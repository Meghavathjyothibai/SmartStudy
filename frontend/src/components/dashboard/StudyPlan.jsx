import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCalendar, FiClock, FiTarget, FiBook,
  FiTrendingUp, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import studyPlanService from '../../services/studyPlanService';
import toast from 'react-hot-toast';

const StudyPlan = () => {
  const [loading, setLoading] = useState(true);
  const [studyPlan, setStudyPlan] = useState(null);
  const [weeklyPlan, setWeeklyPlan] = useState([]);

  useEffect(() => {
    fetchStudyPlan();
  }, []);

  const fetchStudyPlan = async () => {
    try {
      const response = await studyPlanService.getActivePlan();
      setStudyPlan(response.studyPlan);
      // Mock data for now - replace with actual data
      setWeeklyPlan([
        { day: 'Monday', subjects: ['Mathematics', 'Physics'], hours: 4 },
        { day: 'Tuesday', subjects: ['Chemistry', 'Biology'], hours: 3.5 },
        { day: 'Wednesday', subjects: ['Computer Science', 'Mathematics'], hours: 4 },
        { day: 'Thursday', subjects: ['Physics', 'Chemistry'], hours: 3 },
        { day: 'Friday', subjects: ['Biology', 'Computer Science'], hours: 4 },
        { day: 'Saturday', subjects: ['Review', 'Practice'], hours: 5 },
        { day: 'Sunday', subjects: ['Rest', 'Light Review'], hours: 2 },
      ]);
    } catch (error) {
      console.error('Error fetching study plan:', error);
      toast.error('Failed to load study plan');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
      
      await studyPlanService.generatePlan(startDate, endDate);
      toast.success('New study plan generated!');
      fetchStudyPlan();
    } catch (error) {
      toast.error('Failed to generate study plan');
    } finally {
      setLoading(false);
    }
  };

  const todayPlan = weeklyPlan[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] || weeklyPlan[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Study Plan</h1>
        <button
          onClick={handleGeneratePlan}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Generate New Plan
        </button>
      </div>

      {/* Today's Focus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white"
      >
        <h2 className="text-xl font-semibold mb-2">Today's Focus</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
            <FiBook className="w-6 h-6 mb-2" />
            <p className="text-sm opacity-90">Subjects</p>
            <p className="text-2xl font-bold">{todayPlan?.subjects?.length || 0}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
            <FiClock className="w-6 h-6 mb-2" />
            <p className="text-sm opacity-90">Study Hours</p>
            <p className="text-2xl font-bold">{todayPlan?.hours || 0}h</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
            <FiTarget className="w-6 h-6 mb-2" />
            <p className="text-sm opacity-90">Tasks</p>
            <p className="text-2xl font-bold">{studyPlan?.schedule?.length || 0}</p>
          </div>
        </div>
      </motion.div>

      {/* Weekly Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Weekly Schedule</h2>
        <div className="space-y-3">
          {weeklyPlan.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center p-3 rounded-lg ${
                day.day === todayPlan?.day ? 'bg-indigo-50 border-2 border-indigo-200' : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-24 font-medium text-gray-700">{day.day}</div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {day.subjects.map((subject, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FiClock className="text-gray-400" />
                <span className="font-semibold text-gray-700">{day.hours}h</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Progress Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Weekly Progress</h2>
          <div className="space-y-4">
            {['Mathematics', 'Physics', 'Chemistry', 'Biology'].map((subject, index) => (
              <div key={subject}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{subject}</span>
                  <span className="font-semibold text-indigo-600">{75 - index * 10}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${75 - index * 10}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Study Recommendations</h2>
          <div className="space-y-3">
            {[
              { text: 'Focus on Mathematics - Chapter 5', type: 'urgent' },
              { text: 'Review Physics formulas', type: 'important' },
              { text: 'Complete Chemistry assignment', type: 'normal' },
              { text: 'Practice coding problems', type: 'normal' },
            ].map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                {rec.type === 'urgent' ? (
                  <FiAlertCircle className="text-red-500 mt-1" />
                ) : rec.type === 'important' ? (
                  <FiAlertCircle className="text-yellow-500 mt-1" />
                ) : (
                  <FiCheckCircle className="text-green-500 mt-1" />
                )}
                <span className="text-sm text-gray-700">{rec.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudyPlan;