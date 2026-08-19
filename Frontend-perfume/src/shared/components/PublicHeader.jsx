import { Link } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

const ADMIN_ROLES = ['SUPER_ADMIN_ROLE', 'ADMIN_ROLE'];

export default function PublicHeader() {
    const { isAuthenticated, role, logout } = useAuthStore();

    const isAdmin = isAuthenticated && ADMIN_ROLES.includes(role);

    return (
        <header className="sticky top-0 z-40 border-b-2 border-[#1c1712]/10 bg-[#fffaf3]/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12 lg:px-20">

                <Link
                    to="/"
                    className="text-sm font-black uppercase tracking-[0.3em] text-[#1c1712]"
                >
                    L'ESSENCE DE FRANCE
                </Link>

                {isAdmin ? (
                    <div className="flex items-center gap-4">
                        <Link
                            to="/dashboard"
                            className="text-xs font-black uppercase tracking-wider text-[#1c1712] hover:text-[#ef0202]"
                        >
                            Panel admin
                        </Link>

                        <button
                            type="button"
                            onClick={logout}
                            className="border-2 border-[#1c1712] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#1c1712] hover:bg-[#1c1712] hover:text-white"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="text-xs font-black uppercase tracking-wider text-[#1c1712] hover:text-[#b98c52]"
                    >
                        Iniciar sesión
                    </Link>
                )}

            </div>
        </header>
    );
}
