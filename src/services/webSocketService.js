// WebSocket simulation service for real-time notifications
class WebSocketService {
  constructor() {
    this.isConnected = false;
    this.listeners = new Map();
    this.connectionId = null;
    this.heartbeatInterval = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  // Simulate WebSocket connection
  connect(userId, userRole) {
    return new Promise((resolve, reject) => {
      // Simulate connection delay
      setTimeout(() => {
        try {
          this.connectionId = `ws_${userId}_${Date.now()}`;
          this.isConnected = true;
          this.reconnectAttempts = 0;
          
          console.log(`WebSocket connected: ${this.connectionId} (Role: ${userRole})`);
          
          // Start heartbeat simulation
          this.startHeartbeat();
          
          // Simulate receiving connection confirmation
          this.emit('connection', {
            connectionId: this.connectionId,
            userId,
            userRole,
            timestamp: new Date().toISOString()
          });
          
          resolve(this.connectionId);
        } catch (error) {
          reject(error);
        }
      }, 500); // Simulate network delay
    });
  }

  // Simulate WebSocket disconnection
  disconnect() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    this.isConnected = false;
    this.connectionId = null;
    
    console.log('WebSocket disconnected');
    
    this.emit('disconnect', {
      timestamp: new Date().toISOString()
    });
  }

  // Subscribe to events
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Emit events to listeners
  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket event listener for ${event}:`, error);
        }
      });
    }
  }

  // Send message (simulate sending to server)
  send(message) {
    if (!this.isConnected) {
      throw new Error('WebSocket is not connected');
    }

    // Simulate message sending
    console.log('WebSocket sending:', message);
    
    // Simulate server response after delay
    setTimeout(() => {
      this.emit('message_sent', {
        messageId: `msg_${Date.now()}`,
        originalMessage: message,
        timestamp: new Date().toISOString()
      });
    }, 100);
  }

  // Simulate receiving real-time notifications
  simulateIncomingNotification(notification) {
    if (!this.isConnected) {
      return;
    }

    // Add WebSocket metadata
    const wsNotification = {
      ...notification,
      id: notification.id || `ws_notif_${Date.now()}`,
      source: 'websocket',
      connectionId: this.connectionId,
      receivedAt: new Date().toISOString()
    };

    console.log('WebSocket received notification:', wsNotification);
    
    this.emit('notification', wsNotification);
  }

  // Simulate real-time status updates
  simulateStatusUpdate(update) {
    if (!this.isConnected) {
      return;
    }

    const wsUpdate = {
      ...update,
      source: 'websocket',
      connectionId: this.connectionId,
      timestamp: new Date().toISOString()
    };

    console.log('WebSocket received status update:', wsUpdate);
    
    this.emit('status_update', wsUpdate);
  }

  // Start heartbeat to maintain connection
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.emit('heartbeat', {
          connectionId: this.connectionId,
          timestamp: new Date().toISOString()
        });
      }
    }, 30000); // Every 30 seconds
  }

  // Simulate connection loss and reconnection
  simulateConnectionLoss() {
    if (!this.isConnected) {
      return;
    }

    console.log('Simulating connection loss...');
    this.isConnected = false;
    
    this.emit('connection_lost', {
      timestamp: new Date().toISOString()
    });

    // Attempt to reconnect
    this.attemptReconnect();
  }

  // Attempt to reconnect
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      this.emit('reconnect_failed', {
        attempts: this.reconnectAttempts,
        timestamp: new Date().toISOString()
      });
      return;
    }

    this.reconnectAttempts++;
    
    console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      // Simulate successful reconnection
      const success = Math.random() > 0.3; // 70% success rate
      
      if (success) {
        this.isConnected = true;
        this.connectionId = `ws_reconnect_${Date.now()}`;
        
        console.log('Reconnected successfully');
        
        this.emit('reconnected', {
          connectionId: this.connectionId,
          attempts: this.reconnectAttempts,
          timestamp: new Date().toISOString()
        });
        
        this.startHeartbeat();
      } else {
        console.log('Reconnection failed, trying again...');
        this.attemptReconnect();
      }
    }, this.reconnectDelay);
  }

  // Get connection status
  getStatus() {
    return {
      isConnected: this.isConnected,
      connectionId: this.connectionId,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  // Simulate typing indicators for chat
  simulateTyping(userId, isTyping) {
    if (!this.isConnected) {
      return;
    }

    this.emit('typing', {
      userId,
      isTyping,
      timestamp: new Date().toISOString()
    });
  }

  // Simulate online/offline status
  simulatePresence(userId, status) {
    if (!this.isConnected) {
      return;
    }

    this.emit('presence', {
      userId,
      status, // 'online', 'offline', 'away'
      timestamp: new Date().toISOString()
    });
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

// Auto-connect simulation for demo purposes
export const initializeWebSocket = (userId, userRole) => {
  return webSocketService.connect(userId, userRole);
};

export default webSocketService;
