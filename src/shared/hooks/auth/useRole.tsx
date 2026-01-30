import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export type Role = 'master' | 'player';

export function useRole(): Role {
  const [searchParams] = useSearchParams();
  return useMemo(() => {
    const roleParam = searchParams.get('role')?.toLowerCase();
    if (roleParam === 'master') return 'master';
    return 'player';
  }, [searchParams]);
}
