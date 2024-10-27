import axios, { AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AddToCartVariables,
  ApiResponse,
  BackendError,
  CartItem,
  LoginCredentials,
  LoginResponse,
  OrderFilters,
  Product,
  ProductFilters,
  ProductsResponse,
  RegisterData,
  User,
  ViewOrdersResponse,
} from "@/types/DataTypes";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Types

type QueryKeys = {
  userProfile: ["userProfile"];
  products: ["products", ProductFilters];
  cart: ["cart"];
  orders: ["orders"];
  adminOrders: ["adminOrders"];
};

// Authentication Mutations
export const useRegister = () => {
  return useMutation<ApiResponse, AxiosError<BackendError>, RegisterData>({
    mutationFn: async (userData: RegisterData) => {
      const { data } = await axiosInstance.post<ApiResponse>(
        "/auth/signup",
        userData
      );
      return data;
    },
  });
};

export const useLogin = () => {
  return useMutation<
    ApiResponse<LoginResponse>,
    AxiosError<BackendError>,
    LoginCredentials
  >({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await axiosInstance.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        credentials,
        { withCredentials: true }
      );
      return data;
    },
  });
};

export const useUserProfile = () => {
  return useQuery<
    ApiResponse<User>,
    Error,
    ApiResponse<User>,
    QueryKeys["userProfile"]
  >({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<User>>(
        "/auth/getData",
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
  });
};

export const useUpdateProfile = () => {
  return useMutation<ApiResponse<User>, Error, User>({
    mutationFn: async (userData: User) => {
      const { data } = await axiosInstance.put<ApiResponse<User>>(
        "/auth/profile",
        userData,
        { withCredentials: true }
      );
      return data;
    },
  });
};

export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery<
    ProductsResponse,
    AxiosError<ApiResponse<null>>,
    ProductsResponse,
    QueryKeys["products"]
  >({
    queryKey: ["products", filters],
    queryFn: async () => {
      const queryParams = {
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? 10,
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.rating && { rating: filters.rating }),
      };

      const { data } = await axiosInstance.get<ProductsResponse>(
        "/products/get-all-products",
        {
          params: queryParams,
        }
      );
      return data;
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, Partial<Product>>({
    mutationFn: async (productData: Partial<Product>) => {
      const { data } = await axiosInstance.post<Product>(
        "/products/create",
        productData,
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = () => {
  return useMutation<Product, Error, Partial<Product & { _id: string }>>({
    mutationFn: async ({ _id, ...productData }) => {
      const { data } = await axiosInstance.put<Product>(
        `/products/${_id}`,
        productData
      );
      return data;
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (productId: string) => {
      await axiosInstance.delete(`/products/delete/${productId}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useAddToCart = () => {
  return useMutation<void, Error, AddToCartVariables>({
    mutationFn: async ({ productId, price }: AddToCartVariables) => {
      await axiosInstance.post(
        "/cart/add",
        { productId, price },
        { withCredentials: true }
      );
    },
  });
};
export const useViewCart = () => {
  return useQuery<ApiResponse<CartItem[]>, AxiosError>({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<CartItem[]>>(
        "/cart/get-cart",
        { withCredentials: true }
      );
      return data;
    },
  });
};

// Order Mutations

export const useViewOrders = (filters: OrderFilters = {}) => {
  return useQuery<
    ViewOrdersResponse,
    AxiosError<ApiResponse<null>>,
    ViewOrdersResponse,
    QueryKeys["orders"]
  >({
    queryKey: ["orders"],
    queryFn: async () => {
      const queryParams = {
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? 10,
        role: filters.role ?? "user",
      };

      const { data } = await axiosInstance.get<ViewOrdersResponse>(
        filters.role == "admin"
          ? "/orders/view-all-orders"
          : "orders/view-orders",
        {
          params: queryParams,
          withCredentials: true,
        }
      );
      return data;
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      await axiosInstance.get("/orders/place-order", {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// Admin Mutations
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { orderId: string; status: string }>({
    mutationFn: async ({ orderId, status }) => {
      await axiosInstance.get(
        `/orders/orderActions/${orderId}?status=${status}`,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
