import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set(products),

  // CREATING NEW PRODUCT

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/product", productData);
      console.log(res);

      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },

  // GETTING ALL PRODUCTS

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/product/");
      console.log(response);

      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response?.data.error || "Failed to fetch products");
    }
  },

  // DELETING PRODUCT

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      console.log(productId);

      await axios.delete(`/product/${productId}`);
      set((prevProducts) => ({
        products: prevProducts.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data.error || "Failed to delete product");
    }
  },

  // FEATUR THE PRODUCTS FOR ADMINS

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/product/${productId}`);
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to update product");
    }
  },

  // FETCH FEATURED PRODUCTS

  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/product/featured");
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      console.log("Error fetching featured products:", error);
    }
  },

  // FETCHING PRODUCTS BY CATEGORY

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/product/category/${category}`);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },
}));
