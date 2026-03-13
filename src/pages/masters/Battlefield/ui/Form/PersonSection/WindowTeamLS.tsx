import { useState } from 'react';
import type { SavedTeam } from '../../../../../../shared/hooks/auth/useSavedTeams';
import { ConfirmDialog } from '../../../../../players/Heroes Library/components/Desktop/HeroForm/ui/FormStep5/ConfirmDialog';

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
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  return (
    <div className="fixed top-[1vh] right-[1vw] h-[20vh] w-[25vw] bg-neutral-900/95 backdrop-blur-xl rounded-2xl border-2 border-neutral-600 shadow-2xl z-100">
      <h3 className="text-[2vh] font-bold text-amber-400 border-b border-amber-500/30">
        Команды героев ({teams.length})
      </h3>

      {!teams.length ? (
        <div className="flex flex-col items-center h-full text-neutral-400">
          <div className="w-full h-[14vh] bg-neutral-800/50 rounded-2xl flex items-center justify-center">
            <p className="text-[3vh]">Список команд пуст</p>
          </div>
          <button
            onClick={() => setSaveDialogOpen(true)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/40 transition-all duration-300"
          >
            Создать первую Команду
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-[0.5vh] h-[14vh] overflow-auto">
            {teams.map((team) => {
              const usersCount = Array.isArray(team.users) ? team.users.length : 0;
              return (
                <div
                  key={team.id}
                  className="flex justify-center bg-neutral-800/50 rounded-lg group hover:bg-neutral-800/70"
                >
                  <button className="w-[25vw]" onClick={() => onLoadTeam(team.id)}>
                    <div className="font-bold text-[2vh] text-white truncate">{team.name}</div>
                    <div className="text-[1.6vh] opacity-80 text-neutral-200">
                      {usersCount} {usersCount === 1 ? 'герой' : 'героев'}
                    </div>
                  </button>
                  <button
                    onClick={() => onDeleteTeam?.(team.id)}
                    className="relative right-[0.5vw] text-red-500 w-[2.5vh] text-[3vh] group-hover:opacity-100 transition-all duration-300"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setSaveDialogOpen(true)}
            className="w-full text-[2vh] bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/40 transition-all duration-300"
          >
            ➕ Сохранить новую команду
          </button>
        </>
      )}

      <ConfirmDialog
        isOpen={saveDialogOpen}
        config={{
          title: 'Сохранить команду',
          message: 'Введите название для команды героев',
          type: 'prompt',
          confirmText: 'Сохранить',
          cancelText: 'Отмена',
          defaultValue: `Команда #${teams.length + 1}`,
          onConfirm: (name) => {
            if (name?.trim()) onSaveCurrent(name.trim());
          },
        }}
        onClose={() => setSaveDialogOpen(false)}
      />
    </div>
  );
}
