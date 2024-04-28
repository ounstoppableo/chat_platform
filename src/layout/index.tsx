import UserInfo from '@/components/userInfo/userInfo.tsx';
import ChatRelation from '@/components/chatRelation/chatRelation.tsx';
import ChatSpace from '@/components/chatSpace/chatSpace.tsx';
import MemberList from '@/components/memberList/memberList.tsx';
import loginFlagContext from '@/context/loginFlagContext';
import Login from '@/components/login/login.tsx';
import { useContext, useEffect, useRef, useState } from 'react';
import { userConfirm } from '@/service/login';
import { useDispatch, useSelector } from 'react-redux';
import { Socket, io } from 'socket.io-client';
import getToken from '@/utils/getToken';
import socketContext from '@/context/socketContext';
import { Group } from '@/redux/userInfo/userInfo.type';
import socketListener from '@/utils/socketListener';
import { ClientToServerEvents, ServerToClientEvents } from '@/type/socket.type';
import InputLogicContext from '@/context/inputLogicContext';
import smallSizeContext from '@/context/smallSizeContext';
import { Drawer } from 'antd';

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
  const { smallSize, setSmallSize } = useContext(smallSizeContext);
  const [currentPage, setCurrentPage] = useState<
    'message' | 'relation' | 'userInfo' | 'groupList'
  >('groupList');
  // const groups = useSelector((state: any) => state.userInfo.groups);
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
  const userInfo = useSelector((state: any) => state.userInfo.data);
  const [openGroupMember, setOpenGroupMember] = useState(false);

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
    if (smallSize) {
      setCurrentPage('message');
    }
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
      socket.current = io('/', {
        withCredentials: true,
        auth: {
          token: getToken()
        },
        path: '/socket.io',
        transports: ['websocket', 'polling']
      });
      socketListener(socket.current, dispatch, res.data, switchGroup);
    }
  };

  //监控页面大小变换
  useEffect(() => {
    const callback = () => {
      if (innerWidth < 1024) {
        setSmallSize(true);
      } else {
        setSmallSize(false);
      }
    };
    window.addEventListener('resize', callback);
    return () => {
      window.removeEventListener('resize', callback);
    };
  }, []);

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

  const togglePage = (
    type: 'message' | 'relation' | 'userInfo' | 'groupList'
  ) => {
    if (type === 'relation') {
      if (!userInfo.isLogin) return showLoginForm();
    }

    if (type === 'relation') {
      setMsgOrRelation('relation');
    }
    if (type === 'groupList') {
      setMsgOrRelation('msg');
    }
    setCurrentPage(type);
    return null;
  };
  const toOpenGroupMember = () => {
    setOpenGroupMember(true);
  };
  const toCloseGroupMember = () => {
    setOpenGroupMember(false);
  };

  return (
    <socketContext.Provider value={socket}>
      <loginFlagContext.Provider value={{ showLoginForm, closeLoginForm }}>
        <InputLogicContext.Provider value={{ inputValue, setInputValue }}>
          <div
            className={`tw-h-screen tw-transition-all tw-w-full tw-flex tw-flex-col tw-items-center ${
              smallSize ? '' : 'tw-py-20'
            } tw-min-h-[640px] tw-relative tw-bg-temple tw-bg-cover`}
          >
            <div
              className={`tw-h-full ${
                smallSize ? 'tw-w-full tw-flex-col' : 'tw-w-fit tw-rounded-2xl'
              } tw-transition-all tw-flex tw-bg-deepGray tw-gap-5 tw-p-5`}
            >
              {smallSize ? (
                currentPage === 'userInfo' ? (
                  <div className="tw-w-full tw-h-[calc(100%-50px)]">
                    <UserInfo
                      msgOrRelation={msgOrRelation}
                      setMsgOrRelation={setMsgOrRelation}
                      switchGroup={switchGroup}
                    />
                  </div>
                ) : (
                  <></>
                )
              ) : (
                <div className="tw-w-14">
                  <UserInfo
                    msgOrRelation={msgOrRelation}
                    setMsgOrRelation={setMsgOrRelation}
                    switchGroup={switchGroup}
                  />
                </div>
              )}
              {smallSize ? (
                currentPage === 'groupList' || currentPage === 'relation' ? (
                  <div className="tw-w-full tw-h-[calc(100%-50px)] tw-overflow-auto tw-pr-2 ">
                    <ChatRelation
                      selectedGroup={selectedGroup}
                      switchGroup={switchGroup}
                      msgOrRelation={msgOrRelation}
                    />
                  </div>
                ) : (
                  <></>
                )
              ) : (
                <div className="tw-w-64 tw-min-w-[200px] tw-overflow-auto tw-pr-2 ">
                  <ChatRelation
                    selectedGroup={selectedGroup}
                    switchGroup={switchGroup}
                    msgOrRelation={msgOrRelation}
                  />
                </div>
              )}
              {smallSize ? (
                currentPage === 'message' ? (
                  <div
                    className={`${
                      smallSize
                        ? 'tw-w-full tw-h-[calc(100%-50px)]'
                        : 'tw-max-w-[600px] tw-min-w-[400px]'
                    } tw-overflow-hidden`}
                  >
                    <ChatSpace
                      selectedGroup={selectedGroup}
                      switchGroup={switchGroup}
                      toOpenGroupMember={toOpenGroupMember}
                      at={at}
                      ref={mentions}
                    />
                  </div>
                ) : (
                  <></>
                )
              ) : (
                <div
                  className={`${
                    smallSize
                      ? 'tw-w-full tw-h-[calc(100%-50px)]'
                      : 'tw-max-w-[600px] tw-min-w-[512px]'
                  } tw-overflow-hidden`}
                >
                  <ChatSpace
                    selectedGroup={selectedGroup}
                    switchGroup={switchGroup}
                    at={at}
                    ref={mentions}
                  />
                </div>
              )}
              {selectedGroup.type === 'group' && !smallSize ? (
                <div className="tw-w-48 tw-min-w-[150px]">
                  <MemberList
                    selectedGroup={selectedGroup}
                    switchGroup={switchGroup}
                    at={at}
                  />
                </div>
              ) : (
                <></>
              )}
              {smallSize ? (
                <>
                  <Drawer
                    open={openGroupMember}
                    onClose={toCloseGroupMember}
                    closable={false}
                    width="80%"
                    className="customDrawer"
                  >
                    <MemberList
                      toCloseGroupMember={toCloseGroupMember}
                      selectedGroup={selectedGroup}
                      switchGroup={switchGroup}
                      at={at}
                    />
                  </Drawer>
                </>
              ) : (
                <></>
              )}
              {smallSize ? (
                <div className="tw-h-[50px] tw-w-full tw-flex tw-justify-around tw-gap-4">
                  <div
                    onClick={() => togglePage('groupList')}
                    className={`hover:tw-text-[#1d90f5] hover:tw-cursor-pointer ${
                      currentPage === 'groupList' ? 'tw-text-[#1d90f5]' : ''
                    } tw-flex-1 tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-bg-[#323644] tw-rounded-lg`}
                  >
                    <span className="iconfont icon-xiaoxi"></span>
                    <span className="tw-text-xs">消息</span>
                  </div>
                  <div
                    onClick={() => togglePage('relation')}
                    className={`hover:tw-text-[#1d90f5] hover:tw-cursor-pointer ${
                      currentPage === 'relation' ? 'tw-text-[#1d90f5]' : ''
                    } tw-flex-1 tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-bg-[#323644] tw-rounded-lg`}
                  >
                    <span className="iconfont icon-lianxiren"></span>
                    <span className="tw-text-xs">联系人</span>
                  </div>
                  <div
                    onClick={() => togglePage('userInfo')}
                    className={`hover:tw-text-[#1d90f5] hover:tw-cursor-pointer ${
                      currentPage === 'userInfo' ? 'tw-text-[#1d90f5]' : ''
                    } tw-flex-1 tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-bg-[#323644] tw-rounded-lg`}
                  >
                    <span className="iconfont icon-gerenxinxi"></span>
                    <span className="tw-text-xs">个人信息</span>
                  </div>
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
