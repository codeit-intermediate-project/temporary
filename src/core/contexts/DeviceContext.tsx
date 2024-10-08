'use client';

import { createContext, PropsWithChildren } from 'react';

import useDevice, { DEVICE } from '@lib/hooks/useDevice';

export const DeviceContext = createContext<keyof typeof DEVICE>(DEVICE.mobile);

function DeviceProvider({ children }: PropsWithChildren) {
  const device = useDevice();

  return (
    <DeviceContext.Provider value={device}>{children}</DeviceContext.Provider>
  );
}

export default DeviceProvider;
