import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isLightMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isLightMode: false,
      toggleTheme: () => {
        set((state) => {
          const newIsLightMode = !state.isLightMode;
          if (newIsLightMode) {
            document.documentElement.classList.add('light');
          } else {
            document.documentElement.classList.remove('light');
          }
          return { isLightMode: newIsLightMode };
        });
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.isLightMode) {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
        }
      }
    }
  )
);
