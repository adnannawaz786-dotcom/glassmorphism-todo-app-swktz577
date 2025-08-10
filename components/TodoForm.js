import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

const TodoForm = ({ onAddTodo, isOpen, onToggle }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('personal');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!text.trim()) {
      newErrors.text = 'Todo text is required';
    } else if (text.trim().length > 200) {
      newErrors.text = 'Todo text must be less than 200 characters';
    }
    
    if (dueDate && new Date(dueDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newTodo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      priority,
      category,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddTodo(newTodo);
    
    // Reset form
    setText('');
    setPriority('medium');
    setCategory('personal');
    setDueDate('');
    setErrors({});
    
    // Close form on mobile after adding
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  const handleCancel = () => {
    setText('');
    setPriority('medium');
    setCategory('personal');
    setDueDate('');
    setErrors({});
    onToggle();
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200'
  };

  const categoryOptions = [
    { value: 'personal', label: 'Personal', color: 'bg-blue-100 text-blue-800' },
    { value: 'work', label: 'Work', color: 'bg-purple-100 text-purple-800' },
    { value: 'shopping', label: 'Shopping', color: 'bg-green-100 text-green-800' },
    { value: 'health', label: 'Health', color: 'bg-pink-100 text-pink-800' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl p-6 mb-6 border border-white/20 shadow-xl backdrop-blur-md bg-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Todo
        </h2>
        <button
          onClick={handleCancel}
          className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
          aria-label="Close form"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="todoText" className="block text-sm font-medium text-gray-700 mb-2">
            What needs to be done?
          </label>
          <textarea
            id="todoText"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your todo..."
            rows={3}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.text ? 'border-red-300' : 'border-white/30'
            } bg-white/20 backdrop-blur-sm placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-none`}
          />
          {errors.text && (
            <p className="mt-1 text-sm text-red-600">{errors.text}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {text.length}/200 characters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            >
              {categoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
            Due Date (Optional)
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.dueDate ? 'border-red-300' : 'border-white/30'
            } bg-white/20 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200`}
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <motion.button
            type="submit"
            disabled={!text.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            Add Todo
          </motion.button>
          
          <motion.button
            type="button"
            onClick={handleCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 sm:flex-none px-6 py-3 rounded-lg font-medium border border-white/30 bg-white/20 text-gray-700 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white/10 transition-all duration-200"
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default TodoForm;