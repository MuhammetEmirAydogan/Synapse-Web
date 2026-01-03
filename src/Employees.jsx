import { useState, useEffect } from 'react';
import api from './api';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, Shield, Copy, CheckCircle, Clock, Check, Users, Sparkles } from 'lucide-react';

function Employees() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee'); 
  const [invites, setInvites] = useState([]);  
  const [message, setMessage] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [submitting, setSubmitting] = useState(false); 
  const [copiedToken, setCopiedToken] = useState(null); 

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {
      const res = await api.get('/invitations/'); 
      setInvites(res.data);
    } catch (err) {
      console.error("Liste çekilemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await api.post('/invitations/invite', { email: email, role: role });
      setMessage({ type: 'success', text: `Davet Başarılı! Token üretildi.` });
      setEmail('');
      fetchInvites(); 
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Bir sorun oluştu";
      setMessage({ type: 'error', text: `Hata: ${errorMsg}` });
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (token) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000); 
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* HERO BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-2xl shadow-blue-900/20"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Users className="text-blue-200" size={32} />
              Personel Yönetimi
            </h2>
            <p className="text-blue-100 mt-2 font-medium max-w-lg">
              Ekibini buradan yönet. Yeni davetiyeler gönder, rollerini belirle ve katılım durumlarını canlı takip et.
            </p>
          </div>
          <div className="hidden md:block p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <Sparkles size={32} className="text-yellow-300 animate-pulse" />
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-400 opacity-20 rounded-full blur-2xl"></div>
      </motion.div>

      {/* DAVET KARTI - DARK MODE ENTEGRASYONU */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        // bg-white/80 yerine dark mode için dark:bg-slate-800 eklendi
        className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 dark:border-slate-700 relative overflow-hidden group transition-colors"
      >
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-6 flex items-center gap-2">
            <UserPlus size={20} className="text-blue-500"/>
            Yeni Ekip Arkadaşı Ekle
          </h3>

          <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group/input">
              <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within/input:text-blue-500 transition" size={20} />
              {/* Input: Dark mode'da slate-900 ve text-white */}
              <input 
                type="email" 
                placeholder="E-posta adresi girin..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 outline-none transition font-medium text-slate-700 dark:text-slate-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="w-full md:w-64 relative group/select">
              <Shield className="absolute left-4 top-3.5 text-slate-400 group-focus-within/select:text-purple-500 transition" size={20} />
              <select 
                className="w-full pl-12 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-purple-500/10 dark:focus:ring-purple-500/20 outline-none transition font-medium text-slate-700 dark:text-slate-200 appearance-none cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="employee">Çalışan</option>
                <option value="company_admin">Yönetici</option>
              </select>
              <div className="absolute right-4 top-4 text-slate-400 pointer-events-none">▼</div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-600 dark:hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? '...' : 'Davet Et'} <Sparkles size={16} />
            </button>
          </form>

          <AnimatePresence>
            {message && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }} 
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className={`rounded-xl p-4 font-bold text-sm flex items-center gap-3 ${
                  message.type === 'success' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                }`}
              >
                {message.type === 'success' ? <CheckCircle size={20} /> : <Shield size={20} />}
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* LİSTE KARTLARI - DARK MODE */}
      <div>
        <div className="flex items-center justify-between px-2 mb-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Aktif Personel Listesi</h3>
          <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-black shadow-inner">
            {invites.length} KİŞİ
          </span>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>)}
          </div>
        ) : invites.length === 0 ? (
          <div className="text-center p-12 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 font-medium">
             Henüz kimse yok. Yukarıdan ilk davetini gönder! 🚀
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-4">
            {invites.map((invite) => (
              <motion.div 
                key={invite.id} 
                variants={item}
                
                className="group relative bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  
                  {/* Sol Taraf */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg ${
                      invite.role === 'company_admin' 
                        ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-purple-200 dark:shadow-none' 
                        : 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-blue-200 dark:shadow-none'
                    }`}>
                      {invite.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-lg">{invite.email}</h4>
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
                        {invite.role === 'company_admin' ? 'YÖNETİCİ' : 'PERSONEL'}
                      </span>
                    </div>
                  </div>

                  {/* Orta: Durum */}
                  <div>
                    {invite.is_used ? (
                      <span className="px-4 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-bold text-sm border border-green-100 dark:border-green-800 flex items-center gap-2 shadow-sm">
                        <CheckCircle size={16} /> Aktif
                      </span>
                    ) : (
                      <span className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-bold text-sm border border-amber-100 dark:border-amber-800 flex items-center gap-2 shadow-sm animate-pulse">
                        <Clock size={16} /> Bekliyor
                      </span>
                    )}
                  </div>

                  {/* Sağ: Token */}
                  <div className="w-full md:w-auto flex justify-end">
                     <button 
                      onClick={() => copyToClipboard(invite.token)}
                      className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-mono text-sm hover:bg-slate-800 dark:hover:bg-black hover:text-white transition-all duration-300 active:scale-95 border border-slate-200 dark:border-slate-700 group/btn"
                    >
                      <span className="tracking-widest">
                        {invite.is_used ? '••••••••' : invite.token.substring(0, 8) + '...'}
                      </span>
                      {copiedToken === invite.token ? (
                        <Check size={18} className="text-green-400" />
                      ) : (
                        <Copy size={18} className="group-hover/btn:text-white transition" />
                      )}
                    </button>
                  </div>

                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Employees;