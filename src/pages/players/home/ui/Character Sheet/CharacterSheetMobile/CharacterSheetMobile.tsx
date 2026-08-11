import { CharacterSection } from '../CharacterSection';
import Equipment from '/img/players/Character Sheet/Equipment.jpg';
import Magic from '/img/players/Character Sheet/Magic.jpg';
import Treasures from '/img/players/Character Sheet/Treasures.jpg';
import Table from '/img/players/Character Sheet/Table.jpg';
import Library from '/img/players/Character Sheet/Library.jpg';
import { useRef } from 'react';
import { gsap } from 'gsap';

import { useGSAP } from '@gsap/react';

export const CharacterSheetMobile = () => {
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
                start: 'top 90%',
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
                start: 'top 80%',
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
    <div ref={containerRef} className="w-screen h-[315vh] flex flex-col">
      <div>
        <img src={Library} alt="library" className="w-screen" />
        <div
          ref={(el) => {
            titleRefs.current[0] = el;
          }}
          className="relative bottom-[45vh] z-20 inline-block text-[8vw] text-center font-bold leading-tight text-amber-100"
          style={{
            textShadow:
              '0 0 20px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,0.8), 0 4px 8px rgba(0,0,0,0.9), 0 8px 16px rgba(0,0,0,0.7)',
          }}
        >
          Твоя личная библиотека героев
        </div>
      </div>
      <div
        className="w-[95vw] relative bottom-[5vh] left-[2.5vw] text-center z-20 text-[7vw] text-amber-100"
        ref={(el) => {
          titleRefs.current[1] = el;
        }}
      >
        <h3>Создавай своих персонажей и сохраняй их в библиотеке</h3>
      </div>
      <div className="flex flex-col h-[250vh] gap-[2vh] text-amber-100">
        {textDescription.map((item, index) => (
          <div
            key={item.id}
            className={`w-screen flex flex-col items-center gap-[2vh]`}
            ref={(el) => {
              imageRefs.current[index] = el;
            }}
          >
            <div>
              <img
                className="w-[70vw] h-[35vh] object-cover rounded-4xl hover:scale-[1.02] transition-all duration-300"
                src={item.img}
                alt={item.text}
              />
            </div>
            <div className="text-center">
              <h3 className="w-[75vw] text-[3vh] font-bold font-medieval leading-tight tracking-wide">
                {item.text}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center flex flex-col gap-[5vh] text-[4vw] z-100 text-amber-100">
        <div
          ref={shieldsRef}
          className="relative bottom-[0vh] flex justify-center flex-row flex-wrap gap-x-[20vw] gap-y-[5vh]"
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
    </div>
  );
};
