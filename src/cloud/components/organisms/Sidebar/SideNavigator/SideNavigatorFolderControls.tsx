import React, { useCallback, useState } from 'react'
import { useNav } from '../../../../lib/stores/nav'
import styled from '../../../../lib/styled'
import { SerializedFolderWithBookmark } from '../../../../interfaces/db/folder'
import { useContextMenu, MenuTypes } from '../../../../lib/stores/contextMenu'
import { useToast } from '../../../../lib/stores/toast'
import {
  CreateFolderBookmarkResponseBody,
  DestroyFolderBookmarkResponseBody,
  createFolderBookmark,
  destroyFolderBookmark,
} from '../../../../api/teams/folders/bookmarks'
import {
  mdiDotsVertical,
  mdiTextBoxPlusOutline,
  mdiFolderMultiplePlusOutline,
  mdiFolderCogOutline,
  mdiTrashCanOutline,
  mdiStar,
  mdiStarOutline,
} from '@mdi/js'
import {
  useCapturingGlobalKeyDownHandler,
  preventKeyboardEventPropagation,
} from '../../../../lib/keyboard'
import {
  isFolderDeleteShortcut,
  isDocCreateShortcut,
  isFolderCreateShortcut,
  isFolderBookmarkShortcut,
  isFolderEditShortcut,
} from '../../../../lib/shortcuts'
import { useModal } from '../../../../lib/stores/modal'
import EditFolderModal from '../../Modal/contents/Folder/EditFolderModal'
import SideNavigatorIconButton from './SideNavigatorIconButton'
import Tooltip from '../../../atoms/Tooltip'
import IconMdi from '../../../atoms/IconMdi'

interface SideNavigatorFolderControlsProps {
  folder: SerializedFolderWithBookmark
  focused: boolean
  onNewFolderClick: () => void
}

const SideNavigatorFolderControls = ({
  folder,
  focused = false,
  onNewFolderClick,
}: SideNavigatorFolderControlsProps) => {
  const { deleteFolderHandler, updateFoldersMap, createDocHandler } = useNav()
  const { pushMessage, pushDocHandlerErrorMessage } = useToast()
  const { popup } = useContextMenu()
  const { openModal } = useModal()
  const [sendingBookmark, setSendingBookmark] = useState<boolean>(false)

  const toggleBookmark = useCallback(async () => {
    if (sendingBookmark) {
      return
    }
    setSendingBookmark(true)
    try {
      let data:
        | CreateFolderBookmarkResponseBody
        | DestroyFolderBookmarkResponseBody
      if (folder.bookmarked) {
        data = await destroyFolderBookmark(folder.teamId, folder.id)
      } else {
        data = await createFolderBookmark(folder.teamId, folder.id)
      }
      updateFoldersMap([data.folder.id, data.folder])
    } catch (error) {
      pushMessage({
        title: 'Error',
        description: 'Could not bookmark this folder',
      })
    }
    setSendingBookmark(false)
  }, [
    folder,
    setSendingBookmark,
    pushMessage,
    updateFoldersMap,
    sendingBookmark,
  ])

  const openDotsContextMenuOthers = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      popup(event, [
        {
          type: MenuTypes.Normal,
          icon: <IconMdi path={mdiFolderCogOutline} size={16} />,
          label: 'Edit Folder',
          onClick: async () => openModal(<EditFolderModal folder={folder} />),
        },
        {
          type: MenuTypes.Normal,
          icon: (
            <IconMdi
              path={folder.bookmarked ? mdiStar : mdiStarOutline}
              size={16}
            />
          ),
          label: sendingBookmark
            ? '...'
            : folder.bookmarked
            ? 'Bookmarked'
            : 'Bookmark Folder',
          onClick: async () => toggleBookmark(),
        },
        {
          type: MenuTypes.Normal,
          icon: <IconMdi path={mdiTrashCanOutline} size={16} />,
          label: 'Delete Folder',
          onClick: async () => deleteFolderHandler(folder),
        },
      ])
    },
    [
      popup,
      folder,
      toggleBookmark,
      openModal,
      sendingBookmark,
      deleteFolderHandler,
    ]
  )

  const createChildDoc = useCallback(async () => {
    try {
      await createDocHandler({
        parentFolderId: folder.id,
        workspaceId: folder.workspaceId,
      })
    } catch (error) {
      pushDocHandlerErrorMessage(error)
    }
  }, [
    createDocHandler,
    pushDocHandlerErrorMessage,
    folder.id,
    folder.workspaceId,
  ])

  const keyDownHandler = useCallback(
    async (event: KeyboardEvent) => {
      if (!focused) {
        return
      }
      if (isFolderBookmarkShortcut(event)) {
        preventKeyboardEventPropagation(event)
        toggleBookmark()
        return
      }
      if (isFolderCreateShortcut(event)) {
        preventKeyboardEventPropagation(event)
        onNewFolderClick()
        return
      }

      if (isFolderEditShortcut(event)) {
        preventKeyboardEventPropagation(event)
        openModal(<EditFolderModal folder={folder} />)
        return
      }

      if (isDocCreateShortcut(event)) {
        preventKeyboardEventPropagation(event)
        createChildDoc()
        return
      }
      if (isFolderDeleteShortcut(event)) {
        preventKeyboardEventPropagation(event)
        deleteFolderHandler(folder)
        return
      }
    },
    [
      focused,
      toggleBookmark,
      createChildDoc,
      onNewFolderClick,
      folder,
      deleteFolderHandler,
      openModal,
    ]
  )
  useCapturingGlobalKeyDownHandler(keyDownHandler)

  return (
    <Wrapper>
      <Tooltip
        tooltip={
          <div>
            <span className='tooltip-text'>Create new doc</span>
            <span className='tooltip-command'>N</span>
          </div>
        }
        style={{ left: '-200%' }}
      >
        <SideNavigatorIconButton
          path={mdiTextBoxPlusOutline}
          onClick={createChildDoc}
        />
      </Tooltip>
      <Tooltip
        tooltip={
          <div>
            <span className='tooltip-text'>Create new folder</span>
            <span className='tooltip-command'>F</span>
          </div>
        }
        style={{ left: '-200%' }}
      >
        <SideNavigatorIconButton
          onClick={onNewFolderClick}
          path={mdiFolderMultiplePlusOutline}
        />
      </Tooltip>
      <SideNavigatorIconButton
        onClick={openDotsContextMenuOthers}
        path={mdiDotsVertical}
      />
    </Wrapper>
  )
}

export default SideNavigatorFolderControls

const Wrapper = styled.div`
  display: flex;
  text-align: right;
  vertical-align: middle;
`
