import { Msg } from '@/redux/userInfo/userInfo.type';

export interface ServerToClientEvents {
  toRoomClient: (msg: Msg) => void;
  someoneStatusChange: (param: { username: string; isOnline: boolean }) => void;
  sbLikeMsg: (msg: {
    success: boolean;
    likes: number;
    msgId: string;
    room: string;
    type: 'like';
  }) => void;
  cancelSbLikeMsg: (msg: {
    success: boolean;
    likes: number;
    msgId: string;
    room: string;
    type: 'cancelLike';
  }) => void;
  sbDislikeMsg: (msg: {
    success: boolean;
    dislikes: number;
    msgId: string;
    room: string;
  }) => void;
  cancelSbDislikeMsg: (msg: {
    success: boolean;
    dislikes: number;
    msgId: string;
    room: string;
  }) => void;
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
  likeSbMsg: (msg: {
    username: string;
    msgId: number;
    likes: number;
    room: string;
  }) => void;
  cancelLikeSbMsg: (msg: {
    username: string;
    msgId: number;
    likes: number;
    room: string;
  }) => void;
  dislikeSbMsg: (msg: {
    username: string;
    msgId: number;
    dislikes: number;
    room: string;
  }) => void;
  cancelDislikeSbMsg: (msg: {
    username: string;
    msgId: number;
    dislikes: number;
    room: string;
  }) => void;
}
