import { createContext, useContext, useCallback } from 'react';
import { useTypedStorageItem } from '../../../../shared/hooks/auth/useTypedStorageItem';
import { appStorage } from '../lib/storage';
import { validateHeroesArray } from '../lib/validators';
import type { Hero } from '../types/hero';

interface HeroesContextType {
  heroes: Hero[];
  addHero: (hero: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateHero: (id: string, updates: Partial<Hero>) => void;
  deleteHero: (id: string) => void;
  getHero: (id: string) => Hero | undefined;
  clearAllHeroes: () => void;
}

const HeroesContext = createContext<HeroesContextType | undefined>(undefined);

export function HeroesProvider({ children }: { children: React.ReactNode }) {
  const { value: heroes, set: setHeroes } = useTypedStorageItem('dnd-heroes', {
    storage: appStorage,
    defaultValue: [],
    validate: validateHeroesArray,
  });

  const heroesArray = heroes || [];

  const addHero = useCallback(
    (heroData: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newHero: Hero = {
        ...heroData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setHeroes([...heroesArray, newHero]);
      return newHero.id;
    },
    [heroesArray, setHeroes]
  );

  const updateHero = useCallback(
    (id: string, updates: Partial<Hero>) => {
      const updatedHeroes = heroesArray.map((hero) =>
        hero.id === id ? { ...hero, ...updates, updatedAt: new Date().toISOString() } : hero
      );
      setHeroes(updatedHeroes);
    },
    [heroesArray, setHeroes]
  );

  const deleteHero = useCallback(
    (id: string) => {
      const filteredHeroes = heroesArray.filter((hero) => hero.id !== id);
      setHeroes(filteredHeroes);
    },
    [heroesArray, setHeroes]
  );

  const getHero = useCallback(
    (id: string) => {
      const hero = heroesArray.find((hero) => hero.id === id);
      return hero;
    },
    [heroesArray]
  );

  const clearAllHeroes = useCallback(() => {
    setHeroes([]);
  }, [setHeroes]);

  return (
    <HeroesContext.Provider
      value={{
        heroes: heroesArray,
        addHero,
        updateHero,
        deleteHero,
        getHero,
        clearAllHeroes,
      }}
    >
      {children}
    </HeroesContext.Provider>
  );
}

export function useHeroes() {
  const context = useContext(HeroesContext);
  if (!context) {
    throw new Error('useHeroes must be used within HeroesProvider');
  }
  return context;
}
