import type { SavedTeam } from '../../../../../../shared/hooks/auth/useSavedTeams';

interface WindowsTeamLSProps {
  teams: SavedTeam[];
  onLoadTeam: (id: string) => void;
  onSaveCurrent: (name: string) => void;
  onDeleteTeam?: (id: string) => void;
  onRenameTeam?: (id: string, name: string) => void;
}

export function WindowsTeamLS({
  teams,
  onLoadTeam,
  onSaveCurrent,
  onDeleteTeam,
}: WindowsTeamLSProps) {
  return (
    <div className="fixed top-4 right-4 h-[20vh] w-[25vw] bg-neutral-900/95 backdrop-blur-xl  rounded-2xl border-2 border-neutral-600 shadow-2xl z-100">
      <h3 className=" text-[2vh] font-bold text-amber-400 border-b border-amber-500/30">
        Команды героев ({teams.length})
      </h3>
      {!teams.length ? (
        <div className="flex flex-col items-center  h-full text-neutral-400">
          <div className="w-full h-[14vh] bg-neutral-800/50 rounded-2xl flex items-center justify-center">
            <p className="text-[3vh]">Список команд пуст</p>
          </div>
          <button
            onClick={() => {
              const defaultName = `Команда #${teams.length + 1}`;
              const name = window.prompt('Как назвать команду героев?', defaultName);
              if (!name) return;
              onSaveCurrent(name.trim());
            }}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 
                       hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg 
                       hover:shadow-green-500/40 transition-all duration-300"
          >
            Создать первую Команду
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-[0.5vh] h-[14vh] overflow-auto ">
            {teams.map((team) => {
              const usersCount = Array.isArray(team.users) ? team.users.length : 0;

              return (
                <div
                  key={team.id}
                  className="flex justify-center bg-neutral-800/50 rounded-lg group hover:bg-neutral-800/70"
                >
                  <button onClick={() => onLoadTeam(team.id)}>
                    <div className="font-bold text-white truncate">{team.name}</div>
                    <div className="text-[1.5vh] opacity-80 text-neutral-200">
                      {usersCount} {usersCount === 1 ? 'герой' : 'героев'}
                    </div>
                  </button>
                  <button
                    onClick={() => onDeleteTeam?.(team.id)}
                    className="relative left-[8vw] text-red-500 w-[2.5vh] text-[3vh] group-hover:opacity-100 transition-all duration-300"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => {
              const defaultName = `Команда #${teams.length + 1}`;
              const name = window.prompt('Как назвать команду героев?', defaultName);
              if (!name) return;
              onSaveCurrent(name.trim());
            }}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 
                       hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg 
                       hover:shadow-green-500/40 transition-all duration-300"
          >
            ➕ Сохранить новую команду
          </button>
        </>
      )}
    </div>
  );
}
