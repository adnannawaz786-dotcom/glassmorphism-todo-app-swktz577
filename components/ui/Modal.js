import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          confirmButton: 'bg-red-500/20 hover:bg-red-500/30 text-red-700 border-red-200/50',
          icon: '⚠️'
        };
      case 'success':
        return {
          confirmButton: 'bg-green-500/20 hover:bg-green-500/30 text-green-700 border-green-200/50',
          icon: '✓'
        };
      case 'warning':
        return {
          confirmButton: 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-700 border-yellow-200/50',
          icon: '⚠️'
        };
      default:
        return {
          confirmButton: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 border-blue-200/50',
          icon: 'ℹ️'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: isVisible ? 1 : 0, 
              scale: isVisible ? 1 : 0.9, 
              y: isVisible ? 0 : 20 
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              duration: 0.2,
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="relative w-full max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">
                  {typeStyles.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {title}
                </h3>
              </div>
              
              {/* Message */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {message}
              </p>
              
              {/* Actions */}
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 rounded-xl border border-gray-200/50 font-medium transition-all duration-200"
                >
                  {cancelText}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  className={`flex-1 px-4 py-2.5 rounded-xl border font-medium transition-all duration-200 ${typeStyles.confirmButton}`}
                >
                  {confirmText}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;