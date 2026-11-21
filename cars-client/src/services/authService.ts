import axios from 'axios';
import type { LoginData, RegisterData, User } from '../models/Auth';
import { apiClient } from '../api/apiClient';

function getErrorMessage(error: unknown, fallback: string): Error {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error : new Error(fallback);
  }

  const data: unknown = error.response?.data;
  if (typeof data === 'string' && data.trim()) return new Error(data);
  if (Array.isArray(data)) return new Error(data.map(String).join(' '));
  if (data && typeof data === 'object') {
    const body = data as Record<string, unknown>;
    const errors = body.errors;
    if (errors && typeof errors === 'object') {
      const messages = Object.values(errors as Record<string, unknown>).flatMap((value) =>
        Array.isArray(value) ? value.map(String) : [String(value)],
      );
      if (messages.length > 0) return new Error(messages.join(' '));
    }
    for (const key of ['detail', 'title', 'message']) {
      if (typeof body[key] === 'string') return new Error(body[key]);
    }
  }

  if (error.request) return new Error('Brak odpowiedzi z serwera. Sprawdź, czy API jest uruchomione.');
  return new Error(fallback);
}

export async function login(data: LoginData): Promise<User> {
  try {
    const response = await apiClient.post<User>('/account/login', data);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Nie udało się zalogować.');
  }
}

export async function register(data: RegisterData): Promise<string> {
  try {
    const response = await apiClient.post<{ message: string }>('/account/register', data);
    return response.data.message;
  } catch (error) {
    throw getErrorMessage(error, 'Nie udało się utworzyć konta.');
  }
}

export async function confirmEmail(userId: string, token: string): Promise<string> {
  try {
    const response = await apiClient.get<{ message: string }>('/account/confirm-email', {
      params: { userId, token },
    });
    return response.data.message;
  } catch (error) {
    throw getErrorMessage(error, 'Nie udało się potwierdzić adresu e-mail.');
  }
}

export async function forgotPassword(email: string): Promise<string> {
  try {
    const response = await apiClient.post<{ message: string }>('/account/forgot-password', { email });
    return response.data.message;
  } catch (error) {
    throw getErrorMessage(error, 'Nie udało się wysłać instrukcji resetowania hasła.');
  }
}

export async function resetPassword(email: string, token: string, newPassword: string): Promise<string> {
  try {
    const response = await apiClient.post<{ message: string }>('/account/reset-password', {
      email,
      token,
      newPassword,
    });
    return response.data.message;
  } catch (error) {
    throw getErrorMessage(error, 'Nie udało się zmienić hasła.');
  }
}
