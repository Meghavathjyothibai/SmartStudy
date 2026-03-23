import api from './api';

const studyPlanService = {
  // Get active study plan
  getActivePlan: async () => {
    try {
      const response = await api.get('/studyplan/active');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Generate new study plan
  generatePlan: async (startDate, endDate, preferences = {}) => {
    try {
      const response = await api.post('/studyplan/generate', { startDate, endDate, preferences });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get study analytics
  getAnalytics: async () => {
    try {
      const response = await api.get('/studyplan/analytics');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark task as complete
  markTaskComplete: async (planId, taskId) => {
    try {
      const response = await api.put(`/studyplan/${planId}/task/${taskId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Pause study plan
  pausePlan: async (planId) => {
    try {
      const response = await api.post(`/studyplan/${planId}/pause`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Resume study plan
  resumePlan: async (planId) => {
    try {
      const response = await api.post(`/studyplan/${planId}/resume`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default studyPlanService;