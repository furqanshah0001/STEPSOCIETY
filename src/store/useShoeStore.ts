import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Shoe } from '../types';

interface ShoeStore {
  shoes: Shoe[];
  hasSeenOnboarding: boolean;
  addShoe: (shoe: Omit<Shoe, 'id' | 'createdAt' | 'wearCount'>) => void;
  updateShoe: (id: string, shoe: Partial<Shoe>) => void;
  deleteShoe: (id: string) => void;
  incrementWear: (id: string) => void;
  setHasSeenOnboarding: (val: boolean) => void;
}

export const useShoeStore = create<ShoeStore>()(
  persist(
    (set) => ({
      shoes: [],
      hasSeenOnboarding: false,
      addShoe: (shoeData) => set((state) => ({
        shoes: [
          ...state.shoes,
          {
            ...shoeData,
            id: crypto.randomUUID(),
            wearCount: 0,
            createdAt: new Date().toISOString(),
          }
        ]
      })),
      updateShoe: (id, shoeData) => set((state) => ({
        shoes: state.shoes.map((s) => s.id === id ? { ...s, ...shoeData } : s)
      })),
      deleteShoe: (id) => set((state) => ({
        shoes: state.shoes.filter((s) => s.id !== id)
      })),
      incrementWear: (id) => set((state) => ({
        shoes: state.shoes.map((s) => s.id === id ? { ...s, wearCount: s.wearCount + 1 } : s)
      })),
      setHasSeenOnboarding: (val) => set({ hasSeenOnboarding: val })
    }),
    {
      name: 'vibecode-storage',
    }
  )
);
