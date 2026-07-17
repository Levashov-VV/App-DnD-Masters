import type { HeroFormData } from '../../../../features/heroes/schemas/heroSchema';

export interface Hero extends HeroFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}