import { mockMessages, mockChatRooms, mockUsers } from '../mocks/data';

const communicationService = {
  // Get all messages
  getAllMessages: () => Promise.resolve({ data: mockMessages }),
  
  // Get messages between two users
  getMessagesBetweenUsers: (userId1, userId2) => Promise.resolve({
    data: mockMessages.filter(msg => 
      (msg.senderId === userId1 && msg.receiverId === userId2) ||
      (msg.senderId === userId2 && msg.receiverId === userId1)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }),
  
  // Get messages by user
  getMessagesByUser: (userId) => Promise.resolve({
    data: mockMessages.filter(msg => 
      msg.senderId === userId || msg.receiverId === userId
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }),
  
  // Send a new message
  sendMessage: (messageData) => {
    const newMessage = {
      ...messageData,
      id: Math.max(...mockMessages.map(m => m.id)) + 1,
      timestamp: new Date().toISOString(),
      status: "sent"
    };
    mockMessages.push(newMessage);
    return Promise.resolve({ data: newMessage });
  },
  
  // Mark message as read
  markMessageAsRead: (messageId) => {
    const message = mockMessages.find(m => m.id === messageId);
    if (message) {
      message.status = "read";
      return Promise.resolve({ data: message });
    }
    return Promise.reject(new Error("Message not found"));
  },
  
  // Delete message
  deleteMessage: (messageId) => {
    const initialLength = mockMessages.length;
    const filtered = mockMessages.filter(msg => msg.id !== messageId);
    if (filtered.length < initialLength) {
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error("Message not found"));
  },
  
  // Chat Rooms
  getAllChatRooms: () => Promise.resolve({ data: mockChatRooms }),
  
  getChatRoomById: (roomId) => Promise.resolve({
    data: mockChatRooms.find(room => room.id === roomId)
  }),
  
  getChatRoomsByUser: (userId) => Promise.resolve({
    data: mockChatRooms.filter(room => room.participants.includes(userId))
  }),
  
  createChatRoom: (roomData) => {
    const newRoom = {
      ...roomData,
      id: Math.max(...mockChatRooms.map(r => r.id)) + 1,
      lastMessage: new Date().toISOString(),
      unreadCount: 0
    };
    mockChatRooms.push(newRoom);
    return Promise.resolve({ data: newRoom });
  },
  
  updateChatRoom: (roomId, updatedData) => {
    const index = mockChatRooms.findIndex(room => room.id === roomId);
    if (index > -1) {
      mockChatRooms[index] = { ...mockChatRooms[index], ...updatedData };
      return Promise.resolve({ data: mockChatRooms[index] });
    }
    return Promise.reject(new Error("Chat room not found"));
  },
  
  // Get unread message count for user
  getUnreadCount: (userId) => {
    const unreadMessages = mockMessages.filter(msg => 
      msg.receiverId === userId && msg.status === "unread"
    );
    return Promise.resolve({ data: unreadMessages.length });
  },
  
  // Get recent conversations for user
  getRecentConversations: (userId) => {
    const userMessages = mockMessages.filter(msg => 
      msg.senderId === userId || msg.receiverId === userId
    );
    
    const conversations = userMessages.reduce((acc, msg) => {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!acc[otherUserId]) {
        acc[otherUserId] = {
          userId: otherUserId,
          lastMessage: msg,
          unreadCount: 0
        };
      }
      
      if (msg.timestamp > acc[otherUserId].lastMessage.timestamp) {
        acc[otherUserId].lastMessage = msg;
      }
      
      if (msg.receiverId === userId && msg.status === "unread") {
        acc[otherUserId].unreadCount++;
      }
      
      return acc;
    }, {});
    
    return Promise.resolve({
      data: Object.values(conversations).sort((a, b) => 
        new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
      )
    });
  }
};

export default communicationService;
