import loginFlagContext from '@/context/loginFlagContext';
import { UserInfo } from '@/redux/userInfo/userInfo.type';
import { LockOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { useSelector } from 'react-redux';

const InputMask = () => {
  const loginControl = useContext(loginFlagContext);
  const userInfo: UserInfo = useSelector((state: any) => state.userInfo.data);

  return (
    <>
      {!userInfo.isLogin ? (
        <div className="tw-rounded-lg tw-absolute tw-inset-0 tw-backdrop-blur-xs tw-text-base tw-flex tw-justify-center tw-items-center">
          <span
            className="tw-cursor-pointer"
            onClick={() => loginControl.showLoginForm()}
          >
            <LockOutlined />
            点我<span className="tw-text-hoverColor">登录</span>之后再发言~
          </span>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default InputMask;
