import { createContext, useContext } from 'react';
import { useRole, type Role } from '../../shared/hooks/auth/useRole';

interface RoleContextValue {
  role: Role;
  isMaster: boolean;
  isPlayer: boolean;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const role = useRole();

  const value: RoleContextValue = {
    role,
    isMaster: role === 'master',
    isPlayer: role === 'player',
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRoleContext() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRoleContext must be used within RoleProvider');
  }
  return context;
}
