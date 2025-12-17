export function BattlePreload() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-black/80 text-white">
      <div className="h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      <div className="text-xl font-semibold text-amber-300">Загрузка поля боя...</div>
    </div>
  );
}
