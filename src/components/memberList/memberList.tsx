import useRelationCtrl from '@/hooks/relationCtrl.tsx';
import { setGroupMember } from '@/redux/userInfo/userInfo';
import { UserInfo } from '@/redux/userInfo/userInfo.type';
import { addFriend } from '@/service/addRelationLogic';
import { getGroupMember } from '@/service/getGroupInfo';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

const MemberList = (props: any) => {
  const { selectedGroup } = props;
  const memberArr: any = [];
  const groupMember: UserInfo[] = useSelector(
    (state: any) => state.userInfo.groupMember
  );
  const userInfo: UserInfo = useSelector((state: any) => state.userInfo.data);
  const onlineNum = groupMember.filter(
    (item: any) => !!item.isOnline === true
  ).length;
  const dispatch = useDispatch();
  useEffect(() => {
    getGroupMember(selectedGroup.groupId).then((res) => {
      if (res.code === 200) {
        dispatch(setGroupMember(res.data));
      }
    });
  }, [selectedGroup]);

  //鼠标右键事件的回调
  const [menu, setMenu] = useState(<></>);
  const contextMenuCb = (e: any, username: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (username === userInfo.username) return;
    if (!userInfo.isLogin) return;
    console.log(username);
    const toAddFriend = () => {
      addFriend(username).then((res) => {
        if (res.code === 200) {
          if (res.data.type === 1) {
            message.success(res.data.msg);
          } else message.info(res.data.msg);
          setMenu(<></>);
        }
      });
    };
    const atTa = () => {};
    setMenu(
      <div
        className={`tw-text-xs tw-absolute tw-w-24 tw-h-16 tw-rounded-lg tw-bg-chatSpaceFooter tw-flex tw-flex-col tw-gap-1 tw-p-1`}
        style={{ top: e.clientY + 'px', left: e.clientX + 'px' }}
        id="menberListMenu"
      >
        <div
          onClick={atTa}
          className="tw-pl-1 tw-gap-1 tw-items-center tw-flex tw-rounded tw-flex-1 tw-self-start hover:tw-bg-messageBackground tw-w-full"
        >
          <span>@</span>
          <span>艾特Ta</span>
        </div>
        <div
          onClick={toAddFriend}
          className="tw-pl-1 tw-gap-1 tw-items-center tw-flex tw-rounded tw-flex-1 tw-self-start hover:tw-bg-messageBackground tw-w-full"
        >
          <span>
            <PlusOutlined />
          </span>
          <span>添加好友</span>
        </div>
      </div>
    );
  };
  //清除菜单
  useEffect(() => {
    const cb = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      if (
        (!e.target.closest('#menberListMenu') && e.type === 'click') ||
        (!e.target.closest('.menberListItem') && e.type === 'contextmenu')
      ) {
        setMenu(<></>);
      }
    };
    window.addEventListener('click', cb);
    window.addEventListener('contextmenu', cb);
    return () => {
      window.removeEventListener('click', cb);
    };
  }, []);

  const sorted = [...groupMember].sort((a: any, b: any) => {
    return b.isOnline - a.isOnline;
  });
  sorted.forEach((item: UserInfo) => {
    memberArr.push(
      <div
        key={item.uid}
        className="menberListItem hover:tw-bg-chatSpaceHeader tw-flex tw-gap-2 tw-items-center tw-px-0.5 tw-py-1.5 tw-rounded"
        onContextMenu={(e) => contextMenuCb(e, item.username)}
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
    groupName: selectedGroup.groupName
  });
  const addMember = () => {
    show();
  };

  return (
    <div className="tw-w-full tw-h-full tw-bg-lightGray tw-rounded-lg tw-text-base tw-px-2.5 tw-py-2 tw-flex tw-flex-col tw-gap-4">
      <div>在线人数：{onlineNum}</div>
      <button
        onClick={addMember}
        className="tw-bg-[#409eff] tw-text-white tw-rounded-full tw-w-6 tw-h-6 tw-absolute tw-right-8"
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
