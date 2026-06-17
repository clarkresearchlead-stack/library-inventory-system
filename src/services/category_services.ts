import http from "@/utils/http_services";
import { Category, CategoryPayload } from "@/models/category";

export const getCategories = async (): Promise<Category[]> => {
  const response = await http.get<Category[]>("/categories");
  return response.data;
};

export const getCategory = async (id: number): Promise<Category> => {
  const response = await http.get<Category>(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (payload: CategoryPayload): Promise<Category> => {
  const response = await http.post<Category>("/categories", payload);
  return response.data;
};

export const updateCategory = async (id: number, payload: CategoryPayload): Promise<Category> => {
  const response = await http.put<Category>(`/categories/${id}`, payload);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await http.delete(`/categories/${id}`);
};