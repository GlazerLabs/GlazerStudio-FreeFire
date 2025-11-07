'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const VALID_EMAIL = 'Esports@glazer.studio';
const VALID_PASSWORD = 'GlazerAdmin@2025';

const useAuthStore = create(
  persist(
    (set) => ({
      authFlag: 0,       // 0 = logged out, 1 = logged in
      email: '',
      error: '',
      login: (email, password) => {
        if (email === VALID_EMAIL && password === VALID_PASSWORD) {
          set({ authFlag: 1, email, error: '' });
          return true;
        }
        set({ authFlag: 0, email: '', error: 'Invalid email or password' });
        return false;
      },
      logout: () => set({ authFlag: 0, email: '', error: '' }),
      clearError: () => set({ error: '' }),
    }),
    {
      name: 'gs-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;