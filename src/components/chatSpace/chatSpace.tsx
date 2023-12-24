import ChatInput from '@/components/chatInput/chatInput.tsx';
import { useEffect, useRef, useState } from 'react';
import InputMask from '../InputMask/InputMask.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { setMsg } from '@/redux/userInfo/userInfo.ts';

const ChatSpace = (props: any) => {
  const msg = useSelector((state: any) => state.userInfo.msg);
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.userInfo.data);
  const { selectedGroup } = props;
  const chatSpaceRef = useRef<any>(null);
  const [msgArr, setMsgArr] = useState<any[]>([]);

  //添加聊天记录
  useEffect(() => {
    if (msg[selectedGroup.groupId] && msg[selectedGroup.groupId].length !== 0) {
      const arr = [] as any;
      msg[selectedGroup.groupId].forEach((item: any) => {
        arr.push(
          <div className="tw-flex tw-gap-2">
            <div className="tw-w-10">
              {item.username !== userInfo.username ? (
                <img
                  src={'/public' + userInfo.avatar}
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
                  src={'/public' + userInfo.avatar}
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
      dispatch(setMsg({ reset: true, room: selectedGroup.groupId } as any));
      setMsgArr([...msgArr, ...arr]);
    }
  }, [msg]);
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
