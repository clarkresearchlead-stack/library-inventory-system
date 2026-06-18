import http from "@/shared/utils/http";
import { InventoryLog, StockPayload } from "@/models/inventory";
import { Book } from "@/models/book";

export const getInventoryLogs = async (): Promise<InventoryLog[]> => {
  const response = await http.get<InventoryLog[]>("/inventory-logs");
  return response.data;
};

export const getLowStockBooks = async (): Promise<Book[]> => {
  const response = await http.get<Book[]>("/books/low-stock");
  return response.data;
};

export const stockIn = async (id: number, payload: StockPayload): Promise<void> => {
  await http.patch(`/books/${id}/stock-in`, payload);
};

export const stockOut = async (id: number, payload: StockPayload): Promise<void> => {
  await http.patch(`/books/${id}/stock-out`, payload);
};