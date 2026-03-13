import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { assetUrl } from '@/shared/utils/assetUrl';

export function DiceTrayMobile() {
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subTitleRef = useRef<HTMLDivElement>(null);
  const oneDiceRollRef = useRef<HTMLDivElement>(null);
  const multipleDiceRollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const leftText = leftTextRef.current;
      const rightText = rightTextRef.current;
      const title = titleRef.current;
      const subTitle = subTitleRef.current;
      const oneDiceRoll = oneDiceRollRef.current;
      const multipleDiceRoll = multipleDiceRollRef.current;

      //Заголовок
      if (!title) return;

      gsap.fromTo(
        title,
        { y: 0, opacity: 0 },
        {
          opacity: 1,
          y: '0vh',
          duration: 1,
          scrollTrigger: {
            trigger: title,
            start: 'top 90%',
            end: 'bottom 20%',
            scrub: 1,
          },
        }
      );
      //Текст вверху
      if (!leftText || !rightText) return;

      if (leftText) {
        gsap.fromTo(
          leftText,
          { y: 0, opacity: 0 },
          {
            opacity: 1,
            y: '15vh',
            duration: 1,
            scrollTrigger: {
              trigger: leftText,
              start: 'top 90%',
              end: 'bottom 20%',
              scrub: 1,
            },
          }
        );
      }

      if (rightText) {
        gsap.fromTo(
          rightText,
          { x: '-15vh', opacity: 0 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            scrollTrigger: {
              trigger: rightText,
              start: 'top 90%',
              end: 'bottom 60%',
              scrub: 1,
            },
          }
        );
      }
      //Подзаголовок
      if (!subTitle) return;

      gsap.fromTo(
        subTitle,
        { y: '-15vh', opacity: 0, scale: 0.6 },
        {
          opacity: 1,
          scale: 1,
          y: '0vh',
          duration: 1,
          scrollTrigger: {
            trigger: subTitle,
            start: 'top 90%',
            end: 'bottom 20%',
            scrub: 1,
          },
        }
      );

      //Одиночный бросок
      if (!oneDiceRoll) return;

      gsap.fromTo(
        oneDiceRoll,
        { x: '-25vh', opacity: 0 },
        {
          opacity: 1,
          x: '0vh',
          duration: 1,
          scrollTrigger: {
            trigger: oneDiceRoll,
            start: 'top 90%',
            end: 'bottom 60%',
            scrub: 1,
          },
        }
      );

      //Множественный бросок
      if (!multipleDiceRoll) return;

      gsap.fromTo(
        multipleDiceRoll,
        { x: '25vh', opacity: 0 },
        {
          opacity: 1,
          x: '0vh',
          duration: 1,
          scrollTrigger: {
            trigger: multipleDiceRoll,
            start: 'top 90%',
            end: 'bottom 80%',
            scrub: 1,
          },
        }
      );
    }, []);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative top-[5vh] flex flex-col w-screen bg-neutral-900 text-amber-100 text-[3.2vh] overflow-x-hidden">
      <article className="flex flex-col gap-[1vh]">
        <div ref={titleRef} className="flex justify-center text-center text-[5vh]">
          Интерактивный 3D Dice Tray
        </div>
        <div>
          <img
            className="h-[50vh] object-cover"
            src={assetUrl('img/masters/home/DiceTray/DiceTray.png')}
            alt="Dice Tray"
          />
        </div>
        <div className="flex justify-center">
          <div className="flex flex-col gap-[10vh] w-screen">
            <div ref={leftTextRef} className="text-center relative bottom-[10vh] text-[3.2vh]">
              Реалистичная симуляция бросков кубиков с физикой: падение сверху, прыжки, вращение
              d4-d20
            </div>
            <div className="w-screen">
              <img src={assetUrl('img/masters/home/DiceTray/Tarask.png')} />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex flex-col w-screen">
            <div ref={rightTextRef} className="w-[95vw] relative left-[5vw] text-center">
              Комплексные формулы для подсчётов ваших результатов в игре
            </div>
            <div className="w-screen relative right-[2vw]">
              <img src={assetUrl('img/masters/home/DiceTray/Beholder.png')} />
            </div>
          </div>
        </div>
        <div ref={subTitleRef} className="flex relative bottom-[2vh] justify-center text-[4vh]">
          Два подраздела бросков
        </div>
        <div className="flex flex-col items-center gap-[2vh]">
          <div
            ref={oneDiceRollRef}
            className="flex flex-col items-center w-[90vw] gap-[2vh] rounded-2xl border-2 border-amber-100 bg-neutral-700"
          >
            <div>Единичный бросок</div>
            <div className="text-center">
              Вы выбираете тип и вид кубика (d4-d20), совершаете один бросок и получаете наглядную
              3D‑анимацию с корректным результатом и историей каждого броска
            </div>
          </div>
          <div
            ref={multipleDiceRollRef}
            className="flex flex-col items-center w-[90vw] gap-[2vh] rounded-2xl border-2 border-amber-100 bg-neutral-700"
          >
            <div>Множественный бросок</div>
            <div className="text-center">
              {' '}
              Вы выбираете типы и вид кубиков (d4 - d20), которые хотите использовать и их
              количество (максимум 3), вводите модификатор и получаете наглядную 3D‐анимацию с
              корректным результатом.
            </div>
          </div>
        </div>
      </article>
      <div className="w-[100vw] rounded-xl bg-amber-100 h-0.5 opacity-50 relative top-[10vh]" />
      <div className="h-[30vh]"></div>
    </section>
  );
}
