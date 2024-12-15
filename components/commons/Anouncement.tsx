"use client"
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface AnnouncementProps {
  id: string
  message: string
  onClose: (id: string) => void
}

export function Announcement({ id, message, onClose }: AnnouncementProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(id), 300)
  }

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-3 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm font-medium">{message}</p>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors duration-200"
            aria-label="Close announcement"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

