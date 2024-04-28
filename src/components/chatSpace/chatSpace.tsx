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
  DownloadOutlined,
  EditOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileMarkdownOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileTextOutlined,
  FileUnknownOutlined,
  FileWordOutlined,
  FileZipOutlined,
  LikeFilled,
  LoadingOutlined,
  LogoutOutlined,
  MessageOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import socketContext from '@/context/socketContext.ts';
import { Group, Msg, UserInfo } from '@/redux/userInfo/userInfo.type.ts';
import { Input, Modal, Popconfirm, message } from 'antd';
import useReplyLogic from './hooks/useReplyLogic.tsx';
import useOperaLogic from './hooks/useOperaLogic.tsx';
import useGroupManageLogic from './hooks/useGroupManageLogic.tsx';
import useNewMsgTipLogic from './hooks/useNewMsgTipLogic.tsx';
import useMenuLogic from './hooks/useMenuLogic.tsx';
import { createPortal } from 'react-dom';
import useOpenImgLogic from './hooks/useOpenImgLogic.tsx';
import usePictureLoadLogic from './hooks/usePictureLoadLogic.tsx';
import { getMsgs } from '@/service/msgControl.ts';
import loginFlagContext from '@/context/loginFlagContext.ts';
import smallSizeContext from '@/context/smallSizeContext.ts';

