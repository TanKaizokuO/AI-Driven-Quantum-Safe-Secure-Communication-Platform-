const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

export class SessionSocket {
  private socket: WebSocket | null = null;
  private sessionId: string;
  private onMessageCallback: (data: any) => void;
  private onConnectCallback?: () => void;
  private onDisconnectCallback?: () => void;

  constructor(
    sessionId: string,
    onMessage: (data: any) => void,
    onConnect?: () => void,
    onDisconnect?: () => void
  ) {
    this.sessionId = sessionId;
    this.onMessageCallback = onMessage;
    this.onConnectCallback = onConnect;
    this.onDisconnectCallback = onDisconnect;
  }

  connect() {
    try {
      this.socket = new WebSocket(`${WS_BASE_URL}/ws/${this.sessionId}`);

      this.socket.onopen = () => {
        console.log('WebSocket connection established.');
        if (this.onConnectCallback) this.onConnectCallback();
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessageCallback(data);
        } catch (e) {
          console.error('Failed to parse WebSocket message data:', e);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection closed.');
        if (this.onDisconnectCallback) this.onDisconnectCallback();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error occurred:', error);
      };
    } catch (e) {
      console.error('Failed to initialize WebSocket:', e);
    }
  }

  send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('Cannot send message, WebSocket is not open.');
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
