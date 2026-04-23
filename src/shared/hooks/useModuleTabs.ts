import { usePathname } from "next/navigation";
import { modules } from "@/shared/config/module-tabs";

export function useModuleTabs() {
  const pathname = usePathname();

  const currentModule = modules.find(
    (m) =>
      pathname === m.basePath ||
      pathname.startsWith(m.basePath + "/")
  );

  const currentTab = currentModule?.tabs.find(
    (t) =>
      pathname === t.href ||
      pathname.startsWith(t.href + "/")
  );

  return {
    module: currentModule,
    tabs: currentModule?.tabs || [],
    currentTab,
    title: currentTab?.title || currentModule?.name || "Dashboard",
  };
}