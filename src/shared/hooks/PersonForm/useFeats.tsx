import { useState, useEffect } from 'react';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { HeroFormData } from '../../../features/heroes/schemas/heroSchema';
import type { Feat } from '../../../features/heroes/constants/dndData';
import { DND_FEATS } from '../../../features/heroes/constants/dndData';

export function useFeats(
  setValue: UseFormSetValue<HeroFormData>,
  watch: UseFormWatch<HeroFormData>
) {
  const formFeats = watch('feats') || [];

  const [isFeatsOpen, setIsFeatsOpen] = useState(false);
  const [selectedFeat, setSelectedFeat] = useState<Feat | null>(null);
  const [activeFeats, setActiveFeats] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeatType, setSelectedFeatType] = useState<string>('all');

  useEffect(() => {
    // activeFeats хранит nameEn — сверяемся с DND_FEATS по русскому имени, сохранённому в форме
    const activeNameEns = formFeats
      .map((feat) => DND_FEATS.find((f) => f.name === feat.name)?.nameEn)
      .filter((v): v is string => Boolean(v));
    setActiveFeats(new Set(activeNameEns));
  }, [JSON.stringify(formFeats)]);

  const updateFeats = (newSet: Set<string>) => {
    setActiveFeats(newSet);
    const featsArray = Array.from(newSet).map((featNameEn) => {
      const featData = DND_FEATS.find((f) => f.nameEn === featNameEn);
      return {
        name: featData?.name ?? featNameEn,
        description: featData?.description ?? '',
        source: '',
        prerequisite: '',
      };
    });
    setValue('feats', featsArray, { shouldDirty: true });
  };

  const toggleFeat = (featNameEn: string) => {
    const newSet = new Set(activeFeats);
    if (newSet.has(featNameEn)) {
      newSet.delete(featNameEn);
    } else {
      newSet.add(featNameEn);
    }
    updateFeats(newSet);
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

  const goBackToFeatsList = () => setSelectedFeat(null);

  const clearAllFeats = () => updateFeats(new Set());

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