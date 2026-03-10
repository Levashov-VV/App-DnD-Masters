import { useMemo } from 'react';
import spellsData from '../../../features/heroes/constants/spells.json';
import type { SpellEntry } from './useSpellLibrary';

export function useSpellById(spellId: string | null): SpellEntry | null {
  const allSpells = useMemo(() => {
    const data = spellsData as Record<string, SpellEntry[]>;
    return Object.values(data).flat();
  }, []);

  return useMemo(() => {
    if (!spellId) return null;
    return allSpells.find((spell) => spell.id === spellId) ?? null;
  }, [allSpells, spellId]);
}
