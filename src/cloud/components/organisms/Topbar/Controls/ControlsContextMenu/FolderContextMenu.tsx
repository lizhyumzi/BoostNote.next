import React, { useState, useCallback, useMemo } from 'react'
import { usePage } from '../../../../../lib/stores/pageStore'
import { useNav } from '../../../../../lib/stores/nav'
import {
  destroyFolderBookmark,
  createFolderBookmark,
  CreateFolderBookmarkResponseBody,
  DestroyFolderBookmarkResponseBody,
} from '../../../../../api/teams/folders/bookmarks'
import { useToast } from '../../../../../lib/stores/toast'
import ContextMenuItem from './ControlsContextMenuItem'
import {
  StyledContextMenuContainer,
  StyledFooter,
  Scrollable,
  StyledMenuItem,
  StyledIcon,
} from './styled'
import ControlsContextMenuBackground from './ControlsContextMenuBackground'
import { SerializedFolderWithBookmark } from '../../../../../interfaces/db/folder'
import { getFormattedBoosthubDate } from '../../../../../lib/date'
import { useEffectOnce } from 'react-use'
import {
  useGlobalKeyDownHandler,
  isSingleKeyEventOutsideOfInput,
  preventKeyboardEventPropagation,
  useContextMenuKeydownHandler,
} from '../../../../../lib/keyboard'
import { MetaKeyText } from '../../../../../lib/keyboard'
import { useModal } from '../../../../../lib/stores/modal'
import EditFolderModal from '../../../Modal/contents/Folder/EditFolderModal'
import IconMdi from '../../../../atoms/IconMdi'
import { mdiStar, mdiFolderEdit, mdiTrashCan, mdiStarOutline } from '@mdi/js'

interface FolderContextMenuProps {
  currentFolder: SerializedFolderWithBookmark
  closeContextMenu: () => void
}

const FolderContextMenu = ({
  closeContextMenu,
  currentFolder,
}: FolderContextMenuProps) => {
  const [sendingBookmark, setSendingBookmark] = useState<boolean>(false)
  const { updateFoldersMap, deleteFolderHandler } = useNav()
  const { setPartialPageData } = usePage()
  const { pushMessage } = useToast()
  const { openModal } = useModal()

  const menuRef = React.createRef<HTMLDivElement>()
  useEffectOnce(() => {
    menuRef.current!.focus()
  })

  const onBlurHandler = (event: any) => {
    if (
      !(
        menuRef.current == null ||
        event.relatedTarget == null ||
        !menuRef.current.contains(event.relatedTarget)
      )
    ) {
      return
    }
    closeContextMenu()
  }

  const toggleBookmark = useCallback(async () => {
    if (sendingBookmark || currentFolder == null) {
      return
    }
    setSendingBookmark(true)
    try {
      let data:
        | CreateFolderBookmarkResponseBody
        | DestroyFolderBookmarkResponseBody
      if (currentFolder.bookmarked) {
        data = await destroyFolderBookmark(
          currentFolder.teamId,
          currentFolder.id
        )
      } else {
        data = await createFolderBookmark(
          currentFolder.teamId,
          currentFolder.id
        )
      }
      updateFoldersMap([data.folder.id, data.folder])
      setPartialPageData({ pageFolder: data.folder })
    } catch (error) {
      pushMessage({
        title: 'Error',
        description: 'Could not bookmark this doc',
      })
    }
    setSendingBookmark(false)
  }, [
    currentFolder,
    setPartialPageData,
    setSendingBookmark,
    pushMessage,
    updateFoldersMap,
    sendingBookmark,
  ])

  const keydownHandler = useMemo(() => {
    return (event: KeyboardEvent) => {
      if (isSingleKeyEventOutsideOfInput(event, 'escape')) {
        preventKeyboardEventPropagation(event)
        closeContextMenu()
      }
    }
  }, [closeContextMenu])
  useGlobalKeyDownHandler(keydownHandler)
  useContextMenuKeydownHandler(menuRef)

  return (
    <>
      <ControlsContextMenuBackground closeContextMenu={closeContextMenu} />
      <StyledContextMenuContainer ref={menuRef} onBlur={onBlurHandler}>
        <Scrollable>
          <ContextMenuItem
            label={
              <div>
                <StyledMenuItem>
                  <StyledIcon>
                    <IconMdi path={mdiFolderEdit} />
                  </StyledIcon>
                  Edit
                </StyledMenuItem>
              </div>
            }
            disabled={sendingBookmark}
            onClick={() => {
              openModal(<EditFolderModal folder={currentFolder} />)
            }}
            id='fD-context-top-edit'
            tooltip='E'
          />
          <ContextMenuItem
            label={
              sendingBookmark ? (
                '...'
              ) : currentFolder.bookmarked ? (
                <div>
                  <StyledMenuItem>
                    <StyledIcon>
                      <IconMdi path={mdiStar} />
                    </StyledIcon>
                    Unbookmark
                  </StyledMenuItem>
                </div>
              ) : (
                <div>
                  <StyledMenuItem>
                    <StyledIcon>
                      <IconMdi path={mdiStarOutline} />
                    </StyledIcon>
                    Bookmark
                  </StyledMenuItem>
                </div>
              )
            }
            disabled={sendingBookmark}
            onClick={toggleBookmark}
            id='fD-context-top-bookmark'
            tooltip='B'
          />
          <ContextMenuItem
            label={
              <div>
                <StyledMenuItem>
                  <StyledIcon>
                    <IconMdi path={mdiTrashCan} />
                  </StyledIcon>
                  Delete
                </StyledMenuItem>
              </div>
            }
            onClick={() => deleteFolderHandler(currentFolder)}
            id='fd-context-top-delete'
            tooltip={`${MetaKeyText()} + Shift + Delete`}
          />
        </Scrollable>
        <StyledFooter>
          Last updated:
          <div>{getFormattedBoosthubDate(currentFolder.updatedAt)}</div>
        </StyledFooter>
      </StyledContextMenuContainer>
    </>
  )
}

export default FolderContextMenu
