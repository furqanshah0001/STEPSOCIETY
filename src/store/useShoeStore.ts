import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Shoe } from '../types';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface ShoeStore {
  shoes: Shoe[];
  hasSeenOnboarding: boolean;
  isLoading: boolean;
  fetchShoes: (userId: string) => Promise<void>;
  addShoe: (shoe: Omit<Shoe, 'id' | 'createdAt' | 'wearCount'>) => Promise<void>;
  updateShoe: (id: string, shoe: Partial<Shoe>) => Promise<void>;
  deleteShoe: (id: string) => Promise<void>;
  incrementWear: (id: string) => Promise<void>;
  setHasSeenOnboarding: (val: boolean) => void;
  clearShoes: () => void;
}

export const useShoeStore = create<ShoeStore>()(
  persist(
    (set, get) => ({
      shoes: [],
      hasSeenOnboarding: false,
      isLoading: false,

      fetchShoes: async (userId: string) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from('shoes')
            .select('*')
            .eq('user_id', userId)
            .order('createdAt', { ascending: false });

          if (error) {
            if (error.code === '42P01') {
              console.error('Table shoes does not exist. Please create it first.');
              toast.error('Database not set up: Missing "shoes" table. Please run the SQL migration.');
            } else {
              throw error;
            }
          } else if (data) {
            set({ shoes: data });
          }
        } catch (error: any) {
          console.error('Error fetching shoes:', error.message);
          toast.error("Could not sync your vault from the cloud.");
        } finally {
          set({ isLoading: false });
        }
      },

      addShoe: async (shoeData) => {
        const user = (await supabase.auth.getSession()).data.session?.user;
        if (!user) {
          toast.error('You must be logged in to save to vault.');
          return;
        }

        const ownerName = user.user_metadata?.username || 'Unknown';

        const newShoe = {
          ...shoeData,
          id: crypto.randomUUID(),
          wearCount: 0,
          createdAt: new Date().toISOString(),
          user_id: user.id,
          is_public: shoeData.is_public ?? false,
          owner_name: ownerName
        };

        // Optimistic update
        set((state) => ({ shoes: [newShoe, ...state.shoes] }));

        try {
          const { error } = await supabase.from('shoes').insert([newShoe]);
          if (error) throw error;
        } catch (err: any) {
          console.error(err);
          // Revert if error
          set((state) => ({ shoes: state.shoes.filter(s => s.id !== newShoe.id) }));
          toast.error("Failed to save shoe to cloud.");
        }
      },

      updateShoe: async (id, shoeData) => {
        // Optimistic update
        const previousShoes = get().shoes;
        set((state) => ({
          shoes: state.shoes.map((s) => s.id === id ? { ...s, ...shoeData } : s)
        }));

        try {
          const { error } = await supabase.from('shoes').update(shoeData).eq('id', id);
          if (error) throw error;
        } catch (err: any) {
          console.error(err);
          set({ shoes: previousShoes });
          toast.error("Failed to update shoe in cloud.");
        }
      },

      deleteShoe: async (id) => {
        const previousShoes = get().shoes;
        set((state) => ({
          shoes: state.shoes.filter((s) => s.id !== id)
        }));

        try {
          const { error } = await supabase.from('shoes').delete().eq('id', id);
          if (error) throw error;
        } catch (err: any) {
          console.error(err);
          set({ shoes: previousShoes });
          toast.error("Failed to delete shoe from cloud.");
        }
      },

      incrementWear: async (id) => {
        const shoe = get().shoes.find(s => s.id === id);
        if (!shoe) return;

        const newWearCount = shoe.wearCount + 1;

        // Optimistic update
        set((state) => ({
          shoes: state.shoes.map((s) => s.id === id ? { ...s, wearCount: newWearCount } : s)
        }));

        try {
          const { error } = await supabase.from('shoes').update({ wearCount: newWearCount }).eq('id', id);
          if (error) throw error;
        } catch (err: any) {
           console.error(err);
           set((state) => ({
             shoes: state.shoes.map((s) => s.id === id ? { ...s, wearCount: shoe.wearCount } : s)
           }));
           toast.error("Failed to sync wear count.");
        }
      },

      setHasSeenOnboarding: (val) => set({ hasSeenOnboarding: val }),

      clearShoes: () => set({ shoes: [] }),
    }),
    {
      name: 'vibecode-storage',
      // We still persist locally for speed but we'll fetch from Supabase to sync.
    }
  )
);
