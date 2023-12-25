import { Msg } from '@/redux/userInfo/userInfo.type';

export interface ServerToClientEvents {
  toRoomClient: (msg: Msg) => void;
  someoneStatusChange: (param: { username: string; isOnline: boolean }) => void;
  error: (err: any) => void;
}
export interface ClientToServerEvents {
  joinRoom: (groupIds: string[]) => void;
  msgToServer: (msg: {
    room: string;
    msg: string;
    time: Date;
    avatar: string;
  }) => void;
}
