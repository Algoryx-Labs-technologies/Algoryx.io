import { io, Socket } from 'socket.io-client';
import { supabase } from './supabase';

const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  // Remove trailing slash and /api/v1 if present (WebSocket connects to base URL)
  let baseUrl = envUrl.replace(/\/+$/, '');
  baseUrl = baseUrl.replace(/\/api\/v\d+$/, '');
  return baseUrl;
};

class WebSocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async connect(): Promise<Socket> {
    if (this.socket?.connected) {
      return this.socket;
    }

    return new Promise((resolve, reject) => {
      const apiUrl = getApiBaseUrl();
      this.socket = io(apiUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: this.maxReconnectAttempts,
      });

      this.socket.on('connect', async () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;

        // Authenticate with token
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            this.socket?.emit('authenticate', { token: session.access_token });
          } else {
            reject(new Error('No authentication token available'));
          }
        } catch (error) {
          reject(error);
        }
      });

      this.socket.on('authenticated', () => {
        console.log('WebSocket authenticated');
        resolve(this.socket!);
      });

      this.socket.on('error', (error: any) => {
        console.error('WebSocket error:', error);
        reject(error);
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        this.reconnectAttempts++;
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(error);
        }
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsClient = new WebSocketClient();

