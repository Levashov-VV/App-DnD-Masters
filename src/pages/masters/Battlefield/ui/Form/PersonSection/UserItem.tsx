import { useFormContext, useWatch } from 'react-hook-form';
import Person from '../../../../../../../public/img/masters/Battlefield/Figures/Logo-Profile.png';

type User = {
  id: number;
  name: string;
  img: string;
  logo: string;
  initiative: number;
  hp: number;
  size: string;
};

interface BattleFormData {
  characters: User[];
  enemies: User[];
  mapId: number;
  gridWidth: number;
  gridHeight: number;
}

interface UserItemProps {
  index: number;
  arrayName: 'characters' | 'enemies';
}

const selectUser = () => {
  return (
    <select className="bg-neutral-700">
      <option value="Dwarf">Гном</option>
      <option value="Goliaf">Голиаф</option>
      <option value="Dragonborn">Драконорождённый</option>
      <option value="Kalashtar">Калаштар</option>
      <option value="Minotaur">Минотавр</option>
      <option value="Tiffling">Тиффлинг</option>
      <option value="Human">Человек</option>
      <option value="Shifter">Шифтер</option>
      <option value="Elf">Эльф</option>
    </select>
  );
};

const selectEnemy = () => {
  return (
    <select className="bg-neutral-700">
      <option value="Dwarf">Гном</option>
    </select>
  );
};

export const UserItem: React.FC<UserItemProps> = ({ index, arrayName }) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<BattleFormData>();

  const character = useWatch({
    control,
    name: `${arrayName}.${index}` as any,
  });

  const handleRemove = () => {
    if (confirm(`Удалить ${character?.name || 'персонажа'}?`)) {
      window.dispatchEvent(
        new CustomEvent('removeCharacter', {
          detail: { arrayName, index },
        })
      );
    }
  };

  if (!character) return null;

  return (
    <li className="flex items-center gap-2">
      <img
        className="w-10 h-10 object-contain"
        src={character.img || Person}
        alt={character.name}
      />
      <input {...register(`${arrayName}.${index}.name` as any)} />
			{arrayName === 'characters' ? selectUser() : selectEnemy()}
      <select className="bg-neutral-700" {...register(`${arrayName}.${index}.size` as any)}>
        <option value="small">Маленький</option>
        <option value="medium">Средний</option>
        <option value="huge">Большой</option>
        <option value="large">Огромный</option>
      </select>
      <div className="flex flex-col"></div>
      <button onClick={handleRemove}>X</button>
    </li>
  );
};
