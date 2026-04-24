import { modules } from '@/shared/config/module-tabs';
import type { ModuleTab, ModuleConfig } from '@/shared/config/module-tabs';

export function getPageTitle(pathname: string): string {
  let bestMatch: { tab: ModuleTab; module: ModuleConfig } | null = null;

  for (const module of modules) {
    for (const tab of module.tabs) {
      if (pathname.startsWith(tab.href)) {
        if (!bestMatch || tab.href.length > bestMatch.tab.href.length) {
          bestMatch = { tab, module };
        }
      }
    }
  }

  if (bestMatch) {
    return bestMatch.tab.title || bestMatch.tab.name;
  }

  return '';
}