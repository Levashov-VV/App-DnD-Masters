import { useForm, FormProvider } from 'react-hook-form';
import { useState } from 'react';
import { NavigationHeader } from './Navigation/NavigationHeader';
import { PersonSection } from './PersonSection/PersonSection';
import { BattleMapSection } from './BattleMapSection/BattleMapSection';
import { SubmitSection } from './SubmitSection/SubmitSection';
import { WindowsTeamLS } from './PersonSection/WindowTeamLS';
import { useSavedTeams } from '../../../../../shared/hooks/auth/useSavedTeams';
import { useCurrentBattle } from '../../../../../shared/hooks/auth/useCurrentBattle';
import type { BattleFormData } from './types';

function CurrentBattleProvider() {
  useCurrentBattle();
  return null;
}

export function Forms() {
  const methods = useForm<BattleFormData>({
    defaultValues: {
      users: [],
      enemies: [],
      mapId: 1,
      gridSize: 30,
      gridWidth: 30,
      gridHeight: 30,
      customMapImage: '',
    },
  });

  const [stepForm, setStepForm] = useState(0);
  const { saveCurrentTeam, loadTeam, deleteTeam, teams } = useSavedTeams();

  const onSubmit = (data: BattleFormData) => {
    console.log('Form data:', data);
  };

  return (
    <FormProvider {...methods}>
      <CurrentBattleProvider />
      <WindowsTeamLS
        teams={teams}
        onLoadTeam={loadTeam}
        onSaveCurrent={saveCurrentTeam}
        onDeleteTeam={deleteTeam}
      />

      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col justify-start items-center relative top-[5vh] w-[80vw] h-[80vh] bg-neutral-700 p-8 rounded-3xl shadow-2xl"
      >
        <NavigationHeader stepForm={stepForm} setStepForm={setStepForm} />

        <div className="flex-1 w-full relative top-[8vh]">
          <div className={stepForm === 0 ? 'block' : 'hidden'}>
            <PersonSection />
          </div>

          <div className={stepForm === 1 ? 'block' : 'hidden'}>
            <BattleMapSection />
          </div>

          <div className={stepForm === 2 ? 'block' : 'hidden'}>
            <SubmitSection />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
