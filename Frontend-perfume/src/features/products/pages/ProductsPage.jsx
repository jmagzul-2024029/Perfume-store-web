import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';

import { useProductStore } from '../store/useProductStore';

const GENDER_LABELS = {
    HOMBRE: 'Hombre',
    MUJER: 'Mujer',
    UNISEX: 'Unisex',
};

const EMPTY_FILTERS = {
    gender: '',
    category: '',
    sort: '',
};

export default function ProductsPage() {
    const {
        products,
        isLoading,
        error,
        fetchProducts,
    } = useProductStore();

    const catalogDriveUrl = import.meta.env.VITE_CATALOG_DRIVE_URL;

    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState(EMPTY_FILTERS);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const categories = useMemo(() => {
        const unique = new Set(
            products
                .map((product) => product.category)
                .filter(Boolean)
        );
        return Array.from(unique).sort();
    }, [products]);

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();

        let result = products.filter((product) => {
            const matchesQuery =
                !query ||
                product.name?.toLowerCase().includes(query) ||
                product.brand?.toLowerCase().includes(query) ||
                product.description?.toLowerCase().includes(query);

            const matchesGender =
                !filters.gender || product.gender === filters.gender;

            const matchesCategory =
                !filters.category || product.category === filters.category;

            return matchesQuery && matchesGender && matchesCategory;
        });

        if (filters.sort === 'price-asc') {
            result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
        } else if (filters.sort === 'price-desc') {
            result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
        } else if (filters.sort === 'name-asc') {
            result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        }

        return result;
    }, [products, search, filters]);

    const activeFilterCount =
        (filters.gender ? 1 : 0) +
        (filters.category ? 1 : 0) +
        (filters.sort ? 1 : 0);

    const hasActiveSearch = search.trim().length > 0;

    const clearAll = () => {
        setSearch('');
        setFilters(EMPTY_FILTERS);
    };

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

                    <div className="mb-6 flex flex-wrap items-end justify-between gap-6 border-b-2 border-[#1c1712]/10 pb-5">

                        <div>
                            <span className="text-xs font-black uppercase tracking-widest text-[#b76e79]">
                                Colección
                            </span>

                            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
                                Nuestros perfumes
                            </h2>
                        </div>

                        <span className="text-sm font-bold text-[#6b5c5e]">
                            {filteredProducts.length} de {products.length} productos
                        </span>

                    </div>

                    {/* BÚSQUEDA Y FILTROS */}
                    <div className="mb-8 space-y-3">

                        <div className="flex flex-col gap-3 sm:flex-row">

                            <div className="relative flex-1">
                                <Search
                                    size={18}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6b5c5e]"
                                />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Buscar por nombre, marca o descripción..."
                                    className="w-full border-2 border-[#1c1712] bg-white py-3 pl-11 pr-4 text-sm font-medium placeholder:text-[#a89b9d] focus:outline-none focus:ring-2 focus:ring-[#b76e79]"
                                />
                                {hasActiveSearch && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        aria-label="Limpiar búsqueda"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b5c5e] hover:text-[#1c1712]"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowFilters((prev) => !prev)}
                                className={`flex shrink-0 items-center justify-center gap-2 border-2 border-[#1c1712] px-5 py-3 text-xs font-black uppercase tracking-widest transition ${
                                    showFilters || activeFilterCount > 0
                                        ? 'bg-[#1c1712] text-white'
                                        : 'bg-white text-[#1c1712] hover:bg-[#1c1712] hover:text-white'
                                }`}
                            >
                                <SlidersHorizontal size={16} />
                                Filtros
                                {activeFilterCount > 0 && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#b76e79] text-[10px] text-white">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>

                        </div>

                        {showFilters && (
                            <div className="flex flex-wrap items-end gap-4 border-2 border-[#1c1712] bg-white p-5 shadow-[5px_5px_0px_#b76e79]">

                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6b5c5e]">
                                        Género
                                    </label>
                                    <select
                                        value={filters.gender}
                                        onChange={(event) =>
                                            setFilters((prev) => ({ ...prev, gender: event.target.value }))
                                        }
                                        className="border-2 border-[#1c1712] bg-white px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#b76e79]"
                                    >
                                        <option value="">Todos</option>
                                        {Object.entries(GENDER_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {categories.length > 0 && (
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#6b5c5e]">
                                            Categoría
                                        </label>
                                        <select
                                            value={filters.category}
                                            onChange={(event) =>
                                                setFilters((prev) => ({ ...prev, category: event.target.value }))
                                            }
                                            className="border-2 border-[#1c1712] bg-white px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#b76e79]"
                                        >
                                            <option value="">Todas</option>
                                            {categories.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6b5c5e]">
                                        Ordenar por
                                    </label>
                                    <select
                                        value={filters.sort}
                                        onChange={(event) =>
                                            setFilters((prev) => ({ ...prev, sort: event.target.value }))
                                        }
                                        className="border-2 border-[#1c1712] bg-white px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#b76e79]"
                                    >
                                        <option value="">Más recientes</option>
                                        <option value="price-asc">Precio: menor a mayor</option>
                                        <option value="price-desc">Precio: mayor a menor</option>
                                        <option value="name-asc">Nombre: A-Z</option>
                                    </select>
                                </div>

                                {(activeFilterCount > 0 || hasActiveSearch) && (
                                    <button
                                        type="button"
                                        onClick={clearAll}
                                        className="ml-auto flex items-center gap-1 text-xs font-black uppercase tracking-widest text-[#b42339] hover:underline"
                                    >
                                        <X size={14} />
                                        Limpiar todo
                                    </button>
                                )}

                            </div>
                        )}

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
                        !error &&
                        products.length > 0 &&
                        filteredProducts.length === 0 && (
                            <div className="border-2 border-[#1c1712] bg-white p-12 text-center shadow-[8px_8px_0px_#b76e79]">
                                <h3 className="text-2xl font-black uppercase">
                                    Sin resultados
                                </h3>

                                <p className="mt-3 text-[#6b5c5e]">
                                    No encontramos perfumes que coincidan
                                    con tu búsqueda o filtros.
                                </p>

                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="mt-5 border-2 border-[#1c1712] bg-[#1c1712] px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#696969]"
                                >
                                    Limpiar búsqueda
                                </button>
                            </div>
                        )}

                    {!isLoading &&
                        filteredProducts.length > 0 && (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                                {filteredProducts.map((product) => (
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