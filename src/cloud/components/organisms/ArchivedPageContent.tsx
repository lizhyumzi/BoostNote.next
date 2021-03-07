import React, { useMemo } from 'react'
import { usePage } from '../../lib/stores/pageStore'
import { useNav } from '../../lib/stores/nav'
import { useTitle } from 'react-use'
import { mdiArchive } from '@mdi/js'
import BreadCrumbs from './RightSideTopBar/BreadCrumbs'
import EmojiIcon from '../atoms/EmojiIcon'
import ContentManager from '../molecules/ContentManager'
import AppLayout from '../layouts/AppLayout'

const ArchivedPage = () => {
  const { team } = usePage()
  const { docsMap, workspacesMap } = useNav()

  const archivedDocs = useMemo(() => {
    return [...docsMap.values()].filter((doc) => doc.archivedAt != null)
  }, [docsMap])

  useTitle('Archived')

  if (team == null) {
    return <AppLayout rightLayout={{}} />
  }

  return (
    <AppLayout
      rightLayout={{
        className: 'reduced-width',
        topbar: {
          left: <BreadCrumbs team={team} />,
        },
        header: (
          <>
            <EmojiIcon defaultIcon={mdiArchive} style={{ marginRight: 10 }} />
            <span style={{ marginRight: 10 }}>Archived</span>
          </>
        ),
      }}
    >
      <ContentManager
        team={team}
        documents={archivedDocs}
        folders={[]}
        page='archive'
        workspacesMap={workspacesMap}
      />
    </AppLayout>
  )
}

export default ArchivedPage
