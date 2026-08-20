import { Link, Outlet } from 'react-router-dom';
import { LogOut, Store } from 'lucide-react';

import { useAuthStore } from '../../features/auth/store/useAuthStore';

const roleLabel = {
    SUPER_ADMIN_ROLE: 'Super Admin',
    ADMIN_ROLE: 'Admin',
};

export const DashboardLayout = () => {
    const { user, role, logout } = useAuthStore();

    return (
        <div className="min-h-screen bg-[#fdfbfa]">
            <header className="sticky top-0 z-40 flex items-center justify-between gap-6 border-b-2 border-[#1c1712]/10 bg-[#fdfbfa]/95 px-6 py-4 backdrop-blur md:px-12">
                <div className="flex items-center gap-8">
                    <Link to="/dashboard" className="text-sm font-black uppercase tracking-[0.3em] text-[#1c1712]">
                        L'ESSENCE DE FRANCE <span className="text-[#000000]">Admin</span>
                    </Link>

                    <nav className="hidden items-center gap-6 md:flex">
                        <Link
                            to="/dashboard/perfumes"
                            className="text-xs font-black uppercase tracking-widest text-[#1c1712] transition hover:text-[#b76e79]"
                        >
                            Perfumes
                        </Link>

                        {role === 'SUPER_ADMIN_ROLE' && (
                            <Link
                                to="/dashboard/admins"
                                className="text-xs font-black uppercase tracking-widest text-[#1c1712] transition hover:text-[#b76e79]"
                            >
                                Administradores
                            </Link>
                        )}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden text-right sm:block">
                        <p className="text-xs font-black uppercase tracking-wide text-[#1c1712]">
                            {user?.name || user?.username}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#b76e79]">
                            {roleLabel[role] || role}
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="flex items-center gap-2 rounded-full border-2 border-[#1c1712] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#1c1712] transition hover:bg-[#1c1712] hover:text-white"
                    >
                        <Store size={14} />
                        <span className="hidden sm:inline">Ver tienda</span>
                    </Link>

                    <button
                        onClick={logout}
                        className="flex items-center gap-2 rounded-full bg-[#1c1712] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-[#33333392]"
                    >
                        <LogOut size={14} />
                        <span className="hidden sm:inline">Cerrar sesión</span>
                    </button>
                </div>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
