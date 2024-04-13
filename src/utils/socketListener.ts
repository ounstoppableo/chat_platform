import {
  setHadNewMsg,
  setNewMsg,
  setNewGroupMsg,
  setUserInfo,
  setUserStatus,
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
  setSystemInfo
} from '@/redux/userInfo/userInfo';
import { Msg } from '@/redux/userInfo/userInfo.type';
import { getFriends } from '@/service/addRelationLogic';
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
    getTotalMsg(userData.username).then((res) => {
      if (res.code === 200) {
        dispatch(
          setHistoryMessage({ msgs: res.data, groupId: '', opera: 'init' })
        );
      }
    });
    getFriends().then((res) => {
      if (res.code === 200) {
        dispatch(setFriends(res.data.result));
      }
    });
    socket.emit('joinRoom', userData.groups);
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
      const likeList = JSON.parse(localStorage.getItem('likeList') || '{}');
      const dislikeList = JSON.parse(
        localStorage.getItem('dislikeList') || '{}'
      );
      localStorage.setItem(
        'likeList',
        JSON.stringify(Object.assign(likeList, { [msg.msgId]: true }))
      );
      if (dislikeList[msg.msgId]) {
        localStorage.setItem(
          'dislikeList',
          JSON.stringify(Object.assign(dislikeList, { [msg.msgId]: false }))
        );
      }
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
      const likeList = JSON.parse(localStorage.getItem('likeList') || '{}');
      localStorage.setItem(
        'likeList',
        JSON.stringify(Object.assign(likeList, { [msg.msgId]: false }))
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
      const likeList = JSON.parse(localStorage.getItem('likeList') || '{}');
      const dislikeList = JSON.parse(
        localStorage.getItem('dislikeList') || '{}'
      );
      if (likeList[msg.msgId]) {
        localStorage.setItem(
          'likeList',
          JSON.stringify(Object.assign(likeList, { [msg.msgId]: false }))
        );
      }
      localStorage.setItem(
        'dislikeList',
        JSON.stringify(Object.assign(dislikeList, { [msg.msgId]: true }))
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
      const dislikeList = JSON.parse(
        localStorage.getItem('dislikeList') || '{}'
      );
      localStorage.setItem(
        'dislikeList',
        JSON.stringify(Object.assign(dislikeList, { [msg.msgId]: false }))
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
      dispatch(setFriends(msg.groupInfo));
      dispatch(setAddGroups(msg.groupInfo));
    }
  });
  //删除群组
  socket.on('delGroup', (msg) => {
    if (msg.success) {
      if (userData.username === msg.groupInfo.authorBy) {
        message.success('删除群聊成功！');
      } else {
        if (
          JSON.parse(localStorage.getItem('currGroup') || '{}').groupId ===
          msg.groupInfo.groupId
        ) {
          switchGroup({});
        }
      }
      dispatch(setDelGroup(msg.groupInfo.groupId));
    }
    if (msg.systemMsg) {
      dispatch(setSystemInfo(msg.systemMsg));
    }
  });
  //退出群组
  socket.on('exitGroup', (msg) => {
    if (msg.success) {
      if (userData.username === msg.username) {
        message.success('退出群聊成功！');
        dispatch(setDelGroup(msg.groupInfo.groupId));
      } else {
        if (
          JSON.parse(localStorage.getItem('currGroup') || '{}').groupId ===
          msg.groupInfo.groupId
        ) {
          dispatch(setDelGroupMember(msg.username));
        }
      }
    }
    if (msg.systemMsg) {
      dispatch(setSystemInfo(msg.systemMsg));
    }
  });
  //修改群名
  socket.on('editGroupName', (msg) => {
    if (msg.success) {
      if (userData.username === msg.groupInfo.authorBy) {
        message.success('修改群名成功！');
        switchGroup({
          ...JSON.parse(localStorage.getItem('currGroup') || '{}'),
          groupName: msg.newName
        });
      } else {
        if (
          JSON.parse(localStorage.getItem('currGroup') || '{}').groupId ===
          msg.groupInfo.groupId
        ) {
          switchGroup({
            ...JSON.parse(localStorage.getItem('currGroup') || '{}'),
            groupName: msg.newName
          });
        }
      }
    }
    dispatch(setEditGroupName({ group: msg.groupInfo, newName: msg.newName }));
  });

  //踢出群聊
  socket.on('kickOutGroup', (msg) => {
    if (msg.success) {
      if (userData.username === msg.groupInfo.authorBy) {
        message.success('踢出群聊成功！');
        dispatch(setDelGroupMember(msg.kickOutUsername));
      } else if (userData.username === msg.kickOutUsername) {
        if (
          JSON.parse(localStorage.getItem('currGroup') || '{}').groupId ===
          msg.groupInfo.groupId
        ) {
          switchGroup({});
        }
        dispatch(setDelGroup(msg.groupInfo.groupId));
      } else {
        if (
          JSON.parse(localStorage.getItem('currGroup') || '{}').groupId ===
          msg.groupInfo.groupId
        ) {
          dispatch(setDelGroupMember(msg.kickOutUsername));
        }
      }
    }
    if (msg.systemMsg) {
      dispatch(setSystemInfo(msg.systemMsg));
    }
  });

  //撤回消息
  socket.on('withdrawMsg', (msg) => {
    if (msg.username === userData.username) message.success('撤回成功！');
    dispatch(setWithdrawMsg(msg));
  });

  //添加好友
  socket.on('addFriend', (msg) => {
    if (msg.data) {
      dispatch(setSystemInfo(msg.data));
    } else {
      if (msg.type === 1) {
        message.success(msg.msg);
      } else message.info(msg.msg);
    }
  });
  //接受好友申请
  socket.on('acceptAddFriend', (msg) => {
    if (msg.toName === userData.username) {
      dispatch(setSystemInfo({ type: 'delete', msgId: msg.msgId }));
      message.success('添加成功！');
    }
    getFriends().then((res) => {
      if (res.code === 200) {
        dispatch(setFriends(res.data.result));
      }
    });
  });
  //拒绝好友申请
  socket.on('rejectAddFriend', (msg) => {
    if (msg.toName === userData.username) {
      dispatch(setSystemInfo({ type: 'delete', msgId: msg.msgId as number }));
      message.success('已拒绝');
    }
    if (msg.data) {
      dispatch(setSystemInfo(msg.data));
    }
  });

  //添加群成员
  socket.on('addGroupMember', (msg) => {
    if (msg.data) {
      dispatch(setSystemInfo(msg.data));
    } else {
      message.success('成功发送邀请！');
    }
  });
  //拒绝加群
  socket.on('rejectJoinGroup', (msg) => {
    if (msg.systemMsg.toName === userData.username) {
      dispatch(
        setSystemInfo({ type: 'delete', msgId: msg.systemMsg.msgId as number })
      );
      message.success('已拒绝');
    } else {
      dispatch(setSystemInfo(msg.systemMsg));
    }
  });

  //有人加入群组
  socket.on('joinRoom', (msg) => {
    if (
      JSON.parse(localStorage.getItem('currGroup') || '{}').groupId ===
        msg.groupId &&
      msg.userInfo
    ) {
      dispatch(setAddGroupMember(msg.userInfo));
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
