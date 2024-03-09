import { Msg } from '@/redux/userInfo/userInfo.type';
import { useState } from 'react';

const useReplyLogic = (props: any) => {
  //滚动到msg的位置
  const scrollToMsg = (dataIndex: string) => {
    const target = document.body.querySelector(`[data-index='${dataIndex}']`);
    target &&
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
  };
  const { historyMsg, selectedGroup, userInfo, openImg } = props;
  const [replyInfo, setReplyInfo] = useState<any>(null);
  const closeReply = () => {
    setReplyInfo(null);
  };
  const addReply = (replyInfo: {
    username: string;
    msg: string;
    msgId: string;
  }) => {
    setReplyInfo(replyInfo);
  };
  //获取回复消息
  const getReplyMsg = (msg: Msg) => {
    const replyMsg: Msg = historyMsg[selectedGroup.groupId].find(
      (item: Msg) => item.id === msg.forMsg
    );
    return replyMsg ? (
      <div
        className={`tw-flex tw-gap-1 tw-bg-[#424656] tw-break-all tw-w-fit tw-py-1 tw-px-2 tw-rounded-lg tw-text-xs tw-mt-1 tw-text-[#999999] ${
          msg.username === userInfo.username ? 'tw-self-end' : 'tw-self-start'
        }`}
      >
        {msg.username !== userInfo.username ? (
          <>
            <span
              className="iconfont icon-arrow-to-top tw-cursor-pointer tw-text-white tw-flex tw-items-center"
              style={{ fontSize: '12px' }}
              onClick={() => scrollToMsg(msg.forMsg)}
            >
              {' '}
            </span>
            <span> &nbsp;</span>
          </>
        ) : (
          <></>
        )}
        <span className="nowrap tw-flex tw-items-center">
          {replyMsg.username + ':'}
        </span>
        {replyMsg.type === 'picture' ? (
          <span>
            <img
              onClick={openImg}
              src={'/public' + replyMsg.src || ''}
              className="tw-object-contain tw-w-full tw-rounded-lg"
              alt=""
            />
          </span>
        ) : (
          <span>{replyMsg.msg}</span>
        )}
        {msg.username === userInfo.username ? (
          <>
            <span>&nbsp;</span>
            <span
              className="iconfont icon-arrow-to-top tw-cursor-pointer tw-text-white tw-flex tw-items-center"
              style={{ fontSize: '12px' }}
              onClick={() => scrollToMsg(msg.forMsg)}
            >
              {' '}
            </span>
          </>
        ) : (
          <></>
        )}
      </div>
    ) : (
      <></>
    );
  };
  return {
    replyInfo,
    closeReply,
    addReply,
    getReplyMsg
  };
};
export default useReplyLogic;
