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
}
