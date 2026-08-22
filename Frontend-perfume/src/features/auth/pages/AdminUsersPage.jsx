import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Trash2, UserPlus } from 'lucide-react';

import { useAuthStore } from '../store/useAuthStore';

const emptyForm = {
    email: '',
    username: '',
    password: '',
    name: '',
    surname: '',
    phone: '',
};

export const AdminUsersPage = () => {
    const { getManagers, createManager, deleteManager, isLoading } = useAuthStore();

    const [admins, setAdmins] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);

    const loadAdmins = async () => {
        const result = await getManagers();
        if (result.success) {
            setAdmins(result.data || []);
        } else {
            toast.error(result.error);
        }
    };

    useEffect(() => {
        loadAdmins();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await createManager(form);
        if (result.success) {
            if (result.emailSent === false) {
                // El admin se creó, pero el correo de verificación no salió:
                // se lo hacemos notar explícitamente en vez de un toast de éxito genérico.
                toast.error(
                    result.message ||
                    'Administrador creado, pero no se pudo enviar el correo de verificación.',
                    { duration: 6000 }
                );
            } else {
                toast.success(result.message || 'Administrador creado exitosamente');
            }
            setForm(emptyForm);
            setShowForm(false);
            loadAdmins();
        } else {
            toast.error(result.error);
        }
    };

    const handleDelete = async (id, label) => {
        if (!window.confirm(`¿Eliminar permanentemente a ${label}?`)) return;

        const result = await deleteManager(id);
        if (result.success) {
            toast.success(result.message || 'Administrador eliminado');
            loadAdmins();
        } else {
            toast.error(result.error);
        }
    };

    return (
        <main className="min-h-screen bg-[#fcfced] px-4 py-6 text-[#1c1712] sm:px-6 sm:py-10 md:px-12 lg:px-20">
            <div className="mx-auto w-full max-w-5xl">

                {/* ENCABEZADO */}
                <div className="mb-8 flex flex-col gap-5 border-b-2 border-[#1c1712]/10 pb-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-6">

                    <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b76e79] sm:text-xs sm:tracking-widest">
                            Super Admin
                        </span>

                        <h1 className="mt-1 text-2xl font-black uppercase tracking-tight sm:mt-2 sm:text-3xl">
                            Administradores
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowForm((v) => !v)}
                        className="cursor-pointer rounded-lg flex w-full items-center justify-center gap-2 border-2 border-[#1c1712] bg-[#1c1712] px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-[#b2b2b2] hover:text-black sm:w-auto sm:shrink-0 sm:px-7 sm:py-2"
                    >
                        <UserPlus size={14} />
                        {showForm ? 'Cancelar' : 'Nuevo admin'}
                    </button>
                </div>

                {/* FORMULARIO */}
                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="mb-8 grid grid-cols-1 gap-3 border-2 border-[#1c1712] bg-white p-4 shadow-[5px_5px_0px_#b76e79] sm:mb-10 sm:grid-cols-2 sm:gap-4 sm:p-6 sm:shadow-[8px_8px_0px_#b76e79]"
                    >
                        <input
                            name="name"
                            placeholder="Nombre"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="min-w-0 border-2 border-[#1c1712]/20 px-3 py-3 text-sm focus:border-[#b76e79] focus:outline-none sm:px-4 sm:py-2"
                        />

                        <input
                            name="surname"
                            placeholder="Apellido"
                            value={form.surname}
                            onChange={handleChange}
                            required
                            className="min-w-0 border-2 border-[#1c1712]/20 px-3 py-3 text-sm focus:border-[#b76e79] focus:outline-none sm:px-4 sm:py-2"
                        />

                        <input
                            name="username"
                            placeholder="Usuario"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="min-w-0 border-2 border-[#1c1712]/20 px-3 py-3 text-sm focus:border-[#b76e79] focus:outline-none sm:px-4 sm:py-2"
                        />

                        <input
                            name="email"
                            type="email"
                            placeholder="Correo"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="min-w-0 border-2 border-[#1c1712]/20 px-3 py-3 text-sm focus:border-[#b76e79] focus:outline-none sm:px-4 sm:py-2"
                        />

                        <input
                            name="phone"
                            placeholder="Teléfono (8 dígitos)"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            className="min-w-0 border-2 border-[#1c1712]/20 px-3 py-3 text-sm focus:border-[#b76e79] focus:outline-none sm:px-4 sm:py-2"
                        />

                        <input
                            name="password"
                            type="password"
                            placeholder="Contraseña temporal"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="min-w-0 border-2 border-[#1c1712]/20 px-3 py-3 text-sm focus:border-[#b76e79] focus:outline-none sm:px-4 sm:py-2"
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-2 w-full border-2 border-[#1c1712] bg-[#1c1712] px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#b76e79] disabled:opacity-50 sm:col-span-2 sm:px-6 sm:text-sm"
                        >
                            {isLoading ? 'Creando...' : 'Crear administrador'}
                        </button>
                    </form>
                )}

                {/* LISTA DE ADMINISTRADORES */}
                <div className="w-full border-2 border-[#1c1712] bg-white">

                    {admins.length === 0 ? (
                        <p className="p-6 text-center text-sm text-[#6b5c5e] sm:p-8">
                            No hay administradores adicionales todavía.
                        </p>
                    ) : (
                        admins.map((admin) => (
                            <div
                                key={admin.id}
                                className="flex flex-col gap-4 border-b border-[#1c1712]/10 p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5"
                            >
                                {/* INFORMACIÓN */}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-black uppercase sm:text-base">
                                        {admin.name} {admin.surname}
                                    </p>

                                    <p className="mt-1 break-all text-xs text-[#6b5c5e] sm:text-sm">
                                        {admin.email} · {admin.phone}
                                    </p>
                                </div>

                                {/* BOTÓN */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(
                                            admin.id,
                                            `${admin.name} ${admin.surname}`
                                        )
                                    }
                                    className="cursor-pointer flex w-full shrink-0 items-center justify-center gap-2 border-2 border-red-600 px-3 py-2.5 text-[10px] font-black uppercase tracking-wide text-red-600 transition hover:bg-red-600 hover:text-white sm:w-auto sm:text-xs"
                                >
                                    <Trash2 size={14} />
                                    Eliminar
                                </button>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </main>
    );
};

export default AdminUsersPage;
