import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ErrorPage } from '../SoundPadError/ErrorPage';

interface Track {
  name: string;
  url: string;
}

interface Scene {
  cover: string;
  music: Track[];
}

type ScenesMap = Record<string, Scene>;

const SOUNDPAD_JSON_URL =
  'https://cdn.jsdelivr.net/gh/Levashov-VV/DnD-Audio@main/SoundPad.json?v=2';

const getSoundWord = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return 'звук';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'звука';
  return 'звуков';
};

const fetchSoundPad = async (): Promise<ScenesMap> => {
  const res = await fetch(SOUNDPAD_JSON_URL);

  if (!res.ok) {
    throw new Error('Не удалось загрузить SoundPad.json');
  }

  return res.json();
};

const SceneCard: React.FC<{
  name: string;
  scene: Scene;
}> = ({ name, scene }) => {
  const slug = name.toLowerCase().replace(/ /g, '-');

  return (
    <Link
      to={`/Master/soundpad/${slug}`}
      className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border-white/20"
      aria-label={`Открыть саундпад ${name}`}
    >
      <div className="w-full h-[30vh]">
        <img
          src={`https://cdn.jsdelivr.net/gh/Levashov-VV/DnD-Audio@main/${scene.cover}`}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover"
          
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-[1vh] left-[1vw]">
          <h3 className="text-[3vh] font-bold text-amber-200 drop-shadow-lg">{name}</h3>
          <p className="text-amber-100 text-[2vh]">
            {scene.music.length} {getSoundWord(scene.music.length)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export const SoundPadMobile: React.FC = () => {
  const {
    data: scenes,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery<ScenesMap, Error>({
    queryKey: ['soundpad-json'],
    queryFn: fetchSoundPad,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-[6vh]">
        Загрузка SoundPads...
      </div>
    );
  }

  if (isError || !scenes) {
    return (
      <ErrorPage
        message={error?.message ?? 'Ошибка загрузки SoundPad.json'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="relative top-[15vh] h-[320vh] w-screen flex flex-col items-center gap-[2vh] overflow-x-hidden">
      <header className="relative bg-gradient-to-b to-transparent w-full text-center">
        <p className="text-[3.2vh] text-amber-200">Выбери локацию и создай атмосферу за секунды</p>
      </header>

      <main className="w-[90vw] flex flex-col justify-center">
        <div className="grid grid-cols-1 gap-[2vw]">
          {Object.entries(scenes).map(([name, scene]) => (
            <SceneCard key={name} name={name} scene={scene} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default SoundPadMobile;
