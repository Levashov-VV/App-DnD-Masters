import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { User, BattleFormData } from '../../../pages/masters/Battlefield/ui/Form/types';

export type SavedTeam = {
  id: string;
  name: string;
  users: User[];
  createdAt: string;
};

export function useSavedTeams() {
  const [teams, setTeams] = useState<SavedTeam[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dnd-saved-teams');
      if (saved) {
        const parsed = JSON.parse(saved);
        setTeams(
          Array.isArray(parsed)
            ? parsed.map((t) => ({
                ...t,
                users: Array.isArray(t.users) ? t.users : [],
              }))
            : []
        );
      }
    } catch (error) {
      console.error('Ошибка загрузки команд:', error);
      localStorage.removeItem('dnd-saved-teams');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && teams.length > 0) {
      localStorage.setItem('dnd-saved-teams', JSON.stringify(teams));
    }
  }, [teams, isLoaded]);

  const saveCurrentTeam = useCallback((name: string) => {
    try {
      const battleData = JSON.parse(sessionStorage.getItem('dnd-current-battle') || '{}');

      const users = battleData.users || [];

      if (users.length > 0) {
        const newTeam: SavedTeam = {
          id: uuidv4(),
          name,
          users,
          createdAt: new Date().toLocaleString(),
        };
        setTeams((prev) => [newTeam, ...prev]);
      } else {
        console.warn('⚠️ Нет героев для сохранения');
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  }, []);

  const loadTeam = useCallback(
    (id: string) => {
      const team = teams.find((team) => team.id === id);
      if (team) {
        const newBattleData: BattleFormData = {
          users: team.users,
          enemies: [],
          mapId: 1,
          gridSize: 15,
          customMapImage: '',
        };

        sessionStorage.setItem('dnd-current-battle', JSON.stringify(newBattleData));
        window.location.reload();
      }
    },
    [teams]
  );

  const deleteTeam = useCallback((teamId: string) => {
    setTeams((prev) => {
      const newTeams = prev.filter((team) => team.id !== teamId);
      localStorage.setItem('dnd-saved-teams', JSON.stringify(newTeams));
      return newTeams;
    });
  }, []);

  return {
    teams,
    saveCurrentTeam,
    loadTeam,
    deleteTeam,
    isLoaded,
  };
}
