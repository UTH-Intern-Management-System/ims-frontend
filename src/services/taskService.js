import { mockTasks, mockUsers } from '../mocks/data';

const taskService = {
  // Get all tasks
  getAll: () => Promise.resolve({ data: mockTasks }),
  
  // Get task by ID
  getById: (id) => Promise.resolve({
    data: mockTasks.find(task => task.id === id)
  }),
  
  // Get tasks by assignee
  getByAssignee: (assigneeId) => Promise.resolve({
    data: mockTasks.filter(task => task.assigneeId === assigneeId)
  }),
  
  // Get tasks by mentor
  getByMentor: (mentorId) => Promise.resolve({
    data: mockTasks.filter(task => task.mentorId === mentorId)
  }),
  
  // Get tasks by status
  getByStatus: (status) => Promise.resolve({
    data: mockTasks.filter(task => task.status === status)
  }),
  
  // Get tasks by priority
  getByPriority: (priority) => Promise.resolve({
    data: mockTasks.filter(task => task.priority === priority)
  }),
  
  // Get tasks by category
  getByCategory: (category) => Promise.resolve({
    data: mockTasks.filter(task => task.category === category)
  }),
  
  // Create new task
  create: (taskData) => {
    const newTask = {
      ...taskData,
      id: Math.max(...mockTasks.map(t => t.id)) + 1,
      progress: 0,
      actualHours: 0,
      attachments: [],
      comments: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    mockTasks.push(newTask);
    return Promise.resolve({ data: newTask });
  },
  
  // Update task
  update: (id, updatedData) => {
    const index = mockTasks.findIndex(task => task.id === id);
    if (index > -1) {
      mockTasks[index] = { ...mockTasks[index], ...updatedData };
      return Promise.resolve({ data: mockTasks[index] });
    }
    return Promise.reject(new Error("Task not found"));
  },
  
  // Delete task
  delete: (id) => {
    const initialLength = mockTasks.length;
    const filtered = mockTasks.filter(task => task.id !== id);
    if (filtered.length < initialLength) {
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error("Task not found"));
  },
  
  // Update task progress
  updateProgress: (id, progress) => {
    const task = mockTasks.find(t => t.id === id);
    if (task) {
      task.progress = progress;
      if (progress >= 100) {
        task.status = "completed";
      } else if (progress > 0) {
        task.status = "in-progress";
      }
      return Promise.resolve({ data: task });
    }
    return Promise.reject(new Error("Task not found"));
  },
  
  // Add comment to task
  addComment: (taskId, commentData) => {
    const task = mockTasks.find(t => t.id === taskId);
    if (task) {
      const newComment = {
        id: Math.max(...task.comments.map(c => c.id)) + 1,
        ...commentData,
        timestamp: new Date().toISOString()
      };
      task.comments.push(newComment);
      return Promise.resolve({ data: newComment });
    }
    return Promise.reject(new Error("Task not found"));
  },
  
  // Get task analytics
  getAnalytics: () => {
    const totalTasks = mockTasks.length;
    const completedTasks = mockTasks.filter(task => task.status === "completed").length;
    const inProgressTasks = mockTasks.filter(task => task.status === "in-progress").length;
    const pendingTasks = mockTasks.filter(task => task.status === "planning").length;
    const overdueTasks = mockTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      return dueDate < today && task.status !== "completed";
    }).length;
    
    const averageProgress = mockTasks.reduce((sum, task) => sum + (task.progress || 0), 0) / totalTasks;
    
    const tasksByPriority = {
      high: mockTasks.filter(task => task.priority === "high").length,
      medium: mockTasks.filter(task => task.priority === "medium").length,
      low: mockTasks.filter(task => task.priority === "low").length
    };
    
    const tasksByCategory = mockTasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {});
    
    return Promise.resolve({
      data: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        overdueTasks,
        averageProgress: averageProgress.toFixed(1),
        tasksByPriority,
        tasksByCategory
      }
    });
  }
};

export default taskService;