import { motion } from 'framer-motion';

const TodoFilters = ({ currentFilter, onFilterChange, counts }) => {
  const filters = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'active', label: 'Active', count: counts.active },
    { key: 'completed', label: 'Completed', count: counts.completed }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="glass-card p-4 mb-6"
    >
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {filters.map((filter) => (
          <motion.button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`
              relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
              backdrop-blur-sm border border-white/20 hover:border-white/30
              ${currentFilter === filter.key 
                ? 'bg-white/30 text-gray-800 shadow-lg' 
                : 'bg-white/10 text-gray-700 hover:bg-white/20'
              }
            `}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className="relative z-10">
              {filter.label}
              {filter.count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`
                    ml-2 px-2 py-0.5 rounded-full text-xs font-bold
                    ${currentFilter === filter.key 
                      ? 'bg-white/40 text-gray-800' 
                      : 'bg-white/20 text-gray-600'
                    }
                  `}
                >
                  {filter.count}
                </motion.span>
              )}
            </span>
            
            {currentFilter === filter.key && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-3 text-center text-sm text-gray-600"
      >
        {counts.all === 0 ? (
          "No todos yet. Add one above!"
        ) : (
          `${counts.active} of ${counts.all} tasks remaining`
        )}
      </motion.div>
    </motion.div>
  );
};

export default TodoFilters;