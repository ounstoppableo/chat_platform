import { Group } from '@/redux/userInfo/userInfo.type';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const ChatRelation = (props: any) => {
  const { selectedGroup, switchGroup } = props;
  const groups: Group[] = useSelector((state: any) => state.userInfo.groups);
  const arr: any[] = [];
  groups.forEach((item: Group) => {
    arr.push(
      <div
        key={item.groupId}
        className={`tw-h-16 tw-rounded-lg ${
          selectedGroup.groupId === item.groupId
            ? 'tw-bg-chatRelationActive'
            : 'lightGray'
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
  return <div className="tw-flex tw-flex-col tw-gap-3">{arr}</div>;
};
export default ChatRelation;
