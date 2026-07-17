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
      'classes' in item &&
      'level' in item &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.race === 'string' &&
      Array.isArray((item as { classes: unknown }).classes) &&
      typeof item.level === 'number'
    );
  });
}
