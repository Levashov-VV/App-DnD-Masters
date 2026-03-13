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
  emptySlot: { top: number; left: number; width: number; height: number };
  itemPosition: { top: number; left: number; width: number; height: number };
  zIndex: number;
}

const getHandItemType = (item: EquipmentItem): 'sword' | 'shield' | null => {
  if (!item.type) return null;
  const typeLower = item.type.toLowerCase();
  if (typeLower.includes('щит') || typeLower === 'щит') return 'shield';
  if (
    typeLower.includes('меч') ||
    typeLower.includes('оружие') ||
    typeLower === 'оружие ближнего боя'
  )
    return 'sword';
  return null;
};

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

const getItemStyle = (slotType: EquipmentSlot, itemType: 'sword' | 'shield' | null) => {
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
  if (!itemType && slotType === 'armor') {
    return { inset: 0, width: '100%', height: '100%', objectFit: 'contain' as const };
  }
  if (slotType === 'mainHand') {
    if (itemType === 'sword')
      return {
        transform: 'rotate(210deg)',
        transformOrigin: 'bottom center',
        bottom: '110%',
        left: '80%',
        width: '90%',
        height: '110%',
      };
    if (itemType === 'shield')
      return {
        transform: 'rotate(0deg)',
        transformOrigin: 'center',
        top: '25%',
        left: '20%',
        width: '90%',
        height: '70%',
      };
  }
  if (slotType === 'offHand') {
    if (itemType === 'sword')
      return {
        transform: 'rotate(-210deg)',
        transformOrigin: 'bottom center',
        bottom: '75%',
        right: '95%',
        width: '90%',
        height: '100%',
      };
    if (itemType === 'shield')
      return {
        transform: 'rotate(0deg) scaleX(-1)',
        transformOrigin: 'center',
        top: '50%',
        right: '45%',
        width: '90%',
        height: '70%',
      };
  }
  return {};
};

export function EquipmentSlots({ equipped, onSlotClick, onEdit }: EquipmentSlotsProps) {
  // Для визуальной обратной связи при tap
  const [activeSlot, setActiveSlot] = useState<EquipmentSlot | null>(null);

  const slotAreas: SlotArea[] = [
    {
      type: 'armor',
      emptySlot: { top: 30, left: 25, width: 50, height: 30 },
      itemPosition: { top: 27, left: 10, width: 75, height: 40 },
      zIndex: 20,
    },
    {
      type: 'ranged',
      emptySlot: { top: 10, left: 55, width: 22, height: 25 },
      itemPosition: { top: 20, left: 52, width: 28, height: 35 },
      zIndex: 10,
    },
    {
      type: 'offHand',
      emptySlot: { top: 40, left: 0, width: 22, height: 45 },
      itemPosition: { top: 15, left: 4, width: 60, height: 60 },
      zIndex: 15,
    },
    {
      type: 'mainHand',
      emptySlot: { top: 40, left: 72, width: 22, height: 45 },
      itemPosition: { top: 30, left: 50, width: 60, height: 60 },
      zIndex: 15,
    },
  ];

  const getItemInSlot = (slotType: EquipmentSlot): EquipmentItem | undefined =>
    equipped.find((item) => item.slot === slotType);

  const handleSlotClick = (slotType: EquipmentSlot) => {
    const item = getItemInSlot(slotType);
    // Кратковременный active-эффект для тач-обратной связи
    setActiveSlot(slotType);
    setTimeout(() => setActiveSlot(null), 200);
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
        return 'Сил. рука';
      case 'offHand':
        return 'Слаб. рука';
      case 'ranged':
        return 'Дальний';
      default:
        return '';
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Размер под мобильный: 55vw вместо 20vw */}
      <div className="relative w-[55vw] aspect-[3/4] flex items-center justify-center">
        <img
          src={Shadow}
          alt="Силуэт персонажа"
          className="absolute inset-0 w-full h-full object-contain select-none"
          draggable={false}
        />

        {slotAreas.map((area) => {
          const item = getItemInSlot(area.type);
          const slotImage = getSlotImage(area.type, item);
          const isActive = activeSlot === area.type;

          const handItemType =
            item && (area.type === 'mainHand' || area.type === 'offHand')
              ? getHandItemType(item)
              : null;

          const itemStyle =
            area.type === 'ranged' || handItemType
              ? getItemStyle(area.type, handItemType)
              : getItemStyle(area.type, null);

          const coords = item ? area.itemPosition : area.emptySlot;

          return (
            <div
              key={area.type}
              className="absolute cursor-pointer transition-all duration-150"
              style={{
                top: `${coords.top}%`,
                left: `${coords.left}%`,
                width: `${coords.width}%`,
                height: `${coords.height}%`,
                zIndex: area.zIndex,
                // Масштаб при нажатии — тач-фидбек
                transform: isActive ? 'scale(0.93)' : 'scale(1)',
              }}
              onClick={() => handleSlotClick(area.type)}
            >
              {/* Пустой слот — рамка видна ВСЕГДА, не только при hover */}
              {!item && (
                <div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    border: isActive
                      ? '3px dashed rgba(251, 191, 36, 1)'
                      : '2px dashed rgba(251, 191, 36, 0.55)',
                    background: isActive
                      ? 'radial-gradient(ellipse at center, rgba(251,191,36,0.2) 0%, transparent 70%)'
                      : 'radial-gradient(ellipse at center, rgba(251,191,36,0.07) 0%, transparent 70%)',
                    boxShadow: isActive ? '0 0 18px 4px rgba(251,191,36,0.35)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                />
              )}

              {/* Лейбл пустого слота — виден ВСЕГДА */}
              {!item && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="text-center">
                    <div
                      className="text-amber-200 font-bold whitespace-nowrap"
                      style={{ fontSize: 'clamp(7px, 2.2vw, 11px)' }}
                    >
                      {getSlotLabel(area.type)}
                    </div>
                    <div
                      className="text-amber-400/70 font-medium"
                      style={{ fontSize: 'clamp(6px, 1.8vw, 9px)' }}
                    >
                      + добавить
                    </div>
                  </div>
                </div>
              )}

              {/* Экипированный предмет */}
              {item && slotImage && (
                <img
                  src={slotImage}
                  alt={item.name}
                  className="absolute pointer-events-none select-none"
                  draggable={false}
                  style={{
                    ...itemStyle,
                    transition: 'filter 0.15s ease',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Легенда — адаптирована под мобильный */}
      <div
        className="relative bottom-[5vh] bg-stone-800/60 border-2 border-amber-600 rounded-lg backdrop-blur-sm w-[80vw]"
        style={{ padding: '1.2vw 2vw' }}
      >
        <div
          className="flex items-center justify-center gap-[3vw]"
          style={{ fontSize: 'clamp(9px, 3vw, 13px)' }}
        >
          <div className="flex items-center gap-[1.5vw]">
            <div className="w-[3vw] h-[3vw] bg-green-600 border-2 border-green-400 rounded shadow-sm shadow-green-400/50" />
            <span className="text-amber-100 font-medium">Экипировано</span>
          </div>
          <div className="flex items-center gap-[1.5vw]">
            <div className="w-[3vw] h-[3vw] bg-stone-900/80 border-2 border-amber-400 border-dashed rounded animate-pulse" />
            <span className="text-amber-100 font-medium">Свободно</span>
          </div>
        </div>
        <div
          className="text-center text-amber-100/60 italic mt-[0.8vw]"
          style={{ fontSize: 'clamp(8px, 2.5vw, 11px)' }}
        >
          Нажмите на слот для управления
        </div>
      </div>
    </div>
  );
}
