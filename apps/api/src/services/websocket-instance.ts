// This file exports the WebSocket service instance
// It's initialized in server.ts and exported here to avoid circular dependencies
import { Server as SocketIOServer } from 'socket.io';

let wsServiceInstance: any = null;

export const setWebSocketService = (service: any) => {
  wsServiceInstance = service;
};

export const getWebSocketService = () => {
  return wsServiceInstance;
};

