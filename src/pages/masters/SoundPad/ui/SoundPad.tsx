import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

interface Track {
  name: string;
  url: string;
}
interface Scene {
  cover: string;
  music: Track[];
}

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
          ))}
        </div>
      </main>
    </div>
  );
};
