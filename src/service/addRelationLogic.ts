import http from '@/utils/http';

export const addFriend = (username: string) => {
  return http(`/api/addFriend`, {
    method: 'POST',
    body: { username }
  });
};
export const getSystemInfo = () => {
  return http('/api/getSystemMsg');
};
export const acceptAddFriend = (data: {
  msgId: string | number;
  fromName: string;
  toName: string;
}) => {
  return http(
    `/api/acceptAddFriend?msgId=${data.msgId}&fromName=${data.fromName}&toName=${data.toName}`
  );
};
export const rejectAddFriend = (msgId: string) => {
  return http(`/api/rejectAddFriend/${msgId}`);
};

export const delSystemInfo = (msgId: string) => {
  return http(`/api/delSystemInfo/${msgId}`, { method: 'DELETE' });
};
export const getFriends = () => {
  return http(`/api/getFriends`);
};

export const toCreateGroup = (groupName: string, avatar: string) => {
  return http(`/api/createGroup?groupName=${groupName}&avatar=${avatar}`);
};

export const getGroups = () => {
  return http('/api/getGroups');
};
