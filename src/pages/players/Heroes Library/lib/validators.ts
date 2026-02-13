// features/heroes/lib/validators.ts
import type { Hero } from '../types/hero';

export function validateHeroesArray(value: unknown): Hero[] {
  if (!Array.isArray(value)) {
    console.warn('Heroes data is not an array, returning empty array');
    return [];
  }

  return value.filter((item): item is Hero => {
    return (
      typeof item === 'object' &&
      item !== null &&
      'id' in item &&
      'name' in item &&
      'race' in item &&
      'class' in item &&
      'level' in item &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.race === 'string' &&
      typeof item.class === 'string' &&
      typeof item.level === 'number'
    );
  });
}
