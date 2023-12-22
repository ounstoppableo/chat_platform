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

    this.socket.onmessage = (e: any) => {
      this.listeners.forEach((listener) => listener(JSON.parse(e.data)));
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };
    this.socket.onerror = (e: any) => {
      console.log(e);
    };
  }

  send(message: any) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
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

const webSocketService = new WebSocketService();
export default webSocketService;
