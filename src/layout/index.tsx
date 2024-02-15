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
import InputLogicContext from '@/context/inputLogicContext';

const Layout = () => {
  const [inputValue, setInputValue] = useState('');
  const [loginFlag, setLoginFlag] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<
    Pick<Group, 'groupName' | 'groupId'>
  >({
    groupName: '全员总群',
    groupId: '1'
  });
  //初始化
  useEffect(() => {
    localStorage.setItem('currGroupId', selectedGroup.groupId);
  }, []);

  const toSetSelectGroup = (prop: Pick<Group, 'groupName' | 'groupId'>) => {
    localStorage.setItem('currGroupId', prop.groupId);
    setSelectedGroup(prop);
  };

  const socket = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>(
    {} as Socket<ServerToClientEvents, ClientToServerEvents>
  );
  const [msgOrRelation, setMsgOrRelation] = useState<'msg' | 'relation'>('msg');
  const dispatch = useDispatch();
  const switchGroup = (groupInfo: Pick<Group, 'groupName' | 'groupId'>) => {
    toSetSelectGroup(groupInfo);
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
    const promise = new Promise((resolve) => {
      loginConfirm().then(() => resolve(1));
    });
    return () => {
      promise.then(() => {
        socket.current.disconnect();
      });
    };
  }, []);
  return (
    <socketContext.Provider value={socket}>
      <loginFlagContext.Provider value={{ showLoginForm, closeLoginForm }}>
        <InputLogicContext.Provider value={{ inputValue, setInputValue }}>
          <div
            className={`tw-h-screen tw-min-h-[580px] tw-relative tw-bg-temple tw-bg-cover`}
          >
            <div
              className={`tw-absolute tw-inset-x-36 tw-inset-y-20 tw-rounded-2xl tw-flex tw-bg-deepGray tw-overflow-hidden tw-gap-5 tw-p-5`}
            >
              <div className="tw-w-14">
                <UserInfo
                  msgOrRelation={msgOrRelation}
                  setMsgOrRelation={setMsgOrRelation}
                />
              </div>
              <div className="tw-w-64 tw-overflow-auto tw-pr-2">
                <ChatRelation
                  selectedGroup={selectedGroup}
                  switchGroup={switchGroup}
                  msgOrRelation={msgOrRelation}
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
        </InputLogicContext.Provider>
      </loginFlagContext.Provider>
    </socketContext.Provider>
  );
};
export default Layout;
