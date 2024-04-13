import UserInfo from '@/components/userInfo/userInfo.tsx';
import ChatRelation from '@/components/chatRelation/chatRelation.tsx';
import ChatSpace from '@/components/chatSpace/chatSpace.tsx';
import MemberList from '@/components/memberList/memberList.tsx';
import loginFlagContext from '@/context/loginFlagContext';
import Login from '@/components/login/login.tsx';
import { useEffect, useRef, useState } from 'react';
import { userConfirm } from '@/service/login';
import { useDispatch, useSelector } from 'react-redux';
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
    Pick<Group, 'groupName' | 'groupId' | 'type'> & { toAvatar?: string }
  >({
    groupName: '全员总群',
    groupId: '1',
    type: 'group'
  });
  const groups = useSelector((state: any) => state.userInfo.groups);
  const mentions = useRef<any>(null);
  const at = (username?: string) => {
    if (mentions.current) {
      mentions.current.focus();
      setInputValue(username ? inputValue + `@${username}` : inputValue + '@');
      const keyboardEvent = new KeyboardEvent('keyup', {
        key: 'Shift',
        shiftKey: true,
        bubbles: true
      });
      requestAnimationFrame(() => {
        mentions.current.textarea.dispatchEvent(keyboardEvent);
      });
      if (username) {
        requestAnimationFrame(() => {
          const clickEvent = new Event('click', { bubbles: true });
          document
            .querySelector(`[data-mentionsitem="${username}"]`)
            ?.dispatchEvent(clickEvent);
        });
      }
    }
  };
  //初始化
  useEffect(() => {
    localStorage.setItem('currGroup', JSON.stringify(selectedGroup));
  }, []);

  const toSetSelectGroup = (
    prop: Pick<Group, 'groupName' | 'groupId' | 'type'> & { toAvatar?: string }
  ) => {
    localStorage.setItem('currGroup', JSON.stringify(prop));
    setSelectedGroup(prop);
  };

  const socket = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>(
    {} as Socket<ServerToClientEvents, ClientToServerEvents>
  );
  const [msgOrRelation, setMsgOrRelation] = useState<'msg' | 'relation'>('msg');
  const dispatch = useDispatch();
  const switchGroup = (
    groupInfo: Pick<Group, 'groupName' | 'groupId' | 'type'> & {
      toAvatar?: string;
    }
  ) => {
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
        withCredentials: true,
        auth: {
          token: getToken()
        }
      });
      socketListener(socket.current, dispatch, res.data, switchGroup);
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
              className={`tw-absolute ${
                selectedGroup.type === 'group'
                  ? 'tw-inset-x-36'
                  : 'tw-inset-x-60'
              } tw-transition-all tw-inset-y-20 tw-rounded-2xl tw-flex tw-bg-deepGray tw-gap-5 tw-p-5`}
            >
              <div className="tw-w-14">
                <UserInfo
                  msgOrRelation={msgOrRelation}
                  setMsgOrRelation={setMsgOrRelation}
                  switchGroup={switchGroup}
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
                <ChatSpace
                  selectedGroup={selectedGroup}
                  switchGroup={switchGroup}
                  at={at}
                  ref={mentions}
                />
              </div>
              {selectedGroup.type === 'group' ? (
                <div className="tw-w-48">
                  <MemberList
                    selectedGroup={selectedGroup}
                    switchGroup={switchGroup}
                    at={at}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
            <Login show={loginFlag}></Login>
          </div>
        </InputLogicContext.Provider>
      </loginFlagContext.Provider>
    </socketContext.Provider>
  );
};
export default Layout;
