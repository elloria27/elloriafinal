
type Subscription = {
  channel: string;
  callback: (data: any) => void;
};

class WebSocketClient {
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, Subscription[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(private url: string) {
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Resubscribe to all channels
      this.subscriptions.forEach((subs, channel) => {
        this.ws?.send(JSON.stringify({ type: 'subscribe', channel }));
      });
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const subs = this.subscriptions.get(data.channel);
      if (subs) {
        subs.forEach(sub => sub.callback(data.payload));
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  subscribe(channel: string, callback: (data: any) => void) {
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, []);
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'subscribe', channel }));
      }
    }
    
    const subs = this.subscriptions.get(channel)!;
    subs.push({ channel, callback });
    this.subscriptions.set(channel, subs);

    return () => this.unsubscribe(channel, callback);
  }

  private unsubscribe(channel: string, callback: (data: any) => void) {
    const subs = this.subscriptions.get(channel);
    if (subs) {
      const newSubs = subs.filter(sub => sub.callback !== callback);
      if (newSubs.length === 0) {
        this.subscriptions.delete(channel);
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: 'unsubscribe', channel }));
        }
      } else {
        this.subscriptions.set(channel, newSubs);
      }
    }
  }

  close() {
    this.ws?.close();
  }
}

// Create singleton instance
const wsClient = new WebSocketClient('ws://localhost:8080');

export default wsClient;
