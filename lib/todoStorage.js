// Local storage utility functions for todos persistence

const TODOS_STORAGE_KEY = 'glassmorphism_todos';

/**
 * Retrieve todos from localStorage
 * @returns {Array} Array of todo objects
 */
export const getTodosFromStorage = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const todosJson = localStorage.getItem(TODOS_STORAGE_KEY);
    return todosJson ? JSON.parse(todosJson) : [];
  } catch (error) {
    console.error('Error retrieving todos from localStorage:', error);
    return [];
  }
};

/**
 * Save todos to localStorage
 * @param {Array} todos - Array of todo objects to save
 * @returns {boolean} Success status
 */
export const saveTodosToStorage = (todos) => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
    return true;
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
    return false;
  }
};

/**
 * Add a new todo to storage
 * @param {Object} todo - Todo object to add
 * @returns {Array} Updated todos array
 */
export const addTodoToStorage = (todo) => {
  const existingTodos = getTodosFromStorage();
  const newTodo = {
    id: Date.now().toString(),
    text: todo.text || '',
    completed: false,
    priority: todo.priority || 'medium',
    category: todo.category || 'general',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...todo
  };
  
  const updatedTodos = [newTodo, ...existingTodos];
  saveTodosToStorage(updatedTodos);
  return updatedTodos;
};

/**
 * Update an existing todo in storage
 * @param {string} id - Todo ID to update
 * @param {Object} updates - Object with updated properties
 * @returns {Array} Updated todos array
 */
export const updateTodoInStorage = (id, updates) => {
  const existingTodos = getTodosFromStorage();
  const updatedTodos = existingTodos.map(todo => 
    todo.id === id 
      ? { 
          ...todo, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        }
      : todo
  );
  
  saveTodosToStorage(updatedTodos);
  return updatedTodos;
};

/**
 * Delete a todo from storage
 * @param {string} id - Todo ID to delete
 * @returns {Array} Updated todos array
 */
export const deleteTodoFromStorage = (id) => {
  const existingTodos = getTodosFromStorage();
  const updatedTodos = existingTodos.filter(todo => todo.id !== id);
  
  saveTodosToStorage(updatedTodos);
  return updatedTodos;
};

/**
 * Toggle todo completion status
 * @param {string} id - Todo ID to toggle
 * @returns {Array} Updated todos array
 */
export const toggleTodoInStorage = (id) => {
  const existingTodos = getTodosFromStorage();
  const updatedTodos = existingTodos.map(todo =>
    todo.id === id
      ? {
          ...todo,
          completed: !todo.completed,
          updatedAt: new Date().toISOString()
        }
      : todo
  );
  
  saveTodosToStorage(updatedTodos);
  return updatedTodos;
};

/**
 * Clear all todos from storage
 * @returns {boolean} Success status
 */
export const clearAllTodosFromStorage = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(TODOS_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing todos from localStorage:', error);
    return false;
  }
};

/**
 * Get todos filtered by completion status
 * @param {boolean} completed - Filter by completion status
 * @returns {Array} Filtered todos array
 */
export const getTodosByStatus = (completed) => {
  const todos = getTodosFromStorage();
  return todos.filter(todo => todo.completed === completed);
};

/**
 * Get todos filtered by category
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered todos array
 */
export const getTodosByCategory = (category) => {
  const todos = getTodosFromStorage();
  return todos.filter(todo => todo.category === category);
};

/**
 * Get todos filtered by priority
 * @param {string} priority - Priority level (high, medium, low)
 * @returns {Array} Filtered todos array
 */
export const getTodosByPriority = (priority) => {
  const todos = getTodosFromStorage();
  return todos.filter(todo => todo.priority === priority);
};

/**
 * Search todos by text content
 * @param {string} searchTerm - Search term to match against todo text
 * @returns {Array} Filtered todos array
 */
export const searchTodos = (searchTerm) => {
  const todos = getTodosFromStorage();
  const lowercaseSearch = searchTerm.toLowerCase();
  
  return todos.filter(todo =>
    todo.text.toLowerCase().includes(lowercaseSearch) ||
    (todo.category && todo.category.toLowerCase().includes(lowercaseSearch))
  );
};

/**
 * Get todo statistics
 * @returns {Object} Statistics object with counts and percentages
 */
export const getTodoStats = () => {
  const todos = getTodosFromStorage();
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  
  return {
    total: totalTodos,
    completed: completedTodos,
    pending: pendingTodos,
    completionRate: totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0
  };
};