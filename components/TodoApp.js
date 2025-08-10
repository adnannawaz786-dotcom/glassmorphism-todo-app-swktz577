import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Check, X, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { saveTodos, loadTodos } from '../lib/todoStorage';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedTodos = loadTodos();
    setTodos(loadedTodos);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveTodos(todos);
    }
  }, [todos, isLoading]);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    
    const todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setTodos(prev => [todo, ...prev]);
    setNewTodo('');
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim() === '') return;
    
    setTodos(prev => 
      prev.map(todo => 
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      )
    );
    
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8 shadow-xl backdrop-blur-lg"
      >
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Todo App</h1>
        </div>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addTodo)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-3 rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addTodo}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add
          </motion.button>
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'active', 'completed'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all capitalize',
                filter === filterType
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/20 text-gray-700 hover:bg-white/30'
              )}
            >
              {filterType}
            </button>
          ))}
        </div>

        <AnimatePresence>
          <div className="space-y-3 mb-6">
            {filteredTodos.map((todo) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-xl bg-white/30 backdrop-blur-sm border border-white/20 transition-all',
                  todo.completed && 'opacity-60'
                )}
              >
                <button
                  onClick={() => toggleComplete(todo.id)}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                    todo.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-400 hover:border-green-400'
                  )}
                >
                  {todo.completed && <Check className="h-4 w-4" />}
                </button>

                {editingId === todo.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                      className="flex-1 px-3 py-1 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      autoFocus
                    />
                    <button
                      onClick={saveEdit}
                      className="p-1 text-green-600 hover:bg-green-100 rounded"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className={cn(
                        'flex-1 text-gray-800',
                        todo.completed && 'line-through text-gray-500'
                      )}
                    >
                      {todo.text}
                    </span>
                    <button
                      onClick={() => startEditing(todo.id, todo.text)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {todos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No todos yet. Add one above!</p>
          </div>
        ) : (
          <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-white/20">
            <span>
              {activeCount} active, {completedCount} completed
            </span>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Clear completed
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TodoApp;