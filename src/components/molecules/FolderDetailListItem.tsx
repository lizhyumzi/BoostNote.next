import React, { ReactNode, MouseEventHandler } from 'react'
import styled from '../../lib/styled'
import {
  borderBottom,
  textOverflow,
  flexCenter,
} from '../../lib/styled/styleFunctions'
import Icon from '../atoms/Icon'
import cc from 'classcat'

interface FolderDetailListItemProps {
  iconPath?: string
  label: string
  onClick?: MouseEventHandler<HTMLDivElement>
  meta?: ReactNode
  control?: ReactNode
}

const FolderDetailListItem = ({
  iconPath,
  label,
  onClick,
  meta,
  control,
}: FolderDetailListItemProps) => {
  return (
    <Container>
      <div className='clickable' onClick={onClick}>
        <div className='icon'>
          {iconPath != null && <Icon path={iconPath} />}
        </div>
        <div className={cc(['label', label.trim().length === 0 && 'subtle'])}>
          {label.trim().length === 0 ? 'Untitled' : label}
        </div>
      </div>
      <div className='meta'>{meta}</div>
      <div className='control'>{control}</div>
    </Container>
  )
}

export default FolderDetailListItem

const Container = styled.li`
  display: flex;
  align-items: center;
  height: 40px;
  ${borderBottom}
  &:hover {
    background-color: ${({ theme }) => theme.noteNavItemBackgroundColor};
    & > .control {
      display: flex;
    }
    & > .meta {
      display: none;
    }
  }
  .clickable {
    flex: 1;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .icon {
    width: 40px;
    height: 40px;
    ${flexCenter}
  }
  .label {
    flex: 1;
    ${textOverflow}
    &.subtle {
      color: ${({ theme }) => theme.disabledUiTextColor};
    }
  }
  & > .control {
    display: none;
  }
  & > .meta {
    color: ${({ theme }) => theme.disabledUiTextColor};
    ${textOverflow}
  }
`
