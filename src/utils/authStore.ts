import type { StoredSession } from '@/types'

// Framework-agnostic session store. Both the axios client (api/client.ts) and the
// React AuthContext read/write through here, so the interceptor can react to token
// expiry (clearing the session) without importing React or the router.
const STORAGE_KEY = 'dsms_session'

type Listener = (session: StoredSession | null) => void

function loadFromStorage(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredSession) : null
  } catch {
    return null
  }
}

function persist(session: StoredSession | null) {
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) - session just won't persist across reloads.
  }
}

let currentSession: StoredSession | null = loadFromStorage()
const listeners = new Set<Listener>()

export const authStore = {
  getSession(): StoredSession | null {
    return currentSession
  },
  setSession(session: StoredSession | null) {
    currentSession = session
    persist(session)
    listeners.forEach((listener) => listener(session))
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}
