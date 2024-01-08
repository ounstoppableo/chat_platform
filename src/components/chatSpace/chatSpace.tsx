import ChatInput from '@/components/chatInput/chatInput.tsx';
import { useContext, useEffect, useRef } from 'react';
import InputMask from '../InputMask/InputMask.tsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  setHadNewMsg,
  setHistoryMessage,
  setNewMsg
} from '@/redux/userInfo/userInfo.ts';
import dayjs from 'dayjs';
import styles from './chatSpace.module.scss';
import { DislikeFilled, LikeFilled, RollbackOutlined } from '@ant-design/icons';
import socketContext from '@/context/socketContext.ts';
import loginFlagContext from '@/context/loginFlagContext.ts';

const ChatSpace = (props: any) => {
  const socket = useContext(socketContext);
  const loginControl = useContext(loginFlagContext);
  const newMsg = useSelector((state: any) => state.userInfo.newMsg);
  const historyMsg = useSelector((state: any) => state.userInfo.historyMsg);
  const init = useRef(false);
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.userInfo.data);
  const { selectedGroup, atMember } = props;
  const chatSpaceRef = useRef<any>(null);
  const atMemberVDom = atMember.map((item: any, index: number) => {
    return (
      <div
        key={index}
        className="tw-h-8 tw-flex tw-gap-2 tw-items-center tw-cursor-pointer hover:tw-bg-lightHoverColor tw-rounded-lg tw-p-0.5"
      >
        <img
          src={item.avatar}
          className="tw-h-full tw-rounded-full tw-object-contain"
          alt=""
        />
        <div>{item.username}</div>
      </div>
    );
  });
  let msgArr: any = [];

  //获取点赞信息
  const getHadLikes = (msgId: string | number) => {
    const likeList = JSON.parse(localStorage.getItem('likeList') || '{}');
    return likeList[msgId] ? true : false;
  };
  const getHadDislikes = (msgId: string | number) => {
    const dislikeList = JSON.parse(localStorage.getItem('dislikeList') || '{}');
    return dislikeList[msgId] ? true : false;
  };

  //点赞回复操作台的未知控制
  const userOperaControl = (e: any, item: any) => {
    const operaEle =
      e.target.parentElement.parentElement.parentElement.querySelector(
        '#opera'
      );
    const nextSbling = e.target.nextElementSibling;
    const { height: operaEleH, width: operaEleW } =
      operaEle.getBoundingClientRect();
    const {
      x: chatSpaceX,
      y: chatSpaceY,
      width: chatSpaceW
    } = chatSpaceRef.current.getBoundingClientRect();
    const {
      x: msgSpaceX,
      y: msgSpaceY,
      width: msgSpaceW
    } = e.target.getBoundingClientRect();
    if (item.username === userInfo.username) {
      if (msgSpaceX - chatSpaceX - operaEleW - 24 > operaEleW) {
        operaEle.style.top = nextSbling ? '35%' : '45%';
        operaEle.style.left = msgSpaceX - chatSpaceX - operaEleW - 24 + 'px';
      } else {
        operaEle.style.left = msgSpaceX - chatSpaceX - 20 + 'px';
        if (msgSpaceY - chatSpaceY < operaEleH + 2) {
          operaEle.style.top = 'auto';
          operaEle.style.bottom = (nextSbling ? -4 : -operaEleH - 4) + 'px';
        } else {
          operaEle.style.top = 0 + 'px';
        }
      }
    } else {
      if (
        chatSpaceW - (msgSpaceX - chatSpaceX) - operaEleW - msgSpaceW - 24 >
        operaEleW
      ) {
        operaEle.style.top = nextSbling ? '35%' : '45%';
        operaEle.style.right =
          chatSpaceW -
          (msgSpaceX - chatSpaceX) -
          operaEleW -
          msgSpaceW -
          28 +
          'px';
      } else {
        operaEle.style.right =
          chatSpaceW - (msgSpaceX - chatSpaceX) - msgSpaceW - 24 + 'px';
        if (msgSpaceY - chatSpaceY < operaEleH + 4) {
          operaEle.style.top = 'auto';
          operaEle.style.bottom = (nextSbling ? -4 : -operaEleH - 4) + 'px';
        } else {
          operaEle.style.top = '0';
        }
      }
    }
    requestAnimationFrame(() => {
      operaEle.style.transition = 'all 0.2s ease-in-out';
      operaEle.classList.add('opacity100');
    });
  };
  const userOperaControlForLeave = (e: any) => {
    const operaEle =
      e.target.parentElement.parentElement.parentElement.querySelector(
        '#opera'
      );
    operaEle.style.transition = 'none';
    operaEle.classList.remove('opacity100');
  };

  //点赞逻辑
  const like = (item: any) => {
    if (!userInfo.isLogin) return loginControl.showLoginForm();
    const likeList = JSON.parse(localStorage.getItem('likeList') || '{}');
    const dislikeList = JSON.parse(localStorage.getItem('dislikeList') || '{}');
    if (likeList[item.id]) {
      socket.current.emit('cancelLikeSbMsg', {
        room: item.room,
        username: item.username,
        msgId: item.id,
        likes: item.likes
      });
      localStorage.setItem(
        'likeList',
        JSON.stringify(Object.assign(likeList, { [item.id]: false }))
      );
    } else {
      if (dislikeList[item.id]) {
        socket.current.emit('cancelDislikeSbMsg', {
          room: item.room,
          username: item.username,
          msgId: item.id,
          dislikes: item.dislikes
        });
        localStorage.setItem(
          'dislikeList',
          JSON.stringify(Object.assign(dislikeList, { [item.id]: false }))
        );
      }
      socket.current.emit('likeSbMsg', {
        room: item.room,
        username: item.username,
        msgId: item.id,
        likes: item.likes
      });
      localStorage.setItem(
        'likeList',
        JSON.stringify(Object.assign(likeList, { [item.id]: true }))
      );
    }

    return null;
  };
  const dislike = (item: any) => {
    if (!userInfo.isLogin) return loginControl.showLoginForm();
    const likeList = JSON.parse(localStorage.getItem('likeList') || '{}');
    const dislikeList = JSON.parse(localStorage.getItem('dislikeList') || '{}');
    if (dislikeList[item.id]) {
      socket.current.emit('cancelDislikeSbMsg', {
        room: item.room,
        username: item.username,
        msgId: item.id,
        dislikes: item.dislikes
      });
      localStorage.setItem(
        'dislikeList',
        JSON.stringify(Object.assign(dislikeList, { [item.id]: false }))
      );
    } else {
      if (likeList[item.id]) {
        socket.current.emit('cancelLikeSbMsg', {
          room: item.room,
          username: item.username,
          msgId: item.id,
          likes: item.likes
        });
        localStorage.setItem(
          'likeList',
          JSON.stringify(Object.assign(likeList, { [item.id]: false }))
        );
      }
      socket.current.emit('dislikeSbMsg', {
        room: item.room,
        username: item.username,
        msgId: item.id,
        dislikes: item.dislikes
      });
      localStorage.setItem(
        'dislikeList',
        JSON.stringify(Object.assign(dislikeList, { [item.id]: true }))
      );
    }
    return null;
  };

  //添加聊天记录
  if (historyMsg[selectedGroup.groupId]) {
    msgArr = historyMsg[selectedGroup.groupId].map(
      (item: any, index: number) => {
        return (
          <div
            className="tw-flex tw-gap-2 tw-relative"
            key={item.id + '' + index}
          >
            <div
              id="opera"
              className={`tw-flex tw-z-50 tw-px-1 tw-py-0.5 tw-gap-1 opacity0 hover:tw-opacity-100 tw-text-xs tw-absolute opacity0 tw-h-fit tw-w-fit tw-rounded-md tw-bg-messageBackground`}
            >
              <div className="tw-rounded tw-cursor-pointer hover:tw-text-hoverColor hover:tw-bg-midGray tw-p-0.5 tw-flex tw-justify-center tw-items-center">
                <RollbackOutlined />
              </div>
              <div
                onClick={() => like(item)}
                className={`${
                  getHadLikes(item.id) ? 'tw-text-love' : 'tw-text-white'
                } tw-rounded tw-cursor-pointer hover:tw-text-hoverColor hover:tw-bg-midGray tw-p-0.5 tw-flex tw-justify-center tw-items-center`}
              >
                <LikeFilled />
              </div>
              <div
                onClick={() => dislike(item)}
                className={`${
                  getHadDislikes(item.id) ? 'tw-text-disLove' : 'tw-text-white'
                } tw-rounded tw-cursor-pointer hover:tw-text-hoverColor hover:tw-bg-midGray tw-p-0.5 tw-flex tw-justify-center tw-items-center`}
              >
                <DislikeFilled />
              </div>
            </div>
            <div className="tw-w-10">
              {item.username !== userInfo.username ? (
                <img
                  src={'/public' + item.avatar}
                  alt=""
                  className="tw-w-10 tw-rounded-full tw-object-contain"
                />
              ) : (
                <></>
              )}
            </div>
            <div
              className={`tw-flex-1 tw-flex tw-flex-col tw-gap-2 tw-overflow-hidden  ${styles.showTime}`}
            >
              <div
                className={`tw-text-textGrayColor tw-text-xs ${
                  item.username !== userInfo.username ? '' : 'tw-self-end'
                } tw-flex ${
                  item.username === userInfo.username
                    ? 'tw-flex-row-reverse'
                    : ''
                }`}
              >
                <span>{item.username}</span>
                <span>&nbsp;</span>
                <span>{`(${'北京'})`}</span>
                <span>&nbsp;</span>
                <span className="tw-text-xs tw-transition-all">
                  {dayjs(item.time).format('HH:mm')}
                </span>
              </div>
              <div className={`tw-flex tw-flex-col tw-w-full`}>
                <div
                  className={`${
                    item.username !== userInfo.username ? '' : 'tw-self-end'
                  } tw-bg-messageBackground tw-py-2 tw-px-4 tw-rounded-2xl ${
                    item.username !== userInfo.username
                      ? 'tw-rounded-tl-none'
                      : 'tw-rounded-tr-none'
                  } tw-w-fit tw-max-w-full tw-break-words`}
                  onMouseEnter={(e) => userOperaControl(e, item)}
                  onMouseLeave={userOperaControlForLeave}
                >
                  {item.msg}
                </div>
                {item.likes || item.dislikes ? (
                  <div
                    className={`tw-text-xs tw-flex tw-gap-2 tw-mt-1  ${
                      item.username !== userInfo.username
                        ? 'tw-ml-2'
                        : 'tw-self-end tw-mr-2'
                    }`}
                  >
                    {item.likes ? (
                      <div className="tw-text-love">
                        <LikeFilled />
                        {item.likes}
                      </div>
                    ) : (
                      <></>
                    )}
                    {item.dislikes ? (
                      <div className="tw-text-disLove">
                        <DislikeFilled />
                        {item.dislikes}
                      </div>
                    ) : (
                      <> </>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="tw-w-10">
              {item.username === userInfo.username ? (
                <img
                  src={'/public' + item.avatar}
                  alt=""
                  className="tw-w-10 tw-rounded-full tw-object-contain"
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      }
    );
  }

  //每次接收到新消息，都判断所在群是否有消息
  //切换群组时，将新信息插入历史记录
  //对应两个依赖
  useEffect(() => {
    if (
      newMsg[selectedGroup.groupId] &&
      newMsg[selectedGroup.groupId].length !== 0
    ) {
      dispatch(
        setHistoryMessage({
          groupId: selectedGroup.groupId,
          msgs: newMsg[selectedGroup.groupId],
          opera: 'insert'
        })
      );
      dispatch(setNewMsg({ reset: true, room: selectedGroup.groupId } as any));
      dispatch(
        setHadNewMsg({ groupId: selectedGroup.groupId, hadNewMsg: false })
      );
    }
  }, [newMsg, selectedGroup]);

  //聊天空间默认卷到底部，切换群组触发
  useEffect(() => {
    chatSpaceRef.current!.scrollTop = chatSpaceRef.current.scrollHeight;
  }, [selectedGroup]);
  //修复首次加载不滑动到底部的问题
  useEffect(() => {
    if (
      historyMsg[selectedGroup.groupId] &&
      historyMsg[selectedGroup.groupId].length !== 0 &&
      !init.current
    ) {
      chatSpaceRef.current!.scrollTop = chatSpaceRef.current.scrollHeight;
      init.current = true;
    }
  }, [historyMsg]);

  return (
    <div className="tw-flex tw-flex-col tw-bg-lightGray tw-w-full tw-h-full tw-rounded-lg tw-overflow-hidden tw-pb-14 tw-relative">
      <div className="tw-h-12 tw-w-full tw-bg-chatSpaceHeader tw-text-base tw-flex tw-items-center tw-pl-2">
        {selectedGroup.groupName}
      </div>
      <div
        ref={chatSpaceRef}
        className="tw-flex-1 tw-flex tw-gap-5 tw-flex-col tw-px-5 tw-overflow-y-auto tw-overflow-x-hidden tw-pt-4 tw-pb-4"
      >
        {msgArr}
      </div>
      <div className="tw-h-10 tw-absolute tw-inset-x-5 tw-bottom-4 tw-bg-chatSpaceFooter tw-rounded-lg tw-flex tw-items-center tw-px-2 tw-gap-0.5 tw-text-lg">
        <ChatInput selectedGroup={selectedGroup}></ChatInput>
        <InputMask></InputMask>
      </div>
      <div className="tw-absolute tw-bottom-16 tw-p-1 tw-flex tw-flex-col tw-gap-0.5 tw-overflow-auto tw-left-14 tw-w-40 tw-max-h-40 tw-bg-messageBackground tw-shadow-circle tw-rounded-lg">
        {atMemberVDom}
      </div>
    </div>
  );
};
export default ChatSpace;
