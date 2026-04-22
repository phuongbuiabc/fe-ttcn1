import { create } from "zustand";

export type TabItem = {
  name: string;
  href?: string;
  icon?: any;
};

type ModuleStore = {
  activeModule: string;
  tabs: TabItem[];

  setModule: (module: string, tabs: TabItem[]) => void;
};

export const useModuleStore = create<ModuleStore>((set) => ({
  activeModule: "dashboard",
  tabs: [],

  setModule: (module, tabs) =>
    set({
      activeModule: module,
      tabs,
    }),
}));