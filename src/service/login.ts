import http from '@/utils/http';
type userInfo = {
  username: string;
  password: string;
};

export const userLogin = (userInfo: userInfo) => {
  return http('/api/userLogin', {
    method: 'POST',
    body: userInfo
  });
};
export const userConfirm = () => {
  return http('/api/userConfirm');
};
