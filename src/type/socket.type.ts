import {
  Group,
  Msg,
  SystemInfo,
  UserInfo
} from '@/redux/userInfo/userInfo.type';

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
  addGroup: (msg: {
    userInfo?: UserInfo;
    groupId: string;
    groupInfo?: Group;
  }) => void;
  delGroup: (msg: {
    success: boolean;
    groupInfo: Group;
    systemMsg: SystemInfo;
  }) => void;
  exitGroup: (msg: {
    success: boolean;
    groupInfo: Group;
    username: string;
    systemMsg: SystemInfo;
  }) => void;
  editGroupName: (msg: {
    success: boolean;
    groupInfo: Group;
    newName: string;
  }) => void;
  kickOutGroup: (msg: {
    success: boolean;
    groupInfo: Group;
    kickOutUsername: string;
    systemMsg: SystemInfo;
  }) => void;
  withdrawMsg: (msg: Msg) => void;
  error: (err: any) => void;
  clientError: (err: { msg: string }) => void;
  addFriend: (msg: { type?: number; msg?: string; data?: any }) => void;
  acceptAddFriend: (msg: {
    msgId: number;
    fromName: string;
    toName: string;
  }) => void;
  rejectAddFriend: (msg: {
    msgId?: number;
    fromName?: string;
    toName?: string;
    data?: any;
  }) => void;
  addGroupMember: (msg: { data: SystemInfo }) => void;
  rejectJoinGroup: (msg: { systemMsg: SystemInfo }) => void;
  joinRoom: (msg: { userInfo: UserInfo; groupId: string }) => void;
}
export interface ClientToServerEvents {
  joinRoom: (groupIds: any[] | string) => void;
  msgToServer: (msg: {
    room: string;
    msg: string;
    time: Date;
    avatar: string;
    atMembers?: string[];
    forMsg?: string;
    type?: string;
    src?: string;
    fileName?: string;
    fileSize?: string;
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
  p2pChat: (msg: {
    fromName: string;
    toName: string;
    msg: string;
    time: Date;
    fromAvatar: string;
    toAvatar: string;
    type?: string;
    src?: string;
    fileName?: string;
    fileSize?: string;
    room?: string;
  }) => void;
  delGroup: (msg: Group) => void;
  exitGroup: (msg: Group) => void;
  editGroupName: (msg: { group: Group; newName: string }) => void;
  kickOutGroup: (msg: { group: Group; kickOutUsername: string }) => void;
  withdrawMsg: (msg: Msg) => void;
  addFriend: (msg: { targetUsername: string }) => void;
  acceptAddFriend: (msg: {
    msgId: string;
    fromName: string;
    toName: string;
  }) => void;
  rejectAddFriend: (msg: {
    msgId: number;
    fromName: string;
    toName: string;
  }) => void;
  addGroupMember: (msg: {
    groupId: string;
    groupName: string;
    targetsUsernames: string[];
    authorBy: string;
  }) => void;
  rejectJoinGroup: (msg: { systemMsg: SystemInfo }) => void;
}
