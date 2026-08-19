import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useProductStore } from '../store/useProductStore';

export default function ProductsPage() {
    const {
        products,
        isLoading,
        error,
        fetchProducts,
    } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <main className="min-h-screen bg-[#fdfbfa] text-[#1c1712]">

            {/* HERO */}
            <section className="px-6 py-20 md:px-12 lg:px-20">
                <div className="mx-auto max-w-7xl">

                    <span className="text-sm font-black uppercase tracking-[0.35em] text-[#b76e79]">
                        L'ESSENCE DE FRANCE
                    </span>

                    <h1 className="mt-4 max-w-4xl text-5xl font-black uppercase tracking-tighter md:text-7xl">
                        Encuentra tu
                        <span className="block text-[#b76e79]">
                            fragancia ideal
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg text-[#6b5c5e]">
                        Descubre nuestra colección de perfumes
                        y encuentra una fragancia que vaya
                        contigo.
                    </p>

                </div>
            </section>

            {/* PRODUCTOS */}
            <section className="px-6 pb-20 md:px-12 lg:px-20">
                <div className="mx-auto max-w-7xl">

                    <div className="mb-10 flex items-end justify-between gap-6 border-b-2 border-[#1c1712]/10 pb-5">

                        <div>
                            <span className="text-xs font-black uppercase tracking-widest text-[#b76e79]">
                                Colección
                            </span>

                            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
                                Nuestros perfumes
                            </h2>
                        </div>

                        <span className="text-sm font-bold text-[#6b5c5e]">
                            {products.length} productos
                        </span>

                    </div>

                    {isLoading && (
                        <div className="py-20 text-center">
                            <p className="font-bold">
                                Cargando perfumes...
                            </p>
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="border-2 border-red-200 bg-red-50 p-6 text-red-700">
                            <p className="font-bold">
                                {error}
                            </p>
                        </div>
                    )}

                    {!isLoading &&
                        !error &&
                        products.length === 0 && (
                            <div className="border-2 border-[#1c1712] bg-white p-12 text-center shadow-[8px_8px_0px_#b76e79]">
                                <h3 className="text-2xl font-black uppercase">
                                    Aún no hay perfumes
                                </h3>

                                <p className="mt-3 text-[#6b5c5e]">
                                    El catálogo estará disponible
                                    cuando el administrador agregue
                                    productos.
                                </p>
                            </div>
                        )}

                    {!isLoading &&
                        products.length > 0 && (
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">

                                {products.map((product) => (
                                    <article
                                        key={product.id}
                                        className="group overflow-hidden border-2 border-[#1c1712] bg-white shadow-[8px_8px_0px_#1c1712] transition-all duration-300 hover:-translate-y-1 hover:shadow-[12px_12px_0px_#b76e79]"
                                    >

                                        <div className="aspect-[4/5] overflow-hidden bg-[#f7eef0]">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-[#6b5c5e]">
                                                    Sin imagen
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6">

                                            <span className="text-xs font-black uppercase tracking-widest text-[#b76e79]">
                                                {product.brand}
                                            </span>

                                            <h3 className="mt-2 text-2xl font-black uppercase tracking-tight">
                                                {product.name}
                                            </h3>

                                            <p className="mt-3 line-clamp-3 text-sm text-[#6b5c5e]">
                                                {product.description}
                                            </p>

                                            <div className="mt-6 flex items-center justify-between gap-4">

                                                <span className="text-xl font-black">
                                                    Q{Number(product.price).toFixed(2)}
                                                </span>

                                                <Link
                                                    to={`/perfumes/${product.id}`}
                                                    className="border-2 border-[#1c1712] bg-[#1c1712] px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#b76e79]"
                                                >
                                                    Ver perfume
                                                </Link>

                                            </div>

                                        </div>

                                    </article>
                                ))}

                            </div>
                        )}

                </div>
            </section>
        </main>
    );
}