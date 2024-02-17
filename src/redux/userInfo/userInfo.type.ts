export interface UserInfo {
  avatar: string;
  uid: string;
  username: string;
  isLogin?: boolean;
  isOnline?: boolean;
}

export interface Group {
  authorBy: string;
  groupName: string;
  groupId: string;
  username: string;
  gavatar: string;
  lastMsg: string;
  time: Date;
  hadNewMsg: boolean;
  lastMsgUser: string;
  type: string;
  fromAvatar: string;
  toAvatar: string;
  toUsername: string;
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
  atMembers: string[];
  forMsg: string;
};
