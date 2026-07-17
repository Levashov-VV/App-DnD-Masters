import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { assetUrl } from '@/shared/utils/assetUrl';

type itemProps = {
  text: string;
  id: number;
};
const ItemList = ({ text }: itemProps) => {
  return (
    <li className="group w-[63vw] h-[6vh] rounded-3xl border-2 border-amber-100/50 bg-neutral-800/80 text-[3vh] font-medium text-amber-100 ">
      <span className="relative left-[0.5vw] z-10">{text}</span>
    </li>
  );
};
export function CloneVoice() {
  const titleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const titleElement = titleRef.current;
    if (!titleElement) return;
    gsap.fromTo(
      titleElement,
      { y: '-15vh', opacity: 0, scale: 0.6 },
      {
        opacity: 1,
        scale: 1,
        y: '0vh',
        duration: 1,
        scrollTrigger: {
          trigger: titleElement,
          start: 'top 90%',
          end: 'bottom 20%',
          scrub: 1,
        },
      }
    );
  });
  const listCreate = [
    { text: 'Делает ваших персонажей более выразительными и запоминающимися.', id: 1 },
    { text: 'Помогает игрокам глубже погрузиться в сюжет и атмосферу приключения.', id: 2 },
    {
      text: 'Мастер может использовать, чтобы усиливать напряжение или передавать эмоции сцен.',
      id: 3,
    },
    {
      text: 'Упрощает ведение игры и делает взаимодействие с NPC более естественным и живым.',
      id: 4,
    },
  ];

  return (
    <section className="w-screen h-[100vh] bg-neutral-900">
      <article className="flex flex-col items-center gap-[10vh] text-[6vh]">
        <div ref={titleRef} className="w-[80vw] text-center">
          Генерация голоса с помощью AI
        </div>
        <div className="flex flex-row gap-[20vw]">
          <div className="relative left-[5vw] flex flex-col gap-[2vh] w-[55vw] text-[3vh]">
            <div>
              В этом разделе вы можете создавать уникальные голоса для своих персонажей. Загрузите
              уже готовую голосовую запись, запишите новый голос прямо в приложении или
              воспользуйтесь искусственным интеллектом, чтобы сгенерировать озвучку по тексту.
            </div>
            <div className="flex flex-col gap-[3vh]">
              <div>Этот раздел:</div>
              <ul className="flex flex-col gap-[3vh]">
                {listCreate.map((item) => (
                  <ItemList text={item.text} id={item.id} key={item.id} />
                ))}
              </ul>
            </div>
          </div>
          <div className="relative bottom-[20vh] w-[25vw]">
            <img src={assetUrl('/img/masters/home/CreatePerson/Kalashtar.png')} alt="Kalashtar" loading="lazy" />
          </div>
        </div>
      </article>
    </section>
  );
}
