import type { PageSection } from '@/types';

export function findSection(sections: PageSection[] | undefined, key: string): PageSection | undefined {
  return sections?.find((s) => s.key === key);
}
