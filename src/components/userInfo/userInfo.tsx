import { MessageOutlined, TeamOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
const UserInfo = (prop: any) => {
  const { msgOrRelation, setMsgOrRelation } = prop;
  const userInfo = useSelector((state: any) => state.userInfo.data);
  enum destEnum {
    backEnd = 'https://github.com/ounstoppableo/chat-platform-nodets.git',
    fontEnd = 'https://github.com/ounstoppableo/chat_platform.git',
    projectDoc = ''
  }
  const changeMsgOrRelation = (type: 'msg' | 'relation') => {
    setMsgOrRelation(type);
  };
  function goToDest(linkName: keyof typeof destEnum) {
    const link = document.createElement('a');
    link.href = destEnum[linkName];
    link.click();
  }
  return (
    <div className="tw-flex tw-flex-col tw-justify-between tw-h-full">
      <div className="tw-flex tw-flex-col tw-gap-3 tw-items-center">
        <div className="tw-w-14 tw-h-14 tw-rounded-full tw-overflow-hidden">
          {userInfo.avatar ? (
            <img
              className="tw-w-full tw-h-full tw-object-cover tw-object-center"
              src={'/public' + userInfo.avatar}
            />
          ) : (
            <div className="tw-w-full tw-h-full tw-text-4xl tw-bg-white tw-text-black iconfont icon-user-fill tw-flex tw-justify-center tw-items-center"></div>
          )}
        </div>
        <div
          className={`tw-cursor-pointer tw-rounded-lg tw-w-14 tw-h-14 tw-items-center tw-justify-center tw-flex tw-cursor-pointe hover:tw-text-hoverColor  ${
            msgOrRelation === 'msg'
              ? 'tw-text-hoverColor tw-bg-lightGray'
              : 'tw-text-white'
          }`}
          onClick={() => {
            changeMsgOrRelation('msg');
          }}
        >
          <MessageOutlined style={{ fontSize: 25 + 'px' }} />
        </div>
        <div
          className={`tw-cursor-pointer tw-rounded-lg tw-w-14 tw-h-14 tw-items-center tw-justify-center tw-flex tw-cursor-pointe hover:tw-text-hoverColor  ${
            msgOrRelation === 'relation'
              ? 'tw-text-hoverColor tw-bg-lightGray'
              : 'tw-text-white'
          }`}
          onClick={() => {
            changeMsgOrRelation('relation');
          }}
        >
          <TeamOutlined style={{ fontSize: 25 + 'px' }} />
        </div>
      </div>
      <div className="tw-flex tw-flex-col tw-gap-3 tw-items-center">
        <div>
          <svg className="icon tw-text-3xl" aria-hidden="true">
            <use xlinkHref="#icon-weixin"></use>
          </svg>
        </div>
        <div
          className="tw-flex tw-flex-col tw-items-center tw-gap-1 tw-cursor-pointer hover:tw-text-hoverColor"
          onClick={() => {
            goToDest('projectDoc');
          }}
        >
          <svg
            className="icon tw-text-3xl tw-bg-white tw-rounded-full"
            aria-hidden="true"
          >
            <use xlinkHref="#icon-tubiaozhizuomoban"></use>
          </svg>
          <span className="tw-text-xs">项目文档</span>
        </div>
        <div
          className="tw-flex tw-flex-col tw-items-center tw-gap-1 tw-cursor-pointer hover:tw-text-hoverColor"
          onClick={() => {
            goToDest('fontEnd');
          }}
        >
          <svg className="icon tw-text-3xl" aria-hidden="true">
            <use xlinkHref="#icon-github1"></use>
          </svg>
          <span className="tw-text-xs ">前端源码</span>
        </div>
        <div
          className="tw-flex tw-flex-col tw-items-center tw-gap-1 tw-cursor-pointer hover:tw-text-hoverColor"
          onClick={() => {
            goToDest('backEnd');
          }}
        >
          <svg className="icon tw-text-3xl" aria-hidden="true">
            <use xlinkHref="#icon-github1"></use>
          </svg>
          <span className="tw-text-xs">后端源码</span>
        </div>
      </div>
    </div>
  );
};
export default UserInfo;
