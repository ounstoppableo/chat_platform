import loginFlagContext from '@/context/loginFlagContext';
import { useContext } from 'react';

const useOperaLogic = (props: any) => {
  const loginControl = useContext(loginFlagContext);
  const { chatSpaceRef, userInfo, socket } = props;
  //点赞回复操作台的未知控制
  const userOperaControl = (e: any, item: any) => {
    const operaEle =
      e.target.parentElement.parentElement.parentElement.querySelector(
        '#opera'
      );
    if (!operaEle) return;
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
            operaEle.style.top = 0 + 'px';
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
            operaEle.style.top = '0';
          }
        }
      }
      requestAnimationFrame(() => {
        operaEle.style.transition = 'all 0.2s ease-in-out';
        operaEle.classList.add('opacity100');
      });
    });
  };
  const userOperaControlForLeave = (e: any) => {
    const operaEle =
      e.target.parentElement.parentElement.parentElement.querySelector(
        '#opera'
      );
    if (!operaEle) return;
    operaEle.classList.remove('opacity100');
    setTimeout(() => {
      operaEle.style.transition = 'none';
      operaEle.style.display = '';
    }, 200);
  };

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
