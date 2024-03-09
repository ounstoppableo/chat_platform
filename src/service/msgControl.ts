import http from '@/utils/http';

export const delMsg = (msgId: string, groupId: string) => {
  return http(`/api/delMsg?msgId=${msgId}&groupId=${groupId}`);
};
