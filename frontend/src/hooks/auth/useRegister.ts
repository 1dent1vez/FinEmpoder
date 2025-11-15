// frontend/src/hooks/auth/useRegister.ts
import { useMutation } from '@tanstack/react-query';
import authApi, { type RegisterDTO } from '../../api/auth/auth.api';
import { useAuth } from '../../store/auth';

export function useRegister() {
  const setAuth = useAuth((s) => s.setAuth);

  return useMutation({
    mutationFn: (dto: RegisterDTO) => authApi.register(dto),
    onSuccess: ({ token, user }) => {
      setAuth(token, user); // guarda sesión y usuario
    },
  });
}
