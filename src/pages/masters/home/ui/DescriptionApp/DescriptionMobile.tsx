import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import dice20 from '/img/masters/home/DescriptionApp/dice1d20.svg';
import dice10 from '/img/masters/home/DescriptionApp/dice1d10.svg';
import dice6 from '/img/masters/home/DescriptionApp/dice1d6.png';
import shield from '/img/masters/home/DescriptionApp/Shield.png';
import book from '/img/masters/home/DescriptionApp/book.png';
import sword from '/img/masters/home/DescriptionApp/Sword.png';
import Adventure from '/img/players/DescriptionApp/Adventure.jpg';
import Person from '/img/players/DescriptionApp/Person.png';
import Hero from '/img/players/DescriptionApp/Hero.png';
import Dragon from '/img/players/DescriptionApp/Dragon.jpg';


gsap.registerPlugin(ScrollTrigger);

const images = {
  dice20,
  dice10,
  dice6,
  shield,
  book,
  sword,
  Adventure,
  Person,
  Hero,
  Dragon,
} as const;

export function DescriptionAppMobile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);

  const adventureTextRef = useRef<HTMLSpanElement>(null);
  const heroTextRef = useRef<HTMLSpanElement>(null);
  const bookRef = useRef<HTMLImageElement>(null);
  const personBlockRef = useRef<HTMLDivElement>(null);
  const heroBlockRef = useRef<HTMLDivElement>(null);

  const tableTextRef = useRef<HTMLSpanElement>(null);
  const shieldRef = useRef<HTMLImageElement>(null);
  const swordRef = useRef<HTMLImageElement>(null);
  const dice20Ref = useRef<HTMLImageElement>(null);
  const dice10Ref = useRef<HTMLImageElement>(null);
  const dice6Ref = useRef<HTMLImageElement>(null);
  const magicTextRef = useRef<HTMLSpanElement>(null);
  const legendsTextRef = useRef<HTMLSpanElement>(null);
  const airTextRef = useRef<HTMLSpanElement>(null);
  const critsTextRef = useRef<HTMLSpanElement>(null);

  const number1Ref = useRef<HTMLSpanElement>(null);
  const number2Ref = useRef<HTMLSpanElement>(null);
  const number3Ref = useRef<HTMLSpanElement>(null);
  const number4Ref = useRef<HTMLSpanElement>(null);
  const number5Ref = useRef<HTMLSpanElement>(null);

  const handleImageLoad = () => {
    ScrollTrigger.refresh();
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const section1 = section1Ref.current;
      const section2 = section2Ref.current;
      const section3 = section3Ref.current;

      if (!container) return;

      if (adventureTextRef.current && section1) {
        gsap.fromTo(
          adventureTextRef.current,
          { opacity: 0, y: -30 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section1,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 1,
            },
          }
        );
      }

      if (heroTextRef.current && section1) {
        gsap.fromTo(
          heroTextRef.current,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: heroTextRef.current,
              start: 'top 75%',
              end: 'top 50%',
              scrub: 1,
            },
          }
        );
      }

      if (bookRef.current && section1) {
        gsap.fromTo(
          bookRef.current,
          { scale: 0.7, opacity: 0, rotation: -10 },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: bookRef.current,
              start: 'top 75%',
              end: 'top 50%',
              scrub: 1,
            },
          }
        );
      }

      if (personBlockRef.current && section1) {
        gsap.fromTo(
          personBlockRef.current,
          { scale: 0.8, x: -80, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            x: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: personBlockRef.current,
              start: 'top 75%',
              end: 'top 50%',
              scrub: 1,
            },
          }
        );
      }

      if (heroBlockRef.current && section1) {
        gsap.fromTo(
          heroBlockRef.current,
          { scale: 0.8, x: 80, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            x: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: heroBlockRef.current,
              start: 'top 75%',
              end: 'top 50%',
              scrub: 1,
            },
          }
        );
      }

      if (tableTextRef.current && section2) {
        gsap.fromTo(
          tableTextRef.current,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: tableTextRef.current,
              start: 'top 90%',
              end: 'top 60%',
              scrub: 1,
            },
          }
        );

        if (legendsTextRef.current) {
          gsap.fromTo(
            legendsTextRef.current,
            { scale: 0.8, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              ease: 'back.out(1.5)',
              scrollTrigger: {
                trigger: legendsTextRef.current,
                start: 'top 75%',
              },
            }
          );
        }
      }

      if (shieldRef.current && section2) {
        gsap.fromTo(
          shieldRef.current,
          { scale: 0.5, opacity: 0, rotation: -20, x: -10 },
          {
            x: 180,
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 1,
            ease: 'back.out(1.3)',
            scrollTrigger: {
              trigger: shieldRef.current,
              start: 'top 95%',
              end: 'top 20%',
              scrub: 5,
            },
          }
        );
      }

      if (swordRef.current && section2) {
        gsap.fromTo(
          swordRef.current,
          { x: 100, opacity: 0, rotation: 90 },
          {
            x: -200,
            opacity: 1,
            rotation: 180,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: swordRef.current,
              start: 'top 80%',
              end: 'top 30%',
              scrub: 5,
            },
          }
        );
      }

      if (magicTextRef.current) {
        gsap.fromTo(
          magicTextRef.current,
          { scale: 0.5, opacity: 0, filter: 'blur(5px)' },
          {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: magicTextRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      if (section2) {
        const numbers = [number1Ref, number2Ref, number3Ref, number4Ref, number5Ref];
        numbers.forEach((numRef, index) => {
          if (numRef.current) {
            const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1 });
            timeline
              .fromTo(
                numRef.current,
                { opacity: 0, scale: 0.5, x: 100, filter: 'blur(8px)' },
                {
                  opacity: 1,
                  scale: 1.5,
                  x: 0,
                  filter: 'blur(0px)',
                  duration: 2,
                  delay: index * 0.3,
                  ease: 'power2.out',
                }
              )
              .to(numRef.current, {
                opacity: 0,
                scale: 2,
                filter: 'blur(10px)',
                duration: 1,
              });
          }
        });
      }

      if (airTextRef.current) {
        gsap.fromTo(
          airTextRef.current,
          { scale: 0.7, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'back.out(1.3)',
            scrollTrigger: {
              trigger: airTextRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      if (dice20Ref.current && section3) {
        gsap.fromTo(
          dice20Ref.current,
          { y: -180, x: -15, rotation: 0, scale: 0.8 },
          {
            y: 0,
            x: 0,
            rotation: 180,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section3,
              start: 'top 20%',
              end: 'top 5%',
              scrub: 2,
            },
          }
        );
      }

      if (dice10Ref.current && section3) {
        gsap.fromTo(
          dice10Ref.current,
          { y: -180, x: 0, rotation: 0, scale: 0.7 },
          {
            y: 30,
            rotation: 270,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section3,
              start: 'top 20%',
              end: 'top 5%',
              scrub: 1.5,
            },
          }
        );
      }

      if (dice6Ref.current && section3) {
        gsap.fromTo(
          dice6Ref.current,
          { y: -160, x: 0, rotation: 0, scale: 0.8 },
          {
            y: 100,
            x: 0,
            rotation: 360,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section3,
              start: 'top 20%',
              end: 'top 5%',
              scrub: 1.5,
            },
          }
        );

        gsap.to(dice6Ref.current, {
          rotation: '+=15',
          duration: 0.3,
          yoyo: true,
          repeat: 2,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: section3,
            start: 'top 20%',
          },
        });
      }

      if (critsTextRef.current) {
        gsap.fromTo(
          critsTextRef.current,
          { scale: 0.8, opacity: 0, filter: 'blur(3px)' },
          {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: critsTextRef.current,
              start: 'top 95%',
            },
          }
        );
      }
    }, containerRef);

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      ctx.revert();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section className="bg-neutral-900">
      <div ref={containerRef} className="relative w-full overflow-x-hidden">
        <div ref={section1Ref} className="relative flex flex-col justify-center items-center">
          <div>
            <img
              className="w-[100vw] h-[50vh] opacity-70"
              src={images.Adventure}
              alt="Adventure"
              onLoad={handleImageLoad}
            />
            <div>
              <span
                ref={adventureTextRef}
                className="absolute top-[2vh] w-full z-20 text-[12vw] font-bold drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] leading-tight -tracking-[0.01em] text-center text-amber-100"
              >
                Настало время приключений
              </span>
            </div>
          </div>
          <div className="w-screen flex flex-col justify-center items-center">
            <span
              ref={heroTextRef}
              className="inline-block text-[10vw] text-center font-bold leading-tight text-amber-400"
            >
              Начни создавать своих героев ЗДЕСЬ
            </span>
            <img
              ref={bookRef}
              className="w-[70vh] object-contain pointer-events-none"
              src={images.book}
              alt="book"
              onLoad={handleImageLoad}
            />
          </div>
          <div className="relative top-[2vh] flex flex-row text-[2vh] text-center text-amber-100 leading-snug">
            <div ref={personBlockRef}>
              <h3>От первого персонажа</h3>
              <img
                className="h-[30vh] object-contain pointer-events-none"
                src={images.Person}
                alt="Person"
                onLoad={handleImageLoad}
              />
            </div>
            <div ref={heroBlockRef}>
              <h3>До легендарного героя</h3>
              <img
                className="h-[30vh] object-contain pointer-events-none"
                src={images.Hero}
                alt="Hero"
                onLoad={handleImageLoad}
              />
            </div>
          </div>
        </div>

        {/* СЕКЦИЯ 2 */}
        <div ref={section2Ref} className="relative flex flex-col justify-center items-center">
          <div className="flex justify-center relative">
            <span
              ref={tableTextRef}
              className="absolute top-[2vh] z-20 inline-block text-[8vw] text-center font-bold leading-tight text-amber-400"
              style={{
                textShadow:
                  '0 0 20px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,0.8), 0 4px 8px rgba(0,0,0,0.9), 0 8px 16px rgba(0,0,0,0.7)',
              }}
            >
              D&D — это не таблицы
            </span>
            <img
              className="w-[70vh] object-contain pointer-events-none"
              src={images.Dragon}
              alt="Dragon"
              onLoad={handleImageLoad}
            />
          </div>
          <div>
            <h3 className="text-[5vw] text-center text-amber-100 leading-snug">
              Это{' '}
              <span
                ref={legendsTextRef}
                className="inline-block text-[8vw] font-bold text-amber-400"
              >
                ЛЕГЕНДЫ
              </span>
              ,<br />
              которые вы создаете
            </h3>
          </div>
          <div className="flex flex-row">
            <div className="flex justify-center">
              <img
                ref={shieldRef}
                className="w-[50vw] object-contain pointer-events-none"
                src={images.shield}
                alt="shield"
              />
            </div>
            <div>
              <img
                ref={swordRef}
                className="w-[50vw] object-contain pointer-events-none right-[8vw]"
                src={images.sword}
                alt="sword"
              />
            </div>
          </div>

          <h3 className="text-[5vw] text-center text-amber-100">
            Превратите цифры в{' '}
            <span
              ref={magicTextRef}
              className="inline-block text-[6vw] font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent"
            >
              МАГИЮ
            </span>
          </h3>
          <div className="relative top-[10vh] w-screen pointer-events-none">
            <span ref={number1Ref} className="absolute text-[8vw] font-bold text-purple-400/70 left-[10vw] bottom-[2vh]" style={{ fontFamily: 'monospace' }}>20</span>
            <span ref={number2Ref} className="absolute text-[6vw] font-bold text-pink-400/70 right-[15vw] bottom-[2vh]" style={{ fontFamily: 'monospace' }}>+5</span>
            <span ref={number3Ref} className="absolute text-[7vw] font-bold text-cyan-400/70 left-[20vw] top-[5vh]" style={{ fontFamily: 'monospace' }}>18</span>
            <span ref={number4Ref} className="absolute text-[5vw] font-bold text-amber-400/70 right-[20vw] top-[5vh]" style={{ fontFamily: 'monospace' }}>1d12</span>
            <span ref={number5Ref} className="absolute text-[6vw] font-bold text-emerald-400/70 left-[50%] bottom-[-2vh] -translate-x-1/2" style={{ fontFamily: 'monospace' }}>2</span>
          </div>
        </div>

        {/* СЕКЦИЯ 3 */}
        <div ref={section3Ref} className="relative h-[80vh] flex flex-col justify-center">
          <div className="relative bottom-[5vh] w-full">
            <div>
              <h3 className="text-[5.5vw] text-center text-amber-100">Судьба вашего героя</h3>
              <h3 className="text-[5vw] text-center text-amber-100">
                в{' '}
                <span ref={airTextRef} className="inline-block text-[6.5vw] font-bold text-cyan-400">
                  ВОЗДУХЕ
                </span>
              </h3>
            </div>
          </div>

          <div className="relative top-[10vh] w-full">
            <img
              ref={dice20Ref}
              className="absolute w-[28vw] h-[28vw] object-contain pointer-events-none left-[5vw] top-[3vh]"
              src={images.dice20}
              alt="dice20"
            />
            <img
              ref={dice10Ref}
              className="absolute w-[24vw] h-[24vw] object-contain pointer-events-none left-[38vw] top-[5vh]"
              src={images.dice10}
              alt="dice10"
            />
            <img
              ref={dice6Ref}
              className="absolute w-[22vw] h-[22vw] object-contain pointer-events-none right-[5vw] top-[4vh]"
              src={images.dice6}
              alt="dice6"
            />
          </div>

          <div className="relative w-full"></div>
          <div className="relative top-[25vh] flex flex-start flex-col w-[70vw]">
            <h3 className="text-[6vw] text-amber-100">
              Один бросок
              <br /> изменит всё навсегда
            </h3>
            <h3 className="text-[6vw] w-[100vw] text-amber-100">
              Готовы ли вы к эпическим{' '}
              <span
                ref={critsTextRef}
                className="inline-block text-[6vw] font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent"
              >
                критам?
              </span>
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
