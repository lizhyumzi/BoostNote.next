import { useState, useCallback } from 'react'
import { createStoreContext } from '../../utils/context'
import { generateSecret } from '../../utils/secret'
import ky from 'ky'

export interface ToastMessage {
  id: string
  title: string
  description: string
  type?: 'info' | 'error' | 'success'
  createdAt: Date
}

interface ToastStore {
  readonly messages: ToastMessage[]
  pushMessage: (message: Omit<ToastMessage, 'id' | 'createdAt'>) => void
  pushApiErrorMessage: (error: any) => void
  pushDocHandlerErrorMessage: (error: any) => void
  removeMessage: (message: ToastMessage) => void
}

const useToastStore = (): ToastStore => {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const pushMessage = useCallback(
    ({ title, description, type = 'error' }) => {
      setMessages((prev) => {
        return [
          {
            id: generateSecret(),
            createdAt: new Date(),
            title,
            type,
            description,
          },
          ...prev,
        ]
      })
    },
    [setMessages]
  )

  const pushApiErrorMessage = useCallback(
    async (error: any) => {
      let title = 'Error'
      let description = 'Something wrong happened'

      if (error instanceof ky.HTTPError) {
        try {
          title = error.response.status.toString()
          const errorMessage = await error.response.text()
          description = errorMessage.split('\n')[0].split(': ')[1]
        } catch (error) {}
      }

      setMessages((prev) => [
        {
          id: generateSecret(),
          createdAt: new Date(),
          title,
          type: 'error',
          description,
        },
        ...prev,
      ])
    },
    [setMessages]
  )

  const pushDocHandlerErrorMessage = useCallback(
    (error: any) => {
      if (error.response.data.includes('exceeds the free tier')) {
        return
      }

      pushApiErrorMessage(error)
    },
    [pushApiErrorMessage]
  )

  return {
    messages,
    pushMessage,
    pushApiErrorMessage,
    pushDocHandlerErrorMessage,
    removeMessage: (message) =>
      setMessages(messages.filter(({ id }) => id !== message.id)),
  }
}

export const {
  StoreProvider: ToastProvider,
  useStore: useToast,
} = createStoreContext(useToastStore)
