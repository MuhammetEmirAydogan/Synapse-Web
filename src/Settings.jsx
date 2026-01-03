import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save, Shield, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

function Settings({ user }) {
  // Form verileri (Şimdilik görsel, backend V2'de bağlanacak)
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Simülasyon: Backend bağlandığında burası API'ye gidecek
    if(formData.newPassword && formData.newPassword.length < 6) {
        toast.error("Yeni şifre en az 6 karakter olmalı!");
        return;
    }
    toast.success("Profil bilgileri başarıyla güncellendi!");
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* HERO BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-8 text-white shadow-xl shadow-slate-900/20"
      >
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <User className="text-slate-300" size={32} />
            Hesap Ayarları
          </h2>
          <p className="text-slate-400 mt-2 font-medium max-w-lg">
            Kişisel bilgilerini, güvenlik tercihlerini ve şirket detaylarını buradan yönet.
          </p>
        </div>
        {/* Dekor */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* SOL TARAF: Profil Kartı */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center h-full">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-5xl font-bold text-white shadow-xl mb-4 mt-4">
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{user?.full_name}</h3>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider">
              {user?.role || 'Yetkili'}
            </span>
            
            <div className="mt-8 w-full space-y-4 border-t border-slate-100 dark:border-slate-700 pt-6">
               <div className="flex justify-between text-sm items-center">
                 <span className="text-slate-500 flex items-center gap-2"><Briefcase size={16}/> Şirket ID:</span>
                 <span className="font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">{user?.company_id}</span>
               </div>
               <div className="flex justify-between text-sm items-center">
                 <span className="text-slate-500 flex items-center gap-2"><Shield size={16}/> Durum:</span>
                 <span className="text-green-500 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Aktif
                 </span>
               </div>
            </div>
          </div>
        </div>

        {/* SAĞ TARAF: Düzenleme Formu */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 space-y-8 h-full">
            
            {/* Kişisel Bilgiler */}
            <div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                <User size={20} className="text-blue-500"/> Kişisel Bilgiler
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Ad Soyad</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition" size={18} />
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 dark:text-white transition focus:bg-white dark:focus:bg-slate-800"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-Posta</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-500 cursor-not-allowed font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Güvenlik */}
            <div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                <Lock size={20} className="text-purple-500"/> Güvenlik
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mevcut Şifre</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition" size={18} />
                    <input 
                      type="password" 
                      name="currentPassword"
                      placeholder="••••••"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-700 dark:text-white transition focus:bg-white dark:focus:bg-slate-800"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Yeni Şifre</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition" size={18} />
                    <input 
                      type="password" 
                      name="newPassword"
                      placeholder="Yeni şifreniz"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-700 dark:text-white transition focus:bg-white dark:focus:bg-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Kaydet Butonu */}
            <div className="flex justify-end pt-2">
              <button className="flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-blue-500 transition shadow-lg hover:shadow-blue-500/30 active:scale-95">
                <Save size={18} />
                Değişiklikleri Kaydet
              </button>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Settings;