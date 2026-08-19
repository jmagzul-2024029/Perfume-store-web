import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

import Perfumes1 from '../../../assets/img/carr-1.jpg';
import Perfumes2 from '../../../assets/img/carr-2.webp';
import Perfumes3 from '../../../assets/img/carr-3.jpg';
import LogoPerfumes from '../../../assets/img/Logo-Perfume.jpg';

import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';

const perfumeImages = [Perfumes1, Perfumes2, Perfumes3];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
  });

  const [currentImage, setCurrentImage] = useState(0);

  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage(
        (previous) => (previous + 1) % perfumeImages.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFieldErrors({
      email: '',
      password: '',
    });

    if (!email.trim() || !password) {
      setFieldErrors({
        email: !email.trim()
          ? 'Ingresa tu usuario o correo'
          : '',
        password: !password
          ? 'Ingresa tu contraseña'
          : '',
      });

      return;
    }

    try {
      const result = await login(email.trim(), password);

      if (result.success) {
        toast.success("¡Bienvenido a L'ESSENCE DE FRANCE!");

        const loggedUser = useAuthStore.getState().user;

        /*
         * Solamente los administradores necesitan iniciar sesión.
         * Después de autenticarse correctamente van directamente
         * al panel administrativo.
         */
        navigate('/dashboard');

        return;
      }

      if (result.code === 'USER_NOT_FOUND') {
        setFieldErrors({
          email: 'Usuario no encontrado',
          password: '',
        });

        return;
      }

      if (result.code === 'INVALID_PASSWORD') {
        setFieldErrors({
          email: '',
          password: 'Contraseña incorrecta',
        });

        return;
      }

      toast.error(
        result.error || 'No fue posible iniciar sesión'
      );
    } catch (error) {
      console.error('Error durante el login:', error);

      toast.error(
        'No se pudo conectar con el servidor'
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf3] flex items-center justify-center px-4 py-6 sm:px-6 relative overflow-hidden font-outfit">

      {/* Decoración de fondo */}
      <div className="absolute -top-24 -right-24 w-64 h-64 sm:w-80 sm:h-80 bg-[#b98c52] opacity-5 border-4 border-[#1c1712] rotate-12 pointer-events-none" />

      <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-[#b98c52] opacity-5 border-4 border-[#1c1712] -rotate-12 pointer-events-none" />

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white border-2 sm:border-4 border-[#1c1712] shadow-[8px_8px_0px_#1c1712] sm:shadow-[20px_20px_0px_#1c1712] overflow-hidden">

        {/* ================================
            FORMULARIO
        ================================= */}
        <motion.section
          initial={{
            opacity: 0,
            x: -30,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="lg:col-span-5 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center"
        >

          {/* Logo y encabezado */}
          <div className="mb-8 sm:mb-10 text-center">

            <img
              src={LogoPerfumes}
              alt="L'ESSENCE DE FRANCE"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-full mx-auto mb-5 sm:mb-7 border-2 border-[#1c1712]"
            />

            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-[#b98c52] mb-3">
              L'ESSENCE DE FRANCE
            </p>

            <h1 className="text-3xl sm:text-4xl font-black text-[#1c1712] uppercase tracking-tighter leading-none mb-3">
              Acceso{' '}
              <span className="text-[#b98c52]">
                Administrativo
              </span>
            </h1>

            <p className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.15em] text-zinc-500 leading-relaxed max-w-xs mx-auto">
              Gestiona tu colección de fragancias
            </p>
          </div>

          {/* Formulario */}
          <form
            className="space-y-5 sm:space-y-6"
            onSubmit={handleSubmit}
          >

            {/* Email */}
            <Input
              label="Usuario / Email"
              icon={Mail}
              type="text"
              placeholder="admin@perfumeshop.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              error={fieldErrors.email}
              autoComplete="username"
            />

            {/* Contraseña */}
            <div className="relative">

              <Input
                label="Contraseña"
                icon={Lock}
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="••••••••"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                error={fieldErrors.password}
                autoComplete="current-password"
              />

              <button
                type="button"
                aria-label={
                  showPassword
                    ? 'Ocultar contraseña'
                    : 'Mostrar contraseña'
                }
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
                className="absolute right-3 sm:right-4 top-10 text-[#1c1712] hover:text-[#b98c52] transition-colors"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            {/* Recuperación */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#b98c52] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón */}
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-4 sm:py-5 text-xs"
            >
              Entrar al Panel

              <ArrowRight
                size={18}
                className="ml-2"
              />
            </Button>

          </form>

          {/* Información */}
          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t-2 border-[#1c1712]/10 text-center">

            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles
                size={14}
                className="text-[#b98c52]"
              />

              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Área exclusiva
              </span>

              <Sparkles
                size={14}
                className="text-[#b98c52]"
              />
            </div>

            <p className="text-[9px] sm:text-[10px] text-zinc-400 leading-relaxed max-w-xs mx-auto">
              El acceso está disponible únicamente
              para administradores de L'ESSENCE DE FRANCE.
            </p>

          </div>

        </motion.section>

        {/* ================================
            SHOWCASE
        ================================= */}
        <motion.section
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.7,
          }}
          className="hidden lg:block lg:col-span-7 relative min-h-[650px] bg-[#1c1712]"
        >

          <AnimatePresence mode="wait">

            <motion.img
              key={currentImage}
              src={perfumeImages[currentImage]}
              initial={{
                opacity: 0,
                scale: 1.05,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 1.2,
              }}
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              alt={`Colección de perfumes ${currentImage + 1}`}
            />

          </AnimatePresence>

          {/* Degradado */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1712] via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Texto sobre imagen */}
          <div className="absolute left-10 bottom-20 z-20 max-w-md">

            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#caa56d] mb-4">
              L'ESSENCE DE FRANCE
            </p>

            <h2 className="text-4xl xl:text-5xl font-black uppercase tracking-tighter text-white leading-none">
              Perfumes que
              <br /> {/* salto */}
              <span className="text-[#caa56d]">
                dejan huella.
              </span>
            </h2>

          </div>

          {/* Indicadores */}
          <div className="absolute bottom-10 right-10 flex gap-3 z-30">

            {perfumeImages.map((_, index) => (
              <div
                key={index}
                className={`
                  h-1.5
                  border
                  border-[#1c1712]
                  transition-all
                  duration-500
                  ${index === currentImage
                    ? 'w-12 bg-[#b98c52]'
                    : 'w-3 bg-white/30'
                  }
                `}
              />
            ))}

          </div>

        </motion.section>

      </div>

    </main>
  );
};

export default LoginPage;