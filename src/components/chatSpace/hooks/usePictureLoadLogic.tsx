import { Msg } from '@/redux/userInfo/userInfo.type';
import { useRef } from 'react';

const usePictureLoadLogic = (props: any) => {
  const { scrollToBottom, unReadNewMsg } = props;
  const timer = useRef<any>(null);
  const picLoadAndScrollLogic = (msg: Msg) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      unReadNewMsg.targetId.find((item: string) => item === msg.id)
        ? null
        : scrollToBottom();
    }, 200);
  };
  return { picLoadAndScrollLogic };
};
export default usePictureLoadLogic;
