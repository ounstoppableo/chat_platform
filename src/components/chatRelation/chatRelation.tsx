import { Group, UserInfo } from '@/redux/userInfo/userInfo.type';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { CloseOutlined, RightOutlined } from '@ant-design/icons';
import { useSystemInfo } from './hooks/systemInfo.tsx';
import { useGetFriend } from './hooks/friend.tsx';
import { useAddGroup } from './hooks/addGroup.tsx';
import { useContext, useEffect } from 'react';
import { closeChat, getGroups } from '@/service/addRelationLogic.ts';
import { setGroups } from '@/redux/userInfo/userInfo.ts';
import socketContext from '@/context/socketContext.ts';
import styles from './chatRelation.module.scss';

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
          //确保groups原来的属性不丢失，比如hadNewMsg
          dispatch(
            setGroups(
              res.data.result.map((item: Group) => {
                const group = groups.find(
                  (group) => item.groupId === group.groupId
                );
                if (group) {
                  return {
                    ...item,
                    hadNewMsg: group.hadNewMsg
                  };
                } else {
                  return item;
                }
              })
            )
          );
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

  //关闭对话框
  const toCloseChat = (e: any, group: Group) => {
    e.stopPropagation();
    closeChat(group).then((res) => {
      if (res.code === 200) {
        dispatch(
          setGroups(groups.filter((item) => item.groupId !== group.groupId))
        );
        if (selectedGroup.groupId === group.groupId) switchGroup({});
      }
    });
  };

  const newGroups = groups
    .filter((item) => item.isShow !== 0)
    .sort((a: Group, b: Group) => {
      return dayjs(b.time).unix() - dayjs(a.time).unix();
    });
  newGroups.forEach((item: Group) => {
    arr.push(
      <div
        key={item.groupId}
        className={`${
          styles.delBtnShow
        } tw-overflow-hidden tw-relative tw-h-16 tw-rounded-lg ${
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
        {item.type === 'p2p' ? (
          <div
            className={`${styles.delBtn} tw-cursor-default tw-absolute tw-bg-[rgba(0,0,0,0.4)] tw-h-full tw-right-0 tw-flex tw-justify-center tw-items-center tw-overflow-hidden tw-w-[14%]`}
          >
            <span
              onClick={(e) => toCloseChat(e, item)}
              className="tw-text-[#ff4d4f] tw-text-base tw-cursor-pointer"
            >
              <CloseOutlined />
            </span>
          </div>
        ) : (
          <></>
        )}
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
          className={`tw-origin-top tw-transition-all tw-border-b tw-border-[#363637] tw-flex tw-flex-col tw-gap-1.5 tw-pb-3 tw-overflow-hidden tw-animate-unfold`}
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
