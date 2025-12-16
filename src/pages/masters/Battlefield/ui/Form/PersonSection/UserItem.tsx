import { useFormContext, useWatch } from 'react-hook-form';
import Person from '../../../../../../../public/img/masters/Battlefield/Figures/Logo-Profile.png';
import { useCharacter } from '@/shared/hooks/auth/useCharacter';
import type { User, CreatureSide, BattleFormData } from '../types';

interface UserItemProps {
  index: number;
  arrayName: 'users' | 'enemies';
}

export const UserItem: React.FC<UserItemProps> = ({ index, arrayName }) => {
  const classField = `${arrayName}.${index}.className` as const;
  const {
    control,
    register,
  } = useFormContext<BattleFormData>();

  const { data: characters } = useCharacter();

  const users = useWatch({
    control,
    name: `${arrayName}.${index}` as any,
  }) as User | undefined;

  if (!users) return null;

  const side: CreatureSide = arrayName === 'users' ? 'allies' : 'enemies';
  const hasClass = !!users.className;
  const character = hasClass
    ? characters.find((c) => c.side === side && c.name === users.className)
    : undefined;
  const currentImg = hasClass ? character?.logo || users.logo || Person : Person;

  const handleRemove = () => {
    if (confirm(`Удалить ${users?.name || 'персонажа'}?`)) {
      window.dispatchEvent(
        new CustomEvent('removeCharacter', {
          detail: { arrayName, index },
        })
      );
    }
  };

  const UserSelect = () => {
    return (
      <select className="bg-neutral-700" {...register(classField as any)} defaultValue="">
        <option value="" disabled>
          Выберите класс
        </option>
        <option value="Dwarf">Гном</option>
        <option value="Goliaf">Голиаф</option>
        <option value="DragonBorn">Драконорождённый</option>
        <option value="Kalashtar">Калаштар</option>
        <option value="Minotaur">Минотавр</option>
        <option value="Orc">Орк</option>
        <option value="Tiffling">Тиффлинг</option>
        <option value="Human">Человек</option>
        <option value="Shifter">Шифтер</option>
        <option value="Elf">Эльф</option>
      </select>
    );
  };

  const EnemiesSelect = () => {
    return (
      <select className="bg-neutral-700" {...register(classField as any)} defaultValue="">
        <option value="" disabled>
          Выберите врага
        </option>
        <option value="Bandit">Бандит</option>
        <option value="Goblin">Гоблин</option>
        <option value="Zombie">Зомби</option>
        <option value="Dragon">Дракон</option>
        <option value="Demon">Демон</option>
        <option value="Troll">Тролль</option>
        <option value="Skeleton">Скелет</option>
        <option value="Golem">Голем</option>
        <option value="Kobold">Кобольд</option>
        <option value="Мимик">Мимик</option>
        <option value="Ghost">Умертвие</option>
        <option value="Spider">Паук</option>
        <option value="Vampire">Вампир</option>
      </select>
    );
  };

  return (
    <li className="flex items-center gap-2">
      <img className="w-10 h-10 object-contain" src={currentImg} alt={users.name} />
      <input {...register(`${arrayName}.${index}.name` as any)} />
      {arrayName === 'users' ? <UserSelect /> : <EnemiesSelect />}
      <select className="bg-neutral-700" {...register(`${arrayName}.${index}.size` as any)}>
        <option value="small">Маленький</option>
        <option value="medium">Средний</option>
        <option value="huge">Большой</option>
        <option value="large">Огромный</option>
      </select>
      {arrayName === 'users' && (
        <input className="w-[2vw]" {...register(`${arrayName}.${index}.hp` as any)} />
      )}
      <input className="w-[2vw]" {...register(`${arrayName}.${index}.initiative` as any)} />
      <div className="flex flex-col"></div>
      <button type="button" onClick={handleRemove}>X</button>
    </li>
  );
};
