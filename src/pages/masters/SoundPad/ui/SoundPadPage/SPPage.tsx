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
      <div className="flex flex-col justify-center items-center h-screen text-white gap-4">
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
      <div className="flex flex-col justify-center items-center h-screen text-white gap-4">
        <p>Сцена не найдена</p>
        <Link to="/soundpad" className="text-purple-400 underline">
          Вернуться к списку локаций
        </Link>
      </div>
    );
  }

  const [name, scene] = entry;

  return (
    <div className="relative top-[20vh] h-screen text-white">
      {/* Header */}
      <header className="border-b border-white/10 flex items-center justify-between">
        <Link to="/soundpad" className="text-[1.5vh] text-gray-300 hover:text-white">
          ← Все локации
        </Link>
        <h1 className="text-[3vh] font-semibold">{name}</h1>
        <div />
      </header>

      <main className="flex flex-col items-center justify-center gap-[5vh] flex-1">
        <div className="relative top-[2vh] w-[20vw]">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={`https://cdn.jsdelivr.net/gh/Levashov-VV/DnD-Audio@main/${scene.cover}`}
              alt={name}
              className="w-[20vw] h-[30vh]"
            />
          </div>
        </div>

        {/* Кнопки на всю ширину экрана */}
        <div className="w-[40vw]">
          <div className="grid gap-3 grid-cols-4">
            {scene.music.map((track) => (
							<SoundItem key={track.url} track={track} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};