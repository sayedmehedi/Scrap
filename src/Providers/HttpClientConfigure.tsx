import React from 'react';
import { Axios } from "axios";
import { container } from '@src/appEngine';
import { useAppSelector } from '@hooks/store';
import { ServiceProviderTypes } from '@core/serviceProviderTypes';


const apiClient = container.get<Axios>(ServiceProviderTypes.HttpClient);

export default function HttpClientConfigure({ children }: React.PropsWithChildren) {
  const authToken = useAppSelector(state => state.auth.token)

  React.useEffect(() => {
    if (!!authToken) {
      apiClient.defaults.headers.common.Authorization = `Bearer ${authToken}`
    }
  }, [authToken])

  return (
    <>
      {children}
    </>
  );
}
