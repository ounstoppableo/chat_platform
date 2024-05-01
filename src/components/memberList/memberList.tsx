import loginFlagContext from '@/context/loginFlagContext';
import smallSizeContext from '@/context/smallSizeContext';
import socketContext from '@/context/socketContext';
import useRelationCtrl from '@/hooks/relationCtrl.tsx';
import { setGroupMember } from '@/redux/userInfo/userInfo';
import { Group, UserInfo } from '@/redux/userInfo/userInfo.type';
import { getGroupMember } from '@/service/getGroupInfo';
import {
  MessageOutlined,
  PlusOutlined,
  UserDeleteOutlined
} from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

const MemberList = (props: any) => {
  const { selectedGroup, at, switchGroup, toCloseGroupMember } = props;
  const socket = useContext(socketContext);
  const friends = useSelector((state: any) => state.userInfo.friends);
  const loginControl = useContext(loginFlagContext);
  const { smallSize } = useContext(smallSizeContext);
  const memberArr: any = [];
  const groupMember: UserInfo[] = useSelector(
    (state: any) => state.userInfo.groupMember
  );
  const userInfo: UserInfo = useSelector((state: any) => state.userInfo.data);
  const onlineNum = groupMember.filter(
    (item: any) => !!item.isOnline === true
  ).length;
  const groups = useSelector((state: any) => state.userInfo.groups);
  const currentGroup: Group = groups.find(
    (item: any) => item.groupId === selectedGroup.groupId
  );
  const menuTimer = useRef<any>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    getGroupMember(selectedGroup.groupId).then((res) => {
      if (res.code === 200) {
        dispatch(setGroupMember(res.data));
      }
    });
  }, [selectedGroup]);

  //踢出群聊
  const kickOut = (kickOutUsername: string) => {
    socket.current.emit('kickOutGroup', {
      group: currentGroup,
      kickOutUsername
    });
    setMenu(<></>);
  };

  const chat = (friendInfo: any) => {
    switchGroup({
      groupName: userInfo.username + '&&&' + friendInfo.username,
      type: 'p2p',
      toAvatar: friendInfo.avatar,
      groupId: friendInfo.groupId
    });
    smallSize ? (toCloseGroupMember(), setMenu(<></>)) : null;
  };

  const smallSizeAt = (username: string) => {
    toCloseGroupMember();
    at(username);
  };

  //鼠标右键事件的回调
  const [menu, setMenu] = useState(<></>);
  const contextMenuCb = (e: any, username: any, smallSize?: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (smallSize) {
      e = e.touches[0];
    }
    if (username === userInfo.username) return;
    if (!userInfo.isLogin) return;
    const toAddFriend = () => {
      socket.current.emit('addFriend', { targetUsername: username });
      setMenu(<></>);
    };
    setMenu(
      <div
        className={`tw-text-xs tw-absolute tw-w-24 tw-h-fit tw-rounded-lg tw-z-max tw-bg-chatSpaceFooter tw-flex tw-flex-col tw-gap-1 tw-p-1`}
        style={{ top: e.clientY + 'px', left: e.clientX + 'px' }}
        id="memberListMenu"
      >
        <div
          onClick={() => (smallSize ? smallSizeAt(username) : at(username))}
          className="tw-cursor-pointer tw-pl-1 tw-py-1 tw-gap-1 tw-items-center tw-flex tw-rounded tw-flex-1 tw-self-start hover:tw-bg-messageBackground tw-w-full"
        >
          <span>@</span>
          <span>艾特Ta</span>
        </div>
        {friends.find((friend: any) => friend.username === username) ? (
          <div
            onClick={() =>
              chat(friends.find((friend: any) => friend.username === username))
            }
            className="tw-cursor-pointer tw-pl-1 tw-py-1 tw-gap-1 tw-items-center tw-flex tw-rounded tw-flex-1 tw-self-start hover:tw-bg-messageBackground tw-w-full"
          >
            <span>
              <MessageOutlined />
            </span>
            <span>发送消息</span>
          </div>
        ) : (
          <div
            onClick={toAddFriend}
            className="tw-cursor-pointer tw-pl-1 tw-py-1 tw-gap-1 tw-items-center tw-flex tw-rounded tw-flex-1 tw-self-start hover:tw-bg-messageBackground tw-w-full"
          >
            <span>
              <PlusOutlined />
            </span>
            <span>添加好友</span>
          </div>
        )}
        {currentGroup.authorBy === userInfo.username &&
        currentGroup.groupId !== '1' ? (
          <Popconfirm
            title="踢出群聊"
            description="您真的要踢Ta出群吗?"
            onConfirm={() => kickOut(username)}
            okText="确认"
            cancelText="取消"
          >
            <div className="tw-cursor-pointer tw-pl-1 tw-py-1 tw-gap-1 tw-items-center tw-flex tw-rounded tw-flex-1 tw-self-start hover:tw-bg-messageBackground tw-w-full">
              <span>
                <UserDeleteOutlined />
              </span>
              <span>踢出群聊</span>
            </div>
          </Popconfirm>
        ) : (
          <></>
        )}
      </div>
    );
  };

  //清除菜单
  useEffect(() => {
    const cb = (e: any) => {
      if (
        (!e.target.closest('#memberListMenu') && e.type === 'click') ||
        (!e.target.closest('#memberListMenu') && e.type === 'contextmenu')
      ) {
        setMenu(<></>);
      }
    };
    window.addEventListener('click', cb);
    window.addEventListener('contextmenu', cb);
    return () => {
      window.removeEventListener('click', cb);
      window.removeEventListener('contextmenu', cb);
    };
  }, []);

  //移动端菜单控制
  const touchStartCb = (e: any, username: any) => {
    if (menuTimer.current) {
      clearTimeout(menuTimer.current);
    }
    menuTimer.current = setTimeout(() => {
      contextMenuCb(e, username, true);
      menuTimer.current = null;
    }, 500);
  };
  const touchEndCb = () => {
    clearTimeout(menuTimer.current);
    menuTimer.current = null;
  };

  const sorted = [...groupMember].sort((a: any, b: any) => {
    return b.isOnline - a.isOnline;
  });
  sorted.forEach((item: UserInfo) => {
    memberArr.push(
      <div
        key={item.uid}
        className={`hover:tw-bg-chatSpaceHeader tw-flex tw-gap-2 tw-items-center tw-px-0.5 tw-py-1.5 tw-rounded tw-select-none`}
        onContextMenu={(e) => contextMenuCb(e, item.username)}
        onTouchStart={(e) => touchStartCb(e, item.username)}
        onTouchEnd={() => touchEndCb()}
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

  const { show } = useRelationCtrl({
    groupMember,
    groupId: selectedGroup.groupId,
    groupName: selectedGroup.groupName,
    authorBy: currentGroup?.authorBy
  });
  const addMember = () => {
    if (!userInfo.isLogin) return loginControl.showLoginForm();
    return show();
  };

  return (
    <div
      className={`tw-relative tw-w-full tw-h-full tw-bg-lightGray ${
        smallSize ? '' : 'tw-rounded-lg'
      } tw-text-base tw-px-2.5 tw-py-2 tw-flex tw-flex-col tw-gap-4`}
    >
      <div>在线人数：{onlineNum}</div>
      <button
        onClick={addMember}
        className="tw-bg-[#409eff] tw-text-white tw-rounded-full tw-w-6 tw-h-6 tw-absolute tw-right-2"
      >
        <PlusOutlined />
      </button>
      <div className="tw-flex tw-flex-col tw-gap-1 tw-overflow-auto">
        {memberArr}
      </div>
      {createPortal(menu, document.body)}
    </div>
  );
};
export default MemberList;
