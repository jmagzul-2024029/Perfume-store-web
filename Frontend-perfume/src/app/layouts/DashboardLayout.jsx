import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
    LogOut,
    Store,
    Menu,
    X,
    Package,
    Users,
} from 'lucide-react';

import { useAuthStore } from '../../features/auth/store/useAuthStore';

const roleLabel = {
    SUPER_ADMIN_ROLE: 'Super Admin',
    ADMIN_ROLE: 'Admin',
};

export const DashboardLayout = () => {
    const { user, role, logout } = useAuthStore();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#fdfbfa]">
            <header className="sticky top-0 z-40 border-b-2 border-[#1c1712]/10 bg-black/95 backdrop-blur">

                {/* HEADER PRINCIPAL */}
                <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 md:px-12">

                    {/* LOGO */}
                    <Link
                        to="/dashboard"
                        onClick={closeMenu}
                        className="text-xs font-black uppercase tracking-[0.2em] text-[#fbfbfb] sm:text-sm sm:tracking-[0.3em]"
                    >
                        L'ESSENCE DE FRANCE
                    </Link>

                    {/* NAVEGACIÓN DESKTOP */}
                    <nav className="hidden items-center gap-6 md:flex">
                        <Link
                            to="/dashboard/perfumes"
                            className="text-xs font-black uppercase tracking-widest text-[#FAF0E6] transition hover:text-[#f4c97a]"
                        >
                            Perfumes
                        </Link>

                        {role === 'SUPER_ADMIN_ROLE' && (
                            <Link
                                to="/dashboard/admins"
                                className="text-xs font-black uppercase tracking-widest text-[#FAF0E6] transition hover:text-[#f4c97a]"
                            >
                                Administradores
                            </Link>
                        )}
                    </nav>

                    {/* ACCIONES DESKTOP */}
                    <div className="hidden items-center gap-4 md:flex">

                        <div className="text-right">

                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#fffffe]">
                                {roleLabel[role] || role}
                            </p>
                        </div>

                        <Link
                            to="/"
                            className="flex items-center gap-2 rounded-full border-2 border-[#fcfcfc] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#ffffff] transition hover:bg-[#fffefe] hover:text-black"
                        >
                            <Store size={14} />
                            Ver tienda
                        </Link>

                        <button
                            type="button"
                            onClick={logout}
                            className="flex items-center gap-2 rounded-full border-2 border-white bg-black px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-white hover:text-black"
                        >
                            <LogOut size={14} />
                            Cerrar sesión
                        </button>
                    </div>

                    {/* BOTÓN MENÚ MÓVIL */}
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((current) => !current)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-none text-[#faf8f6] transition hover:bg-[#1c1712] hover:text-white md:hidden"
                        aria-label={
                            isMenuOpen
                                ? 'Cerrar menú'
                                : 'Abrir menú'
                        }
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? (
                            <X size={20} />
                        ) : (
                            <Menu size={20} />
                        )}
                    </button>
                </div>

                {/* MENÚ MÓVIL */}
                {isMenuOpen && (                                            /* color de fondo desplegado */
                    <div className="border-t-2 border-white bg-black px-4 pb-5 pt-4 md:hidden">

                        {/* INFORMACIÓN DEL ADMIN */}
                        <div className="border-b border-[#ffffff]/90 py-4">
                            <p className="text-xs font-black uppercase tracking-wide text-white">
                                {user?.name || user?.username}
                            </p>

                            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#d7838f]">
                                {roleLabel[role] || role}
                            </p>
                        </div>

                        {/* PERFUMES */}
                        <Link
                            to="/dashboard/perfumes"
                            onClick={closeMenu}
                            className="flex items-center gap-3 border-b border-[#fffff]/10 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:text-[#b76e79]"
                        >
                            <Package size={18} />
                            Perfumes
                        </Link>

                        {/* ADMINISTRADORES */}
                        {role === 'SUPER_ADMIN_ROLE' && (
                            <Link
                                to="/dashboard/admins"
                                onClick={closeMenu}
                                className="flex items-center gap-3 border-b border-[#fffff]/10 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:text-[#b76e79]"
                            >
                                <Users size={18} />
                                Administradores
                            </Link>
                        )}

                        {/* VER TIENDA */}
                        <Link
                            to="/"
                            onClick={closeMenu}
                            className="flex items-center gap-3 border-b border-[#fffff]/10 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:text-[#b76e79]"
                        >
                            <Store size={18} />
                            Ver tienda
                        </Link>

                        {/* CERRAR SESIÓN */}
                        <button
                            type="button"
                            onClick={() => {
                                closeMenu();
                                logout();
                            }}
                            className="mt-4 flex w-full items-center justify-center gap-3 bg-[#434242] px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#333333]"
                        >
                            <LogOut size={16} />
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;