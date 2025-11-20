"use client";

import { createContext, useRef, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useStore } from "zustand";

import {
  type ImageState,
  type ImageStore,
  createImageStore,
} from "../stores/image-store";
import { mapFromApi } from "@chronistic/stores/image";
import { api } from "@chronistic/utils/api";

export const ImageStoreContext = createContext<ImageStore | null>(null);

export interface ImageStoreProviderProps {
  children: ReactNode;
}

export const ImageStoreProvider = ({ children }: ImageStoreProviderProps) => {
  const storeRef = useRef<ImageStore | null>(null);
  const { data: images } = api.image.getByUser.useQuery();

  if (!storeRef.current) {
    storeRef.current = createImageStore();
  }
  useEffect(() => {
    if (images && storeRef.current) {
      const mappedImages = images.map((image) => mapFromApi(image));
      storeRef.current.setState({ images: mappedImages });
    }
  }, [images]);

  return (
    <ImageStoreContext.Provider value={storeRef.current}>
      {children}
    </ImageStoreContext.Provider>
  );
};

export const useImageContext = <T,>(selector: (state: ImageState) => T): T => {
  const imageStoreContext = useContext(ImageStoreContext);

  if (!imageStoreContext) {
    throw new Error(`useImageStore must be used within ImageStoreProvider`);
  }

  return useStore(imageStoreContext, selector);
};
