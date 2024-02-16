import {
  setGroups,
  setHadNewMsg,
  setNewMsg,
  setNewGroupMsg,
  setUserInfo,
  setUserStatus,
  setHistoryMessage,
  setMsgLikes,
  setMsgDislikes,
  setAddGroupMember,
  setAddGroups
} from '@/redux/userInfo/userInfo';
import { Msg } from '@/redux/userInfo/userInfo.type';
import { getTotalMsg } from '@/service/getGroupInfo';
import { ClientToServerEvents, ServerToClientEvents } from '@/type/socket.type';
import { message } from 'antd';
import { Dispatch } from 'react';
import { Socket } from 'socket.io-client';

const socketListener = (
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  dispatch: Dispatch<any>,
  userData: any,
  switchGroup: any
) => {
  //初次连接，用于初始化用户信息
  socket.on('connect', () => {
    dispatch(setUserInfo(userData));
    dispatch(setGroups(userData.groups));
    getTotalMsg(userData.username).then((res) => {
      if (res.code === 200) {
        dispatch(
          setHistoryMessage({ msgs: res.data, groupId: '', opera: 'init' })
        );
        socket.emit('joinRoom', userData.groups);
      }
    });
  });

  //接收到消息
  socket.on('toRoomClient', (msg: Msg) => {
    //将消息装入新信息队列
    dispatch(setNewMsg(msg));
    //设置最新组显示
    dispatch(setNewGroupMsg(msg));
    dispatch(setHadNewMsg({ groupId: msg.room, hadNewMsg: true }));
  });

  //某人点赞了消息
  socket.on('sbLikeMsg', (msg) => {
    if (msg.success) {
      dispatch(
        setMsgLikes({
          likes: msg.likes,
          msgId: msg.msgId,
          room: msg.room,
          type: 'like'
        })
      );
    }
  });
  //取消点赞
  socket.on('cancelSbLikeMsg', (msg) => {
    if (msg.success) {
      dispatch(
        setMsgLikes({
          likes: msg.likes,
          msgId: msg.msgId,
          room: msg.room,
          type: 'cancelLike'
        })
      );
    }
  });
  //某人点踩了消息
  socket.on('sbDislikeMsg', (msg) => {
    if (msg.success) {
      dispatch(
        setMsgDislikes({
          dislikes: msg.dislikes,
          msgId: msg.msgId,
          room: msg.room,
          type: 'dislike'
        })
      );
    }
  });
  //取消不喜欢
  socket.on('cancelSbDislikeMsg', (msg) => {
    if (msg.success) {
      dispatch(
        setMsgDislikes({
          dislikes: msg.dislikes,
          msgId: msg.msgId,
          room: msg.room,
          type: 'cancelDislike'
        })
      );
    }
  });
  //某个用户状态改变
  socket.on('someoneStatusChange', (msg) => {
    dispatch(setUserStatus(msg));
  });

  //加入群组
  socket.on('addGroup', (msg) => {
    if (
      JSON.parse(localStorage.getItem('currGroup') || '{}').groupId ===
        msg.groupId &&
      msg.userInfo
    ) {
      dispatch(setAddGroupMember(msg.userInfo));
    }
    if (msg.groupInfo) {
      const currGroupName = JSON.parse(
        localStorage.getItem('currGroup') || '{}'
      ).groupName;
      if (
        currGroupName ===
          msg.groupInfo.authorBy + '&&&' + msg.groupInfo.toUsername ||
        currGroupName ===
          msg.groupInfo.toUsername + '&&&' + msg.groupInfo.authorBy
      ) {
        switchGroup({
          groupName: currGroupName,
          groupId: msg.groupInfo.groupId,
          type: msg.groupInfo.type
        });
      }

      dispatch(setAddGroups(msg.groupInfo));
    }
  });
  socket.on('error', (err: any) => {
    message.error('与服务器连接失败');
  });
  socket.on('clientError', (err) => {
    message.error(err.msg);
  });
};
export default socketListener;
