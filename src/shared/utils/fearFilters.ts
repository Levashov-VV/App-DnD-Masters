import { useMemo } from 'react';
import { DND_FEATS } from '../../features/heroes/constants/dndData';

export function useFilteredFeats(
  searchQuery: string,
  selectedFeatType: string,
  activeFeats: Set<string>
) {
  return useMemo(() => {
    return DND_FEATS.filter((feat) => {
      const matchesSearch =
        feat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feat.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedFeatType === 'all' || feat.type === selectedFeatType;

      return matchesSearch && matchesType;
    }).sort((a, b) => {
      const aIsActive = activeFeats.has(a.nameEn);
      const bIsActive = activeFeats.has(b.nameEn);

      if (aIsActive !== bIsActive) {
        return aIsActive ? -1 : 1;
      }
      if (a.type && b.type && a.type !== b.type) {
        return a.type.localeCompare(b.type);
      }

      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedFeatType, activeFeats]);
}
