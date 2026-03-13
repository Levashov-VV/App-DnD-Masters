import charactersData from '@/shared/data/charactersPerson.json';
import type { CreatureSide } from '../../../pages/masters/Battlefield/ui/Form/types';

type Character = {
  id: number;
  side: CreatureSide;
  code: string;
  name: string;
  img: string;
  logo: string;
};

export function useCharacter() {
  return { data: charactersData as Character[], loading: false };
}
