export function CreatePerson() {
  return (
    <section className="w-screen h-[200vh] bg-neutral-900">
      <article className='flex flex-col items-center gap-[10vh] text-6xl'>
        <div className='w-[80vw] text-center'>
          Создавайте собственных персонажей с их характером, предысторией и включая расу, класс, характеристики, снаряжение и многое другое
        </div>
        <div className='flex flex-row gap-[25vw]'>
          <div className='w-[45vw] text-3xl'>
            это место, где мастер за несколько минут получает готового NPC: его характеристики, продуманной историей и ярким характером под конкретную сцену или кампанию. Он снимает рутину ручного заполнения статистики и помогает сразу видеть, как персонаж «встроится» в сюжет и партию.
          </div>
          <div className='w-[25vw]'>
            <img 
              src='../../../../../../public/img/masters/home/CreatePerson/Kalashtar.png'
              alt="Kalashtar"
            />
          </div>
        </div>
        
      </article>
    </section>
  );
}
