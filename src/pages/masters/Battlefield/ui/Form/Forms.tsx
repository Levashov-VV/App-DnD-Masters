import { useForm, FormProvider } from 'react-hook-form';
import { useState } from 'react';
import { Activity } from 'react';
import { NavigationHeader } from './Navigation/NavigationHeader';
import { PersonSection } from './PersonSection/PersonSection';

type User = {
  id: number;
  name: string;
  img: string;
  logo: string;
  initiative: number;
  hp: number;
  size: string;
};

interface BattleFormData {
  characters: User[];
  enemies: User[];
  mapId: number;
  gridWidth: number;
  gridHeight: number;
}

const maps = [
  { title: 'Подземелье', id: 1, img: '/img/masters/Battlefield/Map/Dungeon.jpg' },
  { title: 'Городская площадь', id: 2, img: '/img/masters/Battlefield/Map/CitySquare.jpg' },
  { title: 'Болото', id: 3, img: '/img/masters/Battlefield/Map/Swamp.jpg' },
  { title: 'Лес', id: 4, img: '/img/masters/Battlefield/Map/Forest.jpg' },
  { title: 'Таверна', id: 5, img: '/img/masters/Battlefield/Map/Tavern.jpg' },
];

export function Forms() {
  const methods = useForm<BattleFormData>({
    defaultValues: {
      characters: [],
      enemies: [],
      mapId: 1,
      gridWidth: 10,
      gridHeight: 10,
    },
  });

  const [stepForm, setStepForm] = useState(0);

  const onSubmit = (data: BattleFormData) => {
    console.log('Битва создана:', data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col justify-start items-center relative top-[5vh] w-[80vw] h-[80vh] bg-neutral-700 p-8 rounded-3xl shadow-2xl"
      >
        <NavigationHeader stepForm={stepForm} setStepForm={setStepForm} />

        <div className="flex-1 w-full relative top-[8vh]">
          <Activity mode={stepForm === 0 ? 'visible' : 'hidden'}>
            <PersonSection />
          </Activity>

          <Activity mode={stepForm === 1 ? 'visible' : 'hidden'}>
            <h2>Выберите карту</h2>
            {/* <BattleMapSection maps={maps} /> */}
          </Activity>

          <Activity mode={stepForm === 2 ? 'visible' : 'hidden'}>
            <h2>Выберите размер сетки</h2>
            {/* <BattleGridSection /> */}
          </Activity>

          <Activity mode={stepForm === 3 ? 'visible' : 'hidden'}>
            <h2>Создание битвы</h2>
            {/* <SubmitSection /> */}
          </Activity>
        </div>
      </form>
    </FormProvider>
  );
}
