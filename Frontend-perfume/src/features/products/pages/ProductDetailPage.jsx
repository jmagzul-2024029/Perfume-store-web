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
            <main className="min-h-screen bg-[#fdfbfa] px-6 py-20">
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
            <main className="min-h-screen bg-[#fdfbfa] px-6 py-20">
                <div className="mx-auto max-w-3xl border-2 border-[#1c1712] bg-white p-10 text-center shadow-[8px_8px_0px_#b76e79]">

                    <h1 className="text-3xl font-black uppercase">
                        Perfume no encontrado
                    </h1>

                    <p className="mt-4 text-[#6b5c5e]">
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

    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '50200000000';
    const whatsappMessage = encodeURIComponent(
        `Hola, me interesa el perfume "${product.name}" (${product.brand}) - Q${Number(product.price).toFixed(2)}. ¿Está disponible?`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <main className="min-h-screen bg-[#fdfbfa] px-6 py-12 md:px-12 lg:px-20">

            <div className="mx-auto max-w-7xl">

                <Link
                    to="/perfumes"
                    className="text-sm font-black uppercase tracking-widest text-[#b76e79]"
                >
                    ← Volver a perfumes
                </Link>

                <section className="mt-8 grid overflow-hidden border-2 border-[#1c1712] bg-white shadow-[12px_12px_0px_#1c1712] lg:grid-cols-2">

                    <div className="aspect-square bg-[#f7eef0] lg:aspect-auto">

                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full min-h-[500px] items-center justify-center text-[#6b5c5e]">
                                Sin imagen
                            </div>
                        )}

                    </div>

                    <div className="flex flex-col justify-center p-8 md:p-12">

                        <span className="text-sm font-black uppercase tracking-[0.3em] text-[#b76e79]">
                            {product.brand}
                        </span>

                        <h1 className="mt-4 text-4xl font-black uppercase tracking-tighter md:text-6xl">
                            {product.name}
                        </h1>

                        <p className="mt-6 text-base leading-7 text-[#6b5c5e]">
                            {product.description}
                        </p>

                        <div className="mt-8 grid grid-cols-2 gap-4 border-y-2 border-[#1c1712]/10 py-6">

                            <div>
                                <span className="text-xs font-black uppercase text-[#6b5c5e]">
                                    Precio
                                </span>

                                <p className="mt-1 text-2xl font-black">
                                    Q{Number(product.price).toFixed(2)}
                                </p>
                            </div>

                            <div>
                                <span className="text-xs font-black uppercase text-[#6b5c5e]">
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

                        {product.stock > 0 ? (
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-8 flex items-center justify-center gap-2 border-2 border-[#1c1712] bg-[#1c1712] px-6 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-[#b76e79]"
                            >
                                Consultar por WhatsApp
                            </a>
                        ) : (
                            <button
                                type="button"
                                disabled
                                className="mt-8 border-2 border-[#1c1712] bg-[#1c1712] px-6 py-4 text-sm font-black uppercase tracking-widest text-white opacity-40 disabled:cursor-not-allowed"
                            >
                                Agotado
                            </button>
                        )}

                    </div>

                </section>

            </div>

        </main>
    );
}