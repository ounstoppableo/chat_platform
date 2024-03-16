import { addMeme } from '@/service/msgControl';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import Upload, { RcFile } from 'antd/es/upload';
import { useState } from 'react';
import useMenuLogic from './useMenuLogic.tsx';
export const useMemeLogic = (props: any) => {
  const {
    message,
    selectedGroup,
    socket,
    userInfo,
    closeReply,
    setEmjFlag,
    toName,
    replyInfo
  } = props;
  const [myFavList, setMyFavList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  //表情包相关逻辑
  const MyFavBoard = () => {
    const uploadButton = (
      <button
        className="tw-rounded-lg tw-border tw-border-dashed tw-border-[#424654] hover:tw-border-[#1677ff] tw-text-[#a8abb2] tw-w-16 tw-h-16 tw-flex tw-flex-col tw-gap-1 tw-justify-center tw-items-center tw-mb-4"
        style={{ background: '#424654' }}
        type="button"
      >
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
      </button>
    );
    const beforeUpload = (file: RcFile) => {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('文件大小不能超过2MB!');
      }
      return isLt2M;
    };
    const handleChange = (e: any) => {
      if (e.file.status === 'done') {
        if (e.file.response.code === 200) {
          addMeme(e.file.response.data.src).then((res: any) => {
            if (res.code === 200) {
              setLoading(false);
              setMyFavList([
                ...myFavList,
                { memeUrl: res.data.memeUrl, id: res.data.id }
              ]);
            }
          });
        } else {
          message.error(e.file.response.msg);
        }
      } else {
        setLoading(true);
      }
    };
    return (
      <div className="tw-w-full tw-flex tw-flex-wrap tw-gap-2 tw-h-fit">
        {myFavList.map((item: any) => (
          <div
            className="tw-w-16 tw-h-16 tw-overflow-hidden tw-rounded-lg tw-cursor-pointer"
            key={item.id}
            onContextMenu={(e) => contextMenuCb(e, item)}
            onClick={() => {
              sendMeme(item.memeUrl);
            }}
          >
            <img
              src={'/public' + item.memeUrl}
              className="tw-w-full tw-h-full tw-object-cover"
              alt=""
            />
          </div>
        ))}
        <div className="tw-w-16 tw-h-16 tw-rounded-lg">
          <Upload
            accept="image/*"
            name="image"
            showUploadList={false}
            action="/api/uploadImage"
            withCredentials={true}
            disabled={loading}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {uploadButton}
          </Upload>
        </div>
      </div>
    );
  };
  const sendMeme = (memeUrl: string) => {
    selectedGroup.type === 'group'
      ? socket.current.emit('msgToServer', {
          room: selectedGroup.groupId,
          msg: '[图片]',
          time: new Date(),
          avatar: userInfo.avatar,
          atMembers: [],
          forMsg: replyInfo && replyInfo.msgId,
          type: 'picture',
          src: memeUrl
        })
      : socket.current.emit('p2pChat', {
          fromName: userInfo.username,
          toName: toName,
          msg: '[图片]',
          time: new Date(),
          fromAvatar: userInfo.avatar,
          toAvatar: selectedGroup.toAvatar,
          type: 'picture',
          src: memeUrl
        });
    closeReply();
    setEmjFlag(false);
  };

  const { menu, contextMenuCb } = useMenuLogic({
    setMyFavList,
    myFavList,
    setEmjFlag
  });
  return {
    MyFavBoard,
    setMyFavList,
    menu
  };
};
