import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SoundItem } from './SoundItem';

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

const slugify = (name: string) => name.toLowerCase().replace(/ /g, '-');

const fetchSoundPad = async (): Promise<ScenesMap> => {
  const res = await fetch(SOUNDPAD_JSON_URL);
  if (!res.ok) throw new Error('Не удалось загрузить SoundPad.json');
  return res.json();
};

export const SoundPadScenePage: React.FC = () => {
  const { sceneSlug } = useParams<{ sceneSlug: string }>();

  const {
    data: scenes,
    isPending,
    error,
  } = useQuery<ScenesMap, Error>({
    queryKey: ['soundpad-json'],
    queryFn: fetchSoundPad,
    staleTime: 5 * 60 * 1000,
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-[6vh]">
        Загрузка SoundPad...
      </div>
    );
  }

  if (!sceneSlug || !scenes || error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-white gap-[2vh]">
        <p>Ошибка загрузки сцены</p>
        <Link to="/soundpad" className="text-purple-400 underline">
          Вернуться к списку локаций
        </Link>
      </div>
    );
  }

  const entry = Object.entries(scenes).find(([name]) => slugify(name) === sceneSlug);

  if (!entry) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-white gap-[2vh]">
        <p>Сцена не найдена</p>
        <Link to="/soundpad" className="text-purple-400 underline">
          Вернуться к списку локаций
        </Link>
      </div>
    );
  }

  const [name, scene] = entry;
  const sortedMusic = scene.music.sort((a, b) =>
  a.name.localeCompare(b.name, 'ru')
);

  return (
    <div className="relative top-[20vh] h-[150vh] text-white">
      <header className="border-b border-white/10 flex items-center justify-center">
        <h1 className="text-[4vh] font-semibold">{name}</h1>
        <div />
      </header>
        <Link to="/soundpad" className="absolute left-[1vw] top-[1vh] text-[2vh] text-gray-300 hover:text-white">
          ← Все локации
        </Link>

      <main className="flex flex-col items-center justify-center gap-[5vh] flex-1">
        <div className="relative top-[2vh] w-[25vw]">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={`https://cdn.jsdelivr.net/gh/Levashov-VV/DnD-Audio@main/${scene.cover}`}
              alt={name}
              className="w-[25vw] h-[50vh]"
            />
          </div>
        </div>

        <div className="w-[60vw]">
          <div className="grid gap-[2vh] grid-cols-4">
            {sortedMusic.map((track) => (
							<SoundItem key={track.url} track={track} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};