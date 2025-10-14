'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X } from 'lucide-react'

interface SuccessToastProps {
  isVisible: boolean
  onClose: () => void
  message: string
  position?: number
  totalUsers?: number
}

export default function SuccessToast({ 
  isVisible, 
  onClose, 
  message, 
  position = 0, 
  totalUsers = 0 
}: SuccessToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000) // Auto-close after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {message}
                </p>
                
                {position > 0 && (
                  <div className="text-xs text-gray-600">
                    You&apos;re #{position} in line
                    {totalUsers > 0 && ` out of ${totalUsers} people`}
                  </div>
                )}
              </div>
              
              <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
