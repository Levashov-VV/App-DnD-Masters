import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

type itemProps = {
  text: string;
  id: number;
};
const ItemList = ({ text }: itemProps) => {
  return (
    <li
      className="group w-[40vw] rounded-3xl border-2 border-amber-100/50 bg-neutral-800/80 
                text-3xl font-medium text-neutral-200 shadow-xl
                transition-all duration-500 ease-out hover:cursor-pointer
                hover:-translate-y-4 hover:scale-[1.02] 
                hover:bg-amber-50/90 hover:text-neutral-900 
                hover:border-amber-400/90 hover:shadow-2xl
                hover:shadow-amber-400/50 hover:[box-shadow:_0_20px_40px_-10px_rgba(251,191,36,0.4)]
                active:translate-y-0 active:scale-[0.98]
                before:content-[''] before:absolute before:inset-0 
                before:rounded-3xl before:bg-gradient-to-r before:from-amber-400/0 
                before:via-amber-300/20 before:to-amber-400/0 
                before:opacity-0 before:transition-all before:duration-700
                before:group-hover:opacity-100
                after:content-[''] after:absolute after:-inset-2 
                after:rounded-3xl after:bg-gradient-to-r after:from-amber-400/30 
                after:to-amber-600/30 after:opacity-0 after:blur-xl
                after:transition-all after:duration-700 after:group-hover:opacity-100"
    >
      <span className="relative z-10">{text}</span>
    </li>
  );
};
export function CreatePerson() {
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
    { text: 'Выборе концепции, расы, класса и предыстории', id: 1 },
    { text: 'Характеристиках и механиках', id: 2 },
    { text: 'Снаряжение и заклинаниях', id: 3 },
    { text: 'Личности и деталях', id: 4 },
  ];
  return (
    <section className="w-screen h-[125vh] bg-neutral-900">
      <article className="flex flex-col items-center gap-[10vh] text-6xl">
        <div ref={titleRef} className="w-[80vw] text-center">
          Создавайте собственных персонажей с их характером, предысторией и включая расу, класс,
          характеристики, снаряжение и многое другое
        </div>
        <div className="flex flex-row gap-[20vw]">
          <div className="flex flex-col gap-[2vh] w-[50vw] text-3xl">
            <div>
              Мастер за несколько минут получает готового NPC-персонажа. Он снимает рутину ручного
              заполнения статистики и помогает сразу видеть, как персонаж «встроится» в сюжет и
              партию.
            </div>
            <div className="flex flex-col gap-[3vh]">
              <div>Мастеру больше не нужно думать о:</div>
              <ul className="flex flex-col gap-[3vh]">
                {listCreate.map((item) => (
                  <ItemList text={item.text} id={item.id} key={item.id} />
                ))}
              </ul>
            </div>
            <div>
              <img
                className="w-[25vw] relative bottom-[5vh] left-[6vw]"
                src="../../../../../public/img/masters/home/CreatePerson/Box.png"
                alt="box"
              />
            </div>
          </div>
          <div className="relative bottom-[10vh] w-[25vw]">
            <img
              src="../../../../../../public/img/masters/home/CreatePerson/Kalashtar.png"
              alt="Kalashtar"
            />
          </div>
        </div>
      </article>
      <div className="w-[80vw] rounded-xl bg-amber-100 h-0.5 opacity-50 relative left-[10vw]"></div>
    </section>
  );
}
