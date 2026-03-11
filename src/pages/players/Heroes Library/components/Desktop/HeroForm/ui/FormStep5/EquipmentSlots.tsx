import { useState } from 'react';
import type {
  EquipmentItem,
  EquipmentSlot,
} from '../../../../../../../../features/heroes/schemas/heroSchema';

import Shadow from '/img/players/Character Sheet/PersonSection/Shadow.png';
import Bow from '/img/players/Character Sheet/PersonSection/Bow.png';
import Armor from '/img/players/Character Sheet/PersonSection/Armor.png';
import Shield from '/img/masters/home/DescriptionApp/Shield.png';
import Sword from '/img/masters/home/DescriptionApp/Sword.png';

interface EquipmentSlotsProps {
  equipped: EquipmentItem[];
  onSlotClick: (slotType: EquipmentSlot) => void;
  onEdit: (item: EquipmentItem) => void;
  onRemove: (id: string) => void;
}

interface SlotArea {
  type: EquipmentSlot;
  // Координаты для ПУСТОГО слота
  emptySlot: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  // Координаты для ПРЕДМЕТА
  itemPosition: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  zIndex: number;
}

// Определение типа предмета для рук
const getHandItemType = (item: EquipmentItem): 'sword' | 'shield' | null => {
  if (!item.type) return null;

  const typeLower = item.type.toLowerCase();
  if (typeLower.includes('щит') || typeLower === 'Щит') return 'shield';
  if (
    typeLower.includes('меч') ||
    typeLower.includes('оружие') ||
    typeLower === 'Оружие ближнего боя'
  )
    return 'sword';

  return null;
};

// Маппинг слотов к изображениям
const getSlotImage = (slotType: EquipmentSlot, item?: EquipmentItem): string | null => {
  switch (slotType) {
    case 'armor':
      return Armor;
    case 'ranged':
      return Bow;
    case 'mainHand':
    case 'offHand':
      if (item) {
        const handType = getHandItemType(item);
        if (handType === 'sword') return Sword;
        if (handType === 'shield') return Shield;
      }
      return null;
    default:
      return null;
  }
};

// Позиционирование и поворот для ИЗОБРАЖЕНИЯ предмета
const getItemStyle = (slotType: EquipmentSlot, itemType: 'sword' | 'shield' | null) => {
  // Дальнобойное оружие (лук)
  if (slotType === 'ranged') {
    return {
      transform: 'rotate(45deg)',
      transformOrigin: 'center',
      inset: 0,
      top: '-35%',
      left: '30%',
      width: '100%',
      height: '100%',
      objectFit: 'contain' as const,
    };
  }

  // Броня
  if (!itemType && slotType === 'armor') {
    return {
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'contain' as const,
    };
  }

  // Сильная рука
  if (slotType === 'mainHand') {
    if (itemType === 'sword') {
      return {
        transform: 'rotate(210deg)',
        transformOrigin: 'bottom center',
        bottom: '110%',
        left: '80%',
        width: '90%',
        height: '110%',
      };
    }
    if (itemType === 'shield') {
      return {
        transform: 'rotate(0deg)',
        transformOrigin: 'center',
        top: '25%',
        left: '20%',
        width: '90%',
        height: '70%',
      };
    }
  }

  // Слабая рука
  if (slotType === 'offHand') {
    if (itemType === 'sword') {
      return {
        transform: 'rotate(-210deg)',
        transformOrigin: 'bottom center',
        bottom: '75%',
        right: '95%',
        width: '90%',
        height: '100%',
      };
    }
    if (itemType === 'shield') {
      return {
        transform: 'rotate(0deg) scaleX(-1)',
        transformOrigin: 'center',
        top: '50%',
        right: '45%',
        width: '90%',
        height: '70%',
      };
    }
  }

  return {};
};

