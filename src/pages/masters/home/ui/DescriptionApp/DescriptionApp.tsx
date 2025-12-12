import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import dice20 from '../../../../../../public/img/masters/home/DescriptionApp/dice1d20.svg';
import dice10 from '../../../../../../public/img/masters/home/DescriptionApp/dice1d10.svg';
import dice6 from '../../../../../../public/img/masters/home/DescriptionApp/dice1d6.png';
import shield from '../../../../../../public/img/masters/home/DescriptionApp/Shield.png';
import gear from '../../../../../../public/img/masters/home/DescriptionApp/gear.svg';
import bag from '../../../../../../public/img/masters/home/DescriptionApp/bag.png';
import book from '../../../../../../public/img/masters/home/DescriptionApp/book.png';
import potionMed from '../../../../../../public/img/masters/home/DescriptionApp/potionMed.png';
import potionToxic from '../../../../../../public/img/masters/home/DescriptionApp/potionToxic.png';
import sword from '../../../../../../public/img/masters/home/DescriptionApp/sword.png';

const images = {
  dice20,
  dice10,
  dice6,
  shield,
  gear,
  bag,
  book,
  potionMed,
  potionToxic,
  sword,
} as const;

export function DescriptionApp() {
  gsap.registerPlugin(ScrollTrigger);
  const containerRef = useRef<HTMLDivElement>(null);
  const dice10Ref = useRef<HTMLImageElement>(null);
  const dice20Ref = useRef<HTMLImageElement>(null);
  const dice6Ref = useRef<HTMLImageElement>(null);
  const bagRef = useRef<HTMLImageElement>(null);
  const potionMedRef = useRef<HTMLImageElement>(null);
  const potionToxicRef = useRef<HTMLImageElement>(null);
  const swordRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const dndRef = useRef<HTMLSpanElement>(null);
  const interactiveTextRef = useRef<HTMLSpanElement>(null);
  const mechanicsTextRef = useRef<HTMLSpanElement>(null);
  const upgradeTextRef = useRef<HTMLSpanElement>(null);
  const doTextRef = useRef<HTMLSpanElement>(null);
  const gameTextRef = useRef<HTMLSpanElement>(null);
  const colorTextRef = useRef<HTMLSpanElement>(null);
  const unforgettableTextRef = useRef<HTMLSpanElement>(null);
  const gearDownRef = useRef<HTMLImageElement>(null);
  const gearUpRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const dice10 = dice10Ref.current;
      const dice20 = dice20Ref.current;
      const dice6 = dice6Ref.current;
      const bag = bagRef.current;
      const potionMed = potionMedRef.current;
      const potionToxic = potionToxicRef.current;
      const interactiveText = interactiveTextRef.current;
      const mechanicsText = mechanicsTextRef.current;
      const doText = doTextRef.current;
      const gameText = gameTextRef.current;
      const colorText = colorTextRef.current;
      const unforgettableText = unforgettableTextRef.current;
      const sword = swordRef.current;
      const gearDown = gearDownRef.current;
      const gearUp = gearUpRef.current;
      const upgradeText = upgradeTextRef.current;
      const text = textRef.current;
      const dnd = dndRef.current;

      if (
        !container ||
        !dice10 ||
        !dice20 ||
        !dice6 ||
        !bag ||
        !potionMed ||
        !doText ||
        !interactiveText ||
        !mechanicsText
      )
        return;

      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: true,
          pinSpacing: true,
          scrub: 5,
          start: 'top top',
          end: '+=2500vh',
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      mainTimeline.to(container, {
        xPercent: -100 * (1 - 0.25),
        ease: 'none',
      });

      // Кубики
      // 1d10
      const dice10TL = gsap.timeline({
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

      dice10TL.to(dice10, {
        x: '155vw',
        y: '-100vh',
        rotation: 720,
        scale: 0.8,
        duration: 4,
      });
      // 1d20
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
      // 1d6
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
            start: '25% top',
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
            x: '100vw',
            y: '80vh',
            rotation: '+=720',
            duration: 1.5,
            ease: 'power2.in',
          })
          .to(dice6, {
            x: '90vw',
            y: '80vh',
            opacity: 0,
            ease: 'power2.out',
          });
      }
      // Сумка
      if (bag) {
        gsap.set(bag, {
          x: '0vw',
          y: '0vh',
          rotationY: 180,
        });

        const bagTL = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            containerAnimation: mainTimeline,
            start: '45% top',
            end: '+=120%',
            scrub: 3,
          },
        });

        bagTL.to(bag, {
          scale: 1,
          opacity: 1,
          rotationZ: 120,
          duration: 2,
          ease: 'power2.out',
        });
      }
      // Зелья
      // Лечения
      if (potionMed) {
        gsap.set(potionMed, {
          rotationZ: 120,
          opacity: 0,
        });

        const potionMedTL = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            containerAnimation: mainTimeline,
            start: '60% top',
            end: '+=50%',
            scrub: 3,
          },
        });

        potionMedTL
          .to(potionMed, {
            scale: 1,
            opacity: 1,
            rotationZ: 120,
            x: '20vw',
            y: '50vh',
            duration: 0.5,
            ease: 'power2.out',
          })
          .to(potionMed, {
            opacity: 0,
          });
      }
      // Яд
      if (potionToxic) {
        gsap.set(potionToxic, {
          rotationZ: 120,
          opacity: 0,
        });

        const potionToxicTL = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            containerAnimation: mainTimeline,
            start: '62% top',
            end: '+=50%',
            scrub: 3,
          },
        });

        potionToxicTL
          .to(potionToxic, {
            scale: 1,
            opacity: 1,
            rotationZ: 120,
            x: '25vw',
            y: '50vh',
            duration: 1,
            ease: 'power2.out',
          })
          .to(potionToxic, {
            opacity: 0,
          });

        //Меч
        if (sword) {
          const swordTL = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              containerAnimation: mainTimeline,
              start: '60% top',
              end: '+=50%',
              scrub: 3,
            },
          });

          swordTL
            .to(sword, {
              scale: 1,
              opacity: 1,
              x: '0vw',
              y: '0vh',
              duration: 2,
              ease: 'power2.out',
              scrub: 3,
            })
            .to(sword, {
              y: '120vh',
              x: '-2.5vw',
              duration: 2,
              ease: 'power2.in',
              scrub: 3,
            })
            .to(sword, {
              rotateZ: 180,
            });
        }
      }
      // Шестеренки
      if (gearUp && gearDown) {
        gsap.to(gearUp, {
          rotation: '+=360',
          duration: 3,
          repeat: -1,
          ease: 'none',
        });
        gsap.to(gearDown, {
          rotation: '-=360',
          duration: 3,
          repeat: -1,
          ease: 'none',
        });
      }

      // Текст
      //Погружение
      if (text) {
        gsap.fromTo(
          text,
          { scale: 0 },
          {
            scale: 1,
            duration: 1.5,
            ease: 'back.out(1.2)',
            delay: 0.5,
            scrollTrigger: {
              trigger: text,
              start: 'top 30%',
            },
          }
        );
        //Днд
        const dndElement = dnd;
        if (dndElement && container) {
          gsap.set(dndElement, {
            yPercent: 100,
            autoAlpha: 0,
          });

          ScrollTrigger.create({
            trigger: dndElement,
            containerAnimation: mainTimeline,
            start: 'top 70%',
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
        //Улучшить
        if (upgradeText) {
          gsap.fromTo(
            upgradeText,
            { scale: 3, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 1,
              ease: 'back.out(1.7)',
              delay: 0.5,
              scrollTrigger: {
                trigger: upgradeText,
                containerAnimation: mainTimeline,
                start: 'top 35%',
              },
            }
          );
        }
        //Интерактивными
        if (interactiveText) {
          gsap.set(interactiveText, {
            y: '-20vh',
            x: 0,
            opacity: 0,
            scale: 0.6,
          });

          gsap.fromTo(
            interactiveText,
            { y: '-20vh', opacity: 0, scale: 0.6 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 1,
              scrollTrigger: {
                trigger: interactiveText,
                containerAnimation: mainTimeline,
                start: 'top 80%',
              },
            }
          );
        }
        ScrollTrigger.create({
          trigger: interactiveText,
          containerAnimation: mainTimeline,
          start: 'top 105%',
          onEnter: () => {
            gsap.to(interactiveText, {
              x: '+=8',
              duration: 0.08,
              repeat: 12,
              yoyo: true,
              ease: 'power2.inOut',
            });
          },
        });
        //Механики
        if (mechanicsText) {
          gsap.to(mechanicsText, {
            y: '25vh',
            x: '0vw',
            rotation: 35,
            duration: 2,
            ease: 'none',
            scrollTrigger: {
              trigger: mechanicsText,
              containerAnimation: mainTimeline,
              start: 'top 25%',
              end: 'bottom 70%',
              scrub: 1,
            },
          });
        }
        //Сделать
        if (doText) {
          gsap.fromTo(
            doText.querySelectorAll('.do-letter'),
            { y: 20, opacity: 0, scale: 1.2 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              stagger: 0.06,
              ease: 'back.out(1.7)',
              delay: 0.5,
              scrollTrigger: {
                trigger: doText,
                containerAnimation: mainTimeline,
                start: 'top 75%',
              },
            }
          );
        }
        //Партию
        if (gameText) {
          gsap.fromTo(
            gameText.querySelectorAll('.game-letter'),
            { y: 20, opacity: 0, scale: 1.2 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              stagger: 0.06,
              ease: 'back.out(1.7)',
              delay: 0.5,
              scrollTrigger: {
                trigger: doText,
                containerAnimation: mainTimeline,
                start: 'top 65%',
              },
            }
          );
        }
        //Красочной
        if (colorText) {
          gsap.set(colorText, {
            rotateY: 90,
            opacity: 0,
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center',
            scale: 0.8,
          });

          gsap.to(colorText, {
            rotateY: 0,
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 1.2,
            ease: 'back.out(1.7)',
            delay: 0.3,
            scrollTrigger: {
              trigger: colorText,
              containerAnimation: mainTimeline,
              start: 'top 85%',
            },
          });
        }
        // Незабываемой
        if (unforgettableText) {
          gsap.set(unforgettableText, {
            y: 0,
            opacity: 1,
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center',
            scale: 1,
          });

          const tl = gsap.timeline({ repeat: -1 });
          tl.to(unforgettableText, {
            y: '-25vh',
            opacity: 0,
            scale: 0.9,
            duration: 1.8,
            ease: 'power2.inOut',
          })
            .to(unforgettableText, {
              y: '-35vh',
              duration: 0.4,
              ease: 'power2.in',
            })
            .to(unforgettableText, {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1.4,
              ease: 'back.out(1.7)',
            });
        }
      }
    }, []);

    return () => ctx.revert();
  }, []);

  const doLetters = 'и сделать'.split('');
  const gameLetters = 'свою партию'.split('');

  return (
    <section className="">
      <div
        ref={containerRef}
        className="h-screen flex items-center justify-start w-[453vw] bg-neutral-900 relative"
      >
        <img
          ref={dice10Ref}
          className="absolute z-10 pointer-events-none w-[12vw] h-[12vw] object-contain"
          src={images.dice10}
          alt="dice10"
        />
        <img
          ref={dice20Ref}
          className="absolute z-10 pointer-events-none w-[12vw] h-[12vw] object-contain"
          src={images.dice20}
          alt="dice20"
        />
        <img
          className="z-10 pointer-events-none w-[12vw] h-[12vw] object-contain relative left-[45vw] bottom-[25vh]"
          src={images.shield}
          alt="shield"
        />

        <div className="w-screen h-screen flex flex-col items-center justify-center  px-8 ml-[20%] relative z-20">
          <div>
            <h3 className="text-2xl md:text-[5vw] relative  right-[10%] z-20 leading-tight">
              С нашим приложением вы можете
            </h3>
          </div>
        </div>
        <div className="w-screen h-screen flex items-center relative z-20">
          <h3 className="text-2xl md:text-[5vw] relative z-20 right-[15%]">
            <span
              ref={textRef}
              className="inline-block origin-center"
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
            <span ref={upgradeTextRef} className="inline-block">
              улучшить игру
            </span>
          </h3>
        </div>
        <div className="w-screen h-screen flex items-center  relative right-[5.5%]">
          <img
            ref={dice6Ref}
            className="absolute z-10 pointer-events-none w-[6vw] h-[6vw] object-contain"
            src={images.dice6}
            alt="dice6"
          />
          <img
            ref={gearUpRef}
            className="absolute z-10 pointer-events-none w-[10vw] h-[10vw] object-contain"
            style={{
              left: '10vw',
              bottom: '17.2vh',
              transformOrigin: '50% 50%',
            }}
            src={images.gear}
            alt="gear"
          />
          <img
            ref={gearDownRef}
            className="absolute z-20 pointer-events-none w-[10vw] h-[10vw] object-contain"
            style={{
              left: '16.5vw', // 15.8 - 9 = 6.8vw → зубья ПЕРЕПЛЕТАЮТСЯ!
              bottom: '4vh',
              transformOrigin: '50% 50%',
            }}
            src={images.gear}
            alt="gear"
          />
          <img
            className="absolute z-10 pointer-events-none w-[35vw] h-[35vw] object-contain left-[70vw] bottom-[38vh]"
            ref={bagRef}
            src={images.bag}
            alt="bag"
          />
          <img
            className="absolute z-10 pointer-events-none w-[10vw] h-[10vw] object-contain left-[90vw] bottom-[63vh]"
            ref={potionMedRef}
            src={images.potionMed}
            alt="potion"
          />
          <img
            className="absolute z-10 pointer-events-none w-[10vw] h-[10vw] object-contain left-[90vw] bottom-[63vh]"
            ref={potionToxicRef}
            src={images.potionToxic}
            alt="potion"
          />
          <h3 className="text-2xl md:text-[5vw]">
            <span
              ref={interactiveTextRef}
              className="inline-block origin-center"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
                display: 'inline-block',
              }}
            >
              интерактивными
            </span>{' '}
            <span ref={mechanicsTextRef} className="inline-block transform-origin-left">
              механиками
            </span>{' '}
            <span ref={doTextRef}>
              {doLetters.map((ch, i) => (
                <span key={i} className="do-letter">
                  {ch}
                </span>
              ))}
            </span>
          </h3>
        </div>
        <div className="w-screen h-screen flex items-center relative right-[6%]">
          <img
            className="absolute z-10 w-[35vw] h-[35vw] object-contain left-[27vw] bottom-[40vh]"
            src={images.book}
            alt="book"
          />
          <h3 className="text-2xl md:text-[5vw] z-20">
            <span ref={gameTextRef}>
              {gameLetters.map((ch, i) => (
                <span key={i} className="game-letter">
                  {ch}
                </span>
              ))}
            </span>{' '}
            <span
              ref={colorTextRef}
              className="inline-block origin-center z-20"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            >
              красочной и
            </span>{' '}
            <span ref={unforgettableTextRef}>незабываемой</span>
            <img
              className="absolute z-50 pointer-events-none w-[35vw] h-[35vw] object-contain left-[90vw] bottom-[20vh]"
              ref={swordRef}
              src={images.sword}
              alt="sword"
            />
          </h3>
        </div>
      </div>
    </section>
  );
}
