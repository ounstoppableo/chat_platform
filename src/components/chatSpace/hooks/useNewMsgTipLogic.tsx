import { DownOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const useNewMsgTipLogic = (props: any) => {
  const [unReadMentionMsg, setUnReadMentionMsg] = useState<{
    count: number;
    targetId: any[];
  }>({ count: 0, targetId: [] });
  const [unReadReplyMsg, setUnReadReplyMsg] = useState<{
    count: number;
    targetId: any[];
  }>({ count: 0, targetId: [] });
  const [unReadNewMsg, setUnReadNewMsg] = useState<{
    count: number;
    targetId: any[];
  }>({ count: 0, targetId: [] });
  const { scrollToBottomTimer, chatSpaceRef, message, selectedGroup } = props;
  const clickToScrollToNewMsg = () => {
    if (!scrollToBottomTimer.current) {
      const targetId = unReadNewMsg.targetId.map((item: any) => item);
      const scollToMsgId = targetId.shift();
      chatSpaceRef.current
        ? chatSpaceRef
            .current!.querySelector(`[data-index='${scollToMsgId}']`)
            ?.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
              inline: 'nearest'
            })
        : null;
      setUnReadNewMsg({ count: targetId.length, targetId: targetId });
      scrollToBottomTimer.current = setTimeout(() => {
        clearTimeout(scrollToBottomTimer.current);
        scrollToBottomTimer.current = null;
      }, 500);
    } else {
      message.warning('操作太快啦!休息一下吧~');
    }
  };
  const clickToScrollToMentionMsg = () => {
    if (!scrollToBottomTimer.current) {
      const targetId = unReadMentionMsg.targetId.map((item: any) => item);
      const scollToMsgId = targetId.shift();
      chatSpaceRef.current
        ? chatSpaceRef
            .current!.querySelector(`[data-index='${scollToMsgId}']`)
            ?.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
              inline: 'nearest'
            })
        : null;
      setUnReadMentionMsg({ count: targetId.length, targetId: targetId });
      scrollToBottomTimer.current = setTimeout(() => {
        clearTimeout(scrollToBottomTimer.current);
        scrollToBottomTimer.current = null;
      }, 500);
    } else {
      message.warning('操作太快啦!休息一下吧~');
    }
  };
  const clickToScrollToReplyMsg = () => {
    if (!scrollToBottomTimer.current) {
      const targetId = unReadReplyMsg.targetId.map((item: any) => item);
      const scollToMsgId = targetId.shift();
      chatSpaceRef.current
        ? chatSpaceRef
            .current!.querySelector(`[data-index='${scollToMsgId}']`)
            ?.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
              inline: 'nearest'
            })
        : null;
      setUnReadReplyMsg({ count: targetId.length, targetId: targetId });
      scrollToBottomTimer.current = setTimeout(() => {
        clearTimeout(scrollToBottomTimer.current);
        scrollToBottomTimer.current = null;
      }, 500);
    } else {
      message.warning('操作太快啦!休息一下吧~');
    }
  };

  //监控滚动反馈新消息提示
  useEffect(() => {
    const callback = () => {
      if (unReadNewMsg.count !== 0) {
        unReadNewMsg.targetId.forEach((item: any) => {
          const itemDom = chatSpaceRef.current.querySelector(
            `[data-index='${item}']`
          );
          if (itemDom) {
            const itemDomRect = itemDom.getBoundingClientRect();
            const chatInputContainerY = document
              .getElementById('chatInputContainer')!
              .getBoundingClientRect().y;
            if (itemDomRect.y + itemDomRect.height / 2 < chatInputContainerY) {
              const targetId = unReadNewMsg.targetId.filter(
                (id: any) => id !== item
              );
              setUnReadNewMsg({ count: targetId.length, targetId });
            }
          }
        });
      }
      if (unReadMentionMsg.count !== 0) {
        unReadMentionMsg.targetId.forEach((item: any) => {
          const itemDom = chatSpaceRef.current.querySelector(
            `[data-index='${item}']`
          );
          if (itemDom) {
            const itemDomRect = itemDom.getBoundingClientRect();
            const chatInputContainerY = document
              .getElementById('chatInputContainer')!
              .getBoundingClientRect().y;
            if (itemDomRect.y + itemDomRect.height / 2 < chatInputContainerY) {
              const targetId = unReadMentionMsg.targetId.filter(
                (id: any) => id !== item
              );
              setUnReadMentionMsg({ count: targetId.length, targetId });
            }
          }
        });
      }
      if (unReadReplyMsg.count !== 0) {
        unReadReplyMsg.targetId.forEach((item: any) => {
          const itemDom = chatSpaceRef.current.querySelector(
            `[data-index='${item}']`
          );
          if (itemDom) {
            const itemDomRect = itemDom.getBoundingClientRect();
            const chatInputContainerY = document
              .getElementById('chatInputContainer')!
              .getBoundingClientRect().y;
            if (itemDomRect.y + itemDomRect.height / 2 < chatInputContainerY) {
              const targetId = unReadReplyMsg.targetId.filter(
                (id: any) => id !== item
              );
              setUnReadReplyMsg({ count: targetId.length, targetId });
            }
          }
        });
      }
    };
    chatSpaceRef.current?.addEventListener('scroll', callback);
    return () => {
      chatSpaceRef.current?.removeEventListener('scroll', callback);
    };
  }, [unReadMentionMsg, unReadNewMsg, unReadReplyMsg]);
  //切换群组时清空unReadMsg
  useEffect(() => {
    setUnReadMentionMsg({ count: 0, targetId: [] });
    setUnReadNewMsg({ count: 0, targetId: [] });
    setUnReadReplyMsg({ count: 0, targetId: [] });
  }, [selectedGroup]);
  const newMsgTipDom = (
    <div className="tw-absolute tw-right-6 tw-bottom-[70px] tw-flex tw-flex-col tw-gap-2">
      {unReadNewMsg.count > 0 ? (
        <div
          onClick={clickToScrollToNewMsg}
          className=" tw-border-[#2790f5] tw-border tw-bg-[#323644] tw-text-[14px] tw-text-[#2790f5] hover:tw-bg-[#1a1c22]  tw-cursor-pointer tw-h-7  tw-flex tw-justify-center tw-items-center tw-px-4 tw-rounded-[28px]"
        >
          {unReadNewMsg.count}&nbsp;条新消息&nbsp;
          <span className="tw-text-[12px]">
            <DownOutlined />
          </span>
        </div>
      ) : (
        <></>
      )}
      {unReadMentionMsg.count > 0 ? (
        <div
          onClick={clickToScrollToMentionMsg}
          className=" tw-border-[#2790f5] tw-border tw-bg-[#323644] tw-text-[14px] tw-text-[#2790f5] hover:tw-bg-[#1a1c22]  tw-cursor-pointer tw-h-7  tw-flex tw-justify-center tw-items-center tw-px-4 tw-rounded-[28px]"
        >
          {unReadMentionMsg.count}&nbsp;条@信息&nbsp;
          <span className="tw-text-[12px]">
            <DownOutlined />
          </span>
        </div>
      ) : (
        <></>
      )}
      {unReadReplyMsg.count > 0 ? (
        <div
          onClick={clickToScrollToReplyMsg}
          className=" tw-border-[#2790f5] tw-border tw-bg-[#323644] tw-text-[14px] tw-text-[#2790f5] hover:tw-bg-[#1a1c22]  tw-cursor-pointer tw-h-7  tw-flex tw-justify-center tw-items-center tw-px-4 tw-rounded-[28px]"
        >
          {unReadReplyMsg.count}&nbsp;条回复信息&nbsp;
          <span className="tw-text-[12px]">
            <DownOutlined />
          </span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
  return {
    clickToScrollToNewMsg,
    clickToScrollToMentionMsg,
    clickToScrollToReplyMsg,
    unReadNewMsg,
    unReadReplyMsg,
    unReadMentionMsg,
    setUnReadMentionMsg,
    setUnReadReplyMsg,
    setUnReadNewMsg,
    newMsgTipDom
  };
};
export default useNewMsgTipLogic;
