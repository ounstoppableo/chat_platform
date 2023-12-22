import { wsSendType } from '@/type/wsSend.type';

type msgType = {
  type: 'getUserInfo' | 'getGroups';
  data: any;
};
class WebSocketService {
  socket: any;
  listeners: Set<any>;
  constructor() {
    this.socket = null;
    this.listeners = new Set();
  }

  connect(url: any) {
    this.socket = new WebSocket(url);
    this.socket.onopen = () => {
      console.log('WebSocket connection opened.');
    };

    this.socket.onmessage = (e: msgType) => {
      if (e.type === 'getUserInfo') {
        localStorage.setItem('userInfo', e.data);
      }
      this.listeners.forEach((listener) => listener(JSON.parse(e.data)));
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };
    this.socket.onerror = (e: any) => {
      console.log(e);
    };
  }

  //发送消息，并添加连接检测轮询
  send(message: wsSendType) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else if (this.socket.readyState === WebSocket.CONNECTING) {
      setTimeout(() => this.send(message), 500);
    } else {
      console.error('WebSocket not open. Message not sent.');
    }
  }

  addListener(listener: any) {
    this.listeners.add(listener);
  }

  removeListener(listener: any) {
    this.listeners.delete(listener);
  }

  close() {
    if (this.socket) this.socket.close();
  }
}

export default WebSocketService;
