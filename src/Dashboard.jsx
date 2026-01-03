import { motion } from 'framer-motion';
import { TrendingUp, Users, ShieldCheck, Activity } from 'lucide-react';

function Dashboard({ user }) {
  // Animasyon varyasyonları 
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Karşılama Başlığı  */}
      <motion.div variants={item} className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Hoş geldin, {user?.full_name?.split(' ')[0]}! 👋</h1>
          <p className="text-indigo-100">Synapse AI motoru bugün %99.9 verimlilikle çalışıyor.</p>
        </div>
        {/* Arkaplan Dekorasyonu */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-20 -translate-y-20"></div>
      </motion.div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KART 1: Şirket Kimliği */}
        <motion.div variants={item} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">AKTİF</span>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Şirket Kimliği</h3>
          <p className="text-2xl font-black text-slate-800 dark:text-white font-mono tracking-tight">{user?.company_id || '---'}</p>
        </motion.div>

        {/* KART 2: Mevcut Plan */}
        <motion.div variants={item} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 dark:bg-slate-700 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full">PRO</span>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Mevcut Plan</h3>
          <p className="text-2xl font-black text-slate-800 dark:text-white">Professional</p>
        </motion.div>

        {/* KART 3: AI Kullanımı */}
        <motion.div variants={item} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 dark:bg-slate-700 text-orange-600 dark:text-orange-400 rounded-xl group-hover:scale-110 transition-transform">
              <Activity size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">AI Kullanımı</h3>
          <p className="text-2xl font-black text-slate-800 dark:text-white">432 İstek</p>
        </motion.div>
      </div>

      {/* Alt Bilgi Alanı */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 min-h-[200px] flex items-center justify-center text-slate-400 dark:text-slate-500 border-dashed border-2 dark:border-slate-700 transition-colors">
            Buraya Gelecek Grafikler Hazırlanıyor...
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 min-h-[200px] flex items-center justify-center text-slate-400 dark:text-slate-500 border-dashed border-2 dark:border-slate-700 transition-colors">
            Son Aktiviteler Modülü Yakında...
        </div>
      </motion.div>

    </motion.div>
  );
}

export default Dashboard;