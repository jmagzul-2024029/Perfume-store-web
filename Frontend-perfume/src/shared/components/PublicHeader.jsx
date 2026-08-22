import { Link } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

const ADMIN_ROLES = ['SUPER_ADMIN_ROLE', 'ADMIN_ROLE'];

export default function PublicHeader() {
    const { isAuthenticated, role, logout } = useAuthStore();

    const isAdmin = isAuthenticated && ADMIN_ROLES.includes(role);

    return (
        <header className="sticky top-0 z-40  border-white/10 bg-black/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4 md:px-12 lg:px-20">

                <Link
                    to="/"
                    className="text-sm font-black uppercase tracking-[0.2em] text-[#ffffff]"
                >
                    L'ESSENCE DE FRANCE
                </Link>

                {isAdmin ? (
                    <div className="flex items-center gap-4">
                        <Link
                            to="/dashboard"
                            className="text-xs uppercase tracking-wider text-[#ffffff] hover:text-[#c7c7c7] font-bold hover:scale-115 transition-transform duration-200"
                        >   
                            Panel admin
                        </Link>

                        <button
                            type="button"
                            onClick={logout}
                            className="font-bold transition-transform duration-200 hover:scale-115 border-none px-4 py-2 text-xs font-white uppercase tracking-wider text-[#ffffff] hover:text-[#ff0000]"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="text-xs font-black uppercase tracking-wider text-[#ffffff] hover:text-[#696969]"
                    >
                        Iniciar sesión
                    </Link>
                )}

            </div>
        </header>
    );
}
