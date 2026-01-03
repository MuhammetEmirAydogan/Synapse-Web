import { LayoutDashboard, Users, FolderOpen, LogOut, ChevronRight, Moon, Sun, Settings } from 'lucide-react'; // Settings ikonu eklendi
import { motion } from 'framer-motion';

function Sidebar({ activeTab, setActiveTab, onLogout, darkMode, toggleDarkMode }) {
  const menuItems = [
    { id: 'dashboard', label: 'Genel Bakış', icon: LayoutDashboard },
    { id: 'employees', label: 'Personel', icon: Users },
    { id: 'files', label: 'Dosya Merkezi', icon: FolderOpen },
    { id: 'settings', label: 'Ayarlar', icon: Settings }, 
  ];

  return (
    <div className="w-72 bg-slate-900 dark:bg-slate-950 text-white flex flex-col relative overflow-hidden shadow-2xl z-20 border-r border-slate-800 transition-colors duration-300">
      
      {/* Arka plan efekti */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-800 to-slate-900 opacity-50 z-0 pointer-events-none" />

      {/* Logo Alanı */}
      <div className="p-8 z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 text-2xl font-black tracking-tighter text-blue-400"
        >
          <span className="text-3xl">🦁</span>
          SYNAPSE
        </motion.div>
        <p className="text-slate-500 text-xs font-medium mt-2 tracking-widest uppercase">Kurumsal AI Paneli</p>
      </div>

      {/* Menü Linkleri */}
      <nav className="flex-1 px-4 space-y-3 z-10">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`group relative flex items-center w-full p-4 rounded-xl transition-all duration-300 overflow-hidden ${
              activeTab === item.id 
                ? 'text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {/* Aktif Sekme Arka Planı */}
            {activeTab === item.id && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}

            {/* İçerik */}
            <div className="relative flex items-center justify-between w-full z-10">
              <div className="flex items-center gap-3 font-medium">
                <item.icon size={20} strokeWidth={2} />
                <span>{item.label}</span>
              </div>
              {activeTab === item.id && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </div>
          </button>
        ))}
      </nav>

      {/* ALT KONTROL ALANI  */}
      <div className="p-4 z-10 space-y-2 border-t border-slate-800/50">
        
        {/* Dark Mode Toggle Butonu */}
        <button 
          onClick={toggleDarkMode}
          className="flex items-center justify-between w-full p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all group"
        >
          <span className="text-sm font-medium flex items-center gap-2">
            {darkMode ? <Moon size={18} className="text-purple-400"/> : <Sun size={18} className="text-yellow-400"/>}
            {darkMode ? 'Gece Modu' : 'Gündüz Modu'}
          </span>
          
          {/* Switch Görseli */}
          <div className={`w-10 h-5 rounded-full relative transition-colors ${darkMode ? 'bg-purple-600' : 'bg-slate-600'}`}>
            <motion.div 
              className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full"
              animate={{ x: darkMode ? 20 : 0 }}
            />
          </div>
        </button>

        {/* Güvenli Çıkış */}
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full p-4 rounded-xl transition-all font-medium"
        >
          <LogOut size={20} />
          <span>Güvenli Çıkış</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;