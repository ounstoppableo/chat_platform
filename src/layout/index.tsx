import UserInfo from '@/components/userInfo/userInfo.tsx';
import ChatRelation from '@/components/chatRelation/chatRelation.tsx';
import ChatSpace from '@/components/chatSpace/chatSpace.tsx';
import MemberList from '@/components/memberList/memberList.tsx';
const Layout = () => {
  return (
    <>
      <div className={`tw-h-screen tw-relative tw-bg-temple tw-bg-cover`}>
        <div
          className={`tw-absolute tw-inset-x-36 tw-inset-y-20 tw-rounded-2xl tw-flex tw-bg-deepGray tw-overflow-hidden tw-gap-5 tw-p-5`}
        >
          <div className="tw-w-14">
            <UserInfo />
          </div>
          <div className="tw-w-64">
            <ChatRelation />
          </div>
          <div className="tw-flex-1 tw-min-w-minChatSpace tw-overflow-hidden">
            <ChatSpace />
          </div>
          <div className="tw-w-48">
            <MemberList />
          </div>
        </div>
      </div>
    </>
  );
};
export default Layout;
