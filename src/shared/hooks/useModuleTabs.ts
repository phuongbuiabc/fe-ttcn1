import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { moduleTabs } from "@/shared/config/module-tabs";

export function useModuleTabs() {
  const pathname = usePathname();

  return useMemo(() => {
    const key = Object.keys(moduleTabs).find((k) =>
      pathname.startsWith(k)
    );

    return key ? moduleTabs[key] : null;
  }, [pathname]);
}