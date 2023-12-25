import { createSlice } from '@reduxjs/toolkit';
import { AllMsg, Group, Msg, UserInfo } from './userInfo.type';
export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    data: {} as UserInfo,
    groups: [] as Group[],
    newMsg: {} as AllMsg,
    historyMsg: {} as AllMsg,
    groupMember: [] as UserInfo[]
  },
  reducers: {
    setUserInfo: (state, action: { payload: UserInfo }) => {
      state.data = action.payload;
    },
    setGroups: (state, action) => {
      state.groups = action.payload;
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
          item.date = action.payload.time;
        }
      });
    },
    setHadNewMsg: (
      state,
      action: { payload: { groupId: string; hadNewMsg: boolean } }
    ) => {
      state.groups.forEach((item) => {
        if (item.groupId === action.payload.groupId) {
          item.hadNewMsg = action.payload.hadNewMsg;
        }
      });
    },
    setGroupMember: (state, action: { payload: UserInfo[] }) => {
      state.groupMember = action.payload;
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
      action: { payload: { msgs: Msg[]; groupId: string } }
    ) => {
      state.historyMsg[action.payload.groupId]
        ? (state.historyMsg[action.payload.groupId] = [
            ...state.historyMsg[action.payload.groupId],
            ...action.payload.msgs
          ])
        : (state.historyMsg[action.payload.groupId] = [...action.payload.msgs]);
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
  setHistoryMessage
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
