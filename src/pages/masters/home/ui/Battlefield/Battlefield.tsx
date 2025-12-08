export default function Battlefield() {
  return (
    <section className="h-screen w-screen gap-[10vw] bg-neutral-900 text-[1.8vw] text-white">
      <article className="flex flex-col items-center gap-[10vh]">
        <div className="text-center text-6xl">
          Создавайте динамичные сражения в D&D с полностью настраиваемой боевой картой.
        </div>
        <div>
          <div className="flex flex-col items-center gap-[10vh] className='w-[40vw] h-screen'">
            <img
              className="w-[35vw]"
              src="../../../../../../public/img/masters/home/BattleMap.png"
              alt="BattleMap"
            />
          </div>
          <div className="w-[50vw] h-screen">
            <div>
              Выберите одну из 5 готовых арен (лес, подземелье, городская площадь, таверна,
              некрополь) или загрузите собственное изображение — сетка автоматически наложится с
              клетками по 5 футов по стандартам 5e.
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
