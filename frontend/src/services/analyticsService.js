import api from './api';

const analyticsService = {
  // Get overview statistics
  getOverview: async () => {
    try {
      const response = await api.get('/analytics/overview');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get timeline data
  getTimeline: async (days = 30) => {
    try {
      const response = await api.get(`/analytics/timeline?days=${days}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get achievements
  getAchievements: async () => {
    try {
      const response = await api.get('/analytics/achievements');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default analyticsService;