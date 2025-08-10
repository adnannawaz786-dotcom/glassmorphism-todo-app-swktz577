import { useState, useEffect, useCallback } from 'react';
import { saveTodos, loadTodos } from '../lib/todoStorage';

const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [isLoading, setIsLoading] = useState(true);

  // Load todos from localStorage on mount
  useEffect(() => {
    const loadedTodos = loadTodos();
    setTodos(loadedTodos);
    setIsLoading(false);
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (!isLoading) {
      saveTodos(todos);
    }
  }, [todos, isLoading]);

  // Add a new todo
  const addTodo = useCallback((text) => {
    if (!text.trim()) return;
    
    const newTodo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTodos(prevTodos => [newTodo, ...prevTodos]);
  }, []);

  // Delete a todo
  const deleteTodo = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  // Toggle todo completion status
  const toggleTodo = useCallback((id) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id 
          ? { 
              ...todo, 
              completed: !todo.completed,
              updatedAt: new Date().toISOString()
            }
          : todo
      )
    );
  }, []);

  // Edit todo text
  const editTodo = useCallback((id, newText) => {
    if (!newText.trim()) return;
    
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id 
          ? { 
              ...todo, 
              text: newText.trim(),
              updatedAt: new Date().toISOString()
            }
          : todo
      )
    );
  }, []);

  // Clear all completed todos
  const clearCompleted = useCallback(() => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  }, []);

  // Mark all todos as completed or active
  const toggleAllTodos = useCallback(() => {
    const allCompleted = todos.every(todo => todo.completed);
    setTodos(prevTodos => 
      prevTodos.map(todo => ({
        ...todo,
        completed: !allCompleted,
        updatedAt: new Date().toISOString()
      }))
    );
  }, [todos]);

  // Get filtered todos based on current filter
  const getFilteredTodos = useCallback(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  // Get todo statistics
  const getStats = useCallback(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    
    return {
      total,
      active,
      completed,
      hasCompleted: completed > 0,
      hasActive: active > 0
    };
  }, [todos]);

  // Search todos by text
  const searchTodos = useCallback((searchTerm) => {
    if (!searchTerm.trim()) return getFilteredTodos();
    
    const filtered = getFilteredTodos();
    return filtered.filter(todo => 
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [getFilteredTodos]);

  return {
    // State
    todos: getFilteredTodos(),
    allTodos: todos,
    filter,
    isLoading,
    
    // Actions
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
    clearCompleted,
    toggleAllTodos,
    setFilter,
    
    // Computed values
    stats: getStats(),
    
    // Utility functions
    searchTodos
  };
};

export default useTodos;