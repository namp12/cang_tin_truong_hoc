import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface RealtimeOrder {
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

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  latestOrder: RealtimeOrder | null;
  latestStatusUpdate: { orderId: number; orderNumber: string; status: string } | null;
  emitNewOrder: (order: RealtimeOrder) => void;
  emitStatusUpdate: (orderId: number, orderNumber: string, status: string, canteenId?: number) => void;
  playNotificationSound: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Web Audio API synthesizes a high quality Ding-Dong chime without external mp3 files
function playDingDong() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // First tone (Ding - 659Hz / E5)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime);
    gain1.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start();
    osc1.stop(audioCtx.currentTime + 0.5);

    // Second tone (Dong - 523Hz / C5) after 0.15s
    setTimeout(() => {
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      gain2.gain.setValueAtTime(0.35, audioCtx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start();
      osc2.stop(audioCtx.currentTime + 0.8);
    }, 150);
  } catch (e) {
    // AudioContext blocked by browser policy until user interacts
  }
}

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [latestOrder, setLatestOrder] = useState<RealtimeOrder | null>(null);
  const [latestStatusUpdate, setLatestStatusUpdate] = useState<{ orderId: number; orderNumber: string; status: string } | null>(null);

  useEffect(() => {
    const s = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    s.on('connect', () => {
      setIsConnected(true);
      s.emit('join_canteen', 1); // Default Canteen Toa G
    });

    s.on('disconnect', () => {
      setIsConnected(false);
    });

    s.on('order:new', (order: RealtimeOrder) => {
      setLatestOrder(order);
      playDingDong();
    });

    s.on('order:status_changed', (data: { orderId: number; orderNumber: string; status: string }) => {
      setLatestStatusUpdate(data);
      playDingDong();
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  const emitNewOrder = (order: RealtimeOrder) => {
    if (socket) {
      socket.emit('order:create', order);
    }
  };

  const emitStatusUpdate = (orderId: number, orderNumber: string, status: string, canteenId: number = 1) => {
    if (socket) {
      socket.emit('order:update_status', { orderId, orderNumber, status, canteenId });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        latestOrder,
        latestStatusUpdate,
        emitNewOrder,
        emitStatusUpdate,
        playNotificationSound: playDingDong,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
