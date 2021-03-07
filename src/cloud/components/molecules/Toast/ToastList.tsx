import React from 'react'
import { useToast } from '../../../lib/stores/toast'
import ToastItem from './ToastItem'
import styled from '../../../lib/styled'

const ToastList = () => {
  const { messages, removeMessage } = useToast()

  return (
    <StyledToastList>
      {messages.map((message) => (
        <li key={message.id}>
          <ToastItem item={message} onClose={removeMessage} />
        </li>
      ))}
    </StyledToastList>
  )
}

export default ToastList

const StyledToastList = styled.ul`
  position: fixed;
  z-index: 10000;
  display: flex;
  flex-direction: column-reverse;
  right: 0;
  bottom: 0;
  list-style: none;
`
