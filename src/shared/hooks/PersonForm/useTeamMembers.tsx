import { useState, useEffect } from 'react';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { HeroFormData, TeamMember } from '../../../features/heroes/schemas/heroSchema';

export function useTeamMembers(
  setValue: UseFormSetValue<HeroFormData>,
  watch: UseFormWatch<HeroFormData>
) {
  const formTeamMembers = watch('teamMembers') || [];
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(formTeamMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (formTeamMembers.length > 0 || teamMembers.length === 0) {
      setTeamMembers(formTeamMembers);
    }
  }, [JSON.stringify(formTeamMembers)]);

  useEffect(() => {
    setValue('teamMembers', teamMembers, { shouldDirty: true });
  }, [teamMembers, setValue]);

  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: '',
      race: '',
      class: '',
      subclass: '',
      level: 1,
      customAvatar: '',
      notes: '',
    };
    setSelectedMember(newMember);
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const editTeamMember = (member: TeamMember, index: number) => {
    setSelectedMember(member);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const saveTeamMember = (member: TeamMember) => {
    let updated: TeamMember[];
    
    if (editingIndex !== null) {
      updated = [...teamMembers];
      updated[editingIndex] = member;
    } else {
      updated = [...teamMembers, member];
    }
    
    setTeamMembers(updated);
    setValue('teamMembers', updated, { shouldDirty: true }); // ДОБАВЛЕНО: прямое сохранение в форму
    setIsModalOpen(false);
    setSelectedMember(null);
    setEditingIndex(null);
  };

  const removeTeamMember = (index: number) => {
    const updated = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(updated);
    setValue('teamMembers', updated, { shouldDirty: true });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    setEditingIndex(null);
  };

  return {
    teamMembers,
    isModalOpen,
    selectedMember,
    addTeamMember,
    editTeamMember,
    saveTeamMember,
    removeTeamMember,
    closeModal,
  };
}
