import http from "@/utils/http_services";
import { InventorySummary, LowStockBook, BooksByCategory } from "@/models/report";

export const getInventorySummary = async (): Promise<InventorySummary[]> => {
  const response = await http.get<InventorySummary[]>("/reports/inventory-summary");
  return response.data;
};

export const getLowStockReport = async (): Promise<LowStockBook[]> => {
  const response = await http.get<LowStockBook[]>("/reports/low-stock");
  return response.data;
};

export const getBooksByCategory = async (): Promise<BooksByCategory[]> => {
  const response = await http.get<BooksByCategory[]>("/reports/books-by-category");
  return response.data;
};