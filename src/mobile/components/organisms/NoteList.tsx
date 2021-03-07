import React, { useCallback, useRef } from 'react'
import NoteItem from './NoteItem'
import { NoteDoc } from '../../../lib/db/types'
import styled from '../../../lib/styled'
import { useTranslation } from 'react-i18next'
import Icon from '../../../components/atoms/Icon'
import { mdiPencil } from '@mdi/js'

const NoteListContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  outline: none;
  & > ul {
    flex: 1;
    margin: 0;
    padding: 0;
    list-style: none;
    overflow-y: auto;
  }
`

const NewNoteButton = styled.button`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 60px;
  height: 60px;
  font-size: 36px;
  padding: 0;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.primaryColor};
  color: ${({ theme }) => theme.textColor};
  opacity: 0.8;
  z-index: 1;
  &:active,
  &:hover {
    opacity: 1;
  }
`

const EmptyPlaceholder = styled.li`
  height: 44px;
  padding: 0 10px;
  display: flex;
  align-items: center;
`

type NoteListProps = {
  currentStorageId: string
  currentNoteId?: string
  notes: NoteDoc[]
  createNote?: () => Promise<void>
  basePathname: string
  trashOrPurgeCurrentNote: () => void
}

const NoteList = ({
  notes,
  createNote,
  currentStorageId,
  basePathname,
}: NoteListProps) => {
  const { t } = useTranslation()

  const listRef = useRef<HTMLUListElement>(null)

  const focusList = useCallback(() => {
    listRef.current!.focus()
  }, [])

  return (
    <NoteListContainer>
      {currentStorageId && createNote != null && (
        <NewNoteButton onClick={createNote}>
          <Icon path={mdiPencil} />
        </NewNoteButton>
      )}
      <ul tabIndex={0} ref={listRef}>
        {notes.map((note) => {
          return (
            <li key={note._id}>
              <NoteItem
                note={note}
                basePathname={basePathname}
                focusList={focusList}
                storageId={currentStorageId}
              />
            </li>
          )
        })}
        {notes.length === 0 && (
          <EmptyPlaceholder>{t('note.nothing')}</EmptyPlaceholder>
        )}
      </ul>
    </NoteListContainer>
  )
}

export default NoteList
