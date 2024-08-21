'use client'

import { createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import {
  type ConstructProps,
  type ConstructState,
  type ConstructStore,
  createConstructStore,
} from '../stores/construct-store'

// export type ConstructStoreApi = ReturnType<typeof createConstructStore>

export const ConstructStoreContext = createContext<ConstructStore | null>(null)

type ConstructStoreProviderProps = React.PropsWithChildren<ConstructProps>

export const ConstructStoreProvider = ({ children, ...props 
}: ConstructStoreProviderProps) => {
  const storeRef = useRef<ConstructStore>()
  if (!storeRef.current) {
    storeRef.current = createConstructStore(props)
  }
  return (
    <ConstructStoreContext.Provider value={storeRef.current}>
      {children}
    </ConstructStoreContext.Provider>
  )
}

export const useConstructContext = <T,>(
  selector: (state: ConstructState) => T,
): T => {
  const constructStoreContext = useContext(ConstructStoreContext)

  if (!constructStoreContext) {
    throw new Error(`useConstructStore must be used within ConstructStoreProvider`)
  }

  return useStore(constructStoreContext, selector)
}
