import { Button, TextInput } from '@mantine/core';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const CACHE_SOCKET_HOST_KEY = 'CACHE_SOCKET_HOST_KEY';

type Props = {
  onMessage: (event: WebSocketEventMap['message']) => void;
};

export const ConnectSocket = memo<Props>(({ onMessage }) => {
  const [latestSocketError, setLatestSocketError] = useState<string>();

  const [activeSocketHost, setActiveSocketHost] = useState<string>();

  const [socketHost, setSocketHost] = useState<string>();

  useEffect(() => {
    const cachedHost = localStorage.getItem(CACHE_SOCKET_HOST_KEY);

    if (cachedHost != null) {
      setSocketHost(cachedHost);
    }
  }, []);

  const { readyState } = useWebSocket(
    activeSocketHost ?? '',
    {
      onMessage: (message: MessageEvent<string>) => {
        if (message.data != null && message.data.startsWith('ERROR')) {
          setLatestSocketError(message.data);
          setActiveSocketHost(undefined);
        } else {
          onMessage(message);
        }
      },

      retryOnError: true,
      reconnectAttempts: 20,
      reconnectInterval: 10000, // attempt to reconnect 20 times per 10 second if sever down or something unexpected occur
    },
    activeSocketHost != null
  );

  useEffect(() => {
    if (readyState === ReadyState.OPEN && activeSocketHost != null) {
      localStorage.setItem(CACHE_SOCKET_HOST_KEY, activeSocketHost);
    }
  }, [activeSocketHost, readyState]);

  const handleSocketAction = useCallback(() => {
    if (readyState !== ReadyState.OPEN) {
      if (latestSocketError != null) {
        setLatestSocketError(undefined);
      }

      setActiveSocketHost(socketHost);
    } else {
      setActiveSocketHost(undefined);
    }
  }, [latestSocketError, readyState, socketHost]);

  const connectionStatus = useMemo(() => {
    return {
      [ReadyState.CONNECTING]: 'Connecting',
      [ReadyState.OPEN]: 'Connected',
      [ReadyState.CLOSING]: 'Closing',
      [ReadyState.CLOSED]: 'Closed',
      [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
  }, [readyState]);

  const renderButtonLabel = useMemo(() => {
    return {
      [ReadyState.CONNECTING]: 'Connecting',
      [ReadyState.OPEN]: 'Close',
      [ReadyState.CLOSING]: 'Closing',
      [ReadyState.CLOSED]: 'Connect',
      [ReadyState.UNINSTANTIATED]: 'Connect',
    }[readyState];
  }, [readyState]);

  return (
    <div>
      <div className="gap-[12px] flex">
        <div className="flex-grow">
          <TextInput
            label="WebSocket host:"
            required
            placeholder="Enter the socket host"
            value={socketHost}
            onChange={(event) => setSocketHost(event.target.value)}
            className="mb-[0px]"
          />
        </div>
        <div className="pt-[24px]">
          <Button
            onClick={handleSocketAction}
            disabled={
              socketHost == null ||
              socketHost.trim().length <= 0 ||
              readyState === ReadyState.CONNECTING ||
              readyState === ReadyState.CLOSING
            }
            loading={
              readyState === ReadyState.CONNECTING ||
              readyState === ReadyState.CLOSING
            }
          >
            {renderButtonLabel}
          </Button>
        </div>
      </div>
      {latestSocketError != null && (
        <div className="text-[12px] leading-[18px] text-red-500">
          An error arose when trying to connect the WebSocket:{' '}
          {latestSocketError}
        </div>
      )}
      <div className="text-[12px] leading-[18px] text-gray-600">
        The WebSocket is currently: {connectionStatus}
      </div>
    </div>
  );
});
