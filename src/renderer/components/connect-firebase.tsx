import { Button, JsonInput, TextInput } from '@mantine/core';
import { FirebaseApp, initializeApp, deleteApp } from 'firebase/app';
import {
  MutableRefObject,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { getDatabase, Database, ref, get } from '@firebase/database';
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';

const CACHE_FIREBASE_CONFIG_KEY = 'CACHE_FIREBASE_CONFIG_KEY';

type FormData = {
  email: string;
  password: string;
  firebaseConfig: string;
  url?: string;
};

const schema: z.ZodType<FormData> = z.object({
  email: z.string().email(),
  password: z.string(),
  firebaseConfig: z.string(),
  url: z.string().optional(),
});

type Props = {
  databaseRef: MutableRefObject<Database | undefined>;
};

export const ConnectFirebase = memo(({ databaseRef }: Props) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [app, setApp] = useState<FirebaseApp>();

  useEffect(() => {
    const config = localStorage.getItem(CACHE_FIREBASE_CONFIG_KEY);

    if (config != null) {
      const init = JSON.parse(config);

      setValue('email', init.email);
      setValue('firebaseConfig', init.firebaseConfig);
      setValue('password', init.password);
      setValue('url', init.url);
    }
  }, [setValue]);

  const [loading, setIsLoading] = useState(false);

  const handleConnectFirebaseApp = useCallback(
    async (data: FormData) => {
      const { email, firebaseConfig, password, url } = data;

      setIsLoading(true);

      if (app != null) {
        await deleteApp(app);
        databaseRef.current = undefined;
        setApp(undefined);
      } else if (firebaseConfig != null) {
        try {
          const newApp = initializeApp(JSON.parse(firebaseConfig));

          const auth = getAuth(newApp);

          await signInWithEmailAndPassword(
            auth,
            email ?? '',
            password ?? ''
          ).catch((err) => {
            notifications.show({
              color: 'red',
              message:
                err.code ?? 'Wrong firebase config or provided credential.',
            });
            throw err;
          });

          const dbUrl =
            url != null && url.trim().length !== 0 ? url.trim() : undefined;

          const instance = getDatabase(newApp, dbUrl);

          get(ref(instance)).catch((err) => {
            notifications.show({
              color: 'red',
              message:
                err.code ?? 'Cannot connect to the firebase realtime database.',
            });
            throw err;
          });

          setApp(newApp);

          localStorage.setItem(CACHE_FIREBASE_CONFIG_KEY, JSON.stringify(data));
          databaseRef.current = instance;
        } catch (error: any) {
          notifications.show({
            color: 'red',
            message: error.code ?? 'An unknown error occurred',
          });
          console.log('error: ', error);
          setIsLoading(false);
        }
      }

      setIsLoading(false);
    },
    [app, databaseRef]
  );

  return (
    <div>
      <Controller
        control={control}
        name="firebaseConfig"
        render={({ field: { value, onChange, onBlur } }) => (
          <JsonInput
            label="Firebase config"
            required
            autosize
            minRows={2}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="Enter the firebase config on JSON string format..."
            className="mb-3"
            error={errors.firebaseConfig?.message}
          />
        )}
      />

      <div className="mb-3">
        <div className="flex gap-3">
          <div className="w-1/2">
            <TextInput
              label="Credential"
              placeholder="Login email"
              required
              className="mb-0"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>
          <div className="w-1/2">
            <TextInput
              label="Password"
              placeholder="Password"
              required
              className="mb-0"
              {...register('password')}
              error={errors.password?.message}
            />
          </div>
        </div>
        <div className="text-[12px] leading-[18px] text-gray-500">
          Credential is required for writing rule on realtime database for
          security reason. If you don&apos;t have an account, go to firebase
          console, enable authentication by email and password, and create a new
          one.
        </div>
      </div>

      <TextInput
        label="Firebase database url:"
        placeholder="Firebase database url..."
        className="mt-[4px] mb-[0px]"
        {...register('url')}
        error={errors.url?.message}
      />
      <div className="text-[12px] leading-[18px] text-gray-500">
        Optional: The URL of the Realtime Database instance to connect to. If
        not provided, the SDK connects to the default instance of the Firebase
        App.
      </div>

      <Button
        className="mt-[12px]"
        onClick={handleSubmit(handleConnectFirebaseApp)}
        loading={loading}
        disabled={loading}
      >
        {app != null ? 'Close Firebase connection' : 'Connect Firebase App'}
      </Button>
      {/* {app.current != null && (
        <div className="text-[12px] leading-[18px] text-gray-500">
          Firebase app initialized
        </div>
      )} */}
    </div>
  );
});
