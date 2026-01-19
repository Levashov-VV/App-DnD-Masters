import { useFormContext, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { BattleFormData } from '../types';
import { useState } from 'react';
import { maps } from '../types';

export function SubmitSection() {
  const {
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useFormContext<BattleFormData>();

  const mapId = useWatch({ name: 'mapId' }) || 1;
  const gridSize = useWatch({ name: 'gridSize' }) || 15;
  const mapName = maps.find((map) => map.id === mapId)?.title || 'Не выбрана';
  const mapImage = maps.find((map) => map.id === mapId)?.img || '';
  const customMapImage = useWatch({ name: 'customMapImage' }) as string | null;
  const { gridWidth, gridHeight } = useWatch<BattleFormData>();

  const sizeW = gridWidth || gridSize;
  const sizeH = gridHeight || gridSize;
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const onSubmit = async () => {
    setIsCreating(true);
    try {
      const formData = getValues();
      navigate('/battlefield', { state: { battleData: formData } });
    } catch (error) {
      console.error('Ошибка создания битвы:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section className="flex flex-col items-center gap-[5vh]">
      <div className="text-center max-w-[50vw]">
        <h2 className="text-[5vh] font-bold text-neutral-100 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text">
          Всё настроено!
        </h2>
        <p className="text-[3vh] text-neutral-300 leading-relaxed">
          Нажмите кнопку, чтобы создать битву и перейти на поле боя
        </p>
      </div>

      <div className="flex flex-col items-center gap-[2vh]">
        {!isValid && (
          <div className="flex gap-[2vh] text- text-amber-400 bg-amber-500/10 rounded-xl border-amber-500/30">
            <span>⚠️</span>
            <span>Проверьте все поля перед созданием битвы</span>
          </div>
        )}

        <button
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || isCreating}
          className="group relative w-[20vw] min-w-[10vw] h-[5vh] rounded-2xl text-[2vh] font-semibold 
                      bg-gradient-to-r from-amber-500 to-amber-600 
                    text-neutral-900 hover:from-amber-600 hover:to-amber-700 
                      shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40
                      transform transition-all duration-300 scale-105 hover:scale-110
                      focus:outline-none focus:ring-4 focus:ring-amber-500/50 focus:scale-105
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:from-amber-400 disabled:to-amber-500 disabled:scale-100
                      active:translate-y-0.5"
        >
          <span className="relative z-10 flex items-center justify-center gap-[2vh] h-full">
            {isCreating ? (
              <>
                <div className="w-[2vh] h-[2vh] border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                Создание...
              </>
            ) : (
              'Создать битву'
            )}
          </span>
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/20 to-orange-500/20 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </button>
      </div>
      <details className="w-[50vw] h-[3vh] bg-neutral-900/50 backdrop-blur-sm rounded-2xl border-neutral-700/50">
        <summary className="cursor-pointer text-[2vh] text-neutral-400 hover:text-neutral-200 font-medium">
          👁️ Предпросмотр битвы
        </summary>
        <div className="text-[2vh] text-neutral-400 grid grid-cols-2 md:grid-cols-4 gap-[1vh]">
          <div>Игроки: {getValues('users')?.length || 0}</div>
          <div>Враги: {getValues('enemies')?.length || 0}</div>
          <div>Карта: {customMapImage ? 'Своя карта' : mapName}</div>
          <div>
            Размер: {sizeW}x{sizeH}
          </div>
          {customMapImage && (
            <div className="w-[20vw]">
              <p className="text-neutral-400 ">Превью своей карты:</p>
              <img
                src={customMapImage}
                alt="Своя карта"
                className="w-[20vw] object-cover rounded-xl border-neutral-700"
              />
            </div>
          )}
          {!customMapImage && (
            <div className="w-[20vw]">
              <p className="text-neutral-400 ">Превью карты:</p>
              <img
                src={mapImage}
                alt="Карта"
                className="w-[20vw] object-cover rounded-xl border-neutral-700"
              />
            </div>
          )}
        </div>
      </details>
    </section>
  );
}
