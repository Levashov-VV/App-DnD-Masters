import { CharacterSection } from '../CharacterSection';
import Equipment from '/img/players/Character Sheet/Equipment.jpg';
import Magic from '/img/players/Character Sheet/Magic.jpg';
import Treasures from '/img/players/Character Sheet/Treasures.jpg';
import Table from '/img/players/Character Sheet/Table.jpg';
import { useRef } from 'react';
import { gsap } from 'gsap';

import { useGSAP } from '@gsap/react';

export const CharacterSheetDesktop = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shieldsRef = useRef<HTMLDivElement>(null);
  const titleRefs = useRef<(HTMLElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shieldRefs = useRef<(HTMLDivElement | null)[]>([]);

  const textDescription = [
    {
      text: 'Редактируй основные характеристики своего персонажа (сила, ловкость и т.д.)',
      img: Table,
      id: 1,
    },
    {
      text: 'Подбирай экипировку, оружие и расходники',
      img: Equipment,
      id: 2,
    },
    {
      text: 'Контролируй ячейки и список заклинаний',
      img: Magic,
      id: 3,
    },
    {
      text: 'Вноси заметки о найденных предметах и развитии сюжетной линии.',
      img: Treasures,
      id: 4,
    },
  ];

  const textCharacteristics = [
    { text: 'Сила', min: 8, max: 18, id: 1 },
    { text: 'Ловкость', min: 10, max: 16, id: 2 },
    { text: 'Интеллект', min: 8, max: 15, id: 3 },
  ];

  useGSAP(
    () => {
      titleRefs.current.forEach((el) => {
        if (el) {
          gsap.fromTo(
            el,
            { clipPath: 'inset(0 0 220% 0)' },
            {
              clipPath: 'inset(0 0 0% 0%)',
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 60%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        }
      });

      imageRefs.current.forEach((el) => {
        if (el) {
          gsap.fromTo(
            el,
            { clipPath: 'inset(0 0 220% 0)' },
            {
              clipPath: 'inset(0 0 0% 0%)',
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 60%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        }
      });

      const shieldElements = shieldRefs.current.filter((el): el is HTMLDivElement => el !== null);

      if (shieldElements.length > 0 && shieldsRef.current) {
        gsap.fromTo(
          shieldElements,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            stagger: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: shieldsRef.current,
              start: 'top 85%',
              end: 'bottom 50%',
              scrub: 1,
              toggleActions: 'play none none reverse',
              once: true,
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-screen h-[237vh] flex flex-col">
      <div className="text-center text-[7vh]">
        <h2
          ref={(el) => {
            titleRefs.current[0] = el;
          }}
        >
          Твоя личная библиотека героев
        </h2>
        <h3
          ref={(el) => {
            titleRefs.current[1] = el;
          }}
          className="text-center text-[5vh]"
        >
          Создавай своих персонажей и сохраняй их в библиотеке
        </h3>
      </div>

      <div className="flex flex-col h-[175vh] gap-[10vh] relative top-[5vh]">
        {textDescription.map((item, index) => (
          <div
            key={item.id}
            className={`flex flex-col items-center gap-[4vh] w-[30vw] ${
              index === 2 ? 'absolute top-[30vh] left-[60vw]' : 'relative left-[10vw]'
            } ${index === 3 ? 'relative bottom-[40vh] left-[60vw]' : ''}`}
            ref={(el) => {
              imageRefs.current[index] = el;
            }}
          >
            <img
              className="w-[30vw] h-[50vh] object-cover rounded-xl shadow-2xl hover:scale-[1.02] transition-all duration-300"
              src={item.img}
              alt={item.text}
            />
            <div className="text-center">
              <h3 className="w-[30vw] text-[3vh] font-bold font-medieval leading-tight tracking-wide">
                {item.text}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center flex flex-col gap-[5vh] text-[4vh]">
        <h4
          ref={(el) => {
            titleRefs.current[2] = el;
          }}
        >
          Всё продумано для максимального удобства: понятная структура листов, быстрое
          редактирование значений, автоматические расчеты и мгновенный доступ ко всей информации.
        </h4>

        <div
          ref={shieldsRef}
          className="relative top-[3vh] flex justify-center flex-row gap-[20vw]"
        >
          {textCharacteristics.map((item, index) => (
            <CharacterSection
              key={item.id}
              rootRef={(el) => {
                shieldRefs.current[index] = el;
              }}
              peakValue={item.max}
              minValue={item.min}
              label={item.text}
              riseDuration={1500}
              fallDuration={1500}
              pauseDuration={1500}
            />
          ))}
        </div>
      </div>

      <div className="w-[80vw] rounded-xl bg-amber-100 h-0.5 opacity-50 relative top-[13vh] left-[10vw]"></div>
    </div>
  );
};
