import ChatInput from '@/components/chatInput/chatInput.tsx';
import { useEffect, useRef } from 'react';
import InputMask from '../InputMask/InputMask.tsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  setHadNewMsg,
  setHistoryMessage,
  setNewMsg
} from '@/redux/userInfo/userInfo.ts';

const ChatSpace = (props: any) => {
  const newMsg = useSelector((state: any) => state.userInfo.newMsg);
  const historyMsg = useSelector((state: any) => state.userInfo.historyMsg);
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.userInfo.data);
  const { selectedGroup } = props;
  const chatSpaceRef = useRef<any>(null);
  const msgArr: any = [];

  //添加聊天记录
  if (historyMsg[selectedGroup.groupId]) {
    historyMsg[selectedGroup.groupId].forEach((item: any) => {
      msgArr.push(
        <div className="tw-flex tw-gap-2">
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
          <div className="tw-flex-1 tw-flex tw-flex-col tw-gap-2 tw-overflow-hidden">
            <div
              className={`tw-text-textGrayColor tw-text-xs ${
                item.username !== userInfo.username ? '' : 'tw-self-end'
              } tw-flex tw-flex-row${
                item.username === userInfo.username ? '' : '-reverse'
              }`}
            >
              <span>{item.username}</span>&nbsp;<span>{`(${'北京'})`}</span>
            </div>
            <div
              className={`tw-bg-messageBackground tw-py-2 tw-px-4 ${
                item.username !== userInfo.username ? '' : 'tw-self-end'
              } tw-w-fit tw-max-w-full tw-break-words tw-rounded-2xl ${
                item.username !== userInfo.username
                  ? 'tw-rounded-tl-none'
                  : 'tw-rounded-tr-none'
              }`}
            >
              {item.msg}
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
    });
  }

  //每次接收到新消息，都判断所在群是否有消息，有就取出来
  useEffect(() => {
    if (
      newMsg[selectedGroup.groupId] &&
      newMsg[selectedGroup.groupId].length !== 0
    ) {
      dispatch(
        setHistoryMessage({
          groupId: selectedGroup.groupId,
          msgs: newMsg[selectedGroup.groupId]
        })
      );
      dispatch(setNewMsg({ reset: true, room: selectedGroup.groupId } as any));
      dispatch(
        setHadNewMsg({ groupId: selectedGroup.groupId, hadNewMsg: false })
      );
    }
  }, [newMsg, selectedGroup]);
  //聊天空间默认卷到底部
  useEffect(() => {
    chatSpaceRef.current!.scrollTop = chatSpaceRef.current.scrollHeight;
  });
  return (
    <div className="tw-flex tw-flex-col tw-bg-lightGray tw-w-full tw-h-full tw-rounded-lg tw-overflow-hidden tw-pb-14 tw-relative">
      <div className="tw-h-12 tw-w-full tw-bg-chatSpaceHeader tw-text-base tw-flex tw-items-center tw-pl-2">
        {selectedGroup.groupName}
      </div>
      <div
        ref={chatSpaceRef}
        className="tw-flex-1 tw-flex tw-gap-5 tw-flex-col tw-px-5 tw-overflow-y-auto tw-pt-4 tw-pb-4"
      >
        {msgArr}
      </div>
      <div className="tw-h-10 tw-absolute tw-inset-x-5 tw-bottom-4 tw-bg-chatSpaceFooter tw-rounded-lg tw-flex tw-items-center tw-px-2 tw-gap-0.5 tw-text-lg">
        <ChatInput selectedGroup={selectedGroup}></ChatInput>
        <InputMask></InputMask>
      </div>
    </div>
  );
};
export default ChatSpace;
