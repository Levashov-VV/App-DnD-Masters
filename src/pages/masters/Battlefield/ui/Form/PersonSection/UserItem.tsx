import { useFormContext, useWatch } from 'react-hook-form';
import Person from '../../../../../../../public/img/masters/Battlefield/Figures/Logo-Profile.png';
import { useCharacter } from '@/shared/hooks/auth/useCharacter';
import type { Path } from 'react-hook-form';
import type { User, CreatureSide, BattleFormData } from '../types';

interface UserItemProps {
  index: number;
  arrayName: 'users' | 'enemies';
}
const UserSelect = ({ index, arrayName }: UserItemProps) => {
  const classField = `${arrayName}.${index}.className` as const;
  const { register } = useFormContext<BattleFormData>();
  return (
    <select
      className="bg-neutral-700"
      {...register(classField as Path<BattleFormData>)}
      defaultValue=""
    >
      <option value="" disabled>
        Выберите расу
      </option>
      <option value="Aasimar">Аасимар</option>
      <option value="Goliaf">Голиаф</option>
      <option value="Dwarf">Дварф</option>
      <option value="DragonBorn">Драконорождённый</option>
      <option value="Genasi">Дженази</option>
      <option value="Kalashtar">Калаштар</option>
      <option value="Centaur">Кентавр</option>
      <option value="Minotaur">Минотавр</option>
      <option value="Orc">Орк</option>
      <option value="Halfling">Полурослик</option>
      <option value="Tabaxi">Табакси</option>
      <option value="Tiffling">Тиффлинг</option>
      <option value="Human">Человек</option>
      <option value="Shifter">Шифтер</option>
      <option value="Elf">Эльф</option>
    </select>
  );
};

const EnemiesSelect = ({ index, arrayName }: UserItemProps) => {
  const classField = `${arrayName}.${index}.className` as const;
  const { register } = useFormContext<BattleFormData>();
  return (
    <select
      className="bg-neutral-700"
      {...register(classField as Path<BattleFormData>)}
      defaultValue=""
    >
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

export const UserItem: React.FC<UserItemProps> = ({ index, arrayName }) => {
  const { control, register } = useFormContext<BattleFormData>();
  const { data: characters } = useCharacter();

  const users = useWatch({
    control,
    name: `${arrayName}.${index}` as Path<BattleFormData>,
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

  return (
    <li className="flex items-center gap-2">
      <img className="w-10 h-10 object-contain" src={currentImg} alt={users.name} />
      <input {...register(`${arrayName}.${index}.name` as Path<BattleFormData>)} />
      {arrayName === 'users' ? (
        <UserSelect index={index} arrayName={arrayName} />
      ) : (
        <EnemiesSelect index={index} arrayName={arrayName} />
      )}

      <select
        className="bg-neutral-700"
        {...register(`${arrayName}.${index}.size` as Path<BattleFormData>)}
      >
        <option value="small">Маленький</option>
        <option value="medium">Средний</option>
        <option value="huge">Большой</option>
        <option value="large">Огромный</option>
      </select>
      {arrayName === 'users' && (
        <input
          className="w-[2vw]"
          {...register(`${arrayName}.${index}.hp` as Path<BattleFormData>)}
        />
      )}
      <input
        className="w-[2vw]"
        {...register(`${arrayName}.${index}.initiative` as Path<BattleFormData>)}
      />
      <div className="flex flex-col"></div>
      <button type="button" onClick={handleRemove}>
        X
      </button>
    </li>
  );
};
