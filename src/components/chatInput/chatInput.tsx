import {
  AudioOutlined,
  FolderOutlined,
  HeartOutlined,
  MessageOutlined,
  PictureOutlined,
  RocketOutlined,
  RocketTwoTone,
  SmileOutlined
} from '@ant-design/icons';
import { useContext, useEffect, useState } from 'react';
import { Input, UploadProps, message, Upload } from 'antd';
import emoji from 'emojilib';
import styles from './chatInput.module.scss';
import { RcFile } from 'antd/es/upload';
import wsContext from '@/context/wsContext';

const ChatInput = () => {
  const ws = useContext(wsContext);
  const [msgFlag, setMsgFlag] = useState(false);
  const [emjFlag, setEmjFlag] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [emjOrMyFav, setEmjOrMyFav] = useState(true);
  const emojiBoard = [];
  const handleMshMethod = () => {
    setMsgFlag(!msgFlag);
  };
  const handleEmj = () => {
    setEmjFlag(!emjFlag);
  };
  const addEmj = (emj: any) => {
    setInputValue(inputValue + emj);
  };
  const inputChange = (e: any) => {
    setInputValue(e.currentTarget.value);
  };
  const at = () => {
    setInputValue(inputValue + '@');
  };
  const selectEmjOrMyFav = (tips: string) => {
    tips === 'emj' ? setEmjOrMyFav(true) : setEmjOrMyFav(false);
  };

  //表情选择板
  let i = 0;
  for (const item in emoji) {
    i++;
    emojiBoard.push(
      <div
        className="tw-w-6 tw-h-6 hover:tw-bg-lightGray tw-cursor-pointer tw-flex tw-justify-center tw-items-center  tw-rounded"
        key={i}
        onClick={() => addEmj(item)}
      >
        {item}
      </div>
    );
    if (i === 209) break;
  }

  //图片上传的配置
  const selectPicProps: UploadProps = {
    name: 'selectPictures',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    showUploadList: false,
    beforeUpload: (file: RcFile) => {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('请选择图片类型的文件!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('文件大小不能超过2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    onChange: () => {}
  };

  //上传文件的配置
  const selectFolderProps: UploadProps = {
    name: 'selectFolder',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    showUploadList: false,
    beforeUpload: (file: RcFile) => {
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        message.error('文件大小不能超过5MB!');
      }
      return isLt2M;
    },
    onChange: () => {}
  };

  //发送消息的回调
  const sendMsg = () => {
    const message = { type: 'chat', content: 'Hello, WebSocket!' };
    ws.send(JSON.stringify(message));
  };

  //添加全局点击事件
  useEffect(() => {
    const callback = (e: any) => {
      //实现点击表情选择板外部能关闭选择板
      if (
        emjFlag &&
        !e.target.closest('#emjSelect') &&
        !e.target.closest('#showEmjSelect')
      ) {
        setEmjFlag(!emjFlag);
      }
    };
    document.addEventListener('click', callback);
    return () => {
      document.removeEventListener('click', callback);
    };
  }, [emjFlag]);
  return (
    <>
      <div
        onClick={handleMshMethod}
        className="tw-cursor-pointer tw-w-7 tw-h-7 tw-flex tw-justify-center tw-items-center tw-rounded-lg hover:tw-bg-chatInputActive"
      >
        {msgFlag ? <AudioOutlined /> : <MessageOutlined />}
      </div>
      <div className="tw-flex-1">
        <Input
          value={inputValue}
          placeholder="来聊点什么吧~"
          onChange={inputChange}
        />
      </div>
      <div
        id="showEmjSelect"
        onClick={handleEmj}
        className="tw-w-7 tw-h-7 tw-flex tw-justify-center tw-items-center tw-rounded-lg hover:tw-bg-chatInputActive tw-cursor-pointer ban-select"
      >
        {emjFlag ? '😀' : '😐'}
      </div>
      <div
        onClick={at}
        className="tw-cursor-pointer tw-w-7 tw-h-7 tw-flex tw-leading-8 tw-justify-center tw-items-center tw-rounded-lg hover:tw-bg-chatInputActive"
      >
        @
      </div>
      <Upload {...selectPicProps}>
        <div className="tw-text-lg tw-w-7 tw-h-7 tw-flex tw-leading-8 tw-justify-center tw-items-center tw-rounded-lg hover:tw-bg-chatInputActive">
          <PictureOutlined />
        </div>
      </Upload>
      <Upload {...selectFolderProps}>
        <div className="tw-text-lg tw-w-7 tw-h-7 tw-flex tw-leading-8 tw-justify-center tw-items-center tw-rounded-lg hover:tw-bg-chatInputActive">
          <FolderOutlined />
        </div>
      </Upload>
      <div className="tw-ml-3 tw-w-7 tw-h-7 tw-flex tw-leading-8 tw-justify-center tw-items-center tw-rounded-lg">
        {inputValue.length > 0 ? (
          <div onClick={sendMsg}>
            <RocketTwoTone
              className={styles.rotateAnimation}
              style={{ fontSize: '25px', cursor: 'pointer' }}
            />
          </div>
        ) : (
          <RocketOutlined
            rotate={45}
            style={{ fontSize: '25px', color: '#999' }}
          />
        )}
      </div>
      {emjFlag ? (
        <div
          id="emjSelect"
          className="tw-absolute tw-bottom-12 tw-right-0 tw-rounded-lg tw-w-96 tw-bg-deepGray tw-border-8 tw-border-b-4 tw-border-deepGray"
        >
          <div className="tw-flex tw-flex-wrap tw-gap-0.5 tw-w-full tw-h-60 tw-overflow-auto tw-pb-8">
            {emjOrMyFav ? emojiBoard : ''}
          </div>
          <div className="tw-flex tw-gap-1 tw-absolute tw-pt-1 tw-bottom-0 tw-inset-x-0 tw-bg-deepGray tw-border-t-2 tw-border-lightGray">
            <div
              onClick={() => selectEmjOrMyFav('emj')}
              className={`tw-w-6 tw-h-6 tw-flex tw-justify-center tw-items-center tw-rounded-lg ${
                emjOrMyFav ? 'tw-bg-chatSpaceFooter' : ''
              } tw-cursor-pointer ban-select`}
            >
              <SmileOutlined />
            </div>
            <div
              onClick={() => selectEmjOrMyFav('myFav')}
              className={`tw-w-6 tw-h-6 tw-flex tw-justify-center tw-items-center tw-rounded-lg ${
                emjOrMyFav ? '' : 'tw-bg-chatSpaceFooter'
              } tw-cursor-pointer ban-select`}
            >
              <HeartOutlined />
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};
export default ChatInput;
