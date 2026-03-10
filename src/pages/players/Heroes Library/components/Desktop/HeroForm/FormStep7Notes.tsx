import type { UseFormRegister, FieldErrors, UseFormWatch, Control } from 'react-hook-form';
import type { HeroFormData } from '../../../../../../features/heroes/schemas/heroSchema';
import { TextareaWithFontControl } from './ui/TextareaFontControl';

interface FormStep7NotesProps {
  register: UseFormRegister<HeroFormData>;
  errors: FieldErrors<HeroFormData>;
  watch: UseFormWatch<HeroFormData>;
  control: Control<HeroFormData>;
}

export function FormStep7Notes({ register, errors, watch, control }: FormStep7NotesProps) {
  return (
    <div className="relative left-[0.5vw] top-[1vh] w-[74vw] flex flex-col gap-[1.5vh] uppercase max-h-[63vh] overflow-y-auto">
      <h2 className="text-[2.5vh] font-bold text-amber-100 uppercase">Заметки</h2>

      <div className="grid grid-cols-2 gap-[2vw]">
        <div className="border-2 border-amber-600 bg-stone-800 rounded-lg ">
          <TextareaWithFontControl
            label="Заметки о сюжете"
            {...register('notes.plotNotes')}
            placeholder="Важные события, подсказки, квестовые зацепки..."
            className="h-[20vh]"
            defaultFontSize={14}
            minFontSize={10}
            maxFontSize={24}
          />
        </div>

        <div className="border-2 border-amber-600 bg-stone-800 rounded-lg">
          <TextareaWithFontControl
            label="Заметки о персонажах"
            {...register('notes.npcNotes')}
            placeholder="Встреченные NPC, их мотивации, отношения..."
            className="h-[20vh]"
            defaultFontSize={14}
            minFontSize={10}
            maxFontSize={24}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-[2vw]">
        <div className="border-2 border-amber-600 bg-stone-800 rounded-lg">
          <TextareaWithFontControl
            label="Локации"
            {...register('notes.locationNotes')}
            placeholder="Важные места, города, подземелья..."
            className="h-[15vh]"
            defaultFontSize={13}
            minFontSize={10}
            maxFontSize={22}
          />
        </div>

        <div className="border-2 border-amber-600 bg-stone-800 rounded-lg">
          <TextareaWithFontControl
            label="Задания и цели"
            {...register('notes.questNotes')}
            placeholder="Текущие квесты, цели, награды..."
            className="h-[15vh]"
            defaultFontSize={13}
            minFontSize={10}
            maxFontSize={22}
          />
        </div>

        <div className="border-2 border-amber-600 bg-stone-800 rounded-lg">
          <TextareaWithFontControl
            label="Секреты и тайны"
            {...register('notes.secretNotes')}
            placeholder="Скрытая информация, загадки..."
            className="h-[15vh]"
            defaultFontSize={13}
            minFontSize={10}
            maxFontSize={22}
          />
        </div>

        <div className="border-2 border-amber-600 bg-stone-800 rounded-lg">
          <TextareaWithFontControl
            label="Боевые заметки"
            {...register('notes.combatNotes')}
            placeholder="Тактика, слабости врагов, стратегии..."
            className="h-[15vh]"
            defaultFontSize={13}
            minFontSize={10}
            maxFontSize={22}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="border-2 border-amber-600 bg-stone-800 rounded-lg">
          <TextareaWithFontControl
            label="Контакты"
            {...register('notes.contactNotes')}
            placeholder="Союзники, торговцы..."
            className="h-[12vh]"
            defaultFontSize={12}
            minFontSize={10}
            maxFontSize={20}
          />
        </div>

        <div className="border-2 border-amber-600 bg-stone-800 rounded-lg">
          <TextareaWithFontControl
            label="Слухи и легенды"
            {...register('notes.rumorNotes')}
            placeholder="Услышанные истории..."
            className="h-[12vh]"
            defaultFontSize={12}
            minFontSize={10}
            maxFontSize={20}
          />
        </div>

        <div className="border-2 border-amber-600 bg-stone-800 rounded-lg">
          <TextareaWithFontControl
            label="Прочее"
            {...register('notes.miscNotes')}
            placeholder="Разное..."
            className="h-[12vh]"
            defaultFontSize={12}
            minFontSize={10}
            maxFontSize={20}
          />
        </div>
      </div>
    </div>
  );
}
