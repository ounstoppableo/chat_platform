import loginFlagContext from '@/context/loginFlagContext';
import { userLogin } from '@/service/login';
import {
  CloseOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  KeyOutlined,
  UserOutlined,
  WechatOutlined
} from '@ant-design/icons';
import { Button, Input, message } from 'antd';
import { useContext, useRef, useState } from 'react';
import sha256 from 'crypto-js/sha256';
// import { useDispatch } from 'react-redux';
// import socketContext from '@/context/socketContext';
import { validateString } from '@/utils/validateString';

const Login = (props: any) => {
  // const socket = useContext(socketContext);
  const { show } = props;
  const [loginMethod, setLoginMethod] = useState<'username' | 'wechat'>(
    'username'
  );
  // const dispatch = useDispatch();
  // const loginCf = async () => {
  //   const res = await userConfirm();
  //   if (res.code === 200) {
  //     if (socket.current.disconnect) await socket.current.disconnect();
  //     socket.current = io('https://localhost:3000', {
  //       auth: {
  //         token: getToken()
  //       }
  //     });
  //     socketListener(socket.current, dispatch, res.data);
  //   }
  // };
  const loginAntiMulClick = useRef(false);

  const [userInfo, setUserInfo] = useState<{
    username: string;
    password: string;
  }>({ username: '', password: '' });

  //输入用户名的回调
  const inputUserName = (e: any) => {
    setUserInfo({
      username: e.currentTarget.value,
      password: userInfo.password
    });
  };
  //输入密码的回调
  const inputPassword = (e: any) => {
    setUserInfo({
      username: userInfo.username,
      password: e.currentTarget.value
    });
  };

  //登录逻辑
  const loginConfirm = (_: any) => {
    if (!userInfo.username.trim() || !userInfo.password.trim()) {
      message.error('请正确填写用户名和密码');
      return;
    }
    if (validateString(userInfo.username)) {
      message.error('用户名不能有标点符号！');
      return;
    }
    if (!loginAntiMulClick.current) {
      loginAntiMulClick.current = true;
      userLogin({
        username: userInfo.username,
        password: sha256(userInfo.password).toString()
      }).then((res: any) => {
        if (res.code === 200) {
          localStorage.setItem('token', res.token);
          message.success('登录成功');
          loginControl.closeLoginForm();
          // loginCf();
          location.reload();
        } else {
          loginAntiMulClick.current = false;
        }
      });
    } else {
      message.warning('别急哦~登录请求中');
    }
  };

  //改变登录方式
  const changeLoginMethod = (type: 'username' | 'wechat') => {
    setLoginMethod(type);
  };
  const loginControl = useContext(loginFlagContext);
  const closeLoginForm = (e: any) => {
    if (!e.target.closest('#loginForm')) loginControl.closeLoginForm();
  };
  return show ? (
    <div
      className="tw-bg-loginMask tw-absolute tw-inset-0 tw-flex tw-justify-center tw-items-center tw-text-textGrayColor tw-z-max"
      onClick={(e) => closeLoginForm(e)}
    >
      <div
        id="loginForm"
        className="tw-bg-loginForm  tw-w-[376px] tw-rounded-lg tw-px-5 tw-py-6 tw-relative tw-flex tw-flex-col tw-gap-3 tw-items-center"
      >
        <div
          className="hover:tw-text-hoverColor tw-cursor-pointer tw-absolute tw-top-6 tw-right-5"
          onClick={() => loginControl.closeLoginForm()}
        >
          <CloseOutlined />
        </div>
        <div>
          <img
            src="/src/assets/avatar.jpeg"
            alt=""
            className="tw-object-cover tw-w-24 tw-h-24 tw-rounded-lg"
          />
        </div>
        <p>来聊啊，宝贝~</p>
        <div className="tw-border-b-[1px] tw-border-textGrayColor tw-w-full tw-flex tw-justify-center tw-text-lg tw-gap-3 tw-pb-1">
          <div
            className={`hover:tw-text-hoverColor tw-text-${
              loginMethod === 'username' ? 'hoverColor' : 'textGrayColor'
            } tw-cursor-pointer tw-flex tw-gap-2`}
            onClick={() => changeLoginMethod('username')}
          >
            <UserOutlined />
            <span>用户名</span>
          </div>
          <div className="tw-border-[1px] tw-border-textGrayColor"></div>
          <div
            className={`hover:tw-text-greenTextColor tw-text-${
              loginMethod === 'wechat' ? 'greenTextColor' : 'textGrayColor'
            } tw-cursor-pointer tw-flex tw-gap-2`}
            onClick={() => changeLoginMethod('wechat')}
          >
            <WechatOutlined />
            <span>微信</span>
          </div>
        </div>
        {loginMethod === 'username' ? (
          <>
            <div className="tw-flex tw-flex-col tw-gap-2 tw-w-full">
              <Input
                value={userInfo.username}
                prefix={<UserOutlined />}
                className="customInput"
                classNames={{ input: 'customInput' }}
                onChange={(e: any) => inputUserName(e)}
                maxLength={20}
                allowClear={true}
                placeholder="请输入用户名"
              ></Input>
              <Input.Password
                value={userInfo.password}
                type="passward"
                className="customInput"
                classNames={{ input: 'customInput' }}
                prefix={<KeyOutlined />}
                onChange={(e: any) => inputPassword(e)}
                maxLength={20}
                allowClear={true}
                placeholder="请输入密码"
                iconRender={(visible: any) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              ></Input.Password>
              <Button className="customBtn" onClick={(e) => loginConfirm(e)}>
                登录
              </Button>
            </div>
            <p className="tw-text-whiteTextColor">
              第一次登录<span className="tw-text-hoverColor">自动注册</span>噢~
            </p>
          </>
        ) : (
          <>
            <img
              src="/src/assets/avatar.jpeg"
              alt=""
              className="tw-object-contain"
            />
            <p className="tw-text-whiteTextColor">
              使用「 <span className="tw-text-greenTextColor">微信</span>{' '}
              」扫描二维码登录~~
            </p>
          </>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
};
export default Login;
