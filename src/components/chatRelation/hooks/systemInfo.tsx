import {
  acceptAddFriend,
  delSystemInfo,
  getFriends,
  getSystemInfo,
  rejectAddFriend
} from '@/service/addRelationLogic';
import { message } from 'antd';
import { useEffect, useState } from 'react';

export const useSystemInfo = (props: any) => {
  const { msgOrRelation, setFriends } = props;
  //展开系统消息列表
  const [showSystemInfo, setShowSystemInfo] = useState(false);
  const [systemInfo, setSystemInfo] = useState([]);
  const toShowSystemInfo = () => {
    setShowSystemInfo(!showSystemInfo);
  };
  useEffect(() => {
    if (msgOrRelation === 'relation') {
      getSystemInfo().then((res) => {
        if (res.code === 200) {
          setSystemInfo(res.data.result);
          if (res.data.result.length !== 0) setShowSystemInfo(true);
        }
      });
    }
  }, [msgOrRelation]);
  //确认添加好友
  const confirmAddFriend = (
    msgId: string,
    fromName: string,
    toName: string
  ) => {
    acceptAddFriend({ msgId, fromName, toName }).then((res) => {
      if (res.code === 200) {
        setSystemInfo(systemInfo.filter((item: any) => item.msgId !== msgId));
        message.success('添加成功！');
        getFriends().then((res) => {
          if (res.code === 200) {
            setFriends(res.data.result);
          }
        });
      }
    });
  };
  //取消添加好友
  const cancelAddFriend = (msgId: string) => {
    rejectAddFriend(msgId).then((res) => {
      if (res.code === 200) {
        setSystemInfo(systemInfo.filter((item: any) => item.msgId !== msgId));
        message.success('已拒绝');
      }
    });
  };

  //删除系统信息
  const toDelSystemInfo = (msgId: string) => {
    delSystemInfo(msgId).then((res) => {
      if (res.code === 200) {
        setSystemInfo(systemInfo.filter((item: any) => item.msgId !== msgId));
      }
    });
  };
  return {
    showSystemInfo,
    systemInfo,
    toShowSystemInfo,
    confirmAddFriend,
    cancelAddFriend,
    toDelSystemInfo
  };
};
