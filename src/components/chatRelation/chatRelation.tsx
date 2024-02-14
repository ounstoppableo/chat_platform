import { Group } from '@/redux/userInfo/userInfo.type';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {
  CheckOutlined,
  CloseOutlined,
  NotificationOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useSystemInfo } from './hooks/systemInfo.tsx';
import { useGetFriend } from './hooks/friend.tsx';
import { useAddGroup } from './hooks/addGroup.tsx';
import { useContext, useEffect } from 'react';
import { getGroups } from '@/service/addRelationLogic.ts';
import { setGroups } from '@/redux/userInfo/userInfo.ts';
import socketContext from '@/context/socketContext.ts';

const ChatRelation = (props: any) => {
  const { selectedGroup, switchGroup, msgOrRelation } = props;
  const groups: Group[] = useSelector((state: any) => state.userInfo.groups);
  const socket = useContext(socketContext);
  const dispatch = useDispatch();

  //切换时更新groups
  useEffect(() => {
    if (msgOrRelation === 'msg') {
      getGroups().then((res) => {
        if (res.code === 200) {
          dispatch(setGroups(res.data.result));
          socket.current.emit('joinRoom', res.data.result);
        }
      });
    }
  }, [msgOrRelation]);

  const arr: any[] = [];
  groups.forEach((item: Group) => {
    arr.push(
      <div
        key={item.groupId}
        className={`tw-h-16 tw-rounded-lg ${
          selectedGroup.groupId === item.groupId
            ? 'tw-bg-chatRelationActive'
            : 'tw-bg-lightGray'
        } tw-flex tw-p-3 tw-gap-3 tw-items-center tw-cursor-pointer ${
          item.hadNewMsg ? 'tw-animate-hadMsg' : ''
        }`}
        onClick={() =>
          switchGroup({ groupId: item.groupId, groupName: item.groupName })
        }
      >
        <div className="tw-w-10 tw-h-10 tw-rounded-full tw-overflow-hidden">
          <img
            src={'/public/' + item.gavatar}
            alt=""
            className="tw-w-full tw-h-full tw-object-contain"
          />
        </div>
        <div className="tw-flex-1 tw-flex tw-flex-col tw-overflow-hidden">
          <div className="no-wrap-ellipsis">{item.groupName}</div>
          <div
            className="no-wrap-ellipsis tw-text-textGrayColor tw-text-xs"
            title={
              item.lastMsgUser && item.lastMsg
                ? item.lastMsgUser + '：' + item.lastMsg
                : '啥也没有o~'
            }
          >
            {item.lastMsgUser && item.lastMsg
              ? item.lastMsgUser + '：' + item.lastMsg
              : '啥也没有o~'}
          </div>
        </div>
        <div className="tw-w-14 tw-text-textGrayColor tw-text-xs tw-flex tw-items-center">
          {item.date ? dayjs(item.date).format('MM月DD日') : ''}
        </div>
      </div>
    );
  });

  //创建群聊
  const { createGroup } = useAddGroup();

  //联系人控制
  const { friends, toShowRelation, setFriends, showRelation } = useGetFriend({
    msgOrRelation
  });

  //系统消息控制
  const {
    showSystemInfo,
    systemInfo,
    toShowSystemInfo,
    confirmAddFriend,
    cancelAddFriend,
    toDelSystemInfo
  } = useSystemInfo({
    msgOrRelation,
    setFriends
  });

  const systemInfoDom = systemInfo.map((item: any) => {
    return (
      <div
        key={item.msgId}
        className={`tw-h-16 tw-rounded-lg
         tw-flex tw-p-3 tw-gap-3 tw-items-center tw-bg-lightGray`}
      >
        <div className="tw-w-10 tw-h-10 tw-rounded-full tw-overflow-hidden">
          <div className="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center tw-text-[25px] tw-bg-[#fea356]">
            <NotificationOutlined />
          </div>
        </div>
        <div className="tw-flex-1 tw-flex tw-flex-col">
          {item.done === 'padding' ? (
            <div className=" tw-w-full tw-break-all">{`${item.fromName}请求添加您为好友，是否同意？`}</div>
          ) : (
            <div className=" tw-w-full tw-break-all">{`${item.toName}已拒绝添加您为好友。`}</div>
          )}
        </div>
        {item.done === 'padding' ? (
          <div className="tw-flex tw-gap-1">
            <button
              className="tw-text-[#00CC66]"
              onClick={() =>
                confirmAddFriend(item.msgId, item.fromName, item.toName)
              }
            >
              <CheckOutlined />
            </button>
            <button
              className="tw-text-[#FF6666]"
              onClick={() => cancelAddFriend(item.msgId)}
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

  const friendsDom = friends.map((item: any) => {
    return (
      <div
        key={item.uid}
        className="menberListItem tw-bg-lightGray hover:tw-bg-chatSpaceHeader tw-flex tw-gap-2 tw-items-center tw-px-0.5 tw-py-1.5 tw-rounded"
      >
        <div
          className={`tw-w-6 tw-rounded-full tw-relative 
          after:tw-content-[''] after:tw-w-2 after:tw-h-2 after:tw-bg-onlineGreen ${
            item.isOnline ? '' : 'tw-grayscale'
          } after:tw-absolute after:tw-bottom-0 after:tw-right-0 after:tw-rounded-full
        `}
        >
          <img
            src={'/public' + item.avatar}
            alt=""
            className={`tw-object-contain tw-rounded-full`}
          />
        </div>
        <div className="no-wrap-ellipsis tw-w-3/5" title={item.username}>
          {item.username}
        </div>
      </div>
    );
  });

  return msgOrRelation === 'msg' ? (
    <div className="tw-flex tw-flex-col tw-gap-3 tw-select-none">{arr}</div>
  ) : (
    <div className="tw-flex tw-flex-col tw-gap-3 tw-text-xs tw-select-none">
      <button
        onClick={createGroup}
        className="tw-w-fit hover:tw-bg-btnHoverColor tw-bg-btnColor tw-rounded-lg tw-p-1.5 tw-self-end"
      >
        创建群聊
      </button>
      <div
        onClick={toShowSystemInfo}
        className="tw-flex tw-justify-between tw-cursor-pointer tw-border-b tw-border-[#363637] tw-pb-3 hover:tw-text-hoverColor"
      >
        <span>系统消息</span>
        <span
          className={`tw-transition-all ${
            showSystemInfo ? 'tw-rotate-90' : ''
          }`}
        >
          <RightOutlined />
        </span>
      </div>
      {showSystemInfo ? (
        <div
          className={`tw-origin-top tw-transition-all tw-border-b tw-border-[#363637] tw-pb-3 tw-overflow-hidden tw-animate-unfold`}
        >
          {systemInfoDom.length === 0 ? '暂无数据~' : systemInfoDom}
        </div>
      ) : (
        <></>
      )}
      <div
        onClick={toShowRelation}
        className="tw-flex tw-justify-between tw-cursor-pointer tw-border-b tw-border-[#363637] tw-pb-3 hover:tw-text-hoverColor"
      >
        <span>联系人</span>
        <span
          className={`tw-transition-all ${showRelation ? 'tw-rotate-90' : ''}`}
        >
          <RightOutlined />
        </span>
      </div>
      {showRelation ? (
        <div
          className={`tw-origin-top tw-transition-all tw-border-b tw-border-[#363637] tw-pb-3 tw-overflow-hidden tw-animate-unfold`}
        >
          {friendsDom.length === 0 ? '暂无数据~' : friendsDom}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default ChatRelation;
