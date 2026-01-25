import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { ErrorPage } from './SoundPadError/ErrorPage';
=======
>>>>>>> 3a5e96b6430a78bbd1955d2da18657abd8f200b0

interface Track {
  name: string;
  url: string;
}
<<<<<<< HEAD

=======
>>>>>>> 3a5e96b6430a78bbd1955d2da18657abd8f200b0
interface Scene {
  cover: string;
  music: Track[];
}

<<<<<<< HEAD
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
      to={`/soundpad/${slug}`}
      className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border-white/20 hover:border-white/40 hover:scale-105 transition-all duration-500 shadow-2xl hover:shadow-purple-500/50"
      aria-label={`Открыть саундпад ${name}`}
    >
      <div className="w-full h-full">
        <img
          src={`https://cdn.jsdelivr.net/gh/Levashov-VV/DnD-Audio@main/${scene.cover}`}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-[1vh] left-[1vw]">
          <h3 className="text-[3vh] font-bold text-purple-300 drop-shadow-lg group-hover:text-purple-400 transition-colors line-clamp-2">
            {name}
          </h3>
          <p className="text-amber-100 text-[2vh]">
            {scene.music.length} {getSoundWord(scene.music.length)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export const SoundPad: React.FC = () => {
  const {
    data: scenes,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery<ScenesMap, Error>({
    queryKey: ['soundpad-json'],
    queryFn: fetchSoundPad,
    staleTime: 0, // всегда stale → всегда можно рефетчить
    refetchOnWindowFocus: true, // по желанию
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
    <div className="relative top-[5vh] h-[182vh] flex flex-col items-center justify-center gap-[5vh]">
      <header className="relative z-50 bg-gradient-to-b to-transparent w-full text-center">
        <p className="text-[6vh] text-amber-200">Выбери локацию и создай атмосферу за секунды</p>
      </header>

      <main className="w-[95vw] flex flex-col justify-center">
        <div className="grid grid-cols-4 gap-[2vw]">
          {Object.entries(scenes).map(([name, scene]) => (
            <SceneCard key={name} name={name} scene={scene} />
=======
const fetchSoundPad = async (): Promise<Record<string, Scene>> => {
  const res = await fetch('https://cdn.jsdelivr.net/gh/Levashov-VV/DnD-Audio@main/SoundPad.json');
  if (!res.ok) throw new Error('SoundPad.json failed');
  return res.json();
};

export const SoundPad = () => {
  const {
    data: scenes,
    isPending,
    error,
  } = useQuery({
    queryKey: ['soundpad-json'],
    queryFn: fetchSoundPad,
  });

  if (isPending)
    return (
      <div className="flex justify-center items-center h-screen text-white text-2xl">
        Загрузка SoundPad...
      </div>
    );
  if (error || !scenes)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-2xl">
        Ошибка загрузки
      </div>
    );

  return (
    <div className="relative top-[20vh] bottom-[20vh] w-[100vw] h-[120vh]">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <p className="text-xl text-gray-300 text-center">
          Выбери локацию и создай атмосферу за секунды
        </p>
      </header>

      {/* Секции */}
      <main className="w-[95vw] flex flex-col justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[2vw]">
          {Object.entries(scenes).map(([name, scene]) => (
            <Link
              to={`/soundpad/${name.toLowerCase().replace(/ /g, '-')}`}
              key={name}
              className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border-white/20 hover:border-white/40 hover:scale-105 transition-all duration-500 shadow-2xl hover:shadow-purple-500/50"
            >
              <div className="w-full h-full">
                <img
                  src={`https://cdn.jsdelivr.net/gh/Levashov-VV/DnD-Audio@main/${scene.cover}`}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-[3vh] font-bold text-white drop-shadow-lg group-hover:text-purple-300 transition-colors line-clamp-2">
                    {name}
                  </h3>
                  <p className="text-gray-300 text-[2vh] ">{scene.music.length} звуков</p>
                </div>
              </div>
            </Link>
>>>>>>> 3a5e96b6430a78bbd1955d2da18657abd8f200b0
          ))}
        </div>
      </main>
    </div>
  );
};
<<<<<<< HEAD

export default SoundPad;
=======
>>>>>>> 3a5e96b6430a78bbd1955d2da18657abd8f200b0
