import api from './api';

const taskService = {
  // Get all tasks
  getAllTasks: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/tasks${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single task
  getTask: async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create task
  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add subtask
  addSubtask: async (taskId, subtaskTitle) => {
    try {
      const response = await api.post(`/tasks/${taskId}/subtasks`, { title: subtaskTitle });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update subtask
  updateSubtask: async (taskId, subtaskId, completed) => {
    try {
      const response = await api.put(`/tasks/${taskId}/subtasks/${subtaskId}`, { completed });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default taskService;