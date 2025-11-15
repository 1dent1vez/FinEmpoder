// frontend/src/api/auth/auth.api.ts
import client from '../client';

export type RegisterDTO = {
  name: string;
  career: string;
  age: number;
  email: string;
  phone: string;
  password: string;
  acceptTerms: boolean;
};

export type LoginDTO = {
  email: string;
  password: string;
};

export type AuthUser = {
  _id: string;
  email: string;
  name?: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

const authApi = {
  async register(payload: RegisterDTO): Promise<AuthResponse> {
    const { data } = await client.post<AuthResponse>('/auth/register', payload);
    return data;
  },
  async login(payload: LoginDTO): Promise<AuthResponse> {
    const { data } = await client.post<AuthResponse>('/auth/login', payload);
    return data;
  },
};

export default authApi;
