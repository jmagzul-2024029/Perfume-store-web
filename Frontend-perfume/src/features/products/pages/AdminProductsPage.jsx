import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useProductStore } from '../store/useProductStore';

const emptyForm = {
    name: '',
    brand: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    gender: 'UNISEX',
    size: '',
};

export default function AdminProductsPage() {
    const {
        products,
        isLoading,
        isSaving,
        fetchProducts,
        addProduct,
        editProduct,
        removeProduct,
    } = useProductStore();

    const [form, setForm] =
        useState(emptyForm);

    const [imageFile, setImageFile] =
        useState(null);

    const [imagePreview, setImagePreview] =
        useState('');

    const [editingId, setEditingId] =
        useState(null);

    const [showForm, setShowForm] =
        useState(false);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleChange = (event) => {
        const { name, value } =
            event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            setImageFile(null);
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setImageFile(null);
        setImagePreview('');
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !form.name.trim() ||
            !form.brand.trim() ||
            !form.description.trim() ||
            form.price === '' ||
            form.stock === ''
        ) {
            toast.error(
                'Completa todos los campos obligatorios'
            );
            return;
        }

        const payload = new FormData();

        payload.append('name', form.name);
        payload.append('brand', form.brand);
        payload.append('description', form.description);
        payload.append('price', Number(form.price));
        payload.append('stock', Number(form.stock));
        payload.append('category', form.category);
        payload.append('gender', form.gender);
        payload.append('size', form.size);

        if (imageFile) {
            payload.append('image', imageFile);
        }

        let result;

        if (editingId) {
            result = await editProduct(
                editingId,
                payload
            );
        } else {
            result = await addProduct(payload);
        }

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        toast.success(
            editingId
                ? 'Perfume actualizado'
                : 'Perfume creado'
        );

        resetForm();
    };

    const handleEdit = (product) => {
        setEditingId(product.id);

        setForm({
            name: product.name || '',
            brand: product.brand || '',
            description:
                product.description || '',
            price: product.price ?? '',
            stock: product.stock ?? '',
            category: product.category || '',
            gender:
                product.gender || 'UNISEX',
            size: product.size || '',
        });

        setImageFile(null);
        setImagePreview(product.image || '');

        setShowForm(true);
    };

    const handleDelete = async (product) => {
        const confirmed = window.confirm(
            `¿Seguro que deseas eliminar "${product.name}"?`
        );

        if (!confirmed) return;

        const result =
            await removeProduct(product.id);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        toast.success(
            'Perfume eliminado correctamente'
        );
    };

    return (
        <main className="min-h-screen bg-[#fdfbfa] px-6 py-12 text-[#1c1712] md:px-12 lg:px-20">

            <div className="mx-auto max-w-7xl">

                <div className="mb-10 flex flex-col justify-between gap-6 border-b-2 border-[#1c1712]/10 pb-6 md:flex-row md:items-end">

                    <div>
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-[#b76e79]">
                            Panel administrativo
                        </span>

                        <h1 className="mt-2 text-4xl font-black uppercase tracking-tighter md:text-5xl">
                            Gestión de perfumes
                        </h1>

                        <p className="mt-3 text-[#6b5c5e]">
                            Administra el catálogo de la tienda.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            if (showForm) {
                                resetForm();
                            } else {
                                setShowForm(true);
                            }
                        }}
                        className="border-2 border-[#1c1712] bg-[#1c1712] px-6 py-3 text-sm font-black uppercase tracking-wider text-white transition hover:bg-[#b76e79]"
                    >
                        {showForm
                            ? 'Cancelar'
                            : '+ Nuevo perfume'}
                    </button>

                </div>

                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="mb-12 border-2 border-[#1c1712] bg-white p-6 shadow-[8px_8px_0px_#b76e79] md:p-8"
                    >

                        <h2 className="mb-8 text-2xl font-black uppercase">
                            {editingId
                                ? 'Editar perfume'
                                : 'Nuevo perfume'}
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-xs font-black uppercase">
                                    Nombre *
                                </label>

                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full border-2 border-[#1c1712] px-4 py-3 outline-none focus:border-[#b76e79]"
                                    placeholder="Nombre del perfume"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-black uppercase">
                                    Marca *
                                </label>

                                <input
                                    name="brand"
                                    value={form.brand}
                                    onChange={handleChange}
                                    className="w-full border-2 border-[#1c1712] px-4 py-3 outline-none focus:border-[#b76e79]"
                                    placeholder="Marca"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-xs font-black uppercase">
                                    Descripción *
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full border-2 border-[#1c1712] px-4 py-3 outline-none focus:border-[#b76e79]"
                                    placeholder="Descripción del perfume"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-black uppercase">
                                    Precio *
                                </label>

                                <input
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    onChange={handleChange}
                                    className="w-full border-2 border-[#1c1712] px-4 py-3 outline-none focus:border-[#b76e79]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-black uppercase">
                                    Stock *
                                </label>

                                <input
                                    name="stock"
                                    type="number"
                                    min="0"
                                    value={form.stock}
                                    onChange={handleChange}
                                    className="w-full border-2 border-[#1c1712] px-4 py-3 outline-none focus:border-[#b76e79]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-black uppercase">
                                    Categoría
                                </label>

                                <input
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="w-full border-2 border-[#1c1712] px-4 py-3 outline-none focus:border-[#b76e79]"
                                    placeholder="Eau de Parfum"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-black uppercase">
                                    Género
                                </label>

                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    className="w-full border-2 border-[#1c1712] bg-white px-4 py-3 outline-none focus:border-[#b76e79]"
                                >
                                    <option value="HOMBRE">
                                        Hombre
                                    </option>

                                    <option value="MUJER">
                                        Mujer
                                    </option>

                                    <option value="UNISEX">
                                        Unisex
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-black uppercase">
                                    Tamaño
                                </label>

                                <input
                                    name="size"
                                    value={form.size}
                                    onChange={handleChange}
                                    className="w-full border-2 border-[#1c1712] px-4 py-3 outline-none focus:border-[#b76e79]"
                                    placeholder="100 ml"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-xs font-black uppercase">
                                    Imagen del perfume
                                </label>

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                                    {imagePreview && (
                                        <img
                                            src={imagePreview}
                                            alt="Previsualización"
                                            className="h-24 w-24 flex-shrink-0 border-2 border-[#1c1712] object-cover"
                                        />
                                    )}

                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                        onChange={handleImageChange}
                                        className="w-full border-2 border-[#1c1712] bg-white px-4 py-3 text-sm outline-none file:mr-4 file:border-0 file:bg-[#1c1712] file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:text-white"
                                    />

                                </div>

                                {editingId && !imageFile && (
                                    <p className="mt-2 text-xs text-[#6b5c5e]">
                                        Deja este campo vacío para conservar la imagen actual.
                                    </p>
                                )}
                            </div>

                        </div>

                        <div className="mt-8 flex justify-end">

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="border-2 border-[#1c1712] bg-[#b76e79] px-8 py-3 text-sm font-black uppercase text-[#1c1712] disabled:opacity-50"
                            >
                                {isSaving
                                    ? 'Guardando...'
                                    : editingId
                                        ? 'Actualizar perfume'
                                        : 'Guardar perfume'}
                            </button>

                        </div>

                    </form>
                )}

                {/* TABLA */}

                <section className="overflow-hidden border-2 border-[#1c1712] bg-white">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[900px]">

                            <thead className="bg-[#1c1712] text-left text-xs uppercase tracking-wider text-white">
                                <tr>
                                    <th className="px-5 py-4">
                                        Producto
                                    </th>

                                    <th className="px-5 py-4">
                                        Marca
                                    </th>

                                    <th className="px-5 py-4">
                                        Precio
                                    </th>

                                    <th className="px-5 py-4">
                                        Stock
                                    </th>

                                    <th className="px-5 py-4">
                                        Categoría
                                    </th>

                                    <th className="px-5 py-4">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {isLoading && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-5 py-10 text-center"
                                        >
                                            Cargando productos...
                                        </td>
                                    </tr>
                                )}

                                {!isLoading &&
                                    products.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-5 py-10 text-center text-[#6b5c5e]"
                                            >
                                                No hay perfumes registrados.
                                            </td>
                                        </tr>
                                    )}

                                {!isLoading &&
                                    products.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="border-t border-[#1c1712]/10"
                                        >

                                            <td className="px-5 py-4 font-bold">
                                                {product.name}
                                            </td>

                                            <td className="px-5 py-4">
                                                {product.brand}
                                            </td>

                                            <td className="px-5 py-4 font-black">
                                                Q
                                                {Number(
                                                    product.price
                                                ).toFixed(2)}
                                            </td>

                                            <td className="px-5 py-4">
                                                {product.stock}
                                            </td>

                                            <td className="px-5 py-4">
                                                {product.category ||
                                                    '—'}
                                            </td>

                                            <td className="px-5 py-4">

                                                <div className="flex gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(product)
                                                        }
                                                        className="border-2 border-[#1c1712] px-3 py-2 text-xs font-black uppercase hover:bg-[#f7eef0]"
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(product)
                                                        }
                                                        disabled={isSaving}
                                                        className="border-2 border-red-700 px-3 py-2 text-xs font-black uppercase text-red-700 hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        Eliminar
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    ))}

                            </tbody>

                        </table>

                    </div>

                </section>

            </div>

        </main>
    );
}