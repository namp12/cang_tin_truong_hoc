import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

export let io: Server;

export interface RealtimeOrderPayload {
  orderId: number;
  orderNumber: string;
  tableNumber: string;
  canteenId: number;
  customerName: string;
  items: { name: string; qty: number; price: number; note?: string }[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  orderedAt: string;
}

export function initSocketServer(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`⚡ [Socket.io] Client connected: ${socket.id}`);

    // Join canteen room (e.g. canteen:1 for Toa G, canteen:2 for Toa AB)
    socket.on('join_canteen', (canteenId: number | string) => {
      const room = `canteen:${canteenId}`;
      socket.join(room);
      console.log(`📡 Socket ${socket.id} joined room: ${room}`);
    });

    // Broadcast new order to Kitchen and Admin
    socket.on('order:create', (payload: RealtimeOrderPayload) => {
      console.log(`🔔 [Socket.io] New order created: ${payload.orderNumber}`);
      const room = `canteen:${payload.canteenId || 1}`;
      io.to(room).emit('order:new', payload);
      // Also broadcast globally for dashboard KPI updates
      io.emit('dashboard:update_kpi', {
        revenueDelta: payload.totalAmount,
        ordersDelta: 1,
      });
    });

    // Broadcast status change (Kitchen -> POS & Student)
    socket.on('order:update_status', (data: { orderId: number; orderNumber: string; status: string; canteenId?: number }) => {
      console.log(`🍳 [Socket.io] Order ${data.orderNumber} status changed to: ${data.status}`);
      const room = `canteen:${data.canteenId || 1}`;
      io.to(room).emit('order:status_changed', data);
      io.emit('order:status_changed', data);
    });

    // Out of stock warning (Warehouse/Kitchen -> POS)
    socket.on('stock:alert', (data: { foodId: number; foodName: string; isAvailable: boolean }) => {
      console.log(`⚠️ [Socket.io] Stock alert: ${data.foodName} available=${data.isAvailable}`);
      io.emit('stock:updated', data);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 [Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}
