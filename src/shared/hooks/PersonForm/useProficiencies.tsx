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

  const [weaponProficiencies, setWeaponProficiencies] = useState<string[]>(formWeaponProficiencies);
  const [armorProficiencies, setArmorProficiencies] = useState<string[]>(formArmorProficiencies);
  const [toolProficiencies, setToolProficiencies] = useState<string[]>(formToolProficiencies);
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
    let current: string[];
    let setter: (val: string[]) => void;
    let fieldName: 'weaponProficiencies' | 'armorProficiencies' | 'toolProficiencies';

    if (type === 'weapon') {
      current = weaponProficiencies;
      setter = setWeaponProficiencies;
      fieldName = 'weaponProficiencies';
    } else if (type === 'armor') {
      current = armorProficiencies;
      setter = setArmorProficiencies;
      fieldName = 'armorProficiencies';
    } else {
      current = toolProficiencies;
      setter = setToolProficiencies;
      fieldName = 'toolProficiencies';
    }

    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    setter(updated);
    setValue(fieldName, updated, { shouldDirty: true });
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
