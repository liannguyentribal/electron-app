import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import { useCallback, useRef, useState } from 'react';
import { Database, set, ref } from '@firebase/database';
import { ConnectFirebase, ConnectSocket } from './components';
import { Message } from './components/socket-item';

// wss://socketsbay.com/wss/v2/1/demo/
// wss://echo.websocket.events

function Hello() {
  const [messageReceived, setMessageReceived] = useState<number>(0);
  const [messageSent, setMessageSent] = useState<number>(0);

  const databaseRef = useRef<Database>();

  const handleNewMessageComing = useCallback((message: Message) => {
    if (message.daq != null && databaseRef.current != null) {
      setMessageReceived((count) => count + 1);

      const location = ref(databaseRef.current, message.stream.item);

      set(location, message)
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
    <div className="flex flex-wrap gap-[32px]">
      <div className="w-full max-w-[612px]">
        <div className="p-[24px]">
          <ConnectSocket onMessage={handleNewMessageComing} />
        </div>

        <div className="p-[24px]">
          <ConnectFirebase databaseRef={databaseRef} />
        </div>
      </div>

      <div className="p-[24px] max-h-[400px] overflow-y-auto flex-shrink-0">
        MessageHistory: Received {messageReceived}, Sent {messageSent}
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
