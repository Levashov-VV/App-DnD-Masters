import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Battlefield() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRef1 = useRef<HTMLDivElement>(null);
  const textRef2 = useRef<HTMLDivElement>(null);
  const textRef3 = useRef<HTMLDivElement>(null);
  const textRef4 = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const leftMapRef = useRef<HTMLImageElement>(null);
  const rightMapRef = useRef<HTMLImageElement>(null);
  const textLeftRef = useRef<HTMLDivElement>(null);

  const texts = [
    'Вы можете интерактивно контролировать весь путь от создания боя до внедрения персонажей на поле, а также управление показателями характеристик здоровья и инициативы.',
    'Блок боевого поля позволяет мастерам настраивать арену шаг за шагом: создавайте персонажей и окружение',
    'Затем добавляйте существ — задавайте позиции, инициативу, текущие HP и окружение прямо на сетке.',
    'Интерфейс показывает поле боя игрокам со всеми визуальными эффектами и позволяет динамически контролировать последовательность ходов с таймером.',
  ];

  useEffect(() => {
    const container = containerRef.current;
    const textElements = [textRef1, textRef2, textRef3, textRef4];
    if (!container) return;

    textRefs.current = textElements.map((ref) => ref.current);

    const ctx = gsap.context(() => {
      const textRightRefs = textRefs.current.filter(Boolean) as HTMLDivElement[];
      const titleElement = titleRef.current;
      const leftMapElement = leftMapRef.current;
      const rightMapElement = rightMapRef.current;
      const textLeftElement = textLeftRef.current;

      // Заголовок
      gsap.set(titleElement, { autoAlpha: 0, yPercent: -100 });
      ScrollTrigger.create({
        trigger: container.closest('section') || document.body,
        start: 'top 40%',
        end: 'bottom 20%',
        onEnter: () => {
          gsap.to(titleElement, {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1.2,
            ease: 'back.out(1.7)',
          });
        },
        onLeaveBack: () => {
          gsap.to(titleElement, {
            autoAlpha: 0,
            yPercent: -100,
            duration: 0.8,
            ease: 'power2.in',
          });
        },
      });
      // Левая картинка
      if (leftMapElement) {
        gsap.set(leftMapElement, { xPercent: -20, autoAlpha: 0 });

        ScrollTrigger.create({
          trigger: container,
          start: 'top 105%',
          end: 'bottom 65%',
          scrub: 3,
          animation: gsap.to(leftMapElement, {
            xPercent: 0,
            autoAlpha: 1,
            duration: 4,
            ease: 'power2.out',
          }),
        });
      }

      // Правая картинка
      if (rightMapElement) {
        gsap.set(rightMapElement, { xPercent: 20, autoAlpha: 0 });

        ScrollTrigger.create({
          trigger: container,
          start: 'top 105%',
          end: 'bottom 65%',
          scrub: 3,
          animation: gsap.to(rightMapElement, {
            xPercent: 0,
            autoAlpha: 1,
            duration: 4,
            ease: 'power2.out',
          }),
        });
      }

      // Левая часть текста
      if (textLeftElement) {
        gsap.set(textLeftElement, { autoAlpha: 0, y: 10, scale: 0.9 });
        ScrollTrigger.create({
          trigger: container,
          start: 'top 105%',
          onEnter: () =>
            gsap.to(textLeftElement, { autoAlpha: 1, y: 0, scale: 1, ease: 'back.out(1.7)' }),
        });
      }
      //Правая часть текста
      if (textRightRefs.length === 0) {
        return;
      }
      gsap.set(textRightRefs, {
        autoAlpha: 0,
        y: 10,
        scale: 0.9,
      });
      const tl = gsap.timeline({
        repeat: -1,
        defaults: { duration: 1 },
      });

      textRightRefs.forEach((ref) => {
        tl.to(ref, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          ease: 'back.out(1.7)',
        })
          .to({}, { duration: 7 })
          .to(
            ref,
            {
              autoAlpha: 0,
              y: 0,
              scale: 0.9,
              ease: 'power2.in',
              duration: 0.5,
            },
            '-=0.5'
          );
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef]);

  return (
    <section className="h-[120vh] z-0 w-screen bg-neutral-900 text-amber-100">
      <article className="flex flex-col items-center gap-[15vh]">
        <div ref={titleRef} className="text-center text-[7vh]">
          Создавайте динамичные сражения в D&D с полностью настраиваемой боевой картой
        </div>
        <div className="flex flex-row gap-[10vw]">
          <div className="flex flex-col items-center gap-[10vh] ">
            <div className="flex flex-col items-center gap-[3vh]">
              <div className="w-[40vw] text-left">
                <p ref={textLeftRef} className="text-[1.6vw]">
                  Выберите одну из 5 готовых арен (лес, подземелье, городская площадь, таверна,
                  болото) или загрузите собственное изображение — сетка автоматически наложится с
                  клетками по 5 футов по стандартам 5e.
                </p>
              </div>
              <div className="text-center">
                <img
                  ref={leftMapRef}
                  className="w-[40vw] z-0 object-contain"
                  src="../../../../../../public/img/masters/Battlefield/Map/Dungeon.jpg"
                  alt="Dungeon"
                />
              </div>
            </div>
          </div>
          <div className="w-[40vw] flex flex-col items-center">
            <div className="flex flex-col items-center">
              <img
                ref={rightMapRef}
                className="w-[40vw] z-0"
                src="../../../../../../public/img/masters/Battlefield/Map/CitySquare.jpg"
                alt="CitySquare"
              />
            </div>
            <div className="w-[40vw] h-[25vh] relative">
              <div
                ref={containerRef}
                className="absolute inset-0 w-full h-20vh flex items-start justify-center text-[1.6vw] leading-relaxed"
              >
                <div
                  ref={textRef1}
                  className="absolute inset-0 w-full flex items-center justify-center opacity-0 text-left"
                >
                  {texts[0]}
                </div>
                <div
                  ref={textRef2}
                  className="absolute inset-0 w-full flex items-center justify-center opacity-0 text-left"
                >
                  {texts[1]}
                </div>
                <div
                  ref={textRef3}
                  className="absolute inset-0 w-full flex items-center justify-center opacity-0 text-left"
                >
                  {texts[2]}
                </div>
                <div
                  ref={textRef4}
                  className="absolute inset-0 w-full flex items-center justify-center opacity-0 text-left"
                >
                  {texts[3]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
      <div className="w-[80vw] rounded-xl bg-amber-100 h-0.5 opacity-50 relative top-[10vh] left-[10vw]"></div>
    </section>
  );
}
