import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import { useCallback, useRef, useState } from 'react';
import { Database, set, ref } from '@firebase/database';
import { ConnectFirebase, ConnectSocket } from './components';

// wss://socketsbay.com/wss/v2/1/demo/
// wss://echo.websocket.events

const normalizeMessage = (message: string) => {
  return `${new Date().toISOString()}: ${message}`;
};

function Hello() {
  const [messageHistory, setMessageHistory] = useState<string[]>([]);

  const databaseRef = useRef<Database>();

  const concatMessage = (message: string) => {
    setMessageHistory((old) => old.concat(message));
  };

  const handleNewMessageComing = useCallback((message: MessageEvent<any>) => {
    if (message.data != null && databaseRef.current != null) {
      concatMessage(normalizeMessage(`Receive new date: ${message.data}`));

      const location = ref(databaseRef.current);

      concatMessage(normalizeMessage(`Sending to firebase...`));

      set(location, JSON.parse(message.data))
        .then(() => {
          return concatMessage(normalizeMessage(`Message sent`));
        })
        .catch((err) => {
          console.log('err: ', err);
          concatMessage(normalizeMessage(`Message send failed`));
        });
      // Push the data to firebase
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
        MessageHistory:
        {messageHistory.map((it, index) => (
          <div className="text-[12px] my-1" key={index}>
            {it}
          </div>
        ))}
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
