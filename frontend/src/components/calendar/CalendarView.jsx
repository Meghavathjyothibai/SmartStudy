import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiChevronLeft, FiChevronRight, FiCalendar,
  FiClock, FiBook, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import taskService from '../../services/taskService';
import toast from 'react-hot-toast';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const calendarEvents = tasks.map(task => {
        const taskDate = task.dueDate ? new Date(task.dueDate) : null;
        const startTime = task.startTime || null;
        const endTime = task.endTime || null;
        
        return {
          id: task._id,
          date: taskDate ? taskDate.getDate() : null,
          month: taskDate ? taskDate.getMonth() : null,
          year: taskDate ? taskDate.getFullYear() : null,
          title: task.title,
          startTime: startTime,
          endTime: endTime,
          hasTime: startTime && endTime,
          type: task.priority === 'high' || task.priority === 'urgent' ? 'exam' : 
                 task.status === 'completed' ? 'completed' : 'assignment',
          subject: task.subject,
          status: task.status,
          priority: task.priority
        };
      }).filter(event => event.date !== null);
      
      setEvents(calendarEvents);
    }
    setLoading(false);
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      const response = await taskService.getAllTasks();
      setTasks(response.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  const currentMonthEvents = events.filter(
    event => event.month === currentDate.getMonth() && event.year === currentDate.getFullYear()
  );

  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = currentMonthEvents.filter(e => e.date === day);
    const isToday = day === new Date().getDate() && 
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear();
    const isSelected = day === selectedDate.getDate() &&
                      currentDate.getMonth() === selectedDate.getMonth() &&
                      currentDate.getFullYear() === selectedDate.getFullYear();

    days.push(
      <motion.div
        key={day}
        whileHover={{ scale: 1.02 }}
        onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
        className={`h-24 p-2 border rounded-lg cursor-pointer transition-all overflow-hidden ${
          isSelected
            ? 'border-indigo-600 bg-indigo-50'
            : isToday
            ? 'border-indigo-400 bg-indigo-50/50'
            : 'border-gray-200 hover:border-indigo-300'
        }`}
      >
        <div className="flex justify-between">
          <span className={`text-sm font-semibold ${
            isSelected ? 'text-indigo-600' : isToday ? 'text-indigo-500' : 'text-gray-700'
          }`}>
            {day}
          </span>
          {dayEvents.length > 0 && (
            <span className={`w-5 h-5 text-white text-xs rounded-full flex items-center justify-center ${
              dayEvents.some(e => e.priority === 'high' || e.priority === 'urgent') 
                ? 'bg-red-500' 
                : 'bg-indigo-600'
            }`}>
              {dayEvents.length}
            </span>
          )}
        </div>
        <div className="mt-1 space-y-1 max-h-16 overflow-y-auto">
          {dayEvents.slice(0, 2).map((event, i) => (
            <div
              key={i}
              className={`text-xs p-1 rounded truncate ${
                event.status === 'completed' 
                  ? 'bg-green-100 text-green-700 line-through opacity-60'
                  : event.priority === 'high' || event.priority === 'urgent'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
              title={`${event.title}${event.hasTime ? ` (${event.startTime} - ${event.endTime})` : ' (No time set)'}`}
            >
              {event.hasTime ? (
                `${event.startTime.substring(0,5)} ${event.title.length > 8 ? event.title.substring(0,6) + '...' : event.title}`
              ) : (
                `📅 ${event.title.length > 10 ? event.title.substring(0,8) + '...' : event.title}`
              )}
            </div>
          ))}
          {dayEvents.length > 2 && (
            <div className="text-xs text-gray-500 text-center">
              +{dayEvents.length - 2} more
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  const selectedDateEvents = events.filter(
    e => e.date === selectedDate.getDate() && 
         e.month === selectedDate.getMonth() && 
         e.year === selectedDate.getFullYear()
  ).sort((a, b) => {
    if (a.hasTime && b.hasTime) return a.startTime.localeCompare(b.startTime);
    if (a.hasTime) return -1;
    return 1;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
          >
            Today
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiChevronLeft />
            </button>
            <span className="text-lg font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-lg font-semibold mb-4">
          Tasks for {selectedDate.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
        </h2>
        <div className="space-y-3">
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event, index) => (
              <div
                key={index}
                className={`flex items-center space-x-4 p-3 rounded-lg ${
                  event.status === 'completed' 
                    ? 'bg-green-50 line-through opacity-75'
                    : 'bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  event.status === 'completed'
                    ? 'bg-green-100'
                    : event.priority === 'high' || event.priority === 'urgent'
                    ? 'bg-red-100'
                    : 'bg-indigo-100'
                }`}>
                  {event.status === 'completed' ? (
                    <FiCheckCircle className="w-5 h-5 text-green-600" />
                  ) : event.priority === 'high' || event.priority === 'urgent' ? (
                    <FiAlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <FiBook className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{event.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <FiClock className="mr-1" /> 
                      {event.hasTime ? `${event.startTime} - ${event.endTime}` : '⏰ Time not set'}
                    </span>
                    <span className="flex items-center">
                      <FiBook className="mr-1" /> {event.subject}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  event.status === 'completed' ? 'bg-green-100 text-green-700' :
                  event.priority === 'high' || event.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                  event.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {event.status === 'completed' ? 'Completed' : event.priority}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No tasks scheduled for this day</p>
              <button
                onClick={() => window.location.href = '/tasks/new'}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Task
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CalendarView;