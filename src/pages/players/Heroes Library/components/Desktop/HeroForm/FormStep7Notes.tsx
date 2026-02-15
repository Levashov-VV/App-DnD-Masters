import type { UseFormRegister, FieldErrors, UseFormWatch, Control } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import type { HeroFormData } from '../../../../../../features/heroes/schemas/heroSchema';
import { Input } from './ui/Input';
import { getAbilityModifier } from '../../../../../../features/heroes/constants/dndData';

interface FormStep4EquipmentProps {
  register: UseFormRegister<HeroFormData>;
  errors: FieldErrors<HeroFormData>;
  watch: UseFormWatch<HeroFormData>;
  control: Control<HeroFormData>;
}

export function FormStep7Notes({ register, errors, watch, control }: FormStep4EquipmentProps) {
  const {
    fields: weapons,
    append: addWeapon,
    remove: removeWeapon,
  } = useFieldArray({
    control,
    name: 'equipment.weapons',
  });

  const {
    fields: items,
    append: addItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: 'equipment.items',
  });

  const level = watch('level') || 1;
  const constitution = watch('abilityScores.constitution') || 10;
  const dexterity = watch('abilityScores.dexterity') || 10;

  const conModifier = getAbilityModifier(constitution);
  const dexModifier = getAbilityModifier(dexterity);

  const suggestedMaxHP = 10 + conModifier + (level - 1) * (6 + conModifier);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Снаряжение и боевые характеристики</h2>

      {/* Combat Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Input
            label="Макс. HP *"
            type="number"
            min={1}
            placeholder={`Рекомендуется: ${suggestedMaxHP}`}
            {...register('hitPoints.max', { valueAsNumber: true })}
            error={errors.hitPoints?.max?.message}
          />
          <p className="text-xs text-gray-400 mt-1">Рекомендуется: {suggestedMaxHP}</p>
        </div>

        <Input
          label="Текущий HP *"
          type="number"
          min={0}
          {...register('hitPoints.current', { valueAsNumber: true })}
          error={errors.hitPoints?.current?.message}
        />

        <div>
          <Input
            label="Класс Доспеха (AC) *"
            type="number"
            min={0}
            max={30}
            placeholder={`Базовый: ${10 + dexModifier}`}
            {...register('armorClass', { valueAsNumber: true })}
            error={errors.armorClass?.message}
          />
          <p className="text-xs text-gray-400 mt-1">Базовый AC: {10 + dexModifier}</p>
        </div>

        <Input
          label="Скорость (футы)"
          type="number"
          min={0}
          defaultValue={30}
          {...register('speed', { valueAsNumber: true })}
          error={errors.speed?.message}
        />
      </div>

      <Input
        label="Инициатива"
        type="number"
        defaultValue={dexModifier}
        {...register('initiative', { valueAsNumber: true })}
        error={errors.initiative?.message}
      />

      {/* Weapons */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Оружие</h3>
          <button
            type="button"
            onClick={() => addWeapon({ name: '', damage: '' })}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
          >
            + Добавить оружие
          </button>
        </div>

        <div className="space-y-3">
          {weapons.map((field, index) => (
            <div key={field.id} className="flex gap-3 items-start">
              <Input
                placeholder="Название оружия"
                {...register(`equipment.weapons.${index}.name`)}
                error={errors.equipment?.weapons?.[index]?.name?.message}
              />
              <Input
                placeholder="Урон (например, 1d8)"
                {...register(`equipment.weapons.${index}.damage`)}
                error={errors.equipment?.weapons?.[index]?.damage?.message}
              />
              <button
                type="button"
                onClick={() => removeWeapon(index)}
                className="mt-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}

          {weapons.length === 0 && (
            <p className="text-gray-500 text-sm italic">Оружие не добавлено</p>
          )}
        </div>
      </div>

      {/* Armor */}
      <Input
        label="Доспех"
        placeholder="Например: Кожаный доспех"
        {...register('equipment.armor')}
        error={errors.equipment?.armor?.message}
      />

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Предметы</h3>
          <button
            type="button"
            onClick={() => addItem({ name: '' })}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
          >
            + Добавить предмет
          </button>
        </div>

        <div className="space-y-2">
          {items.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <Input
                placeholder="Название предмета"
                {...register(`equipment.items.${index}.name`)}
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="mt-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}

          {items.length === 0 && (
            <p className="text-gray-500 text-sm italic">Предметы не добавлены</p>
          )}
        </div>
      </div>
    </div>
  );
}
