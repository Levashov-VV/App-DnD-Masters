import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BattleFieldPreload } from '@/app/providers/BattlefieldPreload/BattlefieldPreload';
import { Forms } from './Form/Forms';
import { Battle } from './Battle/Battle';
import type { BattleFormData } from './Form/types';

export function BattleField() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const battleData = location.state?.battleData as BattleFormData | undefined; // ✅ Данные из SubmitSection

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(id);
  }, []);

  if (loading) return <BattleFieldPreload />;

  if (battleData) {
    return (
      <div className="flex justify-center items-center w-[100vw] h-[100vh] bg-neutral-900 overflow-x-hidden">
        <Battle />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-[100vw] h-[100vh] bg-neutral-900 overflow-x-hidden">
      <Forms />
    </div>
  );
}
