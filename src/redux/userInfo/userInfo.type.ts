export interface UserInfo {
  avatar: string;
  uid: string;
  username: string;
  isLogin?: boolean;
  isOnline?: boolean;
}

export interface Group {
  groupName: string;
  groupId: string;
  username: string;
  gavatar: string;
  lastMsg: string;
  date: Date;
  hadNewMsg: boolean;
  lastMsgUser: string;
}
export type AllMsg = {
  [key: string]: Msg[];
};
export type Msg = {
  id: string;
  avatar: string;
  room: string;
  msg: string;
  time: Date;
  timestamp: number;
  likes: number;
  dislikes: number;
  username: string;
};