export function EquipmentSlots({ equipped, onSlotClick, onEdit }: EquipmentSlotsProps) {
  const [hoveredSlot, setHoveredSlot] = useState<EquipmentSlot | null>(null);

  // Координаты для каждого слота
  const slotAreas: SlotArea[] = [
    // БРОНЯ
    {
      type: 'armor',
      // Пустой слот
      emptySlot: { top: 30, left: 25, width: 50, height: 30 },
      // Предмет
      itemPosition: { top: 27, left: 10, width: 75, height: 40 },
      zIndex: 20,
    },
    // ЛУК
    {
      type: 'ranged',
      // Пустой слот
      emptySlot: { top: 10, left: 55, width: 22, height: 25 },
      // Предмет
      itemPosition: { top: 20, left: 52, width: 28, height: 35 },
      zIndex: 10,
    },
    // СЛАБАЯ РУКА
    {
      type: 'offHand',
      // Пустой слот
      emptySlot: { top: 40, left: 0, width: 22, height: 45 },
      // Предмет
      itemPosition: { top: 15, left: 4, width: 60, height: 60 },
      zIndex: 15,
    },
    // СИЛЬНАЯ РУКА
    {
      type: 'mainHand',
      // Пустой слот
      emptySlot: { top: 40, left: 72, width: 22, height: 45 },
      // Предмет
      itemPosition: { top: 30, left: 50, width: 60, height: 60 },
      zIndex: 15,
    },
  ];

  const getItemInSlot = (slotType: EquipmentSlot): EquipmentItem | undefined => {
    return equipped.find((item) => item.slot === slotType);
  };

  const handleSlotClick = (slotType: EquipmentSlot) => {
    const item = getItemInSlot(slotType);
    if (item) {
      onEdit(item);
    } else {
      onSlotClick(slotType);
    }
  };

  const getSlotLabel = (type: EquipmentSlot): string => {
    switch (type) {
      case 'armor':
        return 'Броня';
      case 'mainHand':
        return 'Сильная рука';
      case 'offHand':
        return 'Слабая рука';
      case 'ranged':
        return 'Дальний бой';
      default:
        return '';
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-[20vw] aspect-[3/4] flex items-center justify-center">
        <img
          src={Shadow}
          alt="Силуэт персонажа"
          className="absolute inset-0 w-full h-full object-contain select-none"
          draggable={false}
        />

        {slotAreas.map((area) => {
          const item = getItemInSlot(area.type);
          const slotImage = getSlotImage(area.type, item);
          const isHovered = hoveredSlot === area.type;

          const handItemType =
            item && (area.type === 'mainHand' || area.type === 'offHand')
              ? getHandItemType(item)
              : null;

          const itemStyle =
            area.type === 'ranged' || handItemType
              ? getItemStyle(area.type, handItemType)
              : getItemStyle(area.type, null);

          // Координаты
          const coords = item ? area.itemPosition : area.emptySlot;

          return (
            <div
              key={area.type}
              className="absolute cursor-pointer group transition-all duration-300"
              style={{
                top: `${coords.top}%`,
                left: `${coords.left}%`,
                width: `${coords.width}%`,
                height: `${coords.height}%`,
                zIndex: area.zIndex,
              }}
              onMouseEnter={() => setHoveredSlot(area.type)}
              onMouseLeave={() => setHoveredSlot(null)}
              onClick={() => handleSlotClick(area.type)}
            >
              {/* Border для пустого слота */}
              {!item && isHovered && (
                <div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    border: '3px dashed rgba(251, 191, 36, 0.6)',
                    background:
                      'radial-gradient(ellipse at center, rgba(251,191,36,0.15) 0%, transparent 70%)',
                    boxShadow: '0 0 30px 5px rgba(251,191,36,0.3)',
                  }}
                />
              )}

              {/* Изображение */}
              {item && slotImage && (
                <img
                  src={slotImage}
                  alt={item.name}
                  className="absolute pointer-events-none select-none"
                  draggable={false}
                  style={{
                    ...itemStyle,
                    filter: isHovered
                      ? 'brightness(1.15) drop-shadow(0 0 25px rgba(34,197,94,0.9)) drop-shadow(0 0 35px rgba(34,197,94,0.6))'
                      : 'none',
                    transition: 'filter 0.3s ease',
                  }}
                />
              )}

              {/* Пустой слот */}
              {!item && isHovered && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="">
                    <div className="text-amber-100 font-bold text-[1vh] whitespace-nowrap text-center">
                      {getSlotLabel(area.type)}
                    </div>
                    <div className="text-amber-300/80 font-bold text-[0.8vh] text-center">
                      Нажмите для добавления
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Легенда */}
      <div
        style={{ padding: '0.5vw' }}
        className="relative bottom-[6vh] bg-stone-800/60 border-2 border-amber-600 rounded-lg backdrop-blur-sm w-[30vw]"
      >
        <div className="flex items-center justify-center gap-4 text-[1.6vh]">
          <div className="flex items-center gap-2">
            <div className="w-[1vw] h-[1vw] bg-green-600 border-2 border-green-400 rounded shadow-sm shadow-green-400/50" />
            <span className="text-amber-100 font-medium">Экипировано</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-[1vw] h-[1vw] bg-stone-900/80 border-2 border-amber-400 border-dashed rounded animate-pulse" />
            <span className="text-amber-100 font-medium">Доступно</span>
          </div>
          <div className="text-amber-100/70 text-[1vh] italic">
            Нажмите на предмет для просмотра информации
          </div>
        </div>
      </div>
    </div>
  );
}
