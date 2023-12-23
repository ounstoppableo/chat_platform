import { createSlice } from '@reduxjs/toolkit';
import { Group, UserInfo } from './userInfo.type';
export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    data: {} as UserInfo,
    groups: [] as Group[]
  },
  reducers: {
    setUserInfo: (state, crruent) => {
      state.data = crruent.payload;
    },
    setGroups: (state, crruent) => {
      state.groups = crruent.payload;
    }
  }
});
// 每个 case reducer 函数会生成对应的 Action creators
export const { setUserInfo, setGroups } = userInfoSlice.actions;

export default userInfoSlice.reducer;
