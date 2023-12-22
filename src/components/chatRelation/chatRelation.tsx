import wsContext from '@/context/wsContext';
import { setGroups } from '@/redux/userInfo/userInfo';
import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ChatRelation = () => {
  const ws = useContext(wsContext);
  const groups = useSelector((state: any) => state.userInfo.groups);
  const dispatch = useDispatch();
  useEffect(() => {
    const listener = (e: any) => {
      if (e.type === 'getGroups') {
        console.log(e.data);
        dispatch(setGroups(e.data));
      } else if (e.type === 'getGroupErr') {
        dispatch(setGroups([]));
      }
    };
    ws.addListener(listener);
    return () => ws.removeListener(listener);
  }, []);
  const arr: any[] = [];
  groups.forEach((item: any) => {
    arr.push(
      <div
        key={item.groupId}
        className="tw-h-16 tw-rounded-lg tw-bg-chatRelationActive tw-flex tw-p-3 tw-gap-3 tw-items-center"
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
          <div className="no-wrap-ellipsis tw-text-textGrayColor tw-text-xs">
            22222222222222222222222222222222222222222222222222222222222
          </div>
        </div>
        <div className="tw-w-14 tw-text-textGrayColor tw-text-xs tw-flex tw-items-center">
          12月04日
        </div>
      </div>
    );
  });
  return <div className="tw-flex tw-flex-col tw-gap-3">{arr}</div>;
};
export default ChatRelation;
