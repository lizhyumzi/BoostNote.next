import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FormGroup,
  FormCheckInlineItem,
  FormCheckList,
  FormLabel,
} from '../atoms/form'
import LocalStorageCreateForm from '../organisms/LocalStorageCreateForm'
import FSStorageCreateForm from '../organisms/FSStorageCreateForm'
import PageDraggableHeader from '../atoms/PageDraggableHeader'
import { mdiBookPlusMultiple } from '@mdi/js'
import PageScrollableContent from '../atoms/PageScrollableContent'
import { appIsElectron } from '../../lib/platform'
import styled from '../../lib/styled'

type StorageType = 'local' | 'fs'

interface StorageCreateFormProps {
  storageType: StorageType
}

const StorageCreateForm = ({ storageType }: StorageCreateFormProps) => {
  switch (storageType) {
    case 'fs':
      return <FSStorageCreateForm />
    case 'local':
    default:
      return <LocalStorageCreateForm />
  }
}

const StorageCreatePage = () => {
  const { t } = useTranslation()
  const [storageType, setStorageType] = useState<'local' | 'fs'>('fs')

  return (
    <PageContainer>
      <PageDraggableHeader
        iconPath={mdiBookPlusMultiple}
        label='Create Local Workspace'
      />
      <PageScrollableContent>
        <FormGroup>
          <FormLabel>{t('storage.type')}</FormLabel>
          <FormCheckList>
            {appIsElectron && (
              <FormCheckInlineItem
                id='radio-fsStorageType'
                type='radio'
                checked={storageType === 'fs'}
                onChange={() => setStorageType('fs')}
              >
                File System
              </FormCheckInlineItem>
            )}
            <FormCheckInlineItem
              id='radio-localStorageType'
              type='radio'
              checked={storageType === 'local'}
              onChange={() => setStorageType('local')}
            >
              {t('storage.typeLocal')}
            </FormCheckInlineItem>
          </FormCheckList>
        </FormGroup>

        <StorageCreateForm storageType={storageType} />
      </PageScrollableContent>
    </PageContainer>
  )
}

export default StorageCreatePage

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`
