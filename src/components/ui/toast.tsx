'use client'

import { useEffect, useState, useCallback } from 'react'

interface ToastProps {
  message: string
  show: boolean
  onClose: () => void
}

export function Toast({ message, show, onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2500)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <div
      className={`fixed top-[70px] left-1/2 -translate-x-1/2 bg-ink text-cream px-6 py-3 text-sm z-[3000] transition-opacity duration-300 pointer-events-none ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {message}
    </div>
  )
}

// Toast hook for easy usage
export function useToast() {
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false })

  const showToast = useCallback((message: string) => {
    setToast({ message, show: true })
  }, [])

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }))
  }, [])

  return { toast, showToast, hideToast }
}
