import { showNotification } from '@mantine/notifications';
import { memo } from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { StreamEntity } from './use-get-streams-query';
import { StreamIdentity } from './use-get-stream-identity-query';

export type Message = {
  identity: StreamIdentity;
  daq: string;
  stream: StreamEntity;
};

type Props = {
  uri: string;
  identity: StreamIdentity;
  onMessage(message: Message): void;
  stream: StreamEntity;
};

export const SocketItem = memo<Props>(
  ({ uri, stream, identity, onMessage }) => {
    useWebSocket(
      `${uri}/${stream.name}/${stream.id}/daq`,
      {
        onMessage: (message: MessageEvent<string>) => {
          if (message.data != null && message.data.startsWith('ERROR')) {
            showNotification({
              message: message.data,
              color: 'red',
            });
          } else {
            onMessage({
              identity,
              stream,
              daq: JSON.parse(message.data),
            });
            // Send to firebase
          }
        },

        retryOnError: true,
        reconnectAttempts: 20,
        reconnectInterval: 10000, // attempt to reconnect 20 times per 10 second if sever down or something unexpected occur
      },
      uri != null
    );

    return <div />;
  }
);
