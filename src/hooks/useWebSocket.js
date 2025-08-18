import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook để quản lý kết nối WebSocket
 * @param {string} url - WebSocket server URL
 * @param {function} onMessage - Callback khi nhận message
 * @returns {object} { sendMessage, isConnected, latestMessage }
 */
const useWebSocket = (url, onMessage = () => {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [latestMessage, setLatestMessage] = useState(null);
  const wsRef = useRef(null);

  // Kết nối WebSocket
  const connect = useCallback(() => {
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      setIsConnected(true);
      // WebSocket connected successfully
    };

    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setLatestMessage(message);
        onMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
      // WebSocket disconnected
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, [url, onMessage]);

  // Ngắt kết nối
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  }, []);

  // Gửi message
  const sendMessage = useCallback((message) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('Cannot send message - WebSocket not connected');
    }
  }, [isConnected]);

  // Tự động kết nối/ngắt khi component mount/unmount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Reconnect khi URL thay đổi
  useEffect(() => {
    if (wsRef.current) {
      disconnect();
      connect();
    }
  }, [url, connect, disconnect]);

  return {
    sendMessage,
    isConnected,
    latestMessage,
    connect,
    disconnect
  };
};

export default useWebSocket;