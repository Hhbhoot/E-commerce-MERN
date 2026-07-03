import { useContext, createContext, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socket = useMemo(
    () =>
      io('http://localhost:8000', {
        auth: {
          token: localStorage.getItem('token'),
        },
      }),
    [],
  );
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
