import UserInfo from '@/components/userInfo/userInfo.tsx';
import ChatRelation from '@/components/chatRelation/chatRelation.tsx';
import ChatSpace from '@/components/chatSpace/chatSpace.tsx';
import MemberList from '@/components/memberList/memberList.tsx';
import loginFlagContext from '@/context/loginFlagContext';
import Login from '@/components/login/login.tsx';
import { useEffect, useState } from 'react';
import { userConfirm } from '@/service/login/login';
import { useDispatch } from 'react-redux';
import { setGroups, setUserInfo } from '@/redux/userInfo/userInfo';
const Layout = () => {
  const [loginFlag, setLoginFlag] = useState(false);
  const dispatch = useDispatch();
  const showLoginForm = () => {
    setLoginFlag(true);
  };
  const closeLoginForm = () => {
    setLoginFlag(false);
  };
  const loginConfirm = async () => {
    const res = await userConfirm();
    if (res.code === 200) {
      dispatch(setUserInfo(res.data));
      dispatch(setGroups(res.data.groups));
    }
  };
  useEffect(() => {
    loginConfirm();
  }, []);
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
            <ChatSpace />
          </div>
          <div className="tw-w-48">
            <MemberList />
          </div>
        </div>
        <Login show={loginFlag}></Login>
      </div>
    </loginFlagContext.Provider>
  );
};
export default Layout;
