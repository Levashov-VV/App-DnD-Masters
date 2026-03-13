import { useFormContext, useWatch } from 'react-hook-form';
import { useRef, useCallback, useState } from 'react';
import type { BattleFormData } from '../types';
import { assetUrl } from '@/shared/utils/assetUrl';

const maps = [
  { title: 'Подземелье', id: 1, img: assetUrl('img/masters/Battlefield/Map/Dungeon.jpg') },
  {
    title: 'Городская площадь',
    id: 2,
    img: assetUrl('img/masters/Battlefield/Map/CitySquare.jpg'),
  },
  { title: 'Болото', id: 3, img: assetUrl('img/masters/Battlefield/Map/Swamp.jpg') },
  { title: 'Лес', id: 4, img: assetUrl('img/masters/Battlefield/Map/Forest.jpg') },
  { title: 'Таверна', id: 5, img: assetUrl('img/masters/Battlefield/Map/Tavern.jpg') },
];

export function BattleMapSection() {
  const { control, setValue } = useFormContext<BattleFormData>();
  const mapId = useWatch({ control, name: 'mapId' }) || 1;
  const customImage = useWatch({ control, name: 'customMapImage' }) || null;
  const gridWidth = useWatch({ control, name: 'gridWidth' }) || 10;
  const gridHeight = useWatch({ control, name: 'gridHeight' }) || 10;
  const width = gridWidth;
  const height = gridHeight;
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);
  const [sizeMode, setSizeMode] = useState<'preset' | 'custom'>('preset');

  const selectedMap = maps.find((map) => map.id === mapId) || maps[0];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMapChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMap = maps.find((map) => map.title === e.target.value);
    if (newMap) {
      setValue('mapId', newMap.id);
      setValue('customMapImage', '');
    }
  };

  const clearCustomMap = () => {
    setValue('customMapImage', '');
  };

  const handleGridSizeChange = (size: number) => {
    setSizeMode('preset');
    setIsCustomSizeOpen(false);
    setValue('gridWidth', size);
    setValue('gridHeight', size);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 0;
    setSizeMode('custom');
    setValue('gridWidth', value);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 0;
    setSizeMode('custom');
    setValue('gridHeight', value);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setValue('customMapImage', event.target?.result as string);
        };
        reader.readAsDataURL(files[0]);
      }
    },
    [setValue]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setValue('customMapImage', event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [setValue]
  );

  const sizes = [10, 15, 20, 25, 30, 35, 40] as const;

  return (
    <section className="flex flex-col items-center w-full text-[2.5vh] gap-[2vh]">
      <h1 className="text-[6vh] font-bold text-center bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
        Выберите карту поля боя
      </h1>
      <div className="flex flex-row gap-[3vw]">
        <div className="flex flex-col items-center gap-[2vh] flex-1">
          <label className="w-[20vw] text-center font-bold text-[3vh] text-neutral-200">
            Карты из библиотеки
          </label>

          <select
            className="w-full rounded-2xl bg-neutral-700 bg-gradient-to-br from-neutral-800/90 to-neutral-900/90 
                border-2 border-neutral-600/50 hover:border-purple-500/80 focus:border-purple-500/90 
                focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300 
                text-[2vh] font-semibold shadow-2xl backdrop-blur-md hover:shadow-purple-500/20"
            value={selectedMap.title}
            onChange={handleMapChange}
          >
            {maps.map((map) => (
              <option key={map.id} value={map.title}>
                {map.title}
              </option>
            ))}
          </select>
          <div
            className="w-[25vw] h-[45vh] relative rounded-3xl overflow-hidden 
                          shadow-2xl border-4 border-neutral-700/60 hover:border-purple-500/80 
                          transition-all duration-500 group cursor-pointer bg-neutral-900/50"
          >
            <img
              src={customImage || selectedMap.img}
              alt={customImage ? 'Загруженная карта' : selectedMap.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {customImage && (
              <button
                type="button"
                onClick={clearCustomMap}
                className="absolute top-2 right-2 w-[5vh] h-[5vh] bg-red-500/90 hover:bg-red-600 rounded-2xl 
                flex items-center justify-center text-white font-bold text-[2vh]"
                title="Удалить свою карту"
              >
                ×
              </button>
            )}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-all duration-500 
                            flex items-end pointer-events-none"
            >
              <div className="relative left-[0.5vw]">
                <span className="text-white font-bold text-[2.5vh] drop-shadow-2xl block">
                  {customImage ? 'Ваша карта' : selectedMap.title}
                </span>
                <span className="text-neutral-300 text-[1.5vh] font-medium">
                  {customImage ? 'Готово к использованию' : `${selectedMap.id}/5`}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex flex-col h-[56vh] items-center gap-[5vh] flex-1
                        bg-neutral-900/60 backdrop-blur-xl rounded-3xl shadow-2xl 
                        border-2 border-neutral-700/60 hover:border-amber-400/70 
                        transition-all duration-400 hover:shadow-amber-500/30"
        >
          <div className="w-[25vw] h-[5vh] text-center">
            <h2
              className="text-[3.5vh] font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 
                          bg-clip-text text-transparent drop-shadow-lg"
            >
              🖼️ Загрузить свою карту
            </h2>
            <p className="text-neutral-400 text-[1.4vh] font-medium">JPG, PNG, WebP • max 10MB</p>
          </div>

          <div
            className="w-full h-[40vh] border-4 border-dashed border-neutral-500/50 
              rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-400/10 to-amber-500/5 
            hover:border-amber-400/90 hover:bg-amber-500/25 transition-all duration-400 
              flex flex-col items-center justify-center text-center cursor-pointer 
              group relative overflow-hidden shadow-xl hover:shadow-amber-400/40"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div
              className="w-[8vh] h-[4vw] g-gradient-to-br from-amber-400/40 to-orange-400/40 
                          rounded-3xl flex items-center justify-center group-hover:scale-110 
                          transition-all duration-400 shadow-2xl border-2 border-amber-400/50"
            >
              <svg
                className="w-[4vh] h-[4vh] text-amber-300 drop-shadow-lg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p
              className="text-[2.5vh] font-bold text-neutral-200 group-hover:text-amber-300 
                transition-all duration-300"
            >
              Нажмите или перетащите
            </p>
            <p className="text-neutral-400 text-[1.4vh] font-medium">изображение на поле</p>
            <div
              className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                            blur-sm pointer-events-none"
            />
          </div>
          <input
            ref={fileInputRef}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="w-[20vw] flex flex-col gap-[5vh]">
          <label className="block text-[2.5vh] font-bold text-center text-neutral-200">
            🏁 Размер боевого поля
          </label>

          <div className="grid grid-cols-2 gap-[3vh] w-full justify-items-center">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                className={`rounded-2xl font-bold text-[2vh] shadow-xl transition-all duration-300 flex items-center justify-center w-[5vw] h-[2.5vh] ${
                  sizeMode === 'preset' && gridWidth === size && gridHeight === size
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/50 scale-105 ring-4 ring-purple-500/40'
                    : 'bg-neutral-800/80 hover:bg-purple-600/80 border-2 border-transparent hover:border-purple-400/60 hover:shadow-purple-500/40 hover:scale-105 text-neutral-200'
                }`}
                onClick={() => handleGridSizeChange(size)}
              >
                {size}×{size}
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setIsCustomSizeOpen((prev) => !prev);
                setSizeMode('custom');
              }}
              className={`w-[15vw] rounded-2xl font-bold text-[2vh] shadow-xl transition-all duration-300 ${
                isCustomSizeOpen
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/50 scale-105 ring-4 ring-purple-500/40'
                  : 'bg-neutral-800/80 hover:bg-purple-600/80 border-2 border-transparent hover:border-purple-400/60 hover:shadow-purple-500/40 hover:scale-105 text-neutral-200'
              }`}
            >
              {isCustomSizeOpen ? 'Скрыть произвольный размер' : 'Произвольный размер'}
            </button>
          </div>

          {isCustomSizeOpen && (
            <div className="flex items-center justify-center gap-[1vw]">
              <div className="flex flex-col items-center">
                <span className="text-[1.5vh] text-neutral-300">Ширина</span>
                <input
                  type="number"
                  min={1}
                  max={100}
                  className="w-[4vw] h-[2.5vh] bg-neutral-800 border-neutral-600 rounded-xl text-center text-[2vh] text-neutral-100 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40"
                  value={width || ''}
                  onChange={handleWidthChange}
                />
              </div>

              <span className="relative top-[1vh] text-[3vh] font-bold text-neutral-400">×</span>

              <div className="flex flex-col items-center">
                <span className="text-[1.5vh] text-neutral-300">Высота</span>
                <input
                  type="number"
                  min={1}
                  max={100}
                  className="w-[4vw] h-[2.5vh] bg-neutral-800 border-neutral-600 rounded-xl text-center text-[2vh] text-neutral-100 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40"
                  value={height || ''}
                  onChange={handleHeightChange}
                />
              </div>
            </div>
          )}

          <p className="text-center text-[2.5vh] text-neutral-400 font-medium mt-[2vh]">
            Текущее поле:{' '}
            <span className="text-[2.5vh] font-bold text-purple-400">
              {gridWidth || 10}
              {'x'}
              {gridHeight || 10}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
