import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit3, Check, X, MoreVertical } from 'lucide-react';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [showActions, setShowActions] = useState(false);

  const handleEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText.trim());
    }
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      className="group relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`
        backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl p-4 
        shadow-lg hover:shadow-xl transition-all duration-300 
        hover:bg-white/40 hover:border-white/30
        ${todo.completed ? 'opacity-75' : ''}
      `}>
        <div className="flex items-center gap-3">
          {/* Checkbox */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggle}
            className={`
              flex-shrink-0 w-6 h-6 rounded-full border-2 
              flex items-center justify-center transition-all duration-200
              ${todo.completed 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-400 hover:border-green-400 bg-white/50'
              }
            `}
          >
            <AnimatePresence>
              {todo.completed && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check size={14} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Todo Text */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleEdit}
                className="
                  w-full bg-white/50 border border-white/30 rounded-lg px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50
                  backdrop-blur-sm text-gray-800 placeholder-gray-500
                "
                autoFocus
                placeholder="Enter todo text..."
              />
            ) : (
              <motion.p
                layout
                className={`
                  text-gray-800 cursor-pointer transition-all duration-200
                  ${todo.completed 
                    ? 'line-through text-gray-600' 
                    : 'hover:text-gray-900'
                  }
                `}
                onClick={() => !todo.completed && setIsEditing(true)}
              >
                {todo.text}
              </motion.p>
            )}
          </div>

          {/* Action Buttons */}
          <AnimatePresence>
            {(showActions || isEditing) && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                {isEditing ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEdit}
                      className="
                        p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 
                        text-green-600 transition-colors duration-200
                      "
                      title="Save changes"
                    >
                      <Check size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      className="
                        p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 
                        text-red-600 transition-colors duration-200
                      "
                      title="Cancel editing"
                    >
                      <X size={16} />
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className="
                        p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 
                        text-blue-600 transition-colors duration-200
                      "
                      title="Edit todo"
                    >
                      <Edit3 size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDelete}
                      className="
                        p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 
                        text-red-600 transition-colors duration-200
                      "
                      title="Delete todo"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Todo Metadata */}
        {todo.createdAt && (
          <div className="mt-2 pt-2 border-t border-white/20">
            <p className="text-xs text-gray-500">
              Created {new Date(todo.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TodoItem;