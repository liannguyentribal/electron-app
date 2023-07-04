import { Button, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useGetStreamsQuery } from './use-get-streams-query';
import {
  StreamIdentity,
  useGetStreamIdentitiesQuery,
} from './use-get-stream-identity-query';
import { Message, SocketItem } from './socket-item';

const CACHE_SOCKET_HOST_KEY = 'CACHE_SOCKET_HOST_KEY';

type Props = {
  onMessage: (message: Message) => void;
};

export const ConnectSocket = memo<Props>(({ onMessage }) => {
  const [activeSocketHost, setActiveSocketHost] = useState<string>();

  const [httpUrl, setHttpUrl] = useState<string>();

  const [socketHost, setSocketHost] = useState<string>();

  const { data: streamListData, isLoading: loadingStream } = useGetStreamsQuery(
    httpUrl ?? '',
    {
      enabled: httpUrl != null,
      onError: (err) =>
        showNotification(
          err?.message ?? 'An error occured when try to connect socket host'
        ),
    }
  );

  const streams = useGetStreamIdentitiesQuery(
    httpUrl ?? '',
    streamListData?.map((it) => it.id) ?? []
  );

  const isLoading = useMemo(
    () => loadingStream || streams.some((it) => it.isLoading),
    [loadingStream, streams]
  );

  useEffect(() => {
    const cachedHost = localStorage.getItem(CACHE_SOCKET_HOST_KEY);

    if (cachedHost != null) {
      setSocketHost(cachedHost);
    }
  }, []);

  // const { readyState } = useWebSocket(
  //   activeSocketHost ?? '',
  //   {
  //     onMessage: (message: MessageEvent<string>) => {
  //       if (message.data != null && message.data.startsWith('ERROR')) {
  //         showNotification({
  //           message: message.data,
  //           color: 'red',
  //         });
  //         setActiveSocketHost(undefined);
  //       } else {
  //         onMessage(message);
  //       }
  //     },

  //     retryOnError: true,
  //     reconnectAttempts: 20,
  //     reconnectInterval: 10000, // attempt to reconnect 20 times per 10 second if sever down or something unexpected occur
  //   },
  //   activeSocketHost != null
  // );

  useEffect(() => {
    if (activeSocketHost != null) {
      localStorage.setItem(CACHE_SOCKET_HOST_KEY, activeSocketHost);
    }
  }, [activeSocketHost]);

  const handleSocketAction = useCallback(() => {
    if (socketHost != null) {
      const host = socketHost.trim().toLowerCase();

      const addr = host.includes(':') ? host : `${host}:8888`;

      setActiveSocketHost(`ws://${addr}`);
      setHttpUrl(`http://${addr}`);
    }
  }, [socketHost]);

  // const connectionStatus = useMemo(() => {
  //   return {
  //     [ReadyState.CONNECTING]: 'Connecting',
  //     [ReadyState.OPEN]: 'Connected',
  //     [ReadyState.CLOSING]: 'Closing',
  //     [ReadyState.CLOSED]: 'Closed',
  //     [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  //   }[readyState];
  // }, [readyState]);

  // const renderButtonLabel = useMemo(() => {
  //   return {
  //     [ReadyState.CONNECTING]: 'Connecting',
  //     [ReadyState.OPEN]: 'Close',
  //     [ReadyState.CLOSING]: 'Closing',
  //     [ReadyState.CLOSED]: 'Connect',
  //     [ReadyState.UNINSTANTIATED]: 'Connect',
  //   }[readyState];
  // }, [readyState]);

  return (
    <div>
      <div className="gap-[12px] flex">
        <div className="flex-grow">
          <TextInput
            label="T2 Server:"
            required
            placeholder="Enter the T2 host, include host only, eg: localhost"
            value={socketHost}
            onChange={(event) => setSocketHost(event.target.value)}
            className="mb-[0px]"
          />
        </div>
        <div className="pt-[24px]">
          <Button
            onClick={handleSocketAction}
            disabled={
              socketHost == null || socketHost.trim().length <= 0 || isLoading
            }
            loading={isLoading}
          >
            {streamListData != null && streamListData.length > 0
              ? 'Connected'
              : 'Connect'}
          </Button>
        </div>
      </div>

      <div className="text-[12px] leading-[18px] text-gray-600">
        The WebSocket is currently:{' '}
        {streamListData != null && streamListData.length > 0
          ? 'Connected'
          : 'Closed'}
      </div>

      <div className="flex flex-wrap">
        {streamListData?.map((it, index) => {
          const isActive = streams[index]?.data != null;

          return (
            <div
              key={it.id}
              className={`w-1/4 text-xs px-2 ${
                isActive ? 'text-green-700 font-semibold' : 'text-red-600'
              }`}
            >
              {it.item} - {isActive ? 'Active' : 'Inactive'}
              {isActive && (
                <SocketItem
                  identity={streams[index].data as StreamIdentity}
                  stream={it}
                  uri={activeSocketHost ?? ''}
                  onMessage={onMessage}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
