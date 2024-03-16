import loginFlagContext from '@/context/loginFlagContext';
import { useContext, useEffect, useRef } from 'react';

const useOperaLogic = (props: any) => {
  const loginControl = useContext(loginFlagContext);
  const { chatSpaceRef, userInfo, socket } = props;
  const timer = useRef<any>({});
  const timer2 = useRef<any>({});
  const currentDom = useRef<any>(null);
  //位置计算
  const positionCalculate = () => {};

  //点赞回复操作台的未知控制
  const userOperaControl = (e: any, item: any) => {
    const operaEle =
      e.target.parentElement.parentElement.parentElement.querySelector(
        `[data-opera-index='${item.id}']`
      );
    if (!operaEle) return;
    if (timer.current[item.id]) clearTimeout(timer.current[item.id]);
    if (timer2.current[item.id]) clearTimeout(timer2.current[item.id]);
    currentDom.current = operaEle;
    operaEle.style.display = 'flex';
    requestAnimationFrame(() => {
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
            operaEle.style.top = -4 + 'px';
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
            operaEle.style.top = '-4px';
          }
        }
      }
      requestAnimationFrame(() => {
        operaEle.style.transition = 'all 0.2s ease-in-out';
        operaEle.classList.add('opacity100');
      });
    });
  };
  const userOperaControlForLeave = (e: any, item: any) => {
    const operaEle =
      e.target.parentElement.parentElement.parentElement.querySelector(
        `[data-opera-index='${item.id}']`
      );
    if (!operaEle) return;
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
  // useEffect(() => {
  //   const callback = () => {
  //     if (currentDom.current?.style.display === 'flex') {
  //       console.log(1111);
  //     }
  //   };
  //   chatSpaceRef.current.addEventListener('scroll', callback);
  //   return () => {
  //     chatSpaceRef.current.removeEventListener('scroll', callback);
  //   };
  // }, []);

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
