import { delMeme } from '@/service/msgControl';
import { DeleteOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useEffect, useState } from 'react';

const useMenuLogic = (props: any) => {
  const { setMyFavList, myFavList, setEmjFlag } = props;
  const [menu, setMenu] = useState(<></>);
  const contextMenuCb = (e: any, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    const toDelMeme = (id: number) => {
      requestAnimationFrame(() => {
        setEmjFlag(true);
      });
      delMeme(id).then((res) => {
        if (res.code === 200) {
          message.success('删除成功！');
          setMyFavList(myFavList.filter((item: any) => item.id !== id));
        }
        setMenu(<></>);
      });
    };
    setMenu(
      <div
        className={`tw-z-max tw-text-xs tw-absolute tw-w-24 tw-h-fit tw-rounded-lg tw-bg-chatSpaceFooter tw-flex tw-flex-col tw-gap-1 tw-p-1`}
        style={{ top: e.clientY + 'px', left: e.clientX + 'px' }}
        id="memeMenu"
      >
        <div
          onClick={() => toDelMeme(item.id)}
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
        (!e.target.closest('#memeMenu') && e.type === 'click') ||
        (!e.target.closest('#memeMenu') && e.type === 'contextmenu')
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
