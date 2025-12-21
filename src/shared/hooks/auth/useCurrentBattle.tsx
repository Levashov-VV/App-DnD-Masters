import { useWatch, useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import type { BattleFormData } from '../../../pages/masters/Battlefield/ui/Form/types';

const BATTLE_KEY = 'dnd-current-battle';

export function useCurrentBattle() {
  const { setValue } = useFormContext<BattleFormData>();
  const battleData = useWatch() as BattleFormData;

  useEffect(() => {
    const saved = sessionStorage.getItem('dnd-current-battle');
    if (saved) {
      const data = JSON.parse(saved) as BattleFormData;
      setValue('users', data.users);
      setValue('enemies', data.enemies);
      setValue('mapId', data.mapId);
      setValue('customMapImage', data.customMapImage || '');
    }
  }, [setValue]);

  useEffect(() => {
    if (battleData) {
      sessionStorage.setItem(BATTLE_KEY, JSON.stringify(battleData));
    }
  }, [battleData]);

  return {
    battleData: battleData || {
      users: [],
      enemies: [],
      mapId: 1,
      gridSize: 15,
      customMapImage: '',
    },
  };
}
