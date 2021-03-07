import { useCallback, useMemo, useEffect, useRef } from 'react'
import { createStoreContext } from '../../utils/context'
import { localLiteStorage } from 'ltstrg'
import { Preferences } from './types'
import { preferencesKey } from '../../localStorageKeys'
import { useSetState } from 'react-use'

function savePreferencesToLocalStorage(preferences: Partial<Preferences>) {
  localLiteStorage.setItem(preferencesKey, JSON.stringify(preferences))
}

const basePreferences: Preferences = {
  docContextIsHidden: false,
  sidebarIsHidden: false,
  sidebarIsHovered: false,
  sideBarWidth: 250,
  lastUsedLayout: 'split',
  sidebarBookmarksAreUnfolded: false,
  workspaceManagerIsOpen: true,
}

function usePreferencesStore() {
  const [preferences, setPreferences] = useSetState<Partial<Preferences>>(
    basePreferences
  )
  const hoverOffTimeoutRef = useRef<number>()

  useEffect(() => {
    try {
      const stringifiedPreferences = localLiteStorage.getItem(preferencesKey)
      if (stringifiedPreferences == null) return
      setPreferences(JSON.parse(stringifiedPreferences))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error.message)
    }
  }, [setPreferences])

  useEffect(() => {
    savePreferencesToLocalStorage(preferences)
  }, [preferences])

  const mergedPreferences = useMemo(() => {
    return {
      ...basePreferences,
      ...preferences,
    }
  }, [preferences])

  const toggleHideSidebar = useCallback(() => {
    setPreferences({
      sidebarIsHidden: !mergedPreferences.sidebarIsHidden,
      sidebarIsHovered: false,
    })
  }, [mergedPreferences, setPreferences])

  const topBarPaddingLeft = useMemo(() => {
    if (preferences.sidebarIsHidden || preferences.sideBarWidth == null) {
      return 0
    }

    return preferences.sideBarWidth
  }, [preferences.sideBarWidth, preferences.sidebarIsHidden])

  const hoverSidebarOff = useCallback(
    (time = 100) => {
      if (hoverOffTimeoutRef.current != null) {
        clearInterval(hoverOffTimeoutRef.current)
      }

      hoverOffTimeoutRef.current = window.setTimeout(() => {
        setPreferences({ sidebarIsHovered: false })
      }, time)
    },
    [setPreferences]
  )

  const hoverSidebarOn = useCallback(() => {
    if (hoverOffTimeoutRef.current != null) {
      clearInterval(hoverOffTimeoutRef.current)
    }

    setPreferences({ sidebarIsHovered: true })
  }, [setPreferences])

  return {
    preferences: mergedPreferences,
    setPreferences,
    toggleHideSidebar,
    hoverSidebarOff,
    hoverSidebarOn,
    topBarPaddingLeft,
  }
}

export const {
  StoreProvider: PreferencesProvider,
  useStore: usePreferences,
} = createStoreContext(usePreferencesStore, 'preferences')
