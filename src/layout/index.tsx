import UserInfo from '@/components/userInfo/userInfo.tsx';
import ChatRelation from '@/components/chatRelation/chatRelation.tsx';
import ChatSpace from '@/components/chatSpace/chatSpace.tsx';
import MemberList from '@/components/memberList/memberList.tsx';
import loginFlagContext from '@/context/loginFlagContext';
import Login from '@/components/login/login.tsx';
import { useEffect, useRef, useState } from 'react';
import { userConfirm } from '@/service/login';
import { useDispatch } from 'react-redux';
import { Socket, io } from 'socket.io-client';
import getToken from '@/utils/getToken';
import socketContext from '@/context/socketContext';
import { Group } from '@/redux/userInfo/userInfo.type';
import socketListener from '@/utils/socketListener';
import { ClientToServerEvents, ServerToClientEvents } from '@/type/socket.type';

const Layout = () => {
  const [loginFlag, setLoginFlag] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<
    Pick<Group, 'groupName' | 'groupId'>
  >({
    groupName: '全员总群',
    groupId: '1'
  });
  const socket = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>(
    {} as Socket<ServerToClientEvents, ClientToServerEvents>
  );
  const dispatch = useDispatch();
  const switchGroup = (groupInfo: Pick<Group, 'groupName' | 'groupId'>) => {
    setSelectedGroup(groupInfo);
  };
  const showLoginForm = () => {
    setLoginFlag(true);
  };
  const closeLoginForm = () => {
    setLoginFlag(false);
  };
  const loginConfirm = async () => {
    const res = await userConfirm();
    if (res.code === 200) {
      socket.current = io('https://localhost:3000', {
        auth: {
          token: getToken()
        }
      });
      socketListener(socket.current, dispatch, res.data);
    }
  };
  useEffect(() => {
    loginConfirm();
    return () => {
      socket.current ? socket.current.close() : null;
    };
  }, []);
  return (
    <socketContext.Provider value={socket}>
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
              <ChatRelation
                selectedGroup={selectedGroup}
                switchGroup={switchGroup}
              />
            </div>
            <div className="tw-flex-1 tw-min-w-minChatSpace tw-overflow-hidden">
              <ChatSpace selectedGroup={selectedGroup} />
            </div>
            <div className="tw-w-48">
              <MemberList selectedGroup={selectedGroup} />
            </div>
          </div>
          <Login show={loginFlag}></Login>
        </div>
      </loginFlagContext.Provider>
    </socketContext.Provider>
  );
};
export default Layout;
