import http from '@/utils/http';

export const getGroupMember = (groupId: string) => {
  return http(`/api/groupMembers/${groupId}`);
};
