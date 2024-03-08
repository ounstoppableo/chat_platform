import ChatInput from '@/components/chatInput/chatInput.tsx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import InputMask from '../InputMask/InputMask.tsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  setHadNewMsg,
  setHistoryMessage,
  setNewMsg
} from '@/redux/userInfo/userInfo.ts';
import dayjs from 'dayjs';
import styles from './chatSpace.module.scss';
import {
  CloseOutlined,
  DeleteOutlined,
  DislikeFilled,
  EditOutlined,
  LikeFilled,
  LogoutOutlined
} from '@ant-design/icons';
import socketContext from '@/context/socketContext.ts';
import { Msg } from '@/redux/userInfo/userInfo.type.ts';
import { Input, Modal, Popconfirm, message } from 'antd';
import useReplyLogic from './hooks/useReplyLogic.tsx';
import useOperaLogic from './hooks/useOperaLogic.tsx';
import useGroupManageLogic from './hooks/useGroupManageLogic.tsx';
import useNewMsgTipLogic from './hooks/useNewMsgTipLogic.tsx';

const ChatSpace = React.forwardRef((props: any, mentions) => {
  const socket = useContext(socketContext);
  const newMsg = useSelector((state: any) => state.userInfo.newMsg);
  const historyMsg = useSelector((state: any) => state.userInfo.historyMsg);
  const init = useRef(false);
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.userInfo.data);
  const { selectedGroup, at, switchGroup } = props;
  const chatSpaceRef = useRef<any>(null);
  const groups = useSelector((state: any) => state.userInfo.groups);
  const currentGroup = groups.find(
    (item: any) => item.groupId === selectedGroup.groupId
  );
  const [openEditGroupName, setOpenEditGroupName] = useState(false);

  const [newGroupName, setNewGroupName] = useState('');
  const scrollToBottomTimer = useRef<any>(null);
  const hadNewMsg = useRef(false);

  //回复模块
  const { replyInfo, closeReply, addReply, getReplyMsg } = useReplyLogic({
    historyMsg,
    selectedGroup,
    userInfo
  });

  let msgArr: any = [];

  //操作台逻辑
  const {
    userOperaControlForLeave,
    userOperaControl,
    like,
    dislike,
    getHadLikes,
    getHadDislikes
  } = useOperaLogic({
    userInfo,
    chatSpaceRef,
    socket
  });

  const getTodayTimeStamp = () => {
    return dayjs(dayjs(new Date()).format('YYYY-MM-DD 00:00:00')).unix();
  };
  //消息头日期控制
  const dateControl = (msgIndex: any) => {
    const curr = historyMsg[selectedGroup.groupId][msgIndex];
    const prev =
      msgIndex === 0 ? null : historyMsg[selectedGroup.groupId][msgIndex - 1];
    const currTimeStamp = dayjs(curr.time).unix();
    const prevTimeStamp = prev ? dayjs(prev.time).unix() : 0;
    if (currTimeStamp - prevTimeStamp > 300) {
      if (getTodayTimeStamp() - currTimeStamp <= 0) {
        return (
          <div className="tw-text-center tw-text-disLove tw-text-xs tw-py-3">
            {dayjs(curr.time).format('HH:mm')}
          </div>
        );
      } else if (
        getTodayTimeStamp() - currTimeStamp > 0 &&
        getTodayTimeStamp() - currTimeStamp <= 86400
      ) {
        return (
          <div className="tw-text-center tw-text-disLove tw-text-xs tw-py-3">
            昨天&nbsp;{dayjs(curr.time).format('HH:mm')}
          </div>
        );
      } else if (
        getTodayTimeStamp() - currTimeStamp > 86400 &&
        getTodayTimeStamp() - currTimeStamp <= 604800
      ) {
        let week;
        switch (dayjs(curr.time).day()) {
          case 0:
            week = '星期日';
            break;
          case 1:
            week = '星期一';
            break;
          case 2:
            week = '星期二';
            break;
          case 3:
            week = '星期三';
            break;
          case 4:
            week = '星期四';
            break;
          case 5:
            week = '星期五';
            break;
          case 6:
            week = '星期六';
            break;
        }
        return (
          <div className="tw-text-center tw-text-disLove tw-text-xs tw-py-3">
            {week}&nbsp;{dayjs(curr.time).format('HH:mm')}
          </div>
        );
      } else {
        return (
          <div className="tw-text-center tw-text-disLove tw-text-xs tw-py-3">
            {dayjs(curr.time).format('YYYY年MM月DD日 HH:mm')}
          </div>
        );
      }
    } else {
      return <></>;
    }
  };

  //消息处理
  const msgOpera = (msg: Msg) => {
    if (!msg.atMembers || msg.atMembers.length === 0) {
      return msg.msg;
    } else {
      const pattern = new RegExp(
        msg.atMembers.map((item) => `@${item} `).join('|'),
        'g'
      );
      // // 使用 split() 方法拆分字符串
      let i = 0;
      const parts = msg.msg
        .split(pattern)
        .reduce((acc: any, curr: any, index, array) => {
          if (index < array.length - 1) {
            const delimiter = (msg.msg as any).match(pattern)[index];
            acc.push(
              <span key={i++}>{curr}</span>,
              <span key={i++} className="tw-text-hoverColor tw-cursor-pointer">
                {delimiter}
              </span>
            );
          } else {
            acc.push(<span key={i++}>{curr}</span>);
          }
          return acc;
        }, []);
      return <>{parts}</>;
    }
  };

  //添加聊天记录
  if (historyMsg[selectedGroup.groupId]) {
    msgArr = historyMsg[selectedGroup.groupId].map(
      (item: Msg, index: number) => {
        return (
          <div key={item.id + '' + index} data-index={item.id}>
            {dateControl(index)}
            <div className="tw-flex tw-gap-2 tw-relative">
              {selectedGroup.type === 'group' ? (
                <div
                  data-opera-index={item.id}
                  id="opera"
                  className={`tw-hidden tw-z-50 tw-px-1 tw-py-0.5 tw-gap-1 opacity0 hover:tw-opacity-100 hover:tw-flex tw-text-xs tw-absolute opacity0 tw-h-fit tw-w-fit tw-rounded-md tw-bg-messageBackground`}
                >
                  <div
                    onClick={() =>
                      addReply({
                        username: item.username,
                        msg: item.msg,
                        msgId: item.id
                      })
                    }
                    className={`tw-rounded tw-cursor-pointer hover:tw-text-hoverColor hover:tw-bg-midGray tw-p-0.5 tw-flex tw-justify-center tw-items-center`}
                  >
                    <span
                      className="iconfont icon-reply"
                      style={{ fontSize: '12px' }}
                    ></span>
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
                      getHadDislikes(item.id)
                        ? 'tw-text-disLove'
                        : 'tw-text-white'
                    } tw-rounded tw-cursor-pointer hover:tw-text-hoverColor hover:tw-bg-midGray tw-p-0.5 tw-flex tw-justify-center tw-items-center`}
                  >
                    <DislikeFilled />
                  </div>
                </div>
              ) : (
                <></>
              )}
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
                    onMouseLeave={(e) => userOperaControlForLeave(e, item)}
                  >
                    {msgOpera(item)}
                  </div>
                  {getReplyMsg(item)}
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
      if (chatSpaceRef.current && chatSpaceRef.current.lastElementChild) {
        const lastDomRect =
          chatSpaceRef.current.lastElementChild.getBoundingClientRect();
        if (
          document.getElementById('chatInputContainer')!.getBoundingClientRect()
            .y -
            lastDomRect.y -
            lastDomRect.height -
            20 <
          0
        ) {
          newMsg[selectedGroup.groupId]
            .filter((msg: Msg) => msg.username !== userInfo.username)
            .forEach((item: Msg) => {
              if (item.atMembers?.includes(userInfo.username)) {
                const targetId = unReadMentionMsg.targetId.map((item) => item);
                targetId.push(item.id);
                setUnReadMentionMsg({
                  count: unReadMentionMsg.count + 1,
                  targetId: targetId
                });
              }
              if (
                (
                  item.forMsg &&
                  historyMsg[selectedGroup.groupId].find(
                    (msg: Msg) => msg.id === item.forMsg
                  )
                )?.username === userInfo.username ||
                (
                  item.forMsg &&
                  newMsg[selectedGroup.groupId].find(
                    (msg: Msg) => msg.id === item.forMsg
                  )
                )?.username === userInfo.username
              ) {
                const targetId = unReadReplyMsg.targetId.map((item) => item);
                targetId.push(item.id);
                setUnReadReplyMsg({
                  count: unReadReplyMsg.count + 1,
                  targetId: targetId
                });
              }
              const targetId = unReadNewMsg.targetId.map((item) => item);
              targetId.push(item.id);
              setUnReadNewMsg({
                count: unReadNewMsg.count + 1,
                targetId: targetId
              });
            });
        }
      }
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
  const scrollToBottom = () => {
    chatSpaceRef.current
      ? (chatSpaceRef.current!.scrollTop = chatSpaceRef.current.scrollHeight)
      : null;
  };
  useEffect(() => {
    scrollToBottom();
  }, [selectedGroup]);
  //修复首次加载不滑动到底部的问题
  useEffect(() => {
    if (
      historyMsg[selectedGroup.groupId] &&
      historyMsg[selectedGroup.groupId].length !== 0 &&
      !init.current
    ) {
      scrollToBottom();
      init.current = true;
    }
  }, [historyMsg]);
  //自己发消息则滚动到底部
  useEffect(() => {
    if (
      newMsg[selectedGroup.groupId] &&
      newMsg[selectedGroup.groupId].length !== 0 &&
      newMsg[selectedGroup.groupId][newMsg[selectedGroup.groupId].length - 1]
        .username === userInfo.username
    ) {
      hadNewMsg.current = true;
    }
    if (
      historyMsg[selectedGroup.groupId] &&
      historyMsg[selectedGroup.groupId].length !== 0 &&
      historyMsg[selectedGroup.groupId][
        historyMsg[selectedGroup.groupId].length - 1
      ].username === userInfo.username &&
      hadNewMsg.current
    ) {
      requestAnimationFrame(() => {
        hadNewMsg.current = false;
      });
      scrollToBottom();
    }
  }, [newMsg, historyMsg]);

  //群控制逻辑
  const {
    groupNamePreOpera,
    deleteGroup,
    editGroupName,
    exitGroup,
    checkEditGroupName,
    cancelEditGroupName,
    changeNewGroupName
  } = useGroupManageLogic({
    socket,
    userInfo,
    switchGroup,
    currentGroup,
    setOpenEditGroupName,
    newGroupName,
    message,
    setNewGroupName
  });

  //新消息提示逻辑
  const {
    unReadNewMsg,
    unReadReplyMsg,
    unReadMentionMsg,
    setUnReadMentionMsg,
    setUnReadReplyMsg,
    setUnReadNewMsg,
    newMsgTipDom
  } = useNewMsgTipLogic({
    scrollToBottomTimer,
    chatSpaceRef,
    message,
    selectedGroup
  });

  return selectedGroup.groupName ? (
    <div className="tw-flex tw-flex-col tw-bg-lightGray tw-w-full tw-h-full tw-rounded-lg tw-overflow-hidden tw-pb-4 tw-relative">
      <div className="tw-justify-between tw-h-12 tw-w-full tw-bg-chatSpaceHeader tw-text-base tw-flex tw-items-center tw-px-2">
        <span>
          {selectedGroup.type === 'group' && Number(selectedGroup.groupId) !== 1
            ? selectedGroup.groupName
            : groupNamePreOpera(selectedGroup.groupName)}
          &nbsp;
          {currentGroup &&
          currentGroup.authorBy === userInfo.username &&
          currentGroup.type === 'group' &&
          Number(selectedGroup.groupId) !== 1 ? (
            <span onClick={editGroupName} className="tw-cursor-pointer">
              <EditOutlined />
            </span>
          ) : (
            <></>
          )}
        </span>
        <div>
          {currentGroup &&
          userInfo.username &&
          currentGroup.type === 'group' &&
          Number(selectedGroup.groupId) !== 1 ? (
            currentGroup.authorBy === userInfo.username ? (
              <Popconfirm
                title="删除群聊"
                description="您真的要删除该群聊吗?"
                onConfirm={deleteGroup}
                okText="确认"
                cancelText="取消"
              >
                <button
                  title="删除群聊"
                  className="tw-w-6 tw-h-6 tw-rounded-full tw-bg-[#ff4d4f]"
                >
                  <DeleteOutlined />
                </button>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="退出群聊"
                description="您真的要退出该群聊吗?"
                onConfirm={exitGroup}
                okText="确认"
                cancelText="取消"
              >
                <button
                  title="退出群聊"
                  className="tw-w-6 tw-h-6 tw-rounded-full tw-bg-[#f69220]"
                >
                  <LogoutOutlined />
                </button>
              </Popconfirm>
            )
          ) : (
            <></>
          )}
        </div>
      </div>
      <div
        ref={chatSpaceRef}
        className="tw-flex-1 tw-flex tw-gap-5 tw-flex-col tw-px-5 tw-overflow-y-auto tw-overflow-x-hidden tw-pt-4 tw-pb-4"
      >
        {msgArr}
      </div>
      {replyInfo ? (
        <div className="tw-mx-5 tw-flex tw-gap-2 tw-bg-chatSpaceFooter tw-rounded-lg tw-mb-1 tw-text-xs tw-py-1 tw-px-2 tw-text-textGrayColor">
          <span className="tw-break-all tw-flex-1">
            {replyInfo.username + ':' + replyInfo.msg}
          </span>
          <span
            className="tw-w-5 tw-flex tw-justify-center tw-items-center tw-cursor-pointer"
            onClick={closeReply}
          >
            <CloseOutlined />
          </span>
        </div>
      ) : (
        <></>
      )}
      <div
        id="chatInputContainer"
        className="tw-h-10 tw-relative tw-mx-5 tw-bg-chatSpaceFooter tw-rounded-lg tw-flex tw-items-center tw-px-2 tw-gap-0.5 tw-text-lg"
      >
        <ChatInput
          ref={mentions}
          selectedGroup={selectedGroup}
          toName={groupNamePreOpera(selectedGroup.groupName)}
          replyInfo={replyInfo}
          closeReply={closeReply}
          at={at}
        ></ChatInput>
        <InputMask></InputMask>
      </div>
      <Modal
        open={openEditGroupName}
        className="customModal"
        okText="确认"
        cancelText="取消"
        closeIcon={null}
        footer={
          <div className="tw-flex tw-gap-3 tw-justify-center">
            <button
              onClick={cancelEditGroupName}
              className="tw-border tw-border-[#4c4d4f] hover:tw-border-[#213d5b] hover:tw-text-[#409eff] tw-text-white tw-w-fit hover:tw-bg-[#18222c] tw-bg-transparent tw-rounded tw-px-4 tw-py-1.5  tw-self-end"
            >
              取消
            </button>
            <button
              onClick={checkEditGroupName}
              // disabled={confirmDisabled}
              className="tw-text-white tw-w-fit hover:tw-bg-btnHoverColor tw-bg-btnColor tw-rounded tw-px-4 tw-py-1.5 tw-self-end"
            >
              确认
            </button>
          </div>
        }
      >
        <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-2">
          <div className="tw-text-white">请输入新的群名</div>
          <div>
            <Input
              value={newGroupName}
              onChange={changeNewGroupName}
              className="customInput"
            />
          </div>
        </div>
      </Modal>
      {newMsgTipDom}
    </div>
  ) : (
    <div className="tw-w-full tw-h-full tw-bg-lightGray tw-rounded-lg"></div>
  );
});
ChatSpace.displayName = 'ChatSpace';
export default ChatSpace;
