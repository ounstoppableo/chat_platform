import UserInfo from '@/components/userInfo/userInfo.tsx';
import ChatRelation from '@/components/chatRelation/chatRelation.tsx';
import ChatSpace from '@/components/chatSpace/chatSpace.tsx';
import MemberList from '@/components/memberList/memberList.tsx';
import loginFlagContext from '@/context/loginFlagContext';
import Login from '@/components/login/login.tsx';
import { useState } from 'react';
const Layout = () => {
  const [loginFlag, setLoginFlag] = useState(false);
  const [inputMaskFlag, setInputMaskFlag] = useState(true);
  const closeInputMaskFlag = () => {
    setInputMaskFlag(false);
  };
  const showLoginForm = () => {
    setLoginFlag(true);
  };
  const closeLoginForm = () => {
    setLoginFlag(false);
  };
  return (
    <loginFlagContext.Provider value={{ showLoginForm, closeLoginForm }}>
      <div
        className={`tw-h-screen tw-min-h-[580px] tw-relative tw-bg-temple tw-bg-cover`}
      >
        <div
          className={`tw-absolute tw-inset-x-36 tw-inset-y-20 tw-rounded-2xl tw-flex tw-bg-deepGray tw-overflow-hidden tw-gap-5 tw-p-5`}
        >
          <div className="tw-w-14">
            <UserInfo />
          </div>
          <div className="tw-w-64 tw-overflow-auto tw-pr-2">
            <ChatRelation />
          </div>
          <div className="tw-flex-1 tw-min-w-minChatSpace tw-overflow-hidden">
            <ChatSpace inputMaskFlag={inputMaskFlag} />
          </div>
          <div className="tw-w-48">
            <MemberList />
          </div>
        </div>
        <Login show={loginFlag} closeMask={closeInputMaskFlag}></Login>
      </div>
    </loginFlagContext.Provider>
  );
};
export default Layout;
