import inputLogicContext from '@/context/inputLogicContext';
import { UserInfo } from '@/redux/userInfo/userInfo.type';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useAtMemberLogic = () => {
  const { inputValue, setInputValue } = useContext(inputLogicContext);
  const groupMember: UserInfo[] = useSelector(
    (state: any) => state.userInfo.groupMember
  );
  //@符号后跟着的成员列表显示隐藏控制
  const [atFlag, setAtFlag] = useState(false);
  const [selected, setSelected] = useState('');
  //@符号后跟着的成员列表
  const [atMember, setAtMember] = useState<UserInfo[]>([]);
  const toSetAtMember = (data: UserInfo[]) => {
    setAtMember(data);
    setSelected(data[0]?.username || '');
  };
  const atMemberVDom = atMember.map((item: any, index: number) => {
    return (
      <div
        key={index}
        className={`${
          selected === item.username ? 'tw-bg-midHoverColor' : ''
        } tw-h-10 tw-flex tw-gap-2 tw-items-center tw-cursor-pointer hover:tw-bg-lightHoverColor tw-rounded-lg tw-p-1`}
      >
        <img
          src={'/public' + item.avatar}
          className="tw-h-full tw-rounded-full tw-object-cover"
          alt=""
        />
        <div>{item.username}</div>
      </div>
    );
  });

  //选择事件
  useEffect(() => {
    const keyBoardCallback = (e: any) => {
      if (e.code === 'ArrowUp') {
        const index = atMember.findIndex((item) => item.username === selected);
        setSelected(atMember[index === 0 ? 0 : index - 1].username);
      }
      if (e.code === 'ArrowDown') {
        const index = atMember.findIndex((item) => item.username === selected);
        setSelected(
          atMember[
            index === atMember.length - 1 ? atMember.length - 1 : index + 1
          ].username
        );
      }
      if (e.code === 'Enter') {
        const index = inputValue.lastIndexOf('@');
        setInputValue(inputValue.slice(0, index) + '@' + selected + ' ');
        setAtFlag(false);
      }
    };
    const clickCallback = (e: any) => {
      setSelected(e.target.innerText);
      const index = inputValue.lastIndexOf('@');
      setInputValue(
        inputValue.slice(0, index) + '@' + e.target.innerText + ' '
      );
      setAtFlag(false);
    };
    if (atFlag) {
      document.addEventListener('keyup', keyBoardCallback);
      document.addEventListener('click', clickCallback);
    }
    return () => {
      if (atFlag) {
        document.removeEventListener('keyup', keyBoardCallback);
        document.removeEventListener('click', clickCallback);
      }
    };
  }, [atFlag, selected, inputValue]);

  //过滤逻辑
  useEffect(() => {
    if (inputValue.endsWith('@')) {
      setAtFlag(true);
    }
    if (!inputValue.includes('@')) {
      setAtFlag(false);
    }
    if (inputValue.lastIndexOf('@') >= 0) {
      const index = inputValue.lastIndexOf('@');
      const atName = inputValue.slice(index + 1);
      const atMembers = groupMember.filter((item) =>
        item.username.startsWith(atName)
      );
      toSetAtMember(atMembers);
    }
  }, [inputValue]);
  return { atFlag, atMemberVDom };
};
export default useAtMemberLogic;
