'use client';

import { createContext, useContext, useMemo } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { UserProfileEntity } from '@driveapp/contracts/entities/users/user.entity';

import { useAuth } from '@/hooks/use-auth.hook';

interface AccountContextType {
  user?: UserProfileEntity;
  loading: boolean;
  error?: string;
  checkAuth: () => void;
  logout: () => void;
  sync: () => void;
}

export const AccountContext = createContext<AccountContextType | null>(null);
export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccountContext must be used within an AccountProvider');
  }
  return context;
};

export const AccountProviderImpl = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, loading, error, checkAuth, logout, sync } = useAuth();
  const pathname = usePathname();

  const isAuthenticatedRouter = useMemo(() => {
    return ['/login', '/register'].includes(pathname);
  }, [pathname]);

  if (!isAuthenticated && !isAuthenticatedRouter) {
    return children; // If not authenticated, render children without context
  }

  return (
    <AccountContext.Provider value={{ error, user, loading, checkAuth, logout, sync }}>
      {children}
    </AccountContext.Provider>
  );
};
