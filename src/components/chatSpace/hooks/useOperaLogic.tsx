import loginFlagContext from '@/context/loginFlagContext';
import { useContext, useEffect, useRef } from 'react';

const useOperaLogic = (props: any) => {
  const loginControl = useContext(loginFlagContext);
  const { chatSpaceRef, userInfo, socket } = props;
  const timer = useRef<any>({});
  const timer2 = useRef<any>({});
  const currentMsgItem = useRef<any>(null);
  //位置计算
  const positionCalculate = () => {
    const operaEle: any = chatSpaceRef.current.querySelector(
      `[data-opera-index='${currentMsgItem.current?.id}']`
    );
    const msgEle: any = chatSpaceRef.current.querySelector(
      `[data-msg-index='${currentMsgItem.current?.id}']`
    );
    if (!operaEle) return;
    if (timer.current[currentMsgItem.current?.id])
      clearTimeout(timer.current[currentMsgItem.current?.id]);
    if (timer2.current[currentMsgItem.current?.id])
      clearTimeout(timer2.current[currentMsgItem.current?.id]);
    operaEle.style.display = 'flex';
    requestAnimationFrame(() => {
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
      } = msgEle.getBoundingClientRect();
      if (currentMsgItem.current?.username === userInfo.username) {
        //表示消息长度比较短，要显示在左右位置
        if (msgSpaceX - chatSpaceX - operaEleW - 24 > operaEleW) {
          operaEle.style.top = 5 + 'px';
          operaEle.style.left = -operaEleW - 4 + 'px';
          //表示消息长度比较长，要显示在上下位置
        } else {
          operaEle.style.left = 0 + 'px';
          if (msgSpaceY - chatSpaceY < operaEleH + 2) {
            operaEle.style.top = 'auto';
            operaEle.style.bottom = -operaEleH - 4 + 'px';
          } else {
            operaEle.style.top = -operaEleH - 4 + 'px';
          }
        }
      } else {
        //表示消息长度比较短，要显示在左右位置
        if (
          chatSpaceW - (msgSpaceX - chatSpaceX) - operaEleW - msgSpaceW - 24 >
          operaEleW
        ) {
          operaEle.style.top = 5 + 'px';
          operaEle.style.right = -operaEleW - 4 + 'px';
        } else {
          operaEle.style.right = 0 + 'px';
          if (msgSpaceY - chatSpaceY < operaEleH + 4) {
            operaEle.style.top = 'auto';
            operaEle.style.bottom = -operaEleH - 4 + 'px';
          } else {
            operaEle.style.top = -operaEleH - 4 + 'px';
          }
        }
      }
      requestAnimationFrame(() => {
        operaEle.style.transition = 'all 0.2s ease-in-out';
        operaEle.classList.add('opacity100');
      });
    });
  };

  //点赞回复操作台的未知控制
  const userOperaControl = (e: any, item: any) => {
    currentMsgItem.current = item;
    positionCalculate();
  };
  const userOperaControlForLeave = (e: any, item: any) => {
    currentMsgItem.current = null;
    const operaEle: any = document.body.querySelector(
      `[data-opera-index='${item.id}']`
    );
    if (!operaEle) return;
    clearTimeout(timer.current[item.id]);
    clearTimeout(timer2.current[item.id]);
    timer.current[item.id] = setTimeout(() => {
      operaEle.classList.remove('opacity100');
      timer2.current[item.id] = setTimeout(() => {
        operaEle.style.transition = 'none';
        operaEle.style.display = '';
        timer2.current[item.id] = undefined;
      }, 200);
      timer.current[item.id] = undefined;
    }, 200);
  };

  //监听滚动事件
  useEffect(() => {
    const scrollCallback = (e: any) => {
      if (!currentMsgItem.current) return;
      positionCalculate();
    };
    chatSpaceRef.current?.addEventListener('scroll', scrollCallback);
    return () => {
      chatSpaceRef.current?.removeEventListener('scroll', scrollCallback);
    };
  }, [userInfo]);

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
    } else {
      if (dislikeList[item.id]) {
        socket.current.emit('cancelDislikeSbMsg', {
          room: item.room,
          username: item.username,
          msgId: item.id,
          dislikes: item.dislikes
        });
      }
      socket.current.emit('likeSbMsg', {
        room: item.room,
        username: item.username,
        msgId: item.id,
        likes: item.likes
      });
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
    } else {
      if (likeList[item.id]) {
        socket.current.emit('cancelLikeSbMsg', {
          room: item.room,
          username: item.username,
          msgId: item.id,
          likes: item.likes
        });
      }
      socket.current.emit('dislikeSbMsg', {
        room: item.room,
        username: item.username,
        msgId: item.id,
        dislikes: item.dislikes
      });
    }
    return null;
  };
  //获取点赞信息
  const getHadLikes = (msgId: string | number) => {
    const likeList = JSON.parse(localStorage.getItem('likeList') || '{}');
    return likeList[msgId] ? true : false;
  };
  const getHadDislikes = (msgId: string | number) => {
    const dislikeList = JSON.parse(localStorage.getItem('dislikeList') || '{}');
    return dislikeList[msgId] ? true : false;
  };
  return {
    userOperaControlForLeave,
    userOperaControl,
    like,
    dislike,
    getHadLikes,
    getHadDislikes
  };
};
export default useOperaLogic;
