import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import { DarkVeil } from '../../../shared/components/ui/DarkVeil';
import { BrandLogo } from '../../../shared/components/ui/BrandLogo';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Sincronizando identidad con el servidor...');
  const { verifyEmail } = useAuthStore();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('El enlace de seguridad es inválido o ha expirado.');
      return;
    }

    const processVerification = async () => {
      const result = await verifyEmail(token);
      if (result.success) {
        setStatus('success');
        setMessage(result.message || 'Tu identidad ha sido confirmada exitosamente.');
      } else {
        setStatus('error');
        setMessage(result.error || 'No se pudo completar el protocolo de seguridad.');
      }
    };

    processVerification();
  }, [token, verifyEmail]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-outfit bg-[#f7eef0] text-zinc-900">
      <DarkVeil baseColor="#f7eef0" veilColor="#d9a8ae" />

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-md p-8">
        <div className="bg-white/80 backdrop-blur-3xl p-12 rounded-[3rem] border border-[#e3c3c8]/70 shadow-[0_30px_100px_rgba(110,80,45,0.14)] text-center">
            <div className="flex justify-center mb-8">
            <BrandLogo size="md" className="mx-auto" imageClassName="p-0" />
          </div>

          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-[#d9a8ae]/25 border-t-[#b76e79] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-[#b76e79]">
                  <Mail className="w-8 h-8" />
                </div>
              </div>
              <h2 className="text-xl font-black text-zinc-900 uppercase tracking-widest">{message}</h2>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mb-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase mb-4">Acceso Autorizado</h2>
              <p className="text-zinc-600 font-bold mb-10 text-sm uppercase tracking-widest leading-relaxed">{message}</p>
              <Link
                to="/login"
                className="w-full py-5 rounded-2xl bg-linear-to-r from-[#d9a8ae] to-[#b76e79] text-white font-black uppercase tracking-[0.3em] text-[10px] hover:to-[#9c525d] shadow-2xl shadow-[rgba(185,140,82,0.18)] transition-all border border-[#d9a8ae]/30"
              >
                Ingresar al Sistema
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20 mb-8">
                <AlertCircle className="w-12 h-12 text-rose-500" />
              </div>
              <h2 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase mb-4">Falla de Seguridad</h2>
              <p className="text-zinc-600 font-bold mb-10 text-sm uppercase tracking-widest leading-relaxed">{message}</p>
              <Link
                to="/login"
                className="w-full py-5 rounded-2xl bg-[#fdfbfa] text-zinc-900 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#f3e0e2] border border-[#e3c3c8] transition-all"
              >
                Volver al Portal
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
