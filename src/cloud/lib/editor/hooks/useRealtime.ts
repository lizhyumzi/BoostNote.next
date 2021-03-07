import { useEffect, useState, useRef } from 'react'
import { Doc } from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { uniqWith } from 'ramda'
import { useRealtimeConn } from '../../stores/realtimeConn'

export type PresenceChange<T> =
  | { type: 'connected'; sessionId: number; userInfo: T }
  | { type: 'disconnected'; sessionId: number }

export interface RealtimeArgs<T extends { id: string }> {
  token: string
  userInfo?: T
}

export type ConnectionState =
  | 'initialising'
  | 'connected'
  | 'synced'
  | 'reconnecting'
  | 'disconnected'

const useRealtime = <T extends { id: string }>({
  token,
  userInfo,
}: RealtimeArgs<T>) => {
  const { constructor } = useRealtimeConn()
  const [provider, setProvider] = useState<WebsocketProvider | undefined>()
  const [connState, setConnState] = useState<ConnectionState>('initialising')
  const [users, setUsers] = useState<T[]>([])
  const timeoutRef = useRef<number>()

  useEffect(() => {
    if (constructor == null) {
      return
    }

    const doc = new Doc()
    const provider = new WebsocketProvider('', token, doc, {
      WebSocketPolyfill: constructor,
    })

    provider.on('status', ({ status }: any) => {
      const connected = status === 'connected'
      setConnState(connected ? 'connected' : 'reconnecting')
      if (!connected && timeoutRef.current == null) {
        timeoutRef.current = window.setTimeout(() => {
          provider.disconnect()
          setConnState('disconnected')
        }, 30000)
      }
      if (connected && timeoutRef.current != null) {
        clearInterval(timeoutRef.current)
        timeoutRef.current = undefined
      }
    })

    provider.on('sync', (synced: boolean) => {
      setConnState((prev) => (synced ? 'synced' : prev))
    })

    provider.awareness.on('change', () => {
      const states: Map<number, any> = provider.awareness.getStates()
      const users = Array.from(states.values()).reduce((acc, curr) => {
        if (curr.user != null) {
          acc.push(curr.user)
        }
        return acc
      }, [])
      setUsers(() => uniqWith(idEq, users))
    })

    const origConnect = provider.connect
    provider.connect = () => {
      setConnState('reconnecting')
      clearInterval(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => {
        provider.disconnect()
        setConnState('disconnected')
      }, 30000)
      origConnect.call(provider)
    }

    setProvider(provider)
    return () => {
      doc.destroy()
      provider.awareness.destroy()
      provider.disconnect()
      provider.destroy()
      setUsers([])
      setConnState('disconnected')
    }
  }, [token, constructor])

  useEffect(() => {
    if (provider != null && userInfo != null) {
      provider.awareness.setLocalStateField('user', userInfo)
    }
  }, [userInfo, provider])

  return [provider, connState, users] as [
    WebsocketProvider,
    ConnectionState,
    T[]
  ]
}

const idEq = <T extends { id: string }>(x: T, y: T) => x.id === y.id

export default useRealtime
