import { UserInfo } from '@/redux/userInfo/userInfo.type';
import { getGroupMember } from '@/service/getGroupInfo';
import { useEffect, useState } from 'react';

const MemberList = (props: any) => {
  const { selectedGroup } = props;
  const [memberArr, setMemberArr] = useState<any>([]);
  useEffect(() => {
    getGroupMember(selectedGroup.groupId).then((res) => {
      if (res.code === 200) {
        const arr: any = [];

        res.data.forEach((item: UserInfo) => {
          arr.push(
            <div
              key={item.uid}
              className="hover:tw-bg-chatSpaceHeader tw-flex tw-gap-2 tw-items-center tw-px-0.5 tw-py-1.5 tw-rounded"
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
        setMemberArr(arr);
      }
    });
  }, [selectedGroup]);

  return (
    <div className="tw-w-full tw-h-full tw-bg-lightGray tw-rounded-lg tw-text-base tw-px-2.5 tw-py-2 tw-flex tw-flex-col tw-gap-4">
      <div>在线人数：{memberArr.length}</div>
      <div className="tw-flex tw-flex-col tw-gap-1 tw-overflow-auto">
        {memberArr}
      </div>
    </div>
  );
};
export default MemberList;
