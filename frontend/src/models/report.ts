export interface InventorySummary {
  book_id: number;
  title: string;
  total_stock_in: number;
  total_stock_out: number;
  current_quantity: number;
}

export interface LowStockBook {
  id: number;
  title: string;
  author: string;
  quantity: number;
}

export interface BooksByCategory {
  category: string;
  total_books: number;
}