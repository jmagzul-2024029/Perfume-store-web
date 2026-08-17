import { create } from 'zustand';

import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../services/productService';

export const useProductStore = create((set) => ({
    products: [],
    selectedProduct: null,

    isLoading: false,
    isSaving: false,

    error: null,

    fetchProducts: async () => {
        set({
            isLoading: true,
            error: null,
        });

        try {
            const products = await getProducts();

            set({
                products,
                isLoading: false,
            });

            return {
                success: true,
                data: products,
            };
        } catch (error) {
            const message =
                error.response?.data?.message ||
                'No se pudieron cargar los perfumes';

            set({
                isLoading: false,
                error: message,
            });

            return {
                success: false,
                error: message,
            };
        }
    },

    fetchProductById: async (id) => {
        set({
            isLoading: true,
            error: null,
        });

        try {
            const product =
                await getProductById(id);

            set({
                selectedProduct: product,
                isLoading: false,
            });

            return {
                success: true,
                data: product,
            };
        } catch (error) {
            const message =
                error.response?.data?.message ||
                'No se pudo cargar el perfume';

            set({
                selectedProduct: null,
                isLoading: false,
                error: message,
            });

            return {
                success: false,
                error: message,
            };
        }
    },

    addProduct: async (product) => {
        set({
            isSaving: true,
            error: null,
        });

        try {
            const created =
                await createProduct(product);

            set((state) => ({
                products: [
                    created,
                    ...state.products,
                ],
                isSaving: false,
            }));

            return {
                success: true,
                data: created,
            };
        } catch (error) {
            const message =
                error.response?.data?.message ||
                'No se pudo crear el perfume';

            set({
                isSaving: false,
                error: message,
            });

            return {
                success: false,
                error: message,
            };
        }
    },

    editProduct: async (id, product) => {
        set({
            isSaving: true,
            error: null,
        });

        try {
            const updated =
                await updateProduct(id, product);

            set((state) => ({
                products: state.products.map(
                    (item) =>
                        item.id === id
                            ? updated
                            : item
                ),

                selectedProduct:
                    state.selectedProduct?.id === id
                        ? updated
                        : state.selectedProduct,

                isSaving: false,
            }));

            return {
                success: true,
                data: updated,
            };
        } catch (error) {
            const message =
                error.response?.data?.message ||
                'No se pudo actualizar el perfume';

            set({
                isSaving: false,
                error: message,
            });

            return {
                success: false,
                error: message,
            };
        }
    },

    removeProduct: async (id) => {
        set({
            isSaving: true,
            error: null,
        });

        try {
            await deleteProduct(id);

            set((state) => ({
                products: state.products.filter(
                    (item) => item.id !== id
                ),
                isSaving: false,
            }));

            return {
                success: true,
            };
        } catch (error) {
            const message =
                error.response?.data?.message ||
                'No se pudo eliminar el perfume';

            set({
                isSaving: false,
                error: message,
            });

            return {
                success: false,
                error: message,
            };
        }
    },

    clearSelectedProduct: () => {
        set({
            selectedProduct: null,
        });
    },
}));