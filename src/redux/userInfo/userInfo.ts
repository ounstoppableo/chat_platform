import { createSlice } from '@reduxjs/toolkit';
import { Group, UserInfo } from './userInfo.type';
export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    data: {} as UserInfo,
    groups: [] as Group[],
    msg: {} as any
  },
  reducers: {
    setUserInfo: (state, current) => {
      state.data = current.payload;
    },
    setGroups: (state, current) => {
      state.groups = current.payload;
    },
    setMsg: (state, current: any) => {
      if (current.payload.reset) {
        state.msg = {
          ...state.msg,
          [current.payload.room]: []
        };
      } else {
        const msgStack = state.msg[current.payload.room] || [];
        msgStack.push(current.payload);
        state.msg = {
          ...state.msg,
          [current.payload.room]: msgStack
        };
      }
    }
  }
});
// 每个 case reducer 函数会生成对应的 Action creators
export const { setUserInfo, setGroups, setMsg } = userInfoSlice.actions;

export default userInfoSlice.reducer;
