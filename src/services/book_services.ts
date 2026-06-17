import http from "@/utils/http_services";
import { Book, BookPayload } from "@/models/book";

export const getBooks = async (): Promise<Book[]> => {
  const response = await http.get<Book[]>("/books");
  return response.data;
};

export const getBook = async (id: number): Promise<Book> => {
  const response = await http.get<Book>(`/books/${id}`);
  return response.data;
};

export const createBook = async (payload: BookPayload): Promise<Book> => {
  const response = await http.post<Book>("/books", payload);
  return response.data;
};

export const updateBook = async (id: number, payload: BookPayload): Promise<Book> => {
  const response = await http.put<Book>(`/books/${id}`, payload);
  return response.data;
};

export const deleteBook = async (id: number): Promise<void> => {
  await http.delete(`/books/${id}`);
};