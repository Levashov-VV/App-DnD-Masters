import { useState, useEffect, useRef } from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { HeroFormData } from '../../../../../../features/heroes/schemas/heroSchema';
import { TextareaWithFontControl } from './ui/TextareaFontControl';
import { useTeamMembers } from '../../../../../../shared/hooks/PersonForm/useTeamMembers';
import { TeamMemberCard } from './ui/FormStep4/TeamMemberCard';
import { TeamMemberModal } from './ui/FormStep4/TeamMemberModal';

interface FormStep4TeamAndCampaignInfoProps {
  register: UseFormRegister<HeroFormData>;
  errors: FieldErrors<HeroFormData>;
  watch: UseFormWatch<HeroFormData>;
  setValue: UseFormSetValue<HeroFormData>;
}

export function FormStep4TeamAndCampaignInfo({
  watch,
  setValue,
}: FormStep4TeamAndCampaignInfoProps) {
  const formBackstory = watch('backstory') || '';
  const formAppearance = watch('appearance') || '';
  const formAdditionalFeatures = watch('additionalFeatures') || '';
  const formCampaignGoals = watch('campaignGoals') || '';

  const [backstory, setBackstory] = useState(formBackstory);
  const [appearance, setAppearance] = useState(formAppearance);
  const [additionalFeatures, setAdditionalFeatures] = useState(formAdditionalFeatures);
  const [campaignGoals, setCampaignGoals] = useState(formCampaignGoals);

  // Хук для управления командой
  const teamMembersData = useTeamMembers(setValue, watch);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setValue('backstory', backstory, { shouldDirty: true });
  }, [backstory, setValue]);

  useEffect(() => {
    setValue('appearance', appearance, { shouldDirty: true });
  }, [appearance, setValue]);

  useEffect(() => {
    setValue('additionalFeatures', additionalFeatures, { shouldDirty: true });
  }, [additionalFeatures, setValue]);

  useEffect(() => {
    setValue('campaignGoals', campaignGoals, { shouldDirty: true });
  }, [campaignGoals, setValue]);

  useEffect(() => {
    setBackstory(formBackstory);
  }, [formBackstory]);

  useEffect(() => {
    setAppearance(formAppearance);
  }, [formAppearance]);

  useEffect(() => {
    setAdditionalFeatures(formAdditionalFeatures);
  }, [formAdditionalFeatures]);

  useEffect(() => {
    setCampaignGoals(formCampaignGoals);
  }, [formCampaignGoals]);

  return (
    <>
      <div className="relative left-[0.5vw] top-[1vh] w-[74vw] flex flex-col gap-[1vh] uppercase max-h-[63vh]">
        <h2 className="text-[2.5vh] font-bold text-amber-100">Информация о кампании и команде</h2>

        {/* Секция команды */}
        <div className="border-2 border-amber-600 bg-stone-800 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 style={{ marginLeft: '0.5vw' }} className="text-[2vh] font-bold text-amber-100">
              Члены команды
            </h3>
            <button
              type="button"
              onClick={teamMembersData.addTeamMember}
              style={{ padding: '0.5vh 0.5vw', margin: '0.5vh 0.5vw' }}
              className="bg-amber-600 hover:bg-amber-500 text-stone-900 rounded-lg text-[1.4vh] font-bold transition-colors flex items-center gap-[0.3vw]"
            >
              <svg
                className="w-[1.5vh] h-[1.5vh]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Добавить члена команды
            </button>
          </div>

          {/* Контейнер с горизонтальным скроллом */}
          <div className="relative">
            {teamMembersData.teamMembers.length > 0 && (
              <button
                type="button"
                onClick={scrollLeft}
                className="absolute left-[0.5vw] top-1/2 -translate-y-1/2 z-10 w-[3vh] h-[3vh] bg-amber-600 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors shadow-lg"
                title="Прокрутить влево"
              >
                <svg
                  className="w-[1.5vh] h-[1.5vh] text-stone-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Список членов команды */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto overflow-y-hidden gap-[1vw] px-[3vw] py-[1vh] scroll-smooth"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#d97706 #1c1917',
              }}
            >
              {teamMembersData.teamMembers.length === 0 ? (
                <div className="w-full text-center text-amber-100/50 text-[1.5vh] py-[2vh]">
                  Нет членов команды. Нажмите "Добавить члена команды" чтобы создать.
                </div>
              ) : (
                teamMembersData.teamMembers.map((member, index) => (
                  <div key={member.id} className="flex-shrink-0">
                    <TeamMemberCard
                      member={member}
                      onEdit={() => teamMembersData.editTeamMember(member, index)}
                      onRemove={() => teamMembersData.removeTeamMember(index)}
                    />
                  </div>
                ))
              )}
            </div>

            {teamMembersData.teamMembers.length > 0 && (
              <button
                type="button"
                onClick={scrollRight}
                className="absolute right-[0.5vw] top-1/2 -translate-y-1/2 z-10 w-[3vh] h-[3vh] bg-amber-600 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors shadow-lg"
                title="Прокрутить вправо"
              >
                <svg
                  className="w-[1.5vh] h-[1.5vh] text-stone-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[2vw]">
          <div className="h-[16.5vh] col-span-2 border-2 border-amber-600 bg-stone-800 rounded-lg">
            <TextareaWithFontControl
              label="Предыстория"
              value={backstory}
              onChange={(e) => setBackstory(e.target.value)}
              placeholder="Введите предысторию персонажа..."
              style={{ paddingLeft: '0.2vw' }}
              className="border-2 border-amber-600 h-[13vh]"
              defaultFontSize={14}
              minFontSize={10}
              maxFontSize={24}
            />
          </div>

          <div className="h-[16.5vh] col-span-1 border-2 border-amber-600 bg-stone-800 rounded-lg">
            <TextareaWithFontControl
              label="Внешность"
              value={appearance}
              onChange={(e) => setAppearance(e.target.value)}
              placeholder="Опишите внешность персонажа..."
              style={{ paddingLeft: '0.2vw' }}
              className="border-2 border-amber-600 h-[13vh]"
              defaultFontSize={14}
              minFontSize={10}
              maxFontSize={24}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[2vw]">
          <div className="h-[14.5vh] col-span-2 border-2 border-amber-600 bg-stone-800 rounded-lg">
            <TextareaWithFontControl
              label="Дополнительные особенности персонажа"
              value={additionalFeatures}
              onChange={(e) => setAdditionalFeatures(e.target.value)}
              placeholder="Введите дополнительные особенности персонажа..."
              style={{ paddingLeft: '0.2vw' }}
              className="border-2 border-amber-600 h-[11vh]"
              defaultFontSize={14}
              minFontSize={10}
              maxFontSize={24}
            />
          </div>

          <div className="h-[14.5vh] col-span-1 border-2 border-amber-600 bg-stone-800 rounded-lg">
            <TextareaWithFontControl
              label="Цели и задачи кампании"
              value={campaignGoals}
              onChange={(e) => setCampaignGoals(e.target.value)}
              placeholder="Опишите какие цели и задачи стоят за вашей командой..."
              style={{ paddingLeft: '0.2vw' }}
              className="border-2 border-amber-600 h-[11vh]"
              defaultFontSize={14}
              minFontSize={10}
              maxFontSize={24}
            />
          </div>
        </div>
      </div>

      {/* Модальное окно */}
      {teamMembersData.isModalOpen && teamMembersData.selectedMember && (
        <TeamMemberModal
          member={teamMembersData.selectedMember}
          onSave={teamMembersData.saveTeamMember}
          onClose={teamMembersData.closeModal}
        />
      )}
    </>
  );
}
