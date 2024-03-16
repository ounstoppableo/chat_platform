import socketContext from '@/context/socketContext';
import { setDelMsg } from '@/redux/userInfo/userInfo';
import { Msg } from '@/redux/userInfo/userInfo.type';
import { addMeme, delMsg } from '@/service/msgControl';
import {
  CopyOutlined,
  DeleteOutlined,
  RollbackOutlined,
  SmileOutlined
} from '@ant-design/icons';
import { message } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useMenuLogic = () => {
  const userInfo = useSelector((state: any) => state.userInfo.data);
  const socket = useContext(socketContext);
  const [menu, setMenu] = useState(<></>);
  const dispatch = useDispatch();
  const contextMenuCb = (e: any, msg: Msg) => {
    e.preventDefault();
    e.stopPropagation();
    const copyMsg = () => {
      navigator.clipboard.writeText(msg.msg).then(() => {
        message.success('复制成功！');
        setMenu(<></>);
      });
    };
    const withdrawMsg = () => {
      socket.current.emit('withdrawMsg', msg);
      setMenu(<></>);
    };
    const toDelMsg = () => {
      delMsg(msg.id, msg.room).then((res) => {
        if (res.code === 200) {
          message.success('删除消息成功！');
          dispatch(
            setDelMsg({ groupId: res.data.groupId, msgId: res.data.msgId })
          );
        }
      });
      setMenu(<></>);
    };
    const toAddMeme = (url: string) => {
      addMeme(url).then((res: any) => {
        if (res.code === 200) {
          message.success('添加成功！');
        }
      });
      setMenu(<></>);
    };
    setMenu(
      <div
        className={`tw-z-[99999] tw-text-xs tw-absolute tw-w-24 tw-h-fit tw-rounded-lg tw-bg-chatSpaceFooter tw-flex tw-flex-col tw-gap-1 tw-p-1`}
        style={{ top: e.clientY + 'px', left: e.clientX + 'px' }}
        id="msgMenu"
      >
        <div
          onClick={copyMsg}
          className="tw-cursor-pointer tw-pl-1 tw-py-1 tw-gap-1 tw-items-center tw-flex tw-rounded tw-flex-1 tw-self-start hover:tw-bg-messageBackground tw-w-full"
        >
          <span>
            <CopyOutlined />
          </span>
          <span>复制</span>
        </div>
        {msg.username === userInfo.username ? (
          <div
            onClick={withdrawMsg}
            className="tw-cursor-pointer tw-pl-1 tw-py-1 tw-gap-1 tw-items-center tw-flex tw-rounded tw-flex-1 tw-self-start hover:tw-bg-messageBackground tw-w-full"
          >
            <span>
              <RollbackOutlined />
            </span>
            <span>撤回消息</span>
          </div>
        ) : (
          <></>
        )}
        {msg.type === 'picture' && msg.src ? (
          <div
            onClick={() => toAddMeme(msg.src!)}
            className="tw-cursor-pointer tw-pl-1 tw-py-1 tw-gap-1 tw-items-center tw-flex tw-rounded tw-flex-1 tw-self-start hover:tw-bg-messageBackground tw-w-full"
          >
            <span>
              <SmileOutlined />
            </span>
            <span>添加表情</span>
          </div>
        ) : (
          <></>
        )}
        <div className="tw-w-full tw-border tw-border-[#383c4b] tw-border-solid"></div>
        <div
          onClick={toDelMsg}
          className="tw-cursor-pointer tw-pl-1 tw-py-1 tw-gap-1 tw-items-center tw-flex tw-rounded tw-flex-1 tw-self-start hover:tw-bg-messageBackground tw-w-full"
        >
          <span>
            <DeleteOutlined />
          </span>
          <span>删除</span>
        </div>
      </div>
    );
  };
  //清除菜单
  useEffect(() => {
    const cb = (e: any) => {
      if (
        (!e.target.closest('#msgMenu') && e.type === 'click') ||
        (!e.target.closest('#msgMenu') && e.type === 'contextmenu')
      ) {
        setMenu(<></>);
      }
    };
    window.addEventListener('click', cb);
    window.addEventListener('contextmenu', cb);
    return () => {
      window.removeEventListener('click', cb);
      window.removeEventListener('contextmenu', cb);
    };
  }, []);
  return { menu, contextMenuCb };
};
export default useMenuLogic;
