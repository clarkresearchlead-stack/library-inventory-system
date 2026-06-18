export type TransactionType = "stock_in" | "stock_out";

export interface InventoryLog {
  id: number;
  book_id: number;
  book_title?: string;
  transaction_type: TransactionType;
  quantity: number;
  remarks: string;
  created_at: string;
}

export interface StockPayload {
  quantity: number;
  remarks: string;
}