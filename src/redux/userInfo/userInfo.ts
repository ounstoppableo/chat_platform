import { createSlice } from '@reduxjs/toolkit';
import { AllMsg, Group, Msg, UserInfo } from './userInfo.type';
export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    data: {} as UserInfo,
    groups: [] as Group[],
    newMsg: {} as AllMsg,
    historyMsg: {} as AllMsg,
    groupMember: [] as UserInfo[],
    friends: [] as (UserInfo & { groupId: string; groupName: string })[]
  },
  reducers: {
    setUserInfo: (state, action: { payload: UserInfo }) => {
      state.data = action.payload;
    },
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    setAddGroups: (state, action: { payload: Group }) => {
      state.groups.push(action.payload);
    },
    setNewMsg: (
      state,
      action: { payload: Msg & { reset?: boolean; room?: string } }
    ) => {
      if (action.payload.reset) {
        state.newMsg = {
          ...state.newMsg,
          [action.payload.room]: []
        };
      } else {
        const msgStack = state.newMsg[action.payload.room] || [];
        msgStack.push(action.payload);
        state.newMsg = {
          ...state.newMsg,
          [action.payload.room]: msgStack
        };
      }
    },
    setNewGroupMsg: (state, action: { payload: Msg }) => {
      state.groups.forEach((item) => {
        if (item.groupId === action.payload.room) {
          item.lastMsg = action.payload.msg;
          item.time = action.payload.time;
          item.lastMsgUser = action.payload.username;
        }
      });
    },
    setHadNewMsg: (
      state,
      action: { payload: { groupId: string; hadNewMsg: boolean } }
    ) => {
      state.groups = state.groups.map((item) => {
        if (item.groupId === action.payload.groupId) {
          item.hadNewMsg = action.payload.hadNewMsg;
          return item;
        }
        return item;
      });
    },
    setGroupMember: (state, action: { payload: UserInfo[] }) => {
      state.groupMember = action.payload;
    },
    setAddGroupMember: (state, action: { payload: UserInfo }) => {
      state.groupMember.push(action.payload);
    },
    setUserStatus: (
      state,
      action: { payload: { username: string; isOnline: boolean } }
    ) => {
      state.groupMember.forEach((item) => {
        if (item.username === action.payload.username) {
          item.isOnline = action.payload.isOnline;
        }
      });
    },
    setHistoryMessage: (
      state,
      action: {
        payload: {
          msgs: Msg[] | AllMsg;
          groupId: string;
          opera: 'insert' | 'init';
        };
      }
    ) => {
      if (action.payload.opera === 'insert') {
        state.historyMsg[action.payload.groupId]
          ? (state.historyMsg[action.payload.groupId] = [
              ...state.historyMsg[action.payload.groupId],
              ...(action.payload.msgs as Msg[])
            ])
          : (state.historyMsg[action.payload.groupId] = [
              ...(action.payload.msgs as Msg[])
            ]);
      } else if (action.payload.opera === 'init') {
        state.historyMsg = action.payload.msgs as AllMsg;
      }
    },
    setMsgLikes: (
      state,
      action: {
        payload: {
          likes: number;
          msgId: string;
          room: string;
          type: 'like' | 'cancelLike';
        };
      }
    ) => {
      state.historyMsg[action.payload.room].find(
        (item) => item.id === action.payload.msgId
      )!.likes = action.payload.likes;
    },
    setMsgDislikes: (
      state,
      action: {
        payload: {
          dislikes: number;
          msgId: string;
          room: string;
          type: 'dislike' | 'cancelDislike';
        };
      }
    ) => {
      state.historyMsg[action.payload.room].find(
        (item) => item.id === action.payload.msgId
      )!.dislikes = action.payload.dislikes;
    },
    setFriends: (
      state,
      action: {
        payload: (UserInfo & { groupId: string; groupName: string })[] | Group;
      }
    ) => {
      if (action.payload instanceof Array) {
        state.friends = action.payload;
      } else {
        state.friends = state.friends.map((item) => {
          if (
            item.username === (action.payload as Group).authorBy ||
            item.username === (action.payload as Group).toUsername
          ) {
            return {
              ...item,
              groupId: (action.payload as Group).groupId,
              groupName: (action.payload as Group).groupName
            };
          } else {
            return item;
          }
        });
      }
    },
    setDelGroup: (state, action: { payload: string }) => {
      state.groups = state.groups.filter(
        (item) => item.groupId !== action.payload
      );
    },
    setDelGroupMember: (state, action: { payload: string }) => {
      state.groupMember = state.groupMember.filter(
        (item) => item.username !== action.payload
      );
    },
    setEditGroupName: (
      state,
      action: { payload: { group: Group; newName: string } }
    ) => {
      const temp = state.groups.find(
        (item) => item.groupId === action.payload.group.groupId
      );
      temp ? (temp.groupName = action.payload.newName) : null;
    },
    setWithdrawMsg: (state, action: { payload: Msg }) => {
      const newMsgItem = state.newMsg[action.payload.room]?.find(
        (item) => item.id === action.payload.id
      );
      const historyMsgItem = state.historyMsg[action.payload.room]?.find(
        (item) => item.id === action.payload.id
      );
      if (newMsgItem) {
        newMsgItem.type = 'withdraw';
      }
      if (historyMsgItem) {
        historyMsgItem.type = 'withdraw';
      }
    },
    setDelMsg: (
      state,
      action: { payload: { groupId: string; msgId: string } }
    ) => {
      state.historyMsg[action.payload.groupId] = state.historyMsg[
        action.payload.groupId
      ].filter((item) => {
        return +item.id !== +action.payload.msgId;
      });
    }
  }
});
// 每个 case reducer 函数会生成对应的 Action creators
export const {
  setUserInfo,
  setGroups,
  setNewMsg,
  setNewGroupMsg,
  setHadNewMsg,
  setUserStatus,
  setGroupMember,
  setHistoryMessage,
  setMsgLikes,
  setMsgDislikes,
  setAddGroupMember,
  setAddGroups,
  setFriends,
  setDelGroup,
  setDelGroupMember,
  setEditGroupName,
  setWithdrawMsg,
  setDelMsg
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
