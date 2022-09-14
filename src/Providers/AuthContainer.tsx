import React from 'react'
import { useAppSelector } from '@hooks/store';
import { selectIsAuthenticated } from '@store/slices/authSlice';
import { useGetProfileQuery } from '@data/laravel/services/auth';

export default function AuthProvider({ children }: React.PropsWithChildren) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useGetProfileQuery(undefined, {
    skip: !isAuthenticated
  })

  return (
    <>
      {children}
    </>
  )
}