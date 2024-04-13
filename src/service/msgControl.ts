import http from '@/utils/http';

export const delMsg = (msgId: string, groupId: string) => {
  return http(`/api/delMsg?msgId=${msgId}&groupId=${groupId}`);
};

export const addMeme = (memeUrl: string) => {
  return http(`/api/addMeme`, {
    method: 'POST',
    body: { memeUrl }
  });
};

export const getMeme = () => {
  return http(`/api/getMeme`);
};

export const delMeme = (id: number) => {
  return http(`/api/delMeme/${id}`, { method: 'DELETE' });
};

export const getMsgs = (groupId: string, lastMsgId: number, limit: number) => {
  return http(
    `/api/groupMsg/?groupId=${groupId}&lastMsgId=${lastMsgId}&limit=${limit}`
  );
};
