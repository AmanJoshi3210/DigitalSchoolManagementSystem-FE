import { useEffect } from 'react'
import * as signalR from '@microsoft/signalr'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { authStore } from '@/utils/authStore'

/**
 * Live-updates the conversation/notification caches over the backend's NotificationHub
 * (see Message&notification.md, sections 7 and 9) instead of waiting for the next poll interval.
 * Purely additive: if the socket never connects (offline, blocked, backend down), the
 * existing react-query refetchInterval polling on conversations/messages/notifications
 * still keeps data reasonably fresh, so this is safe to fail silently.
 */
export function useNotificationHub() {
  const { session } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!session) return

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_HUB_URL, {
        accessTokenFactory: () => authStore.getSession()?.accessToken ?? '',
        // We authenticate with a bearer token, not cookies. The JS client's HttpConnection
        // defaults withCredentials to true, which makes the browser require an
        // Access-Control-Allow-Credentials response header - the backend's CORS policy
        // (Program.cs) never sends one, so the negotiate request gets silently blocked
        // ("TypeError: Failed to fetch") even though the server itself returns 200.
        withCredentials: false,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    const invalidateConversations = () => queryClient.invalidateQueries({ queryKey: ['conversations'] })
    const invalidateNotifications = () => queryClient.invalidateQueries({ queryKey: ['notifications'] })

    connection.on('ReceiveMessage', () => {
      invalidateConversations()
      invalidateNotifications()
    })
    connection.on('ReceiveNotification', invalidateNotifications)
    connection.on('ConversationUpdated', invalidateConversations)

    connection.start().catch(() => {
      // Real-time is a nice-to-have; REST polling covers us if the socket can't connect.
    })

    return () => {
      connection.stop()
    }
    // Intentionally keyed on session?.userId, not the whole session object: the session
    // object gets a new identity on every silent token refresh, and accessTokenFactory
    // above always reads the latest token from authStore anyway - keying on the full
    // object would tear down and reconnect the socket on every refresh for no reason.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.userId, queryClient])
}
