import { Group, UserInfo } from '@/redux/userInfo/userInfo.type';
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
import userInfo, { setGroups } from '@/redux/userInfo/userInfo.ts';
import socketContext from '@/context/socketContext.ts';

const ChatRelation = (props: any) => {
  const { selectedGroup, switchGroup, msgOrRelation } = props;
  const groups: Group[] = useSelector((state: any) => state.userInfo.groups);
  const userInfo: UserInfo = useSelector((state: any) => state.userInfo.data);
  const socket = useContext(socketContext);
  const dispatch = useDispatch();

  //切换时更新groups
  useEffect(() => {
    if (msgOrRelation === 'msg') {
      getGroups().then((res) => {
        if (res.code === 200) {
          res.data.result.sort();
          dispatch(setGroups(res.data.result));
          socket.current.emit &&
            socket.current.emit('joinRoom', res.data.result);
        }
      });
    }
  }, [msgOrRelation]);

  const getTodayTimeStamp = () => {
    return dayjs(dayjs(new Date()).format('YYYY-MM-DD 00:00:00')).unix();
  };
  const timeFilter = (time: Date) => {
    if (getTodayTimeStamp() - dayjs(time).unix() <= 0) {
      return dayjs(time).format('HH:mm');
    } else {
      return dayjs(time).format('MM-DD');
    }
  };

  const arr: any[] = [];
  const newGroups = [...groups].sort((a: Group, b: Group) => {
    return dayjs(b.time).unix() - dayjs(a.time).unix();
  });

  const filterAvatar = (item: Group) => {
    const avatar =
      item.type === 'group'
        ? '/public' + item.gavatar
        : item.authorBy === userInfo.username
          ? '/public' + item.toAvatar
          : '/public' + item.fromAvatar;
    return avatar;
  };
  const filterUsername = (item: Group) => {
    const username =
      item.type === 'group'
        ? item.groupName
        : item.authorBy === userInfo.username
          ? item.toUsername
          : item.username;
    return username;
  };

  newGroups.forEach((item: Group) => {
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
          switchGroup({
            groupId: item.groupId,
            groupName: item.groupName,
            type: item.type
          })
        }
      >
        <div className="tw-w-10 tw-h-10 tw-rounded-full tw-overflow-hidden">
          <img
            src={filterAvatar(item)}
            alt=""
            className="tw-w-full tw-h-full tw-object-contain"
          />
        </div>
        <div className="tw-flex-1 tw-flex tw-flex-col tw-overflow-hidden">
          <div className="no-wrap-ellipsis" title={filterUsername(item)}>
            {filterUsername(item)}
          </div>
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
        <div className="tw-w-fit tw-text-textGrayColor tw-text-xs tw-flex tw-items-center">
          {timeFilter(item.time)}
        </div>
      </div>
    );
  });

  //创建群聊
  const { createGroup } = useAddGroup();

  //联系人控制
  const { friendsDom, toShowRelation, setFriends, showRelation } = useGetFriend(
    {
      msgOrRelation,
      switchGroup
    }
  );

  //系统消息控制
  const { showSystemInfo, toShowSystemInfo, systemInfoDom } = useSystemInfo({
    msgOrRelation,
    setFriends
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
