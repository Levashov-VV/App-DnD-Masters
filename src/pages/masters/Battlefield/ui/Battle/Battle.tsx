import { useEffect, useRef, useState } from 'react';
import { BattlePreload } from '../../../../../app/providers/BattlefieldPreload/BattlePreload';

export function Battle() {
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      timeoutRef.current = null;
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (loading) return <BattlePreload />;

  return (
    <div className="w-full h-full flex flex-col items-center text-white">
      <h1 className="text-4xl font-bold mb-8 text-amber-400">🗡️️ Поле боя готово!</h1>
    </div>
  );
}