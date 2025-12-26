import { useState, useEffect } from 'react';

type CreatureSide = 'allies' | 'enemies' | 'users';
type Character = {
  id: number;
  side: CreatureSide;
  code: string;
  name: string;
  img: string;
  logo: string;
};
export function useCharacter() {
  const [data, setData] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('../../../../public/data/charactersPerson.json')
      .then((res) => res.json())
      .then((json: Character[]) => {
        setData(json);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
