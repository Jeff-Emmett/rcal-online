'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Maximize2, Minimize2 } from 'lucide-react'

interface FullscreenToggleProps {
  children: (isFullscreen: boolean) => React.ReactNode
}

/**
 * Provides a fullscreen toggle for any calendar view.
 * Renders a small button that toggles between inline and portal-based fullscreen.
 * Esc exits fullscreen.
 */
export function FullscreenToggle({ children }: FullscreenToggleProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault()
        e.stopPropagation()
        setIsFullscreen(false)
      }
    },
    [isFullscreen]
  )

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown, true)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [isFullscreen, handleKeyDown])

  if (!mounted) return <>{children(false)}</>

  if (isFullscreen) {
    return (
      <>
        {/* Placeholder in normal flow */}
        <div className="h-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-gray-400 dark:text-gray-500 text-sm">
            Fullscreen active — press Esc to return
          </div>
        </div>

        {/* Fullscreen portal */}
        {createPortal(
          <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-900">
            {/* Close bar */}
            <div className="flex items-center justify-end px-4 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
              <button
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Exit fullscreen (Esc)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                Exit Fullscreen
              </button>
            </div>

            {/* Content fills remaining space */}
            <div className="flex-1 overflow-hidden">
              {children(true)}
            </div>
          </div>,
          document.body
        )}
      </>
    )
  }

  return <>{children(false)}</>
}

/**
 * Small button to toggle fullscreen. Place in a view's header.
 */
export function FullscreenButton({
  isFullscreen,
  onToggle,
}: {
  isFullscreen: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen (F)'}
    >
      {isFullscreen ? (
        <Minimize2 className="w-4 h-4" />
      ) : (
        <Maximize2 className="w-4 h-4" />
      )}
    </button>
  )
}
