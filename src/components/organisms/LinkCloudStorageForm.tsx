import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  ChangeEvent,
} from 'react'
import {
  FormGroup,
  FormBlockquote,
  FormPrimaryButton,
  FormSecondaryButton,
  FormLabel,
  FormCheckItem,
  FormField,
  FormTextInput,
} from '../atoms/form'
import LoginButton from '../atoms/LoginButton'
import { usePreferences } from '../../lib/preferences'
import { useToast } from '../../lib/toast'
import { useTranslation } from 'react-i18next'
import { useEffectOnce } from 'react-use'
import { NoteStorage } from '../../lib/db/types'
import Spinner from '../atoms/Spinner'
import { useDb } from '../../lib/db'
import {
  CloudStorage,
  getStorages,
  createStorage as createCloudStorage,
} from '../../lib/accounts'

interface LinkCloudStorageFormProps {
  storage: NoteStorage
}

const LinkCloudStorageForm = ({ storage }: LinkCloudStorageFormProps) => {
  const { preferences } = usePreferences()
  const user = preferences['general.accounts'][0]
  const { t } = useTranslation()
  const { pushMessage } = useToast()
  const [folded, setFolded] = useState(true)

  const unmountRef = useRef(false)

  const [targetRemoteStorageId, setTargetRemoteStorageId] = useState<
    null | string
  >(null)
  const [remoteStorageList, setRemoteStorageList] = useState<CloudStorage[]>([])
  const [fetching, setFetching] = useState(false)
  const [usingSameName, setUsingSameName] = useState(true)
  const [cloudStorageName, setCloudStorageName] = useState(storage.name)
  const db = useDb()
  const [linking, setLinking] = useState(false)

  const targetRemoteStorage = useMemo(() => {
    for (const remoteStorage of remoteStorageList) {
      if (remoteStorage.id.toString() === targetRemoteStorageId) {
        return remoteStorage
      }
    }
    return null
  }, [remoteStorageList, targetRemoteStorageId])

  const fetchRemoteStorage = useCallback(async () => {
    if (user == null) {
      return
    }
    setFetching(true)
    setRemoteStorageList([])
    try {
      const storages = await getStorages(user)
      setRemoteStorageList(storages)
    } catch (error) {
      pushMessage({
        title: 'Cloud Error',
        description:
          'An error occured while attempting to fetch legacy cloud space list',
      })
    }

    if (unmountRef.current) {
      return
    }
    setFetching(false)
  }, [user, pushMessage])

  const openForm = useCallback(() => {
    setFolded(false)
    fetchRemoteStorage()
  }, [fetchRemoteStorage])

  const closeForm = useCallback(() => {
    setFolded(true)
  }, [])

  useEffectOnce(() => {
    return () => {
      unmountRef.current = true
    }
  })

  const linkStorage = useCallback(async () => {
    setLinking(true)
    try {
      const cloudStorage =
        targetRemoteStorage == null
          ? await createCloudStorage(
              usingSameName ? storage.name : cloudStorageName,
              user
            )
          : targetRemoteStorage
      if (cloudStorage === 'SubscriptionRequired') {
        setLinking(false)
        pushMessage({
          title: 'Subscription Required',
          description:
            'Please update subscription to create more legacy cloud space.',
        })
        return
      }
      db.linkStorage(storage.id, {
        id: cloudStorage.id,
        name: cloudStorage.name,
        size: cloudStorage.size,
        syncedAt: Date.now(),
      })
      db.syncStorage(storage.id)
    } catch (error) {
      pushMessage({
        title: 'Error',
        description: error.toString(),
      })
    }

    setLinking(false)
  }, [
    pushMessage,
    db,
    cloudStorageName,
    usingSameName,
    storage.id,
    storage.name,
    user,
    targetRemoteStorage,
  ])

  if (user == null) {
    return (
      <>
        <LoginButton
          onErr={() => {
            pushMessage({
              title: 'Cloud Error',
              description:
                'An error occured while attempting to create a legacy cloud space',
            })
          }}
          ButtonComponent={FormPrimaryButton}
        />
        <FormBlockquote>{t('storage.needSignIn')}</FormBlockquote>
      </>
    )
  }

  if (folded) {
    return (
      <>
        <FormBlockquote>
          This space has not been linked to any legacy cloud space.
        </FormBlockquote>
        <FormGroup>
          <FormPrimaryButton onClick={openForm}>
            Link to legacy cloud space
          </FormPrimaryButton>
        </FormGroup>
      </>
    )
  }

  return (
    <>
      <FormGroup>
        <FormLabel>Legacy cloud space to link</FormLabel>
        <FormCheckItem
          id='radio-remote-storage-new'
          type='radio'
          checked={targetRemoteStorage == null}
          onChange={(event) => {
            if (event.target.checked) {
              setTargetRemoteStorageId(null)
            }
          }}
        >
          New Legacy Cloud Space
        </FormCheckItem>
      </FormGroup>
      <FormGroup>
        <FormField>
          <FormGroup>
            <FormCheckItem
              id='checkbox-remote-storage-new'
              type='checkbox'
              checked={usingSameName}
              onChange={(event) => {
                setUsingSameName(event.target.checked)
              }}
              disabled={targetRemoteStorage != null}
            >
              Use same name of the space in this device
            </FormCheckItem>
          </FormGroup>
          <FormGroup>
            <FormLabel>Space name in the legacy cloud</FormLabel>
            <FormTextInput
              disabled={targetRemoteStorage != null || usingSameName}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setCloudStorageName(event.target.value)
              }}
              value={usingSameName ? storage.name : cloudStorageName}
            />
          </FormGroup>
        </FormField>
      </FormGroup>
      <FormGroup>
        <hr />
        {!fetching && remoteStorageList.length === 0 && (
          <p>No space has been fetched. Click refresh button to try again.</p>
        )}
        {remoteStorageList.map((cloudStorage) => {
          const cloudStorageId = cloudStorage.id.toString()
          const id = `radio-remote-storage-${cloudStorageId}`
          return (
            <FormCheckItem
              id={id}
              key={id}
              type='radio'
              checked={targetRemoteStorageId === cloudStorageId}
              onChange={(event) => {
                if (event.target.checked) {
                  setTargetRemoteStorageId(cloudStorageId)
                }
              }}
            >
              {cloudStorage.name} (id: {cloudStorage.id})
            </FormCheckItem>
          )
        })}
      </FormGroup>
      {fetching && (
        <FormGroup>
          <Spinner /> Fetching spaces in the legacy cloud...
        </FormGroup>
      )}

      <FormGroup>
        <FormSecondaryButton onClick={fetchRemoteStorage} disabled={fetching}>
          Refresh spaces in the legacy cloud
        </FormSecondaryButton>
      </FormGroup>

      {targetRemoteStorage != null && (
        <FormBlockquote>
          <strong>CAUTION!</strong> Your local space will be merged into the
          legacy cloud storage. <strong>THIS ACTION IS NOT REVERTIBLE.</strong>{' '}
          We are highly recommending to create a new local space from the
          existing legacy cloud space to prevent merging the space into wrong
          one.
        </FormBlockquote>
      )}
      <FormGroup>
        <FormPrimaryButton onClick={linkStorage} disabled={linking}>
          {linking ? 'Linking...' : 'Link to the legacy cloud space'}
        </FormPrimaryButton>
        <FormSecondaryButton onClick={closeForm} disabled={linking}>
          Cancel
        </FormSecondaryButton>
      </FormGroup>
    </>
  )
}

export default LinkCloudStorageForm
