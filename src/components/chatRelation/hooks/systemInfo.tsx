import socketContext from '@/context/socketContext';
import {
  acceptAddFriend,
  acceptJoinGroup,
  delSystemInfo,
  getFriends,
  getSystemInfo,
  rejectAddFriend,
  rejectJoinGroup
} from '@/service/addRelationLogic';
import {
  CheckOutlined,
  CloseOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import { message } from 'antd';
import { useContext, useEffect, useState } from 'react';

export const useSystemInfo = (props: any) => {
  const { msgOrRelation, setFriends } = props;
  const soket = useContext(socketContext);
  const [confirmDisabled, setConfirmDisabled] = useState(false);
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

  //确认加群
  const confirmAddGroup = (systemMsg: any) => {
    setConfirmDisabled(true);
    acceptJoinGroup(systemMsg).then((res) => {
      if (res.code === 200) {
        setSystemInfo(
          systemInfo.filter((item: any) => item.msgId !== systemMsg.msgId)
        );
        message.success('添加成功！');
        soket.current.emit('joinRoom', systemMsg.groupId);
      } else if (res.code === 405) {
        delSystemInfo(systemMsg.msgId).then((res) => {
          if (res.code === 200) {
            setSystemInfo(
              systemInfo.filter((item: any) => item.msgId !== systemMsg.msgId)
            );
          }
        });
      }
      setConfirmDisabled(false);
    });
  };
  //取消加群
  const cancelAddGroup = (systemMsg: any) => {
    rejectJoinGroup(systemMsg).then((res) => {
      if (res.code === 200) {
        setSystemInfo(
          systemInfo.filter((item: any) => item.msgId !== systemMsg.msgId)
        );
        message.success('已拒绝');
      }
    });
  };
  const systemMsg = (item: any) => {
    let dom = <></>;
    if (item.type === 'addFriend') {
      dom =
        item.done === 'padding' ? (
          <div className=" tw-w-full tw-break-all">{`${item.fromName}请求添加您为好友，是否同意？`}</div>
        ) : (
          <div className=" tw-w-full tw-break-all">{`${item.toName}已拒绝添加您为好友。`}</div>
        );
    } else {
      dom =
        item.done === 'padding' ? (
          <div className=" tw-w-full tw-break-all">
            {`${item.fromName}邀请您加入群聊`}&nbsp;
            <span className="tw-text-hoverColor">{item.groupName}</span>
            ，是否同意
          </div>
        ) : (
          <div className=" tw-w-full tw-break-all">
            {`${item.toName}已拒绝加入群聊`}&nbsp;
            <span className="tw-text-hoverColor">{item.groupName}</span>。
          </div>
        );
    }
    return dom;
  };

  const systemInfoDom = systemInfo.map((item: any) => {
    return (
      <div
        key={item.msgId}
        className={`tw-h-16 tw-rounded-lg
         tw-flex tw-p-3 tw-gap-3 tw-items-center tw-bg-lightGray tw-mb-2`}
      >
        <div className="tw-w-10 tw-h-10 tw-rounded-full tw-overflow-hidden">
          <div className="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center tw-text-[25px] tw-bg-[#fea356]">
            <NotificationOutlined />
          </div>
        </div>
        <div className="tw-flex-1 tw-flex tw-flex-col">{systemMsg(item)}</div>
        {item.done === 'padding' ? (
          <div className="tw-flex tw-gap-1">
            <button
              className="tw-text-[#00CC66]"
              disabled={confirmDisabled}
              onClick={() => {
                item.type === 'addFriend'
                  ? confirmAddFriend(item.msgId, item.fromName, item.toName)
                  : confirmAddGroup(item);
              }}
            >
              <CheckOutlined />
            </button>
            <button
              className="tw-text-[#FF6666]"
              onClick={() =>
                item.type === 'addFriend'
                  ? cancelAddFriend(item.msgId)
                  : cancelAddGroup(item)
              }
            >
              <CloseOutlined />
            </button>
          </div>
        ) : (
          <div>
            <button
              className="tw-text-[#FF6666]"
              onClick={() => toDelSystemInfo(item.msgId)}
            >
              <CloseOutlined />
            </button>
          </div>
        )}
      </div>
    );
  });

  return {
    showSystemInfo,
    toShowSystemInfo,
    systemInfoDom
  };
};