const ChatSpace = React.forwardRef((props: any, mentions) => {
  const socket = useContext(socketContext);
  const newMsg = useSelector((state: any) => state.userInfo.newMsg);
  const historyMsg = useSelector((state: any) => state.userInfo.historyMsg);
  const init = useRef(false);
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.userInfo.data);
  const loginControl = useContext(loginFlagContext);
  const { selectedGroup, at, switchGroup, toOpenGroupMember } = props;
  const chatSpaceRef = useRef<any>(null);
  const groups = useSelector((state: any) => state.userInfo.groups);
  const currentGroup = groups.find(
    (item: any) => item.groupId === selectedGroup.groupId
  );
  const [openEditGroupName, setOpenEditGroupName] = useState(false);
  const { smallSize, setSmallSize } = useContext(smallSizeContext);
  const [newGroupName, setNewGroupName] = useState('');
  const scrollToBottomTimer = useRef<any>(null);
  const hadNewMsg = useRef(false);
  const [userInfoBg, setUserInfoBg] = useState<string>('');
  const groupMember = useSelector((state: any) => state.userInfo.groupMember);
  const friends = useSelector((state: any) => state.userInfo.friends);

  //记录加载新消息前的位置
  const preScrollOffset = useRef<number>(0);

  //消息加载相关参数
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgHadAllGet, setMsgHadAllGet] = useState(false);

  //图片打开逻辑
  const { openImg } = useOpenImgLogic();

  let msgArr: any = [];

  //新消息提示逻辑
  const {
    unReadNewMsg,
    unReadReplyMsg,
    unReadMentionMsg,
    setUnReadMentionMsg,
    setUnReadReplyMsg,
    setUnReadNewMsg,
    newMsgTipDom,
    clearUnReadMsg
  } = useNewMsgTipLogic({
    scrollToBottomTimer,
    chatSpaceRef,
    message,
    selectedGroup,
    historyMsg
  });

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

  const scrollToBottomSmooth = () => {
    chatSpaceRef.current
      ? chatSpaceRef.current.scrollTo({
          top: chatSpaceRef.current.scrollHeight,
          behavior: 'smooth'
        })
      : null;
  };
  useEffect(() => {
    /**
     * 自己发消息则滚动到底部
     * 别人发的消息如果自己在底部则也滚动到底部
     */
    if (
      historyMsg[selectedGroup.groupId] &&
      historyMsg[selectedGroup.groupId].length !== 0 &&
      hadNewMsg.current
    ) {
      if (
        historyMsg[selectedGroup.groupId][
          historyMsg[selectedGroup.groupId].length - 1
        ].username === userInfo.username ||
        (chatSpaceRef.current &&
          chatSpaceRef.current.scrollTop >=
            chatSpaceRef.current.scrollHeight -
              chatSpaceRef.current.offsetHeight -
              140)
      ) {
        requestAnimationFrame(() => {
          hadNewMsg.current = false;
          clearUnReadMsg();
          scrollToBottomSmooth();
        });
      } else {
        hadNewMsg.current = false;
      }
    }
    if (
      newMsg[selectedGroup.groupId] &&
      newMsg[selectedGroup.groupId].length !== 0
    ) {
      hadNewMsg.current = true;
    }
  }, [newMsg, historyMsg]);

  //图片加载后滚动到底部的逻辑
  const { picLoadAndScrollLogic } = usePictureLoadLogic({
    scrollToBottom,
    unReadNewMsg
  });
  //回复模块
  const { replyInfo, closeReply, addReply, getReplyMsg } = useReplyLogic({
    historyMsg,
    selectedGroup,
    userInfo,
    openImg
  });

  //根据文件后缀选择文件图标
  const selectFileIconBySuffix = (fileName: string) => {
    if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      return <FileExcelOutlined className="tw-text-[#109968]" />;
    } else if (
      fileName.endsWith('.gif') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.bmp') ||
      fileName.endsWith('.tiff') ||
      fileName.endsWith('.tif') ||
      fileName.endsWith('.webp') ||
      fileName.endsWith('.svg')
    ) {
      return <FileImageOutlined className="tw-text-[#7c878e]" />;
    } else if (fileName.endsWith('.md')) {
      return <FileMarkdownOutlined className="tw-text-[#a8a8a8]" />;
    } else if (fileName.endsWith('.pdf')) {
      return <FilePdfOutlined className="tw-text-[#df4023]" />;
    } else if (fileName.endsWith('.ppt')) {
      return <FilePptOutlined className="tw-text-[#bd8cfc]" />;
    } else if (fileName.endsWith('.txt')) {
      return <FileTextOutlined className="" />;
    } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      return <FileWordOutlined className="tw-text-[#3a74d1]" />;
    } else if (
      fileName.endsWith('.zip') ||
      fileName.endsWith('.7z') ||
      fileName.endsWith('.rar') ||
      fileName.endsWith('.tar') ||
      fileName.endsWith('.gz') ||
      fileName.endsWith('.bz2') ||
      fileName.endsWith('.xz') ||
      fileName.endsWith('.iso')
    ) {
      return <FileZipOutlined className="tw-text-[#0078d7]" />;
    }
    return <FileUnknownOutlined className="tw-text-[#7c878e]" />;
  };

  //计算图片主色调
  const calculatePrimeColor = (imgUrl: string) => {
    // 创建一个新的 Canvas 元素
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imgUrl;

    img.onload = () => {
      // 设置 Canvas 的尺寸与图像相同
      canvas.width = img.width;
      canvas.height = img.height;

      // 在 Canvas 上绘制图像
      ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 获取图像像素数据
      const imageData = ctx!.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;

      // 计算图像中出现频率最高的颜色
      const colorMap = {} as any;
      let maxCount = 0;
      let dominantColor = [0, 0, 0]; // 初始主色调为黑色
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const key = r + ',' + g + ',' + b;
        if (!colorMap[key]) {
          colorMap[key] = 0;
        }
        colorMap[key]++;
        if (colorMap[key] > maxCount) {
          maxCount = colorMap[key];
          dominantColor = [r, g, b];
        }
      }

      // 将 RGB 值转换为 CSS 格式的颜色字符串
      const rgbString = 'rgba(' + dominantColor.join(',') + ')';
      setUserInfoBg(rgbString);
    };
  };

  //添加好友
  const toAddFriend = (username: string) => {
    socket.current.emit('addFriend', { targetUsername: username });
  };

  const chat = (friendInfo: any) => {
    switchGroup({
      groupName: userInfo.username + '&&&' + friendInfo.username,
      type: 'p2p',
      toAvatar: friendInfo.avatar,
      groupId: friendInfo.groupId
    });
  };

  //添加聊天记录
  if (historyMsg[selectedGroup.groupId]) {
    msgArr = historyMsg[selectedGroup.groupId].map(
      (item: Msg, index: number) => {
        const groupMemberItem: UserInfo = groupMember.find(
          (member: UserInfo) => item.username === member.username
        );
        const group: Group = groups.find(
          (group: Group) => group.groupId === selectedGroup.groupId
        );
        const isFriend = friends?.find(
          (friend: any) => friend.username === groupMemberItem?.username
        );
        return item.type === 'withdraw' ? (
          <div key={item.id} data-index={item.id}>
            {dateControl(index)}
            <div className="tw-text-[#8b8b8d] tw-text-xs tw-text-center tw-select-none tw-cursor-default">
              {userInfo.username === item.username
                ? '您'
                : `"${item.username}"`}
              撤回了一条消息
            </div>
          </div>
        ) : (
          <div key={item.id} data-index={item.id}>
            {dateControl(index)}
            <div className={`tw-flex tw-gap-2 tw-relative ${styles.parent}`}>
              {item.username !== userInfo.username ? (
                <div
                  className={`tw-cursor-default tw-absolute tw-w-fit tw-h-fit tw-left-[8%] tw-z-max tw-rounded-lg tw-overflow-hidden tw-bg-[#272a37] ${styles.info}`}
                >
                  <div
                    className={`tw-h-[50px]`}
                    style={{ backgroundColor: userInfoBg }}
                  ></div>
                  <div className="tw-absolute tw-translate-y-[-50%] tw-left-2 tw-w-16 tw-h-16 tw-rounded-full tw-overflow-hidden tw-border-[4px] tw-border-[#272a37]">
                    <img
                      src={'/public' + groupMemberItem?.avatar}
                      alt=""
                      className="tw-object-cover"
                    />
                  </div>
                  {groupMemberItem?.isOnline ? (
                    <div
                      className={`tw-w-3 tw-h-3 tw-absolute tw-rounded-full tw-bg-[#adff2f] tw-top-[65px] tw-left-[54px] tw-right-0`}
                    ></div>
                  ) : (
                    <div
                      className={`tw-w-3 tw-h-3 tw-absolute tw-rounded-full tw-bg-[#dfdfdf] tw-top-[65px] tw-left-[54px] tw-right-0`}
                    ></div>
                  )}

                  <div className="tw-mt-1 tw-h-7 tw-flex tw-pr-2 tw-justify-end tw-gap-2">
                    {isFriend ? (
                      <>
                        <span
                          onClick={() => at(groupMemberItem?.username)}
                          className=" tw-leading-[24px] tw-text-[24px] tw-cursor-pointer hover:tw-text-hoverColor"
                        >
                          @
                        </span>
                        <span
                          onClick={() => chat(isFriend)}
                          className="tw-text-xl tw-cursor-pointer hover:tw-text-hoverColor"
                        >
                          <MessageOutlined />
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          onClick={() => at(groupMemberItem?.username)}
                          className=" tw-leading-[24px] tw-text-[24px] tw-cursor-pointer hover:tw-text-hoverColor"
                        >
                          @
                        </span>
                        <span
                          onClick={() => toAddFriend(groupMemberItem?.username)}
                          className="tw-text-xl tw-cursor-pointer hover:tw-text-hoverColor"
                        >
                          <UserAddOutlined />
                        </span>
                      </>
                    )}
                  </div>
                  <div className="tw-ml-2 tw-mr-8 tw-text-lg">
                    {groupMemberItem?.username}
                    <span className="tw-text-[#919191]">
                      #{groupMemberItem?.uid}
                    </span>
                  </div>
                  <div className="tw-ml-2 tw-mb-2 tw-flex tw-gap-1">
                    {group?.authorBy === groupMemberItem?.username ? (
                      <span className=" tw-text-[12px] tw-rounded-lg tw-bg-[#fffbe6] tw-text-[#d48806] tw-border-[#ffe58f] tw-border-2 tw-p-1">
                        创建者
                      </span>
                    ) : (
                      <span className=" tw-text-[12px] tw-rounded-lg tw-bg-[rgba(23,125,220,0.1)] tw-text-[rgba(23,125,220)] tw-border-[rgba(23,125,220,0.3)] tw-border-2 tw-p-1">
                        群成员
                      </span>
                    )}
                    {isFriend ? (
                      <span className=" tw-text-[12px] tw-rounded-lg tw-bg-[rgba(255,192,203,0.1)] tw-text-[rgba(255,192,203,1)] tw-border-[rgba(255,192,203,0.3)] tw-border-2 tw-p-1">
                        好友
                      </span>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="tw-ml-2 tw-text-[14px] tw-mb-3 tw-text-[#6b7280]">
                    <span>所在城市：</span>
                    <span>{groupMemberItem?.region}</span>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className={`tw-w-10`}>
                {item.username !== userInfo.username ? (
                  <img
                    src={'/public' + item.avatar}
                    alt=""
                    onMouseEnter={() =>
                      calculatePrimeColor('/public' + item.avatar)
                    }
                    className={`tw-w-10 tw-rounded-full tw-object-contain  ${styles.showInfo}`}
                  />
                ) : (
                  <></>
                )}
              </div>
              <div
                className={`tw-flex-1 tw-flex tw-flex-col tw-gap-2 ${styles.showTime}`}
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
                  <span>{`(${item.region})`}</span>
                  <span>&nbsp;</span>
                  <span className="tw-text-xs tw-transition-all">
                    {dayjs(item.time).format('HH:mm')}
                  </span>
                </div>
                <div className={`tw-flex tw-flex-col tw-w-full`}>
                  <div
                    data-msg-index={item.id}
                    className={`${
                      item.username !== userInfo.username ? '' : 'tw-self-end'
                    } tw-bg-messageBackground tw-py-2 tw-px-4 tw-rounded-2xl ${
                      item.username !== userInfo.username
                        ? 'tw-rounded-tl-none'
                        : 'tw-rounded-tr-none'
                    } tw-w-fit tw-max-w-full tw-break-all tw-cursor-default tw-relative`}
                    onMouseEnter={(e) => userOperaControl(e, item)}
                    onMouseLeave={(e) => userOperaControlForLeave(e, item)}
                    onContextMenu={(e) => contextMenuCb(e, item)}
                  >
                    {item.type === 'picture' ? (
                      <div className="tw-w-full">
                        <img
                          onClick={openImg}
                          onLoad={() => picLoadAndScrollLogic(item)}
                          src={'/public' + item.src}
                          className="tw-object-contain tw-w-full  tw-rounded-lg"
                          alt=""
                        />
                      </div>
                    ) : item.type === 'file' ? (
                      <div className="tw-flex tw-gap-3 tw-justify-start tw-items-center tw-max-w-[300px] ">
                        <div className="tw-text-4xl">
                          {selectFileIconBySuffix(item.fileName || '')}
                        </div>
                        <div className="tw-flex tw-flex-col tw-overflow-hidden tw-whitespace-nowrap">
                          <div
                            title={item.fileName}
                            className="tw-text-sm tw-text-ellipsis tw-overflow-hidden"
                          >
                            {item.fileName?.endsWith('html') ||
                            item.fileName?.endsWith('pdf') ? (
                              <a
                                href={'/public' + item.src}
                                target="blank"
                                className="tw-text-white hover:tw-text-hoverColor"
                              >
                                {item.fileName}
                              </a>
                            ) : (
                              <a
                                href={'/public' + item.src}
                                className="tw-text-white hover:tw-text-hoverColor"
                                download={item.fileName}
                              >
                                {item.fileName}
                              </a>
                            )}
                          </div>
                          <div className="tw-text-xs">{item.fileSize}</div>
                        </div>
                        <div className="tw-text-lg tw-cursor-pointer">
                          <a
                            href={'/public' + item.src}
                            className="tw-text-white hover:tw-text-hoverColor"
                            download={item.fileName}
                          >
                            <DownloadOutlined />
                          </a>
                        </div>
                      </div>
                    ) : (
                      msgOpera(item)
                    )}
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
                            getHadLikes(item.id)
                              ? 'tw-text-love'
                              : 'tw-text-white'
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

  //监控滚动到顶部事件
  useEffect(() => {
    const scrollCallBack = (e: any) => {
      if (e.target.scrollTop === 0) {
        if (
          selectedGroup.groupId &&
          !msgLoading &&
          !msgHadAllGet &&
          chatSpaceRef.current.scrollHeight !==
            chatSpaceRef.current.offsetHeight
        ) {
          if (!userInfo.isLogin) return loginControl.showLoginForm();
          setMsgLoading(true);
          preScrollOffset.current = chatSpaceRef.current.scrollHeight;
          return getMsgs(
            selectedGroup.groupId,
            (historyMsg[selectedGroup.groupId] &&
              historyMsg[selectedGroup.groupId][0]?.id) ||
              99999,
            20
          ).then((res) => {
            if (res.code === 200) {
              setMsgLoading(false);
              if (res.data.result.length === 0) setMsgHadAllGet(true);
              dispatch(
                setHistoryMessage({
                  groupId: selectedGroup.groupId,
                  msgs: res.data.result,
                  opera: 'unShift'
                })
              );
            }
          });
        }
      }
      return null;
    };
    chatSpaceRef.current?.addEventListener('scroll', scrollCallBack);
    return () => {
      chatSpaceRef.current?.removeEventListener('scroll', scrollCallBack);
    };
  }, [historyMsg, selectedGroup, msgLoading, msgHadAllGet]);
  useEffect(() => {
    if (chatSpaceRef.current && preScrollOffset.current !== 0) {
      chatSpaceRef.current.scrollTop =
        chatSpaceRef.current.scrollHeight - preScrollOffset.current;
      preScrollOffset.current = 0;
    }
  }, [historyMsg]);
  useEffect(() => {
    setMsgHadAllGet(false);
  }, [selectedGroup]);

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

  //右键菜单
  const { menu, contextMenuCb } = useMenuLogic({ currentGroup });

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
        <div className="tw-flex tw-gap-2">
          {currentGroup && currentGroup.type === 'group' && smallSize ? (
            <>
              <button
                title="展开群成员"
                className="tw-w-6 tw-h-6 tw-rounded-full tw-bg-[#323644] tw-flex tw-justify-center tw-items-center"
                onClick={toOpenGroupMember}
              >
                <span className="iconfont icon-Shankar"></span>
              </button>
            </>
          ) : (
            <></>
          )}
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
                  className="tw-w-6 tw-h-6 tw-rounded-full tw-bg-[#ff4d4f] tw-flex tw-justify-center tw-items-center"
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
                  className="tw-w-6 tw-h-6 tw-rounded-full tw-bg-[#f69220] tw-flex tw-justify-center tw-items-center"
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
      <div className="tw-text-center tw-text-xs tw-text-[#999999]">
        {msgLoading && (
          <span>
            <LoadingOutlined />
            &nbsp; 加载中，请稍后~~
          </span>
        )}
      </div>
      <div
        ref={chatSpaceRef}
        className="tw-flex-1 tw-flex tw-gap-5 tw-flex-col tw-px-5 tw-overflow-y-auto tw-overflow-x-hidden tw-pt-4 tw-pb-4"
      >
        {msgHadAllGet && (
          <div className="tw-text-center tw-text-xs tw-text-[#999999]">
            &nbsp; 已经到顶了o~~
          </div>
        )}
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
      {createPortal(menu, document.body)}
    </div>
  ) : (
    <div className="tw-w-full tw-h-full tw-bg-lightGray tw-rounded-lg"></div>
  );
});
ChatSpace.displayName = 'ChatSpace';
export default ChatSpace;
