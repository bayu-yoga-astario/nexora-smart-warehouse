import React, { useState, useEffect } from 'react';
import {
  UserCheck, Shield, KeyRound, Bell, History, Smartphone,
  Mail, Phone, Building2, MapPin, Globe, CheckCircle2,
  AlertTriangle, Save, RefreshCw, Eye, EyeOff, Lock,
  ShieldCheck, Clock, Laptop, LogOut, Check, Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AccountSettings = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    role: '',
    department: '',
    location: '',
    timezone: 'Asia/Jakarta (WIB - UTC+7)',
    language: 'id',
    bio: ''
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [show2FAModal, setShow2FAModal] = useState(false);

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    stockAlerts: true,
    poApproval: true,
    grNotification: true,
    doShipment: true,
    systemAudit: false,
    emailDigest: true,
    browserPush: true
  });

  // Load user data on mount / user change
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || 'Administrator NEXORA',
        email: user.email || 'admin@nexora.com',
        phone: user.phone || '+62 812-8899-0011',
        username: user.username || 'admin.nexora',
        role: user.role || 'Super Administrator',
        department: user.department || 'IT Operations & Enterprise Systems',
        location: user.location || 'Headquarters — Jakarta Central DC',
        timezone: user.timezone || 'Asia/Jakarta (WIB - UTC+7)',
        language: user.language || 'id',
        bio: user.bio || 'Lead Enterprise Administrator for NEXORA Warehouse & Supply Chain ERP Platform.'
      });
    }
  }, [user]);

  // Handle password calculation
  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    setPasswordStrength(score);
  };

  const handlePasswordInputChange = (e) => {
    const val = e.target.value;
    setPasswordData({ ...passwordData, newPassword: val });
    calculatePasswordStrength(val);
  };

  const showNotificationMessage = (msg, isError = false) => {
    if (isError) {
      setSaveError(msg);
      setSaveSuccess('');
    } else {
      setSaveSuccess(msg);
      setSaveError('');
    }
    setTimeout(() => {
      setSaveSuccess('');
      setSaveError('');
    }, 4000);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      updateProfile(formData);
      showNotificationMessage('Informasi profil Administrator berhasil diperbarui.');
    } catch (err) {
      showNotificationMessage('Gagal memperbarui profil: ' + err.message, true);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword) {
      showNotificationMessage('Silakan masukkan password saat ini.', true);
      return;
    }
    if (passwordData.newPassword.length < 8) {
      showNotificationMessage('Password baru minimal harus memiliki 8 karakter.', true);
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotificationMessage('Konfirmasi password baru tidak cocok.', true);
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStrength(0);
      showNotificationMessage('Password administrator berhasil diubah secara aman.');
    }, 600);
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      showNotificationMessage('Preferensi notifikasi telah diperbarui.');
      return updated;
    });
  };

  const handleLogoutAccount = async () => {
    await logout();
    navigate('/login');
  };

  const initials = formData.name
    ? formData.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'AD';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">

      {/* ── Top Header & Hero Card ────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1322] to-slate-900 border border-white/[0.08] shadow-2xl p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-cyan-500/20 border-2 border-white/20">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white" title="Akun Aktif">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold text-white tracking-tight">{formData.name}</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {formData.role}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Online
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" /> {formData.email}
                </span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" /> {formData.department}
                </span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> Login Terakhir: Hari ini, 00:10 WIB
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogoutAccount}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all shadow-lg shadow-rose-950/20"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              Keluar dari Akun
            </button>
          </div>
        </div>
      </div>

      {/* ── Status Feedback Alert ─────────────────────────── */}
      {saveSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-medium animate-scale-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}
      {saveError && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-medium animate-scale-in">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* ── Tabs Navigation ──────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-950/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Profil & Biodata
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-950/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Shield className="w-4 h-4" />
          Keamanan & Password
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-950/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Bell className="w-4 h-4" />
          Preferensi Notifikasi
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'sessions'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-950/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <History className="w-4 h-4" />
          Sesi & Log Akses
        </button>
      </div>

      {/* ── TAB 1: Profile & Biodata ───────────────────────── */}
      {activeTab === 'profile' && (
        <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              Informasi Akun Administrator
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Kelola informasi identitas, kontak, dan departemen akun utama administrator sistem NEXORA.
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nama Lengkap Administrator <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Akun Administrator <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Username / ID Admin
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Role Akses (Hak Akses Sistem)
                </label>
                <input
                  type="text"
                  value={formData.role}
                  readOnly
                  className="w-full px-3.5 py-2.5 bg-[#090f1d]/60 border border-white/[0.05] rounded-xl text-sm text-slate-400 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Tingkat akses tertinggi (Full Master Access).</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Departemen / Divisi
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Lokasi / Hub Utama
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Zona Waktu Sistem
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-cyan-500 transition-all"
                >
                  <option value="Asia/Jakarta (WIB - UTC+7)">Asia/Jakarta (WIB - UTC+7)</option>
                  <option value="Asia/Makassar (WITA - UTC+8)">Asia/Makassar (WITA - UTC+8)</option>
                  <option value="Asia/Jayapura (WIT - UTC+9)">Asia/Jayapura (WIT - UTC+9)</option>
                  <option value="UTC">Universal Coordinated Time (UTC)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Catatan Administrator / Deskripsi Tanggung Jawab
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
              />
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Menyimpan Perubahan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan Perubahan Profil
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── TAB 2: Security & Password ────────────────────── */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Change Password Box */}
          <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-cyan-400" />
                Ganti Kata Sandi Administrator
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Gunakan kombinasi minimal 8 karakter dengan huruf kapital, angka, dan simbol untuk keamanan maksimal.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password Saat Ini <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    placeholder="Masukkan password lama"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password Baru <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    required
                    placeholder="Minimal 8 karakter"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {passwordData.newPassword && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            passwordStrength >= level
                              ? passwordStrength === 1
                                ? 'bg-rose-500'
                                : passwordStrength === 2
                                ? 'bg-amber-500'
                                : passwordStrength === 3
                                ? 'bg-cyan-500'
                                : 'bg-emerald-500'
                              : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Kekuatan Sandi:{' '}
                      <span className="font-semibold text-slate-200">
                        {passwordStrength === 1 && 'Lemah'}
                        {passwordStrength === 2 && 'Cukup'}
                        {passwordStrength === 3 && 'Kuat'}
                        {passwordStrength === 4 && 'Sangat Kuat'}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Konfirmasi Password Baru <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    placeholder="Ulangi password baru"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-lg shadow-cyan-600/25 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  Perbarui Password
                </button>
              </div>
            </form>
          </div>

          {/* Two-Factor Authentication Box */}
          <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Autentikasi Dua Faktor (2FA)</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Tambahkan lapisan keamanan ekstra dengan kode OTP dari aplikasi authenticator (Google Authenticator / Authy) setiap kali login.
                </p>
              </div>

              <button
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  showNotificationMessage(
                    !twoFactorEnabled
                      ? 'Autentikasi 2FA telah diaktifkan untuk akun administrator.'
                      : 'Autentikasi 2FA dinonaktifkan.'
                  );
                }}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: Notification Preferences ───────────────── */}
      {activeTab === 'notifications' && (
        <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              Preferensi Pemberitahuan & Peringatan Sistem
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Atur jenis peringatan operasional gudang dan ERP yang ingin Anda terima secara langsung.
            </p>
          </div>

          <div className="divide-y divide-white/[0.06] space-y-4">
            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-sm font-semibold text-slate-200">Peringatan Stok Menipis (Low Stock Alert)</p>
                <p className="text-xs text-slate-400">Terima notifikasi darurat saat stok produk mencapai Reorder Point (ROP).</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.stockAlerts}
                onChange={() => handleNotificationToggle('stockAlerts')}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-700 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-sm font-semibold text-slate-200">Persetujuan Purchase Order (PO Approval)</p>
                <p className="text-xs text-slate-400">Pemberitahuan saat ada Purchase Request baru yang butuh otorisasi pimpinan.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.poApproval}
                onChange={() => handleNotificationToggle('poApproval')}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-700 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-sm font-semibold text-slate-200">Penerimaan Barang Masuk (Goods Receipt)</p>
                <p className="text-xs text-slate-400">Laporan real-time saat inbound shipment berhasil diverifikasi tim gudang.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.grNotification}
                onChange={() => handleNotificationToggle('grNotification')}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-700 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-sm font-semibold text-slate-200">Pengiriman & Surat Jalan (DO & Shipment Dispatch)</p>
                <p className="text-xs text-slate-400">Notifikasi saat armada pengiriman keluar dari gerbang distribusi.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.doShipment}
                onChange={() => handleNotificationToggle('doShipment')}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-700 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-sm font-semibold text-slate-200">Notifikasi Push Browser</p>
                <p className="text-xs text-slate-400">Izinkan desktop alert saat browser sedang berjalan di latar belakang.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.browserPush}
                onChange={() => handleNotificationToggle('browserPush')}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-700 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: Sessions & Audit Logs ──────────────────── */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          {/* Active Sessions */}
          <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Laptop className="w-5 h-5 text-cyan-400" />
                Sesi Perangkat yang Sedang Aktif
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Daftar perangkat yang saat ini memiliki akses login ke akun administrator ini.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-cyan-500/[0.05] border border-cyan-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">Google Chrome di Windows 11</p>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Sesi Ini
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">IP: 127.0.0.1 • Jakarta, Indonesia • Aktif Sekarang</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#090f1d]/80 border border-white/[0.05]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">NEXORA Mobile App di Android 14</p>
                    <p className="text-xs text-slate-400 mt-0.5">IP: 180.252.19.4 • Jakarta • Aktif 2 jam yang lalu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audit History Snapshot */}
          <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-400" />
                  Aktivitas Administrator Terakhir
                </h3>
                <p className="text-xs text-slate-400 mt-1">Rekam jejak tindakan sistem terbaru yang dilakukan akun ini.</p>
              </div>
              <button
                onClick={() => navigate('/administration/audit-logs')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline"
              >
                Lihat Semua Log Audit
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#090f1d] uppercase tracking-wider text-slate-500 border-b border-white/[0.06]">
                  <tr>
                    <th className="px-4 py-3">Waktu</th>
                    <th className="px-4 py-3">Modul</th>
                    <th className="px-4 py-3">Aksi</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  <tr className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-slate-400">14 Agu 2026, 00:10</td>
                    <td className="px-4 py-3 font-semibold text-slate-200">Auth / Session</td>
                    <td className="px-4 py-3">Administrator Login via Dashboard Portal</td>
                    <td className="px-4 py-3">
                      <span className="text-emerald-400 font-medium">SUCCESS</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-slate-400">13 Agu 2026, 23:45</td>
                    <td className="px-4 py-3 font-semibold text-slate-200">Inventory Stock</td>
                    <td className="px-4 py-3">Export Data Laporan Stok ke Excel</td>
                    <td className="px-4 py-3">
                      <span className="text-emerald-400 font-medium">SUCCESS</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-slate-400">13 Agu 2026, 22:15</td>
                    <td className="px-4 py-3 font-semibold text-slate-200">Procurement</td>
                    <td className="px-4 py-3">Approval Purchase Order PO-2026-019</td>
                    <td className="px-4 py-3">
                      <span className="text-emerald-400 font-medium">SUCCESS</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AccountSettings;
