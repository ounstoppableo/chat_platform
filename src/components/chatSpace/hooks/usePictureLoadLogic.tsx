import { Msg } from '@/redux/userInfo/userInfo.type';

const usePictureLoadLogic = (props: any) => {
  const { scrollToBottom, unReadNewMsg } = props;
  const picLoadAndScrollLogic = (msg: Msg) => {
    setTimeout(() => {
      unReadNewMsg.targetId.find((item: string) => item === msg.id)
        ? null
        : scrollToBottom();
    }, 10);
  };
  return { picLoadAndScrollLogic };
};
export default usePictureLoadLogic;
