import smallSizeContext from '@/context/smallSizeContext';
import { MessageOutlined, TeamOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
const UserInfo = (prop: any) => {
  const { msgOrRelation, setMsgOrRelation, switchGroup } = prop;
  const userInfo = useSelector((state: any) => state.userInfo.data);
  enum destEnum {
    backEnd = 'https://github.com/ounstoppableo/chat-platform-nodets.git',
    fontEnd = 'https://github.com/ounstoppableo/chat_platform.git',
    projectDoc = ''
  }

  const { smallSize, setSmallSize } = useContext(smallSizeContext);
  const changeMsgOrRelation = (type: 'msg' | 'relation') => {
    setMsgOrRelation(type);
    type === 'msg'
      ? switchGroup({
          groupName: '全员总群',
          groupId: '1',
          type: 'group'
        })
      : switchGroup({});
  };
  function goToDest(linkName: keyof typeof destEnum) {
    const link = document.createElement('a');
    link.href = destEnum[linkName];
    link.click();
  }
  return (
    <div
      className={`tw-flex tw-flex-col ${
        smallSize ? 'tw-gap-4' : 'tw-justify-between'
      } tw-h-full`}
    >
      <div className={`tw-flex tw-flex-col tw-gap-3 tw-items-center`}>
        {smallSize ? (
          <>
            <div
              className={`${
                smallSize ? 'tw-w-32 tw-h-32' : 'tw-w-14 tw-h-14'
              } tw-relative`}
            >
              {userInfo.avatar ? (
                <img
                  className="tw-w-full tw-h-full tw-object-cover tw-object-center tw-rounded-full"
                  src={'/public' + userInfo.avatar}
                />
              ) : (
                <div className="tw-w-full tw-h-full tw-text-4xl tw-bg-white tw-text-black iconfont icon-user-fill tw-flex tw-justify-center tw-items-center tw-rounded-full"></div>
              )}
              {userInfo?.isLogin ? (
                <div
                  className={`tw-w-6 tw-h-6 tw-absolute tw-rounded-full tw-bg-[#adff2f] tw-top-[100px] tw-left-[100px] tw-right-0`}
                ></div>
              ) : (
                <div
                  className={`tw-w-6 tw-h-6 tw-absolute tw-rounded-full tw-bg-[#dfdfdf] tw-top-[100px] tw-left-[100px] tw-right-0`}
                ></div>
              )}
            </div>

            <div className="tw-ml-2 tw-mr-8 tw-text-lg">
              {userInfo?.username}
              <span className="tw-text-[#919191]">#{userInfo?.uid}</span>
            </div>
            <div className="tw-ml-2 tw-text-[14px] tw-mb-3 tw-text-[#6b7280]">
              <span>所在城市：</span>
              <span>{userInfo?.region}</span>
            </div>
          </>
        ) : (
          <>
            <div
              className={`${
                smallSize ? '' : 'tw-w-14 tw-h-14'
              } tw-rounded-full tw-overflow-hidden`}
            >
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
            {userInfo.isLogin ? (
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
            ) : (
              <></>
            )}
          </>
        )}
      </div>
      <div className={`tw-flex tw-flex-col tw-gap-3 tw-items-center tw-mt-8 `}>
        <div
          className={`tw-flex ${
            smallSize
              ? 'tw-gap-5 tw-bg-[#323644] tw-w-full tw-py-2 tw-px-2 tw-rounded-lg'
              : 'tw-flex-col'
          } tw-items-center tw-gap-1 tw-cursor-pointer hover:tw-text-hoverColor`}
        >
          <svg
            className={`icon ${smallSize ? 'tw-text-4xl' : ' tw-text-3xl'}`}
            aria-hidden="true"
          >
            <use xlinkHref="#icon-weixin"></use>
          </svg>
          {smallSize ? <span className="tw-text">博主微信</span> : <></>}
        </div>
        <div
          className={`tw-flex ${
            smallSize
              ? 'tw-gap-5 tw-bg-[#323644] tw-w-full tw-py-2 tw-px-2 tw-rounded-lg'
              : 'tw-flex-col'
          } tw-items-center tw-gap-1 tw-cursor-pointer hover:tw-text-hoverColor`}
          onClick={() => {
            goToDest('projectDoc');
          }}
        >
          <svg
            className={`icon ${
              smallSize ? 'tw-text-4xl' : ' tw-text-3xl'
            } tw-bg-white tw-rounded-full`}
            aria-hidden="true"
          >
            <use xlinkHref="#icon-tubiaozhizuomoban"></use>
          </svg>
          <span className={`${smallSize ? 'tw-text' : 'tw-text-xs'}`}>
            项目文档
          </span>
        </div>
        <div
          className={`tw-flex ${
            smallSize
              ? 'tw-gap-5 tw-bg-[#323644] tw-w-full tw-py-2 tw-px-2 tw-rounded-lg'
              : 'tw-flex-col'
          } tw-items-center tw-gap-1 tw-cursor-pointer hover:tw-text-hoverColor`}
          onClick={() => {
            goToDest('fontEnd');
          }}
        >
          <svg
            className={`icon ${smallSize ? 'tw-text-4xl' : ' tw-text-3xl'}`}
            aria-hidden="true"
          >
            <use xlinkHref="#icon-github1"></use>
          </svg>
          <span className={`${smallSize ? 'tw-text' : 'tw-text-xs'}`}>
            前端源码
          </span>
        </div>
        <div
          className={`tw-flex ${
            smallSize
              ? 'tw-gap-5 tw-bg-[#323644] tw-w-full tw-py-2 tw-px-2 tw-rounded-lg'
              : 'tw-flex-col'
          } tw-items-center tw-gap-1 tw-cursor-pointer hover:tw-text-hoverColor`}
          onClick={() => {
            goToDest('backEnd');
          }}
        >
          <svg
            className={`icon ${smallSize ? 'tw-text-4xl' : ' tw-text-3xl'}`}
            aria-hidden="true"
          >
            <use xlinkHref="#icon-github1"></use>
          </svg>
          <span className={`${smallSize ? 'tw-text' : 'tw-text-xs'}`}>
            后端源码
          </span>
        </div>
      </div>
    </div>
  );
};
export default UserInfo;
