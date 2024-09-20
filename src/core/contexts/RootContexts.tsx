'use client';

import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import axios from 'axios';
import { useRouter } from 'next/navigation';

import useApi from '@lib/hooks/useApi';
import showSuccessNotification from '@lib/utils/notifications/showSuccessNotification';

import type {
  LoginRequestDto,
  LoginResponseDto,
  UserServiceResponseDto,
} from '@core/dtos/AuthDto';

interface ContextValue {
  user: UserServiceResponseDto | undefined;
  refreshUser: (user: UserServiceResponseDto) => void;
  dashboardid: string | undefined;
  setDashboardid: Dispatch<SetStateAction<string | undefined>>;
  login: (body: LoginRequestDto) => Promise<LoginResponseDto | undefined>;
  logout: () => void;
  dashboardsFlag: boolean;
  setDashboardsFlag: Dispatch<SetStateAction<boolean>>;
}

const RootContext = createContext<ContextValue>({
  user: undefined,
  refreshUser: () => {},
  dashboardid: undefined,
  setDashboardid: () => {},
  login: async () => undefined,
  logout: async () => {},
  dashboardsFlag: false,
  setDashboardsFlag: () => {},
});

export default function RootProvider({ children }: PropsWithChildren) {
  const [dashboardid, setDashboardid] = useState<string | undefined>(undefined);
  const {
    data: loginData,
    setData: setLoginData,
    callApi: postAuthLogin,
  } = useApi<LoginResponseDto>('/auth/login', 'POST');
  const {
    data: user,
    setData: setUser,
    callApi: getMe,
  } = useApi<UserServiceResponseDto>('/users/me', 'GET');
  const [dashboardsFlag, setDashboardsFlag] = useState(false);
  const router = useRouter();

  /** 유저 정보를 최신상태로 만들고 싶을 때 사용 */
  const refreshUser = useCallback(
    (userData: UserServiceResponseDto) => {
      setUser(userData);
      getMe(undefined);
    },
    [getMe, setUser]
  );

  /** 로그인 로직: 로그인 기능을 만들 때 가져가서 사용하세요 */
  const login = useCallback(
    async (body: LoginRequestDto): Promise<LoginResponseDto | undefined> => {
      const response = await postAuthLogin(body);
      // await localInstance.post('http://localhost:3000/api/auth/login', body);
      if (response && 'data' in response) {
        const { data, status } = response; // 필요한 필드를 추출
        return { ...data, status } as LoginResponseDto; // 올바른 구조로 반환
      }

      if (axios.isAxiosError(response)) {
        throw new Error(
          response.response?.data?.message || '로그인에 실패했습니다.'
        );
      }

      return undefined;
    },
    [postAuthLogin]
  );

  const logout = useCallback(async () => {
    if (!localStorage) return;

    localStorage.removeItem('accessToken');
    setLoginData(undefined);
    setUser(undefined);
    router.push('/');
    showSuccessNotification({ message: '로그아웃 되었습니다.' });
  }, [router, setLoginData, setUser]);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) getMe(undefined);
  }, [getMe]);

  /** 유저 정보 유지: 새로고침하거나, url입력을 통해 이동할 때 유저정보가 유지되도록 구현 */
  useEffect(() => {
    if (loginData?.accessToken) {
      localStorage.setItem('accessToken', loginData?.accessToken);
    }
  }, [loginData, getMe]);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      getMe(undefined);
    }
  }, [getMe]);

  const value = useMemo(
    () => ({
      user,
      refreshUser,
      dashboardid,
      setDashboardid,
      login,
      logout,
      dashboardsFlag,
      setDashboardsFlag,
    }),
    [
      user,
      dashboardid,
      login,
      refreshUser,
      dashboardsFlag,
      setDashboardsFlag,
      logout,
    ]
  );

  return <RootContext.Provider value={value}>{children}</RootContext.Provider>;
}

export function useRoot() {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error(
      'useRoot는 RootProvider 하위 컴포넌트에서 사용해야 합니다.'
    );
  }

  return context;
}
