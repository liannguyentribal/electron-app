import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import { useCallback, useRef, useState } from 'react';
import { Database, set, ref } from '@firebase/database';
import { ConnectFirebase, ConnectSocket } from './components';
import { Message } from './components/socket-item';
import { StreamChannel } from './components/use-get-stream-identity-query';

export const transformer = (message: Message) => {
  const findChannel = (key: string) =>
    message.identity.channels.find((it) => it.name === key);

  const groundSpeed = findChannel('Ground Speed');
  const throttlePos = findChannel('Throttle Pos');
  const engineRPM = findChannel('Engine RPM');
  const gear = findChannel('Gear');
  const gForceLat = findChannel('G Force Lat');
  const gForceLng = findChannel('G Force Long');
  const steeredAngle = findChannel('Steered Angle');

  const createObject = (key: string, channel?: StreamChannel) => ({
    [key]: channel
      ? {
          data: message.daq.samples[channel.index],
          channel,
        }
      : null,
  });

  return {
    ...createObject('groundSpeed', groundSpeed),
    ...createObject('throttlePos', throttlePos),
    ...createObject('engineRPM', engineRPM),
    ...createObject('gear', gear),
    ...createObject('gForceLat', gForceLat),
    ...createObject('gForceLng', gForceLng),
    ...createObject('steeredAngle', steeredAngle),
  };
};

function Hello() {
  const [messageReceived, setMessageReceived] = useState<number>(0);
  const [messageSent, setMessageSent] = useState<number>(0);

  const databaseRef = useRef<Database>();

  const handleNewMessageComing = useCallback((message: Message) => {
    if (message.daq != null && databaseRef.current != null) {
      setMessageReceived((count) => count + 1);

      const location = ref(databaseRef.current, message.stream.item);

      set(location, transformer(message))
        .then(() => {
          setMessageSent((count) => count + 1);
          return true;
        })
        .catch(() => {
          //
        });
    }
  }, []);

  return (
    <div className="flex gap-[32px]">
      <div className="w-full max-w-[612px]">
        <div className="p-[24px]">
          <ConnectSocket onMessage={handleNewMessageComing} />
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
