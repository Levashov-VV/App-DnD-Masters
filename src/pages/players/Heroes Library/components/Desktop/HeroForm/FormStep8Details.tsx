import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { HeroFormData } from '../../../../../../features/heroes/schemas/heroSchema';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';

interface FormStep5DetailsProps {
  register: UseFormRegister<HeroFormData>;
  errors: FieldErrors<HeroFormData>;
}

export function FormStep8Details({ register, errors }: FormStep5DetailsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Детали персонажа</h2>

      {/* Avatar */}
      <Input
        label="Аватар (URL изображения)"
        type="url"
        placeholder="https://example.com/avatar.jpg"
        {...register('avatar')}
        error={errors.avatar?.message}
      />

      {/* Appearance */}
      <Textarea
        label="Внешность"
        rows={3}
        placeholder="Опишите внешность вашего персонажа..."
        {...register('appearance')}
        error={errors.appearance?.message}
      />

      {/* Personality Traits */}
      <Textarea
        label="Черты характера"
        rows={3}
        placeholder="Какие черты характера определяют вашего персонажа?"
        {...register('personality.traits')}
        error={errors.personality?.traits?.message}
      />

      {/* Ideals */}
      <Textarea
        label="Идеалы"
        rows={2}
        placeholder="Во что верит ваш персонаж?"
        {...register('personality.ideals')}
        error={errors.personality?.ideals?.message}
      />

      {/* Bonds */}
      <Textarea
        label="Привязанности"
        rows={2}
        placeholder="Что или кто важен для вашего персонажа?"
        {...register('personality.bonds')}
        error={errors.personality?.bonds?.message}
      />

      {/* Flaws */}
      <Textarea
        label="Слабости"
        rows={2}
        placeholder="Какие недостатки есть у вашего персонажа?"
        {...register('personality.flaws')}
        error={errors.personality?.flaws?.message}
      />

      {/* Backstory */}
      <Textarea
        label="Предыстория"
        rows={6}
        placeholder="Расскажите историю вашего персонажа..."
        {...register('backstory')}
        error={errors.backstory?.message}
      />
    </div>
  );
}
