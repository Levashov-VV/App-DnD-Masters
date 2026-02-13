import { useRef, useState, useEffect } from 'react';
import { MdPlayArrow, MdPause, MdRepeat, MdRepeatOne } from 'react-icons/md';

interface Track {
  name: string;
  url: string;
}

interface SoundButtonProps {
  track: Track;
}

export const SoundPadItemsMobile: React.FC<SoundButtonProps> = ({ track }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isLoop, setIsLoop] = useState(false);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.volume = volume;
      audio.loop = isLoop;
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleLoop = () => {
    const newLoop = !isLoop;
    setIsLoop(newLoop);
    if (audioRef.current) {
      audioRef.current.loop = newLoop;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  return (
    <div className="group w-full h-[8vh] text-left flex flex-col gap-[0.5vh]">
      {/* Название трека */}
      <span className="text-[1.8vh] font-medium text-white truncate">{track.name}</span>

      <div className="flex items-center gap-[2vw]">
        {/* Play/Pause */}
        <button
          onClick={togglePlayPause}
          className="rounded-lg bg-white/20 flex items-center justify-center w-[10vw] h-[5vw]"
        >
          {isPlaying ? (
            <MdPause className="w-[5vw] h-[5vw] text-white" />
          ) : (
            <MdPlayArrow className="w-[5vw] h-[5vw] text-white" />
          )}
        </button>

        {/* Громкость */}
        <div className="flex items-center gap-[2vw] flex-1">
          <div className="w-[10vw] h-[5vw] bg-white/10 rounded flex items-center justify-center">
            <span className="text-[1.4vh] text-gray-300">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-[5vw] bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-300 hover:accent-blue-400"
          />
        </div>

        {/* Repeat */}
        <button
          onClick={toggleLoop}
          className={`rounded-lg transition-all ${
            isLoop ? 'bg-purple-500/50 text-purple-200' : 'bg-white/20'
          }`}
        >
          {isLoop ? (
            <MdRepeatOne className="w-[5vw] h-[5vw]" />
          ) : (
            <MdRepeat className="w-[5vw] h-[5vw]" />
          )}
        </button>
      </div>

      {/* Скрытый аудио элемент */}
      <audio
        ref={audioRef}
        src={`https://cdn.jsdelivr.net/gh/Levashov-VV/DnD-Audio@main/${track.url}`}
        preload="metadata"
      />
    </div>
  );
};
