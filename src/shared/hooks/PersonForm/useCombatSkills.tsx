import { useState, useEffect } from 'react';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { HeroFormData, CombatAbility } from '../../../features/heroes/schemas/heroSchema';

export function useCombatSkills(
  setValue: UseFormSetValue<HeroFormData>,
  watch: UseFormWatch<HeroFormData>
) {
  const formCombatAbilities = watch('combatAbilities') || [];

  const [combatAbilities, setCombatAbilities] = useState<CombatAbility[]>([]);
  const [combatAbilityType, setCombatAbilityType] = useState<'equipment' | 'spell'>('equipment');
  const [selectedSpell, setSelectedSpell] = useState<CombatAbility | null>(null);
  const [editingAbility, setEditingAbility] = useState<{
    ability: CombatAbility;
    index: number;
  } | null>(null);

  const [newEquipment, setNewEquipment] = useState({ name: '', bonus: 0, damage: '' });
  const [newSpell, setNewSpell] = useState({ name: '', bonus: 0, damage: '', description: '' });

  useEffect(() => {
    setCombatAbilities(formCombatAbilities as CombatAbility[]);
  }, [JSON.stringify(formCombatAbilities)]);

  const updateAbilities = (newAbilities: CombatAbility[]) => {
    setCombatAbilities(newAbilities);
    setValue('combatAbilities', newAbilities, { shouldDirty: true });
  };

  const addEquipment = () => {
    if (newEquipment.name.trim()) {
      const newAbility: CombatAbility = {
        type: 'equipment',
        name: newEquipment.name,
        bonus: newEquipment.bonus,
        damage: newEquipment.damage,
      };
      updateAbilities([...combatAbilities, newAbility]);
      setNewEquipment({ name: '', bonus: 0, damage: '' });
    }
  };

  const addSpell = () => {
    if (newSpell.name.trim()) {
      const newAbility: CombatAbility = {
        type: 'spell',
        name: newSpell.name,
        bonus: newSpell.bonus,
        damage: newSpell.damage,
        description: newSpell.description,
      };
      updateAbilities([...combatAbilities, newAbility]);
      setNewSpell({ name: '', bonus: 0, damage: '', description: '' });
    }
  };

  const removeCombatAbility = (index: number) => {
    updateAbilities(combatAbilities.filter((_, i) => i !== index));
  };

  const saveEditedAbility = () => {
    if (editingAbility) {
      const updatedAbilities = [...combatAbilities];
      updatedAbilities[editingAbility.index] = editingAbility.ability;
      updateAbilities(updatedAbilities);
      setEditingAbility(null);
    }
  };

  return {
    combatAbilities,
    combatAbilityType,
    setCombatAbilityType,
    selectedSpell,
    setSelectedSpell,
    editingAbility,
    setEditingAbility,
    newEquipment,
    setNewEquipment,
    newSpell,
    setNewSpell,
    addEquipment,
    addSpell,
    removeCombatAbility,
    saveEditedAbility,
  };
}
