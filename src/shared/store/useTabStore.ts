import { create } from "zustand";

/* ===== PIG ===== */
export type PigTab = "LIST" | "STATS" | "DETAIL";

/* ===== PEN ===== */
export type PenTab = "LIST" | "MAP" | "STATUS";

/* ===== BREED ===== */
export type BreedTab = "LIST" | "DETAIL";

interface TabState {
  pigTab: PigTab;
  penTab: PenTab;
  breedTab: BreedTab;

  setPigTab: (t: PigTab) => void;
  setPenTab: (t: PenTab) => void;
  setBreedTab: (t: BreedTab) => void;
}

export const useTabStore = create<TabState>((set) => ({
  pigTab: "LIST",
  penTab: "LIST",
  breedTab: "LIST",

  setPigTab: (t) => set({ pigTab: t }),
  setPenTab: (t) => set({ penTab: t }),
  setBreedTab: (t) => set({ breedTab: t }),
}));