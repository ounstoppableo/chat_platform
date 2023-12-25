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
}
export type AllMsg = {
  [key: string]: Msg[];
};
export type Msg = {
  avatar: string;
  username: string;
  msg: string;
  time: Date;
  room: string;
};
