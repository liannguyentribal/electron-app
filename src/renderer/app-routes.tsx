import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Database, set, ref } from '@firebase/database';
import {
  ConnectFirebase,
  ConnectSocket,
  DEFAULT_ACTIVE_CHANNELS,
} from './components';
import { Message } from './components/socket-item';
import { StreamChannel } from './components/use-get-stream-identity-query';

export const transformer = (message: Message, channelsKey: string[]) => {
  const findChannel = (key: string) =>
    message.identity.channels.find((it) => it.name === key);

  const channels = channelsKey.map((key) => ({
    key,
    channel: findChannel(key),
  }));

  const createObject = (key: string, channel?: StreamChannel) => ({
    [key]: channel
      ? {
          data: message.daq.samples[channel.index],
          channel,
        }
      : null,
  });

  return Object.assign(
    {},
    ...channels.map((channel) => createObject(channel.key, channel.channel))
  );
};

const CACHE_ACTIVE_CHANNELS = 'CACHE_ACTIVE_CHANNELS';

function Hello() {
  const [messageReceived, setMessageReceived] = useState<number>(0);
  const [messageSent, setMessageSent] = useState<number>(0);

  const [activeChannels, setActiveChannels] = useState(DEFAULT_ACTIVE_CHANNELS);

  useEffect(() => {
    localStorage.setItem(CACHE_ACTIVE_CHANNELS, JSON.stringify(activeChannels));
  }, [activeChannels]);

  useEffect(() => {
    const init = localStorage.getItem(CACHE_ACTIVE_CHANNELS);
    if (init != null) {
      setActiveChannels(JSON.parse(init));
    }
  }, []);

  const databaseRef = useRef<Database>();

  const handleNewMessageComing = useCallback(
    (message: Message) => {
      if (message.daq != null && databaseRef.current != null) {
        setMessageReceived((count) => count + 1);

        const location = ref(databaseRef.current, message.stream.item);

        set(location, transformer(message, activeChannels))
          .then(() => {
            setMessageSent((count) => count + 1);
            return true;
          })
          .catch(() => {
            //
          });
      }
    },
    [activeChannels]
  );

  return (
    <div className="flex gap-[32px]">
      <div className="w-full max-w-[768px]">
        <div className="p-[24px]">
          <ConnectSocket
            onMessage={handleNewMessageComing}
            activeChannels={activeChannels}
            onChangeActiveChannels={setActiveChannels}
          />
        </div>

        <div className="p-[24px]">
          <ConnectFirebase databaseRef={databaseRef} />
        </div>
      </div>

      <div className="p-[24px] max-h-[400px] overflow-y-auto flex-shrink-0">
        <div>MessageHistory:</div>
        <div>Received {messageReceived}</div>
        <div>Sent {messageSent}</div>
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
