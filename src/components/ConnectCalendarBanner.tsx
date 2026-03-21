'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar, X, ChevronRight, AlertCircle, CheckCircle2, Shield } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import {
  useCalendarTokens,
  encryptAndStoreTokens,
  getConnectedProviders,
} from '@/hooks/useCalendarTokens'

const DISMISS_KEY = 'rcal-connect-banner-dismissed'

const PROVIDERS = [
  {
    id: 'google',
    name: 'Google Calendar',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
    href: '/rcal/api/auth/google/authorize',
    color: 'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30',
  },
  {
    id: 'outlook',
    name: 'Outlook / Microsoft 365',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0078D4">
        <path d="M24 7.387v10.478c0 .23-.08.424-.238.576a.807.807 0 01-.588.234h-8.42v-6.56l1.56 1.14a.27.27 0 00.32 0l7.14-5.088c.08-.058.155-.058.226 0zM24 5.395c0-.07-.038-.15-.113-.234a.348.348 0 00-.238-.14h-.146L14.754 11.5l-1.504-1.09V4.5h10.4c.346 0 .566.1.7.297.1.197.15.398.15.598zM13.25 4.5v7.122L1.2 4.68c-.1-.06-.176-.03-.226.088A.756.756 0 00.9 5.1v14.287a.734.734 0 00.247.556c.165.15.354.227.566.227h11.537V12.68l-.34.244-.002.001-4.254 3.025a.27.27 0 01-.318 0L1.574 11.2v5.556a.368.368 0 01-.114.27.368.368 0 01-.272.114.379.379 0 01-.384-.384V8.92l6.762 4.808a.27.27 0 00.318 0L13.25 9.99V4.5z"/>
      </svg>
    ),
    href: '/rcal/api/auth/microsoft/authorize',
    color: 'hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/30',
  },
  {
    id: 'ics',
    name: 'ICS / iCal URL',
    icon: <Calendar className="w-5 h-5 text-orange-500" />,
    href: null,
    color: 'hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30',
    isManual: true,
  },
] as Array<{
  id: string
  name: string
  icon: React.ReactNode
  href: string | null
  color: string
  isManual?: boolean
}>

export function ConnectCalendarBanner() {
  const [dismissed, setDismissed] = useState(true)
  const [loading, setLoading] = useState(true)
  const [showProviders, setShowProviders] = useState(false)
  const [connectStatus, setConnectStatus] = useState<
    'idle' | 'success' | 'denied' | 'error' | 'encrypting'
  >('idle')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const searchParams = useSearchParams()
  const { hasConnected, refresh: refreshProviders } = useCalendarTokens()

  // Check auth status
  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((data) => {
        setIsAuthenticated(!!data.authenticated)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Handle OAuth callback — retrieve tokens and encrypt with EncryptID
  useEffect(() => {
    const connect = searchParams.get('connect')
    const retrievalCode = searchParams.get('rc')

    if (connect === 'pending' && retrievalCode) {
      setConnectStatus('encrypting')
      // Retrieve tokens from server and encrypt locally
      ;(async () => {
        try {
          const response = await fetch('/api/auth/google/retrieve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: retrievalCode }),
          })

          if (!response.ok) {
            throw new Error(`Retrieval failed: ${response.status}`)
          }

          const tokenData = await response.json()

          // Encrypt with EncryptID and store in localStorage
          await encryptAndStoreTokens(tokenData.provider, tokenData)

          setConnectStatus('success')
          refreshProviders()
          window.history.replaceState({}, '', '/rcal/calendar')

          setTimeout(() => setConnectStatus('idle'), 5000)
        } catch (err) {
          console.error('Token encryption failed:', err)
          setConnectStatus('error')
          window.history.replaceState({}, '', '/rcal/calendar')
          setTimeout(() => setConnectStatus('idle'), 5000)
        }
      })()
    } else if (connect === 'denied') {
      setConnectStatus('denied')
      window.history.replaceState({}, '', '/rcal/calendar')
      setTimeout(() => setConnectStatus('idle'), 5000)
    } else if (connect === 'error') {
      setConnectStatus('error')
      window.history.replaceState({}, '', '/rcal/calendar')
      setTimeout(() => setConnectStatus('idle'), 5000)
    }
  }, [searchParams, refreshProviders])

  // Determine banner visibility
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const wasDismissed = localStorage.getItem(DISMISS_KEY)
      const connected = getConnectedProviders().length > 0
      setDismissed(connected || !!wasDismissed)
    }
  }, [loading, isAuthenticated, hasConnected])

  const handleDismiss = useCallback(() => {
    setDismissed(true)
    localStorage.setItem(DISMISS_KEY, 'true')
  }, [])

  // Success toast
  if (connectStatus === 'success') {
    return (
      <div className="bg-green-50 dark:bg-green-950/40 border-b border-green-200 dark:border-green-800 px-4 py-3">
        <div className="flex items-center gap-3 max-w-screen-xl mx-auto">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-800 dark:text-green-200 flex-1">
            Calendar connected! Credentials encrypted with your passkey and stored locally.
          </p>
          <button
            onClick={() => setConnectStatus('idle')}
            className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
          >
            <X className="w-4 h-4 text-green-600 dark:text-green-400" />
          </button>
        </div>
      </div>
    )
  }

  // Encrypting state
  if (connectStatus === 'encrypting') {
    return (
      <div className="bg-blue-50 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-800 px-4 py-3">
        <div className="flex items-center gap-3 max-w-screen-xl mx-auto">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 animate-pulse" />
          <p className="text-sm text-blue-800 dark:text-blue-200 flex-1">
            Encrypting your calendar credentials with your passkey...
          </p>
        </div>
      </div>
    )
  }

  // Error/denied toast
  if (connectStatus === 'error' || connectStatus === 'denied') {
    return (
      <div className="bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-800 px-4 py-3">
        <div className="flex items-center gap-3 max-w-screen-xl mx-auto">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-800 dark:text-red-200 flex-1">
            {connectStatus === 'denied'
              ? 'Calendar access was denied. You can try again anytime.'
              : 'Failed to connect calendar. Please try again.'}
          </p>
          <button
            onClick={() => setConnectStatus('idle')}
            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
          >
            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>
    )
  }

  // Don't render while loading, if not authenticated, or if dismissed
  if (loading || !isAuthenticated || dismissed) return null

  return (
    <div className="bg-blue-50 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-800">
      <div className="px-4 py-3 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Connect your calendar
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
              Sync events from Google Calendar, Outlook, or import via ICS. Credentials are encrypted locally with your passkey.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowProviders(!showProviders)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
            >
              Connect
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showProviders ? 'rotate-90' : ''}`} />
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4 text-blue-400 dark:text-blue-500" />
            </button>
          </div>
        </div>

        {showProviders && (
          <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PROVIDERS.map((provider) => (
                <a
                  key={provider.id}
                  href={provider.href || undefined}
                  onClick={
                    provider.isManual
                      ? (e) => {
                          e.preventDefault()
                          alert('ICS import coming soon — use the sidebar "Add calendar" button for now.')
                        }
                      : undefined
                  }
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors cursor-pointer ${provider.color}`}
                >
                  {provider.icon}
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {provider.name}
                  </span>
                </a>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400">
              <Shield className="w-3.5 h-3.5" />
              Read-only access. Tokens are encrypted with your passkey (AES-256-GCM) and stored only in your browser.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
