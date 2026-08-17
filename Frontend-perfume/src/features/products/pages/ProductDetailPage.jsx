import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useProductStore } from '../store/useProductStore';

export default function ProductDetailPage() {
    const { id } = useParams();

    const {
        selectedProduct,
        isLoading,
        error,
        fetchProductById,
        clearSelectedProduct,
    } = useProductStore();

    useEffect(() => {
        fetchProductById(id);

        return () => {
            clearSelectedProduct();
        };
    }, [
        id,
        fetchProductById,
        clearSelectedProduct,
    ]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#fffaf3] px-6 py-20">
                <div className="mx-auto max-w-7xl text-center">
                    <p className="font-bold">
                        Cargando perfume...
                    </p>
                </div>
            </main>
        );
    }

    if (error || !selectedProduct) {
        return (
            <main className="min-h-screen bg-[#fffaf3] px-6 py-20">
                <div className="mx-auto max-w-3xl border-2 border-[#1c1712] bg-white p-10 text-center shadow-[8px_8px_0px_#b98c52]">

                    <h1 className="text-3xl font-black uppercase">
                        Perfume no encontrado
                    </h1>

                    <p className="mt-4 text-[#6b5e4e]">
                        {error ||
                            'El perfume que buscas no existe.'}
                    </p>

                    <Link
                        to="/perfumes"
                        className="mt-8 inline-block bg-[#1c1712] px-6 py-3 text-sm font-black uppercase text-white"
                    >
                        Volver a perfumes
                    </Link>

                </div>
            </main>
        );
    }

    const product = selectedProduct;

    return (
        <main className="min-h-screen bg-[#fffaf3] px-6 py-12 md:px-12 lg:px-20">

            <div className="mx-auto max-w-7xl">

                <Link
                    to="/perfumes"
                    className="text-sm font-black uppercase tracking-widest text-[#b98c52]"
                >
                    ← Volver a perfumes
                </Link>

                <section className="mt-8 grid overflow-hidden border-2 border-[#1c1712] bg-white shadow-[12px_12px_0px_#1c1712] lg:grid-cols-2">

                    <div className="aspect-square bg-[#f7f0e2] lg:aspect-auto">

                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full min-h-[500px] items-center justify-center text-[#6b5e4e]">
                                Sin imagen
                            </div>
                        )}

                    </div>

                    <div className="flex flex-col justify-center p-8 md:p-12">

                        <span className="text-sm font-black uppercase tracking-[0.3em] text-[#b98c52]">
                            {product.brand}
                        </span>

                        <h1 className="mt-4 text-4xl font-black uppercase tracking-tighter md:text-6xl">
                            {product.name}
                        </h1>

                        <p className="mt-6 text-base leading-7 text-[#6b5e4e]">
                            {product.description}
                        </p>

                        <div className="mt-8 grid grid-cols-2 gap-4 border-y-2 border-[#1c1712]/10 py-6">

                            <div>
                                <span className="text-xs font-black uppercase text-[#6b5e4e]">
                                    Precio
                                </span>

                                <p className="mt-1 text-2xl font-black">
                                    Q{Number(product.price).toFixed(2)}
                                </p>
                            </div>

                            <div>
                                <span className="text-xs font-black uppercase text-[#6b5e4e]">
                                    Disponibilidad
                                </span>

                                <p className="mt-1 text-lg font-black">
                                    {product.stock > 0
                                        ? `${product.stock} disponibles`
                                        : 'Agotado'}
                                </p>
                            </div>

                        </div>

                        <div className="mt-6 space-y-3 text-sm">

                            {product.category && (
                                <p>
                                    <strong>Categoría:</strong>{' '}
                                    {product.category}
                                </p>
                            )}

                            {product.gender && (
                                <p>
                                    <strong>Género:</strong>{' '}
                                    {product.gender}
                                </p>
                            )}

                            {product.size && (
                                <p>
                                    <strong>Tamaño:</strong>{' '}
                                    {product.size}
                                </p>
                            )}

                        </div>

                        <button
                            type="button"
                            disabled={product.stock <= 0}
                            className="mt-8 border-2 border-[#1c1712] bg-[#1c1712] px-6 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-[#b98c52] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {product.stock > 0
                                ? 'Agregar al carrito'
                                : 'Agotado'}
                        </button>

                    </div>

                </section>

            </div>

        </main>
    );
}