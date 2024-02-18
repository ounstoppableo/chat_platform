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
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Input, UploadProps, message, Upload, Mentions } from 'antd';
import emoji from 'emojilib';
import styles from './chatInput.module.scss';
import { RcFile } from 'antd/es/upload';
import { useSelector } from 'react-redux';
import { UserInfo } from '@/redux/userInfo/userInfo.type';
import loginFlagContext from '@/context/loginFlagContext';
import socketContext from '@/context/socketContext';
import inputLogicContext from '@/context/inputLogicContext';

const ChatInput = React.forwardRef((props: any, mentions) => {
  const { selectedGroup, toName, replyInfo, closeReply, at } = props;
  const socket = useContext(socketContext);
  const loginControl = useContext(loginFlagContext);
  const userInfo: UserInfo = useSelector((state: any) => state.userInfo.data);
  const { inputValue, setInputValue } = useContext(inputLogicContext);
  const groupMember: UserInfo[] = useSelector(
    (state: any) => state.userInfo.groupMember
  );
  const timer = useRef<any>(null);
  const atMembers = useRef<string[]>([]);

  const [msgFlag, setMsgFlag] = useState(false);
  const [emjFlag, setEmjFlag] = useState(false);
  // const [inputValue, setInputValue] = useState('');
  const [emjOrMyFav, setEmjOrMyFav] = useState(true);
  const emojiBoard = [];
  const handleMshMethod = () => {
    setMsgFlag(!msgFlag);
  };
  const handleEmj = () => {
    setEmjFlag(!emjFlag);
  };
  const addEmj = (emj: any) => {
    if (inputValue.length === 500) return message.error('超过字数限制！');
    return setInputValue(inputValue + emj);
  };
  const inputChange = (e: any) => {
    setInputValue(
      e.currentTarget ? e.currentTarget.value.slice(0, 500) : e.slice(0, 500)
    );
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

  //发送消息的回调(群)
  const sendMsgToGroup = () => {
    if (!timer.current) {
      if (!userInfo.isLogin) loginControl.showLoginForm();
      socket.current.emit('msgToServer', {
        room: selectedGroup.groupId,
        msg: inputValue,
        time: new Date(),
        avatar: userInfo.avatar,
        atMembers: atMembers.current,
        forMsg: replyInfo && replyInfo.msgId
      });
      setInputValue('');
      closeReply();
      atMembers.current = [];
      timer.current = setTimeout(() => {
        clearTimeout(timer.current);
        timer.current = null;
      }, 3000);
    } else {
      message.error('发送速度太快了o,请3秒后再发~');
    }
  };

  //发送消息的回调(p2p)
  const sendMsgForP2P = () => {
    if (!timer.current) {
      if (!userInfo.isLogin) loginControl.showLoginForm();
      socket.current.emit('p2pChat', {
        fromName: userInfo.username,
        toName: toName,
        msg: inputValue,
        time: new Date(),
        fromAvatar: userInfo.avatar,
        toAvatar: selectedGroup.toAvatar
      });
      setInputValue('');
      timer.current = setTimeout(() => {
        clearTimeout(timer.current);
        timer.current = null;
      }, 3000);
    } else {
      message.error('发送速度太快了o,请3秒后再发~');
    }
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

  useEffect(() => {
    setInputValue('');
    atMembers.current = [];
  }, [selectedGroup]);

  //提及的options
  const mentionOptions = [...groupMember]
    .filter((item) => item.username !== userInfo.username)
    .sort((a: UserInfo, b: UserInfo) => +a.uid - +b.uid)
    .map((item: UserInfo, index: number) => {
      return {
        value: item.username,
        label: (
          <div
            data-mentionsitem={item.username}
            className={`${
              index === 0 ? 'tw-bg-[#2b5281]' : ''
            } tw-h-10 tw-white tw-flex tw-gap-2 tw-items-center tw-cursor-pointer hover:tw-bg-lightHoverColor tw-rounded-lg tw-p-1`}
          >
            <img
              src={'/public' + item.avatar}
              className="tw-h-full tw-rounded-full tw-object-cover"
              alt=""
            />
            <div className="tw-text-white">{item.username}</div>
          </div>
        ),
        key: item.uid,
        className: '',
        style: {
          padding: 0,
          paddingTop: index === 0 ? 0 : '4px'
        }
      };
    });
  const mentionOnSelect = (e: any) => {
    if (inputValue.length + e.value.length >= 498)
      return message.error('超过字数限制！');
    return atMembers.current.includes(e.value)
      ? null
      : atMembers.current.push(e.value);
  };
  //点击空格事件后触发选择
  useEffect(() => {
    const callback = (e: any) => {
      //确定@对象
      if (e.code === 'Space') {
        const clickEvent = new Event('click', { bubbles: true });
        document
          .querySelector(`[data-menu-list="true"]`)
          ?.children[0].dispatchEvent(clickEvent);
      }
    };
    if ((mentions as any)?.current) {
      (mentions as any)?.current.textarea.addEventListener('keyup', callback);
    }
    return () => {
      if ((mentions as any)?.current) {
        (mentions as any)?.current.textarea.removeEventListener(
          'keyup',
          callback
        );
      }
    };
  }, []);

  const enterCallback = (e: any) => {
    //回车发送消息
    if (e.code === 'Enter') {
      selectedGroup.type === 'group' ? sendMsgToGroup() : sendMsgForP2P();
    }
  };

  return (
    <>
      <div
        onClick={handleMshMethod}
        className="tw-cursor-pointer tw-w-7 tw-h-7 tw-flex tw-justify-center tw-items-center tw-rounded-lg hover:tw-bg-chatInputActive"
      >
        {msgFlag ? <AudioOutlined /> : <MessageOutlined />}
      </div>
      <div className="tw-flex-1">
        {selectedGroup.type === 'group' ? (
          <Mentions
            ref={mentions as any}
            value={inputValue}
            className="customMentions"
            placeholder="来聊点什么吧~"
            autoSize={{ minRows: 1, maxRows: 1 }}
            notFoundContent={<div className="tw-text-white">没找到Ta啦~</div>}
            disabled={!userInfo.isLogin}
            onChange={inputChange}
            autoFocus={true}
            options={mentionOptions}
            onKeyUp={enterCallback}
            onSelect={mentionOnSelect}
            popupClassName="customMentionsPopup"
          />
        ) : (
          <Input
            value={inputValue}
            placeholder="来聊点什么吧~"
            autoFocus={true}
            onChange={inputChange}
            onKeyUp={enterCallback}
            className="customInput"
            disabled={!userInfo.isLogin}
          />
        )}
      </div>
      <div
        id="showEmjSelect"
        onClick={handleEmj}
        className="tw-w-7 tw-h-7 tw-flex tw-justify-center tw-items-center tw-rounded-lg hover:tw-bg-chatInputActive tw-cursor-pointer ban-select"
      >
        {emjFlag ? '😀' : '😐'}
      </div>
      {selectedGroup.type === 'group' ? (
        <div
          onClick={() => at()}
          className="tw-cursor-pointer tw-w-7 tw-h-7 tw-flex tw-leading-8 tw-justify-center tw-items-center tw-rounded-lg hover:tw-bg-chatInputActive"
        >
          @
        </div>
      ) : (
        <></>
      )}
      <Upload {...selectPicProps} disabled={!userInfo.isLogin}>
        <div className="tw-text-white  tw-text-lg tw-w-7 tw-h-7 tw-flex tw-leading-8 tw-justify-center tw-items-center tw-rounded-lg hover:tw-bg-chatInputActive">
          <PictureOutlined />
        </div>
      </Upload>
      <Upload {...selectFolderProps} disabled={!userInfo.isLogin}>
        <div className="tw-text-white tw-text-lg tw-w-7 tw-h-7 tw-flex tw-leading-8 tw-justify-center tw-items-center tw-rounded-lg hover:tw-bg-chatInputActive">
          <FolderOutlined />
        </div>
      </Upload>
      <div className="tw-ml-3 tw-w-7 tw-h-7 tw-flex tw-leading-8 tw-justify-center tw-items-center tw-rounded-lg">
        {inputValue.length > 0 ? (
          <div
            onClick={() =>
              selectedGroup.type === 'group'
                ? sendMsgToGroup()
                : sendMsgForP2P()
            }
          >
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
        <></>
      )}
    </>
  );
});
ChatInput.displayName = 'ChatInput';
export default ChatInput;
