import { ClientToServerEvents, ServerToClientEvents } from '@/type/socket.type';
import { Ref, createContext } from 'react';
import { Socket } from 'socket.io-client';

const socketContext = createContext<{
  current: Socket<ServerToClientEvents, ClientToServerEvents>;
}>({} as { current: Socket<ServerToClientEvents, ClientToServerEvents> });

export default socketContext;
