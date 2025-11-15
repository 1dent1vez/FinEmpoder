import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthUser = {
  id: string;           // <- usamos `id`, no `_id`
  email: string;
  name?: string;
};

type State = {
  token: string | null;
  user: AuthUser | null;
  setAuth: (payload: { token: string; user: AuthUser }) => void;
  clearAuth: () => void;
  restoreAuth: () => void; // por compatibilidad con tu App
};

export const useAuth = create<State>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setAuth: ({ token, user }) => set({ token, user }),

      clearAuth: () => set({ token: null, user: null }),

      // si quieres algún side-effect al hidratar, lo dejamos como no-op
      restoreAuth: () => {
        const { token } = get();
        if (!token) return;
      },
    }),
    { name: 'fe_auth' }
  )
);
