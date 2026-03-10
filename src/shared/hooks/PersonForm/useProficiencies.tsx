import { useState, useEffect } from 'react';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { HeroFormData } from '../../../features/heroes/schemas/heroSchema';

export function useProficiencies(
  setValue: UseFormSetValue<HeroFormData>,
  watch: UseFormWatch<HeroFormData>
) {
  const formWeaponProficiencies = watch('weaponProficiencies') || [];
  const formArmorProficiencies = watch('armorProficiencies') || [];
  const formToolProficiencies = watch('toolProficiencies') || [];

  const [weaponProficiencies, setWeaponProficiencies] = useState<string[]>([]);
  const [armorProficiencies, setArmorProficiencies] = useState<string[]>([]);
  const [toolProficiencies, setToolProficiencies] = useState<string[]>([]);
  const [newToolName, setNewToolName] = useState('');

  useEffect(() => {
    setWeaponProficiencies(formWeaponProficiencies);
  }, [JSON.stringify(formWeaponProficiencies)]);

  useEffect(() => {
    setArmorProficiencies(formArmorProficiencies);
  }, [JSON.stringify(formArmorProficiencies)]);

  useEffect(() => {
    setToolProficiencies(formToolProficiencies);
  }, [JSON.stringify(formToolProficiencies)]);

  const toggleProficiency = (type: 'weapon' | 'armor' | 'tool', value: string) => {
    if (type === 'weapon') {
      const updated = weaponProficiencies.includes(value)
        ? weaponProficiencies.filter((i) => i !== value)
        : [...weaponProficiencies, value];
      setWeaponProficiencies(updated);
      setValue('weaponProficiencies', updated, { shouldDirty: true });
    } else if (type === 'armor') {
      const updated = armorProficiencies.includes(value)
        ? armorProficiencies.filter((i) => i !== value)
        : [...armorProficiencies, value];
      setArmorProficiencies(updated);
      setValue('armorProficiencies', updated, { shouldDirty: true });
    } else {
      const updated = toolProficiencies.includes(value)
        ? toolProficiencies.filter((i) => i !== value)
        : [...toolProficiencies, value];
      setToolProficiencies(updated);
      setValue('toolProficiencies', updated, { shouldDirty: true });
    }
  };

  const addTool = () => {
    if (newToolName.trim() && !toolProficiencies.includes(newToolName.trim())) {
      const updated = [...toolProficiencies, newToolName.trim()];
      setToolProficiencies(updated);
      setValue('toolProficiencies', updated, { shouldDirty: true });
      setNewToolName('');
    }
  };

  const removeTool = (tool: string) => {
    const updated = toolProficiencies.filter((item) => item !== tool);
    setToolProficiencies(updated);
    setValue('toolProficiencies', updated, { shouldDirty: true });
  };

  const handleToolInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTool();
    }
  };

  return {
    weaponProficiencies,
    armorProficiencies,
    toolProficiencies,
    newToolName,
    setNewToolName,
    toggleProficiency,
    addTool,
    removeTool,
    handleToolInputKeyPress,
  };
}
