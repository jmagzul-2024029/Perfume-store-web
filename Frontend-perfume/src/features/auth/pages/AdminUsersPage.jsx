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
        <main className="min-h-screen bg-[#fdfbfa] px-6 py-12 md:px-12 lg:px-20">
            <div className="mx-auto max-w-5xl">

                <div className="mb-10 flex items-end justify-between gap-6 border-b-2 border-[#1c1712]/10 pb-5">
                    <div>
                        <span className="text-xs font-black uppercase tracking-widest text-[#b76e79]">
                            Super Admin
                        </span>
                        <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">
                            Administradores
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowForm((v) => !v)}
                        className="flex items-center gap-2 border-2 border-[#1c1712] bg-[#1c1712] px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#b76e79]"
                    >
                        <UserPlus size={14} />
                        {showForm ? 'Cancelar' : 'Nuevo admin'}
                    </button>
                </div>

                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="mb-10 grid grid-cols-1 gap-4 border-2 border-[#1c1712] bg-white p-6 shadow-[8px_8px_0px_#b76e79] sm:grid-cols-2"
                    >
                        <input
                            name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required
                            className="border-2 border-[#1c1712]/20 px-4 py-2 text-sm focus:border-[#b76e79] focus:outline-none"
                        />
                        <input
                            name="surname" placeholder="Apellido" value={form.surname} onChange={handleChange} required
                            className="border-2 border-[#1c1712]/20 px-4 py-2 text-sm focus:border-[#b76e79] focus:outline-none"
                        />
                        <input
                            name="username" placeholder="Usuario" value={form.username} onChange={handleChange} required
                            className="border-2 border-[#1c1712]/20 px-4 py-2 text-sm focus:border-[#b76e79] focus:outline-none"
                        />
                        <input
                            name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} required
                            className="border-2 border-[#1c1712]/20 px-4 py-2 text-sm focus:border-[#b76e79] focus:outline-none"
                        />
                        <input
                            name="phone" placeholder="Teléfono (8 dígitos)" value={form.phone} onChange={handleChange} required
                            className="border-2 border-[#1c1712]/20 px-4 py-2 text-sm focus:border-[#b76e79] focus:outline-none"
                        />
                        <input
                            name="password" type="password" placeholder="Contraseña temporal" value={form.password} onChange={handleChange} required
                            className="border-2 border-[#1c1712]/20 px-4 py-2 text-sm focus:border-[#b76e79] focus:outline-none"
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="sm:col-span-2 mt-2 border-2 border-[#1c1712] bg-[#1c1712] px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-[#b76e79] disabled:opacity-50"
                        >
                            {isLoading ? 'Creando...' : 'Crear administrador'}
                        </button>
                    </form>
                )}

                <div className="border-2 border-[#1c1712] bg-white">
                    {admins.length === 0 ? (
                        <p className="p-8 text-center text-[#6b5c5e]">
                            No hay administradores adicionales todavía.
                        </p>
                    ) : (
                        admins.map((admin) => (
                            <div
                                key={admin.id}
                                className="flex items-center justify-between gap-4 border-b border-[#1c1712]/10 p-5 last:border-b-0"
                            >
                                <div>
                                    <p className="font-black uppercase">
                                        {admin.name} {admin.surname}
                                    </p>
                                    <p className="text-sm text-[#6b5c5e]">
                                        {admin.email} &middot; {admin.phone}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(admin.id, `${admin.name} ${admin.surname}`)}
                                    className="flex items-center gap-2 border-2 border-red-600 px-3 py-2 text-xs font-black uppercase text-red-600 transition hover:bg-red-600 hover:text-white"
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
