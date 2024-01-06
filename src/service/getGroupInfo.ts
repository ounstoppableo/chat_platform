import http from '@/utils/http';

export const getGroupMember = (groupId: string) => {
  return http(`/api/groupMembers/${groupId}`);
};

export const getGroupMsg = (groupId: string) => {
  return http(`/api/groupMsg/${groupId}`);
};

export const getTotalMsg = (username: string) => {
  return http(`/api/totalMsg/${username}`);
};
