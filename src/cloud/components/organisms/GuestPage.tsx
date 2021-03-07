import React from 'react'
import { usePage } from '../../lib/stores/pageStore'
import { useNav } from '../../lib/stores/nav'
import BreadCrumbs from './RightSideTopBar/BreadCrumbs'
import AppLayout from '../layouts/AppLayout'
import DocList from './DocList'

const GuestPage = () => {
  const { team } = usePage()
  const { docsMap } = useNav()

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
        header: <span style={{ marginRight: 10 }}>Shared documents</span>,
      }}
    >
      <DocList docs={[...docsMap.values()]} team={team} />
    </AppLayout>
  )
}

export default GuestPage
