import { createStore } from "zustand/vanilla";
import { type StoreImage } from "./image";
export interface ImageProps {
  images: StoreImage[];
}

export interface ImageState extends ImageProps {
  addImage: (image: StoreImage) => void;
  removeImage: (id: string) => void;
}

export type ImageStore = ReturnType<typeof createImageStore>;

export const createImageStore = (initState?: Partial<ImageState>) => {
  const DEFAULT_PROPS: ImageProps = {
    images: [],
  };
  return createStore<ImageState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initState,
    addImage: (newImage: StoreImage) =>
      set((state) => ({
        images: [...state.images, newImage],
      })),
    removeImage: (id: string) =>
      set((state) => ({
        images: state.images.filter((image) => image.id !== id),
      })),
  }));
};
