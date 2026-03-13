import { useState, useEffect } from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { HeroFormData } from '../../../../../../features/heroes/schemas/heroSchema';
import { TextareaWithFontControl } from './ui/TextareaFontControl';
import { useCombatSkills } from '../../../../../../shared/hooks/PersonForm/useCombatSkills';
import { useFeats } from '../../../../../../shared/hooks/PersonForm/useFeats';
import { useProficiencies } from '../../../../../../shared/hooks/PersonForm/useProficiencies';
import { useFilteredFeats } from '../../../../../../shared/utils/fearFilters';
import { CombatSkillsSection } from '../../../components/Mobile/HeroForm/ui/FormStep3/CombatSkillsSection';
import { FeatsSection } from '../../../components/Mobile/HeroForm/ui/FormStep3/FeatsSection';
import { ProficienciesSection } from '../../../components/Mobile/HeroForm/ui/FormStep3/ProficienciesSection';
import { FeatsModal } from '../../../components/Mobile/HeroForm/ui/FormStep3/FeatsModal';

interface FormStep3SkillsProps {
  register: UseFormRegister<HeroFormData>;
  errors: FieldErrors<HeroFormData>;
  watch: UseFormWatch<HeroFormData>;
  setValue: UseFormSetValue<HeroFormData>;
}

export function FormStep3Skills({ watch, setValue }: FormStep3SkillsProps) {
  const formClassFeatures = watch('classFeatures') || '';
  const formRaceFeatures = watch('raceFeatures') || '';
  const [classFeatures, setClassFeatures] = useState(formClassFeatures);
  const [raceFeatures, setRaceFeatures] = useState(formRaceFeatures);
  const combatSkillsData = useCombatSkills(setValue, watch);
  const featsData = useFeats(setValue, watch);
  const proficiencies = useProficiencies(setValue, watch);

  // Фильтрация черт
  const filteredFeats = useFilteredFeats(
    featsData.searchQuery,
    featsData.selectedFeatType,
    featsData.activeFeats
  );

  useEffect(() => {
    setValue('classFeatures', classFeatures, { shouldDirty: true });
  }, [classFeatures, setValue]);

  useEffect(() => {
    setValue('raceFeatures', raceFeatures, { shouldDirty: true });
  }, [raceFeatures, setValue]);

  useEffect(() => {
    setClassFeatures(formClassFeatures);
  }, [formClassFeatures]);

  useEffect(() => {
    setRaceFeatures(formRaceFeatures);
  }, [formRaceFeatures]);

  return (
    <>
      <div
        style={{ padding: '0 0.5vw' }}
        className="relative left-[0.5vw] top-[1vh] w-[98vw] flex flex-col gap-[1vh] uppercase"
      >
        <h2 className="text-[2.5vh] text-center font-bold text-amber-100">Умения и владения</h2>

        <div className="grid grid-cols-2 gap-[2vw]">
          {/* КЛАССОВЫЕ УМЕНИЯ */}
          <div className="col-span-1 border-2 border-amber-600 bg-stone-800 rounded-lg">
            <TextareaWithFontControl
              label="Классовые умения"
              value={classFeatures}
              onChange={(e) => setClassFeatures(e.target.value)}
              placeholder="Введите классовые умения персонажа...

Можно указать несколько умений, каждое с новой строки или через запятую."
              style={{ paddingLeft: '0.2vw' }}
              className="border-2 border-amber-600 h-[12vh]"
              defaultFontSize={14}
              minFontSize={10}
              maxFontSize={24}
            />
          </div>

          {/* РАСОВЫЕ УМЕНИЯ */}
          <div className="col-span-1 border-2 border-amber-600 bg-stone-800 rounded-lg">
            <TextareaWithFontControl
              label="Расовые умения"
              value={raceFeatures}
              onChange={(e) => setRaceFeatures(e.target.value)}
              placeholder="Введите расовые умения персонажа...

Можно указать несколько умений, каждое с новой строки или через запятую."
              style={{ paddingLeft: '0.2vw' }}
              className="border-2 border-amber-600 h-[12vh]"
              defaultFontSize={14}
              minFontSize={10}
              maxFontSize={24}
            />
          </div>
        </div>

        <div className="h-[30vh] flex gap-[2vw]">
          {/* БОЕВЫЕ СПОСОБНОСТИ */}
          <CombatSkillsSection
            combatAbilityType={combatSkillsData.combatAbilityType}
            setCombatAbilityType={combatSkillsData.setCombatAbilityType}
            combatSkills={combatSkillsData.combatAbilities}
            newEquipment={combatSkillsData.newEquipment}
            setNewEquipment={combatSkillsData.setNewEquipment}
            newSpell={combatSkillsData.newSpell}
            setNewSpell={combatSkillsData.setNewSpell}
            addEquipment={combatSkillsData.addEquipment}
            addSpell={combatSkillsData.addSpell}
            removeCombatAbility={combatSkillsData.removeCombatAbility}
            setEditingAbility={combatSkillsData.setEditingAbility}
            setSelectedSpell={combatSkillsData.setSelectedSpell}
            selectedSpell={combatSkillsData.selectedSpell}
            editingAbility={combatSkillsData.editingAbility}
            saveEditedAbility={combatSkillsData.saveEditedAbility}
          />

          {/* ЧЕРТЫ */}
          <FeatsSection
            activeFeats={featsData.activeFeats}
            setIsFeatsOpen={featsData.setIsFeatsOpen}
            clearAllFeats={featsData.clearAllFeats}
            toggleFeat={featsData.toggleFeat}
            setSelectedFeat={featsData.setSelectedFeat}
          />
        </div>
      </div>

      {/* ВЛАДЕНИЕ СНАРЯЖЕНИЕМ */}
      <div style={{ marginTop: '2vh' }}>
        <ProficienciesSection {...proficiencies} />
      </div>

      {/* МОДАЛЬНОЕ ОКНО ЧЕРТ */}
      <FeatsModal
        isFeatsOpen={featsData.isFeatsOpen}
        setIsFeatsOpen={featsData.setIsFeatsOpen}
        selectedFeat={featsData.selectedFeat}
        setSelectedFeat={featsData.setSelectedFeat}
        activeFeats={featsData.activeFeats}
        searchQuery={featsData.searchQuery}
        setSearchQuery={featsData.setSearchQuery}
        selectedFeatType={featsData.selectedFeatType}
        setSelectedFeatType={featsData.setSelectedFeatType}
        filteredFeats={filteredFeats}
        handleFeatClick={featsData.handleFeatClick}
        applyFeatAndClose={featsData.applyFeatAndClose}
        goBackToFeatsList={featsData.goBackToFeatsList}
      />
    </>
  );
}
