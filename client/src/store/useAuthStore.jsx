import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      setLoggedIn: (isLoggedIn) => set(() => ({ isLoggedIn })),
      setUser: (user) => set(() => ({ user })),
      signOut: () => set(() => ({ user: null, isLoggedIn: false })),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;
