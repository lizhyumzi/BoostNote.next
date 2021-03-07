import React, { useMemo } from 'react'
import NavigatorItem from '../atoms/NavigatorItem'
import { NoteStorage } from '../../../lib/db/types'
import { useGeneralStatus } from '../../lib/generalStatus'
import { getTagListItemId } from '../../../lib/nav'
import { useRouter, usePathnameWithoutNoteId } from '../../lib/router'
import { useContextMenu, MenuTypes } from '../../../mobile/lib/contextMenu'
import { useDialog, DialogIconTypes } from '../../../lib/dialog'
import { useDb } from '../../lib/db'
import { useTranslation } from 'react-i18next'
import { mdiTagMultiple, mdiTag } from '@mdi/js'

interface TagListFragmentProps {
  storage: NoteStorage
}

const TagListFragment = ({ storage }: TagListFragmentProps) => {
  const { toggleSideNavOpenedItem, sideNavOpenedItemSet } = useGeneralStatus()
  const { id: storageId, tagMap } = storage
  const { push } = useRouter()
  const { popup } = useContextMenu()
  const { messageBox } = useDialog()
  const { removeTag } = useDb()
  const { t } = useTranslation()
  const currentPathname = usePathnameWithoutNoteId()

  const tagListNavItemId = getTagListItemId(storage.id)
  const tagListIsFolded = !sideNavOpenedItemSet.has(tagListNavItemId)

  const { toggleNav } = useGeneralStatus()

  const tagList = useMemo(() => {
    return Object.keys(tagMap).map((tagName) => {
      const tagPathname = `/m/storages/${storageId}/tags/${tagName}`
      const tagIsActive = currentPathname === tagPathname
      return (
        <NavigatorItem
          key={`storage:${storageId}/tags:${tagName}`}
          depth={2}
          iconPath={mdiTag}
          label={tagName}
          onClick={() => {
            push(tagPathname)
            toggleNav()
          }}
          active={tagIsActive}
          onContextMenu={(event) => {
            event.preventDefault()
            popup(event, [
              {
                type: MenuTypes.Normal,
                label: t('tag.remove'),
                onClick: () => {
                  messageBox({
                    title: `Remove "${tagName}" tag`,
                    message: t('tag.removeMessage'),
                    iconType: DialogIconTypes.Warning,
                    buttons: [t('tag.remove'), t('general.cancel')],
                    defaultButtonIndex: 0,
                    cancelButtonIndex: 1,
                    onClose: (value: number | null) => {
                      if (value === 0) {
                        removeTag(storageId, tagName)
                      }
                    },
                  })
                },
              },
            ])
          }}
        />
      )
    })
  }, [
    storageId,
    tagMap,
    push,
    currentPathname,
    popup,
    messageBox,
    removeTag,
    t,
    toggleNav,
  ])

  if (tagList.length === 0) {
    return null
  }

  return (
    <>
      <NavigatorItem
        depth={1}
        iconPath={mdiTagMultiple}
        label={t('tag.tags')}
        folded={tagList.length > 0 ? tagListIsFolded : undefined}
        onFoldButtonClick={() => {
          toggleSideNavOpenedItem(tagListNavItemId)
        }}
        onClick={() => {
          toggleSideNavOpenedItem(tagListNavItemId)
        }}
        onContextMenu={(event) => {
          event.preventDefault()
        }}
      />
      {!tagListIsFolded && tagList}
    </>
  )
}

export default TagListFragment
