import http from "@/utils/http_services";
import { LoginCredentials, AuthResponse } from "@/models/user";

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await http.post<AuthResponse>("/auth/login", credentials);
  return response.data;
};