export interface UserInfo {
  avatar: string;
  uid: string;
  username: string;
  isLogin?: boolean;
  isOnline?: boolean;
  region?: boolean;
}

export interface SystemInfo {
  done: string;
  fromName: string;
  groupId: string;
  groupName: string;
  hadRead: boolean;
  msgId: number;
  toName: string;
  type: 'addFriend';
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
  isShow: number;
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
  type: string;
  src?: string;
  fileName?: string;
  fileSize?: string;
  region: string;
};
