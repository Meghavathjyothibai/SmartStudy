import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, FiCalendar, FiCheckSquare, FiBarChart2, 
  FiSettings, FiUser, FiBook, FiAward 
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard', color: 'from-blue-500 to-blue-600' },
    { path: '/tasks', icon: FiCheckSquare, label: 'Tasks', color: 'from-green-500 to-green-600' },
    { path: '/calendar', icon: FiCalendar, label: 'Calendar', color: 'from-purple-500 to-purple-600' },
    { path: '/analytics', icon: FiBarChart2, label: 'Analytics', color: 'from-orange-500 to-orange-600' },
    { path: '/profile', icon: FiUser, label: 'Profile', color: 'from-pink-500 to-pink-600' },
    { path: '/settings', icon: FiSettings, label: 'Settings', color: 'from-gray-500 to-gray-600' },
  ];

  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white shadow-2xl h-screen fixed left-0 top-0 overflow-y-auto hidden lg:block"
    >
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <FiBook className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              StudySmart
            </h1>
            <p className="text-xs text-gray-500">v2.0.0</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="p-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className={`relative flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                  isActive 
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
            <FiUser className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">{user?.name || 'Student'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'student@example.com'}</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Daily Goal</span>
            <span>75%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
            />
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;