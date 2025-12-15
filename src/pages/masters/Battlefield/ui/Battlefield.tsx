import { BattleFieldPreload } from '@/app/providers/BattlefieldPreload/BattlefieldPreload';
import { useEffect, useState } from 'react';
import { Forms } from './Form/Forms';

export function BattleField() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  });

  if (loading) return <BattleFieldPreload />;

  return (
    <div className="flex justify-center items-center w-[100vw] h-[100vh] bg-neutral-900">
      <Forms />
    </div>
  );
}
