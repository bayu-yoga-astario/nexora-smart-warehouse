import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, LogIn, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/authService';

const Login = () => {
  const [email, setEmail] = useState('admin@nexora.com');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError('Login gagal. Silakan periksa kembali email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (userEmail) => {
    setEmail(userEmail);
    setPassword('password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a] p-4 font-sans selection:bg-indigo-500/30">
      <div className="w-full max-w-[850px] bg-white dark:bg-[#1e293b] rounded-3xl shadow-2xl flex overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
        
        {/* Left Side: Branding / Image */}
        <div className="hidden lg:flex lg:w-5/12 bg-indigo-600 relative overflow-hidden flex-col justify-between p-8 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 opacity-95 z-0"></div>
          {/* Warehouse Background Image */}
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
            alt="Warehouse" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 z-0 scale-105"
          />
          
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-lg shadow-black/10">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-[0.2em] uppercase text-white/90">Nexora</span>
          </div>

          <div className="relative z-10 my-8">
            <div className="inline-block px-2.5 py-1 mb-4 rounded-full bg-indigo-500/30 backdrop-blur-sm border border-indigo-300/30 text-[10px] font-semibold tracking-wider text-indigo-100">
              SYSTEM V2.0
            </div>
            <h2 className="text-2xl font-light mb-3 leading-[1.3]">
              Enterprise <br />
              <span className="font-bold text-white">Warehouse & Inventory</span>
            </h2>
            <p className="text-indigo-100/70 text-xs max-w-[250px] leading-relaxed font-medium">
              Streamline your supply chain operations with our comprehensive, elegant, and powerful management system.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-[10px] font-semibold text-indigo-200/60 tracking-wide">
            <span>© 2026 NEXORA ERP</span>
            <span className="w-1 h-1 rounded-full bg-indigo-400/40"></span>
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-7/12 p-8 lg:p-10 flex flex-col justify-center bg-white dark:bg-[#1e293b]">
          <div className="max-w-[340px] w-full mx-auto">
            
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-[0.2em] text-slate-900 dark:text-white uppercase">Nexora</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight">Selamat Datang</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 font-medium">
              Silakan masukkan kredensial Anda untuk mengakses sistem.
            </p>

            {error && (
              <div className="mb-5 p-3 bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 rounded-r-lg text-xs text-red-600 dark:text-red-400 flex items-center gap-2 animate-pulse">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@nexora.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#0f172a]/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <a href="#" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                    Lupa password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#0f172a]/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400 font-medium pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer w-4 h-4 rounded-[4px] border-2 border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 dark:bg-[#0f172a] dark:checked:bg-indigo-500 cursor-pointer appearance-none checked:bg-indigo-600 checked:border-indigo-600 transition-all"
                  />
                  <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <label htmlFor="remember" className="text-[13px] font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                  Ingat sesi login saya
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-sm font-bold tracking-wide transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/40 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-3"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Masuk ke Sistem</span>
                    <LogIn className="w-3.5 h-3.5 ml-1 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/60">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-3 font-bold uppercase tracking-widest text-center">
                Akses Demo Cepat
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@nexora.com')}
                  className="flex-1 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#283548] hover:border-indigo-300 dark:hover:border-indigo-500/50 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-all shadow-sm"
                >
                  Admin Role
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('ahmad.s@nexora.com')}
                  className="flex-1 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#283548] hover:border-indigo-300 dark:hover:border-indigo-500/50 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-all shadow-sm"
                >
                  Manager Role
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
