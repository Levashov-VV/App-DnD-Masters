import { useState, useEffect } from 'react';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { HeroFormData } from '../../../features/heroes/schemas/heroSchema';
import type { Feat } from '../../../features/heroes/constants/dndData';

export function useFeats(
  setValue: UseFormSetValue<HeroFormData>,
  watch: UseFormWatch<HeroFormData>
) {
  const formFeats = watch('feats') || [];

  const [isFeatsOpen, setIsFeatsOpen] = useState(false);
  const [selectedFeat, setSelectedFeat] = useState<Feat | null>(null);
  const [activeFeats, setActiveFeats] = useState<Set<string>>(
    new Set(formFeats.map((feat) => feat.name))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeatType, setSelectedFeatType] = useState<string>('all');

  useEffect(() => {
    setActiveFeats(new Set(formFeats.map((feat) => feat.name)));
  }, [JSON.stringify(formFeats)]);

  useEffect(() => {
    const featsArray = Array.from(activeFeats).map((featName) => ({
      name: featName,
      description: '',
      source: '',
      prerequisite: '',
    }));
    setValue('feats', featsArray, { shouldDirty: true });
  }, [activeFeats, setValue]);

  const toggleFeat = (featNameEn: string) => {
    setActiveFeats((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(featNameEn)) {
        newSet.delete(featNameEn);
      } else {
        newSet.add(featNameEn);
      }
      return newSet;
    });
  };

  const handleFeatClick = (feat: Feat, action: 'toggle' | 'details', e: React.MouseEvent) => {
    e.stopPropagation();
    if (action === 'toggle') {
      toggleFeat(feat.nameEn);
    } else {
      setSelectedFeat(feat);
    }
  };

  const applyFeatAndClose = (featNameEn: string) => {
    toggleFeat(featNameEn);
    setSelectedFeat(null);
    setIsFeatsOpen(false);
  };

  const goBackToFeatsList = () => {
    setSelectedFeat(null);
  };

  const clearAllFeats = () => {
    setActiveFeats(new Set());
  };

  return {
    isFeatsOpen,
    setIsFeatsOpen,
    selectedFeat,
    setSelectedFeat,
    activeFeats,
    searchQuery,
    setSearchQuery,
    selectedFeatType,
    setSelectedFeatType,
    toggleFeat,
    handleFeatClick,
    applyFeatAndClose,
    goBackToFeatsList,
    clearAllFeats,
  };
}
