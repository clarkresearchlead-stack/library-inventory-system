import { Category } from "./category";

export interface Book {
  id: number;
  title: string;
  author: string;
  category_id: number;
  category?: Category;
  genre: string;
  isbn: string;
  publication_year: number;
  quantity: number;
  created_at: string;
}

export interface BookPayload {
  title: string;
  author: string;
  category_id: number;
  genre: string;
  isbn: string;
  publication_year: number;
  quantity: number;
}