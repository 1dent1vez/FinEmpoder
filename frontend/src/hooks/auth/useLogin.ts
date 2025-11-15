// frontend/src/hooks/auth/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import authApi, { type LoginDTO } from '../../api/auth/auth.api';
import { useAuth } from '../../store/auth';

export function useLogin() {
  const setAuth = useAuth((s) => s.setAuth);

  return useMutation({
    mutationFn: (dto: LoginDTO) => authApi.login(dto),
    onSuccess: ({ token, user }) => setAuth(token, user),
  });
}
