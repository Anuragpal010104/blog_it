import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useCategoryStore = create(
  persist(
    (set) => ({
      categories: [],
      selectedCategory: { name: "all" },
      setCategories: (categories) =>
        set(() => ({
          categories,
        })),
      setSelectedCategory: (selectedCategory) =>
        set(() => ({
          selectedCategory,
        })),
      removeSelectedCategory: () =>
        set((state) => ({ ...state, selectedCategory: { name: "all" } })),
      reset: () =>
        set(() => ({ categories: [], selectedCategory: { name: "all" } })),
    }),
    {
      name: "category",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useCategoryStore;
