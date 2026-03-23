import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiSave, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import taskService from '../../services/taskService';
import toast from 'react-hot-toast';

const TaskForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    priority: 'medium',
    dueDate: '',
    startTime: '',
    endTime: '',
    estimatedDuration: 60,
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(true);

  // Auto-calculate end time based on start time and duration
  useEffect(() => {
    if (autoCalculate && formData.startTime && formData.estimatedDuration) {
      const [hours, minutes] = formData.startTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + Number(formData.estimatedDuration);
      
      const endHours = Math.floor(totalMinutes / 60) % 24;
      const endMinutes = totalMinutes % 60;
      
      const endTimeStr = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
      
      setFormData(prev => ({ ...prev, endTime: endTimeStr }));
    }
  }, [formData.startTime, formData.estimatedDuration, autoCalculate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // If user manually changes end time, disable auto-calculate
    if (name === 'endTime' && value) {
      setAutoCalculate(false);
    }
    if (name === 'startTime' || name === 'estimatedDuration') {
      setAutoCalculate(true);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate times
      if (formData.startTime && formData.endTime) {
        const start = formData.startTime;
        const end = formData.endTime;
        
        if (end <= start) {
          toast.error('End time must be after start time');
          setLoading(false);
          return;
        }
      }

      const formattedData = {
        title: formData.title.trim(),
        subject: formData.subject,
        description: formData.description.trim() || undefined,
        priority: formData.priority.toLowerCase(),
        dueDate: formData.dueDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        estimatedDuration: Number(formData.estimatedDuration),
        tags: formData.tags,
      };

      console.log('Sending data:', formattedData);

      const response = await taskService.createTask(formattedData);
      console.log('Success response:', response);
      
      toast.success('Task created successfully!');
      navigate('/tasks');
    } catch (error) {
      console.log('FULL ERROR:', error);
      console.log('ERROR RESPONSE:', error.response);
      console.log('ERROR DATA:', error.response?.data);
      console.log('ERROR STATUS:', error.response?.status);
      
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => 
          `${err.field}: ${err.message}`
        ).join('\n');
        toast.error(errorMessages);
        alert(`Validation Errors:\n${errorMessages}`);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        alert(`Error: ${error.response.data.message}`);
      } else {
        toast.error('Failed to create task');
        alert('Failed to create task. Check console for details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Create New Task</h1>
              <button
                onClick={() => navigate('/tasks')}
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Complete Chapter 5, Submit Research Paper"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject / Course
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a subject</option>
                <optgroup label="School Level">
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                </optgroup>
                <optgroup label="Bachelor's Degree">
                  <option value="B.Tech Computer Science">B.Tech Computer Science</option>
                  <option value="B.Tech Information Technology">B.Tech Information Technology</option>
                  <option value="B.Tech Electronics">B.Tech Electronics</option>
                  <option value="B.Tech Mechanical">B.Tech Mechanical</option>
                  <option value="B.Sc Mathematics">B.Sc Mathematics</option>
                  <option value="B.Sc Physics">B.Sc Physics</option>
                  <option value="B.Com">B.Com</option>
                  <option value="BBA">BBA</option>
                </optgroup>
                <optgroup label="Master's Degree">
                  <option value="M.Tech Computer Science">M.Tech Computer Science</option>
                  <option value="M.Tech Data Science">M.Tech Data Science</option>
                  <option value="M.Sc Mathematics">M.Sc Mathematics</option>
                  <option value="M.Sc Physics">M.Sc Physics</option>
                  <option value="MCA">MCA</option>
                  <option value="MBA">MBA</option>
                </optgroup>
                <optgroup label="PhD & Research">
                  <option value="PhD Computer Science">PhD Computer Science</option>
                  <option value="PhD Mathematics">PhD Mathematics</option>
                  <option value="PhD Physics">PhD Physics</option>
                  <option value="Research Paper">Research Paper</option>
                  <option value="Thesis Writing">Thesis Writing</option>
                </optgroup>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add details about this task..."
              />
            </div>

            {/* Date and Time Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FiClock className="mr-2" /> Schedule
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Duration or End Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="estimatedDuration"
                    value={formData.estimatedDuration}
                    onChange={handleChange}
                    min="5"
                    max="480"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* End Time (auto-calculated or manual) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time {!autoCalculate && '(Manual)'}
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    readOnly={autoCalculate}
                  />
                  {autoCalculate && (
                    <p className="text-xs text-gray-500 mt-1">
                      End time auto-calculated from start time + duration
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-2 text-indigo-500 hover:text-indigo-700"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Type a tag and press Enter"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/tasks')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <FiSave />
                    <span>Create Task</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskForm;