import { BattleFieldPreload } from '@/app/providers/BattlefieldPreload/BattlefieldPreload';
import {useEffect, useState} from "react";

export function BattleField() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  setTimeout(() => {
    setLoading(false);
  }, 3000)
  });

  if (loading) return <BattleFieldPreload />

  return <div>
    Hello
  </div>;
}
