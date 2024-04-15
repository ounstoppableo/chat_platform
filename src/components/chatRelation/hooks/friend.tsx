import { setFriends } from '@/redux/userInfo/userInfo';
import { getFriends } from '@/service/addRelationLogic';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useGetFriend = (props: any) => {
  const { msgOrRelation, switchGroup } = props;
  const userInfo = useSelector((state: any) => state.userInfo.data);
  //展开联系人
  const [showRelation, setShowRelation] = useState(false);
  const friends = useSelector((state: any) => state.userInfo.friends);
  const dispartch = useDispatch();
  const toShowRelation = () => {
    setShowRelation(!showRelation);
  };

  useEffect(() => {
    if (msgOrRelation === 'relation' && userInfo.isLogin) {
      getFriends().then((res) => {
        if (res.code === 200) {
          dispartch(setFriends(res.data.result));
        }
      });
    }
  }, [msgOrRelation]);

  const chat = (friendInfo: any) => {
    switchGroup({
      groupName: userInfo.username + '&&&' + friendInfo.username,
      type: 'p2p',
      toAvatar: friendInfo.avatar,
      groupId: friendInfo.groupId
    });
  };

  const sortedFriends = [...friends].sort((a: any, b: any) => {
    return b.isOnline - a.isOnline;
  });
  const friendsDom = sortedFriends.map((item: any) => {
    return (
      <div
        key={item.uid}
        onClick={() => chat(item)}
        className="menberListItem tw-cursor-pointer tw-bg-lightGray hover:tw-bg-chatSpaceHeader tw-flex tw-gap-2 tw-items-center tw-px-0.5 tw-py-1.5 tw-rounded"
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
  return {
    showRelation,
    friendsDom,
    toShowRelation,
    setFriends
  };
};
