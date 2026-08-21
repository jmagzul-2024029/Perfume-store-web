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

    const catalogDriveUrl = import.meta.env.VITE_CATALOG_DRIVE_URL;

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

            {/* CATÁLOGO */}
            {catalogDriveUrl && (
                <section className="px-6 pb-4 md:px-12 lg:px-20">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 border-2 border-[#1c1712] bg-white p-5 shadow-[6px_6px_0px_#b76e79]">

                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-[#b42339]">
                                Nuestros catálogos
                            </p>

                            <p className="mt-1 text-sm text-[#6b5c5e]">
                                Consulta nuestros catálogos de perfumes para hombres y mujeres en PDF.
                            </p>
                        </div>

                        <a
                            href={catalogDriveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 border-2 border-[#1c1712] bg-[#1c1712] px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#696969]"
                        >
                            Ver catálogos
                        </a>

                    </div>
                </section>
            )}

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
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                                {products.map((product) => (
                                    <article
                                        key={product.id}
                                        className="group overflow-hidden border-2 border-[#1c1712] bg-white shadow-[5px_5px_0px_#808080] transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000000]"
                                    >

                                        <div className="aspect-square overflow-hidden bg-[#f7eef0]">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-xs text-[#6b5c5e]">
                                                    Sin imagen
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-3">

                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#b76e79]">
                                                {product.brand}
                                            </span>

                                            <h3 className="mt-1 line-clamp-1 text-sm font-black uppercase tracking-tight">
                                                {product.name}
                                            </h3>

                                            <p className="mt-1 line-clamp-2 text-xs text-[#6b5c5e]">
                                                {product.description}
                                            </p>

                                            <div className="mt-3 flex items-center justify-between gap-2">

                                                <span className="text-sm font-black">
                                                    Q{Number(product.price).toFixed(2)}
                                                </span>

                                                <Link
                                                    to={`/perfumes/${product.id}`}
                                                    className="border-2 border-[#1c1712] bg-[#1c1712] px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#8b0000]"
                                                >
                                                    Ver detalles
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