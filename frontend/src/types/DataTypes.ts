export interface User {
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  rating: number;
  image: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface ApiResponse<T = any> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  pagination: {
    totalEntries: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  page?: number;
  pageSize?: number;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}

export interface OrderFilters {
  page?: number;
  pageSize?: number;
  role?: string;
}

export interface AddToCartVariables {
  productId: string;
  price: number;
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

// orders data types

// Interface for each item in the order
interface OrderItem {
  product: Product;
  quantity: number;
  _id: string;
}

// Interface for an individual order
export interface Order {
  _id: string;
  user: User;
  items: OrderItem[];
  totalAmount: number;
  status: string; // You may want to use an enum for fixed statuses
  paymentDetails: Record<string, any>; // Define a more specific type if available
  createdAt: string; // Consider using Date type if you parse it
  updatedAt: string; // Consider using Date type if you parse it
  __v: number;
}

// Interface for pagination details
interface Pagination {
  totalEntries: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

// Main interface for the response
export interface ViewOrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
  pagination: Pagination;
}

export interface BackendError {
  errors?: {
    [key: string]: string[];
  };
  message?: string;
}
