import {
  setGroups,
  setHadNewMsg,
  setNewMsg,
  setNewGroupMsg,
  setUserInfo,
  setUserStatus
} from '@/redux/userInfo/userInfo';
import { Msg } from '@/redux/userInfo/userInfo.type';
import { message } from 'antd';
import { Dispatch } from 'react';
import { Socket } from 'socket.io-client';

const socketListener = (
  socket: Socket,
  dispatch: Dispatch<any>,
  userData: any
) => {
  //初次连接，用于初始化用户信息
  socket.on('connect', () => {
    dispatch(setUserInfo(userData));
    dispatch(setGroups(userData.groups));
    socket.emit('joinRoom', userData.groups);
  });

  //接收到消息
  socket.on('toRoomClient', (msg: Msg) => {
    dispatch(setNewMsg(msg));
    dispatch(setNewGroupMsg(msg));
    dispatch(setHadNewMsg({ groupId: msg.room, hadNewMsg: true }));
  });

  //某个用户状态改变
  socket.on(
    'someoneStatusChange',
    (msg: { username: string; isOnline: boolean }) => {
      dispatch(setUserStatus(msg));
    }
  );
  socket.on('error', (err: any) => {
    console.log(err);
    message.error('与服务器连接失败');
  });
};
export default socketListener;
