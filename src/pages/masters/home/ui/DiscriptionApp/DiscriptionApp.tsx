import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import dice20 from '../../../../../../public/img/masters/home/dice1d20.svg';
import dice10 from '../../../../../../public/img/masters/home/dice1d10.svg';
import dice6 from '../../../../../../public/img/masters/home/diced6.png';
import shield from '../../../../../../public/img/masters/home/Shield.png';
import gear from '../../../../../../public/img/masters/home/gear.svg';
import bag from '../../../../../../public/img/masters/home/bag.png';

export function DescriptionApp() {
  gsap.registerPlugin(ScrollTrigger);
  const containerRef = useRef<HTMLDivElement>(null);
  const diceRef = useRef<HTMLImageElement>(null);
  const diceRef20 = useRef<HTMLImageElement>(null);
  const diceRef6 = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const dndRef = useRef<HTMLSpanElement>(null);
  const dndTextRef = useRef<HTMLSpanElement>(null);
  const gearRefDown = useRef<HTMLImageElement>(null);
  const gearRefUp = useRef<HTMLImageElement>(null);
  const bagRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const dice10 = diceRef.current;
      const dice20 = diceRef20.current;
      const dice6 = diceRef6.current;

      if (!container || !dice10 || !dice20 || !dice6) return;

      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: '+=500%',
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      mainTimeline.to(container, {
        xPercent: -100 * (1 - 0.25),
        ease: 'none',
      });

      const diceTL = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          containerAnimation: mainTimeline,
          start: 'top top',
          end: '+=100%',
          scrub: 1,
        },
      });

      gsap.set(dice10, {
        x: '-10vw',
        y: '60vh',
        scale: 0.8,
        opacity: 1,
        rotation: 0,
      });

      diceTL.to(dice10, {
        x: '155vw',
        y: '-100vh',
        rotation: 720,
        scale: 0.8,
        duration: 4,
      });

      const dice20TL = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          containerAnimation: mainTimeline,
          start: 'top top',
          end: '+=100%',
          scrub: 1,
        },
      });

      gsap.set(dice20, {
        x: '-25vw',
        y: '20vh',
        scale: 0.7,
        opacity: 1,
        rotation: 0,
      });

      dice20TL
        .to(dice20, {
          x: '135vw',
          y: '20vh',
          rotation: 540,
          duration: 4,
        })
        .to(dice20, {
          x: '135vw',
          y: '-100vh',
          rotation: 1080,
          duration: 4,
        });

      if (dice6) {
        gsap.set(dice6, {
          x: '-60vw',
          y: '-150vh',
          scale: 0,
          opacity: 0,
          rotation: 0,
        });

        const dice6TL = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            containerAnimation: mainTimeline,
            start: '35% top',
            end: '+=120%',
            scrub: 3,
          },
        });

        dice6TL
          .to(dice6, {
            x: '-2vw',
            y: '-6vh',
            scale: 1,
            opacity: 1,
            rotation: 720,
            duration: 2,
            ease: 'power2.out',
          })
          .to(dice6, {
            x: '15vw',
            y: '-25vh',
            rotation: '+=360',
            duration: 1,
            ease: 'power1.inOut',
          })
          .to(dice6, {
            x: '30vw',
            y: '-5vh',
            rotation: '+=360',
            duration: 1,
            ease: 'power2.inOut',
          })
          .to(dice6, {
            x: '45vw',
            y: '-17vh',
            rotation: '+=360',
            duration: 1,
            ease: 'power2.inOut',
          })
          .to(dice6, {
            x: '90vw',
            y: '80vh',
            rotation: '+=720',
            duration: 3,
            ease: 'power2.in',
          })
          .to(dice6, {
            x: '90vw',
            y: '80vh',
            opacity: 0,
            ease: 'power2.out',
          });
      }

      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { scale: 0 },
          {
            scale: 1,
            duration: 3,
            ease: 'back.out(1.2)',
            delay: 1,
            scrollTrigger: {
              trigger: textRef.current,
              start: 'top 50%',
            },
          }
        );
        if (dndTextRef.current) {
          gsap.fromTo(
            dndTextRef.current,
            { scale: 3, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 1.5,
              ease: 'back.out(1.7)',
              delay: 1,
              scrollTrigger: {
                trigger: dndTextRef.current,
                containerAnimation: mainTimeline,
                start: 'top 65%',
              },
            }
          );
          if (gearRefDown.current && gearRefUp.current) {
            const teethDown = 8;
            const teethUp = 8;
            const ratio = teethDown / teethUp;

            gsap.fromTo(
              gearRefDown.current,
              { rotateZ: 0 },
              {
                duration: 6,
                rotateZ: 360,
                repeat: -1,
                ease: 'none',
                scrollTrigger: {
                  trigger: gearRefDown.current,
                  containerAnimation: mainTimeline,
                },
              }
            );

            gsap.fromTo(
              gearRefUp.current,
              { rotateZ: 0 },
              {
                duration: 6,
                rotateZ: -360 * ratio,
                repeat: -1,
                ease: 'none',
                scrollTrigger: {
                  trigger: gearRefUp.current,
                  containerAnimation: mainTimeline,
                },
              }
            );
          }
        }
        if (bagRef.current) {
          gsap.fromTo(
            bagRef.current,
            { rotateZ: '0deg' },
            {
              scale: 1,
              opacity: 1,
              duration: 1.5,
              rotateZ: '90deg',
              ease: 'back.out(1.7)',
              delay: 1,
              scrollTrigger: {
                trigger: bagRef.current,
                start: 'top 65%',
              },
            }
          );
        }
      }
      const dndElement = dndRef.current;
      if (dndElement && container) {
        gsap.set(dndElement, {
          yPercent: 100,
          autoAlpha: 0,
        });

        ScrollTrigger.create({
          trigger: dndElement,
          containerAnimation: mainTimeline,
          start: 'top 85%',
          end: 'bottom 65%',
          scrub: 0.5,
          onEnter: () => {
            gsap.to(dndElement, {
              yPercent: 0,
              autoAlpha: 1,
              duration: 1.2,
              ease: 'power2.out',
            });
          },
          onLeaveBack: () => {
            gsap.to(dndElement, {
              yPercent: 100,
              autoAlpha: 0,
              duration: 0.8,
              ease: 'power2.in',
            });
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="h-screen">
      <div
        ref={containerRef}
        className="h-screen flex items-center justify-start w-[400vw] bg-neutral-900 relative overflow-hidden"
      >
        <img
          ref={diceRef}
          className="absolute z-10 pointer-events-none w-[12vw] h-[12vw] object-contain"
          src={dice10}
          alt="dice10"
        />
        <img
          ref={diceRef20}
          className="absolute z-10 pointer-events-none w-[12vw] h-[12vw] object-contain"
          src={dice20}
          alt="dice20"
        />
        <img
          className="z-10 pointer-events-none w-[12vw] h-[12vw] object-contain relative left-[45vw] bottom-[25vh]"
          src={shield}
          alt="shield"
        />

        <div className="w-screen h-screen flex flex-col items-center justify-center text-white px-8 ml-[20%] relative z-20">
          <div>
            <h3 className="text-2xl md:text-[5vw] relative z-20 leading-tight">
              С нашим приложением вы можете
            </h3>
          </div>
        </div>
        <div className="w-screen h-screen flex items-center text-white relative z-20">
          <h3 className="text-2xl md:text-[5vw] relative z-20 right-[7%]">
            <span
              ref={textRef}
              className="font-bold inline-block origin-center"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
              }}
            >
              погрузиться
            </span>{' '}
            <span ref={dndRef} className="inline-block" style={{ position: 'relative' }}>
              в мир D&D
            </span>{' '}
            <span ref={dndTextRef} className="inline-block">
              улучшить игру
            </span>
          </h3>
        </div>
        <div className="w-screen h-screen flex items-center text-white relative right-[3.5%]">
          <img
            ref={diceRef6}
            className="absolute z-10 pointer-events-none w-[6vw] h-[6vw] object-contain"
            src={dice6}
            alt="dice6"
          />
          <img
            ref={gearRefUp}
            className="absolute z-10 pointer-events-none w-[10vw] h-[10vw] object-contain left-[7vw] bottom-[18vh] rotate-[\-45deg\]"
            src={gear}
            alt="gear"
          />
          <img
            ref={gearRefDown}
            className="absolute z-20 pointer-events-none w-[10vw] h-[10vw] object-contain left-[2.3vw] bottom-[3vh]"
            src={gear}
            alt="gear"
          />
          <img
            className="absolute z-10 pointer-events-none w-[35vw] h-[35vw] object-contain left-[70vw] bottom-[38vh] rotate-y-180"
            ref={bagRef}
            src={bag}
            alt="bag"
          />
          <h3 className="text-2xl md:text-[5vw]">интерактивными механиками и сделать</h3>
        </div>
        <div className="w-screen h-screen flex items-center text-white relative right-[4%]">
          <h3 className="text-2xl md:text-[5vw]">свою партию красочной и незабываемой</h3>
        </div>
      </div>
    </section>
  );
}
