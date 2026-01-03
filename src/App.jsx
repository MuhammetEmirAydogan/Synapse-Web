import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion'; 
import { Toaster } from 'react-hot-toast'; 
import Login from './Login';
import api from './api';
import Employees from './Employees';
import AcceptInvite from './AcceptInvite'; 
import FileCenter from './FileCenter'; 
import Sidebar from './Sidebar'; 
import Dashboard from './Dashboard'; 
import Settings from './Settings'; // <--- 1. AYARLAR IMPORT EDİLDİ

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authView, setAuthView] = useState('login'); 

  // --- DARK MODE AYARLARI ---
  const [darkMode, setDarkMode] = useState(() => {
    if (localStorage.getItem('theme') === 'dark') return true;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // --- AUTH VE USER İŞLEMLERİ ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUser(); 
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get('/users/me');
      setUser(res.data);
    } catch (err) {
      console.error("Kullanıcı bilgisi çekilemedi", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setAuthView('login'); 
  };

  // --- GİRİŞ EKRANLARI ---
  if (!isLoggedIn) {
    return (
      <div className="bg-slate-900 min-h-screen">
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff' } }} />
        
        <AnimatePresence mode="wait">
          {authView === 'login' ? (
            <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
               <Login onLoginSuccess={() => { setIsLoggedIn(true); fetchUser(); }} onSwitchToAccept={() => setAuthView('accept-invite')} />
            </motion.div>
          ) : (
            <motion.div key="accept" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <AcceptInvite onSwitchToLogin={() => setAuthView('login')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --- ANA UYGULAMA ---
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans overflow-hidden transition-colors duration-300">
      
      <Toaster position="top-right" reverseOrder={false} />

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <div className="flex-1 flex flex-col h-full relative">
        <header className="flex justify-between items-center py-5 px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200/50 dark:border-slate-700/50 transition-colors duration-300">
          <div className="text-lg font-bold text-slate-700 dark:text-slate-200 tracking-tight">
             {activeTab === 'dashboard' && 'Genel Bakış'}
             {activeTab === 'employees' && 'Personel Yönetimi'}
             {activeTab === 'files' && 'AI Dosya Merkezi'}
             {activeTab === 'settings' && 'Hesap Ayarları'} {/* <--- 2. BAŞLIK EKLENDİ */}
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{user?.full_name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{user?.company_id}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 dark:shadow-none">
                {user?.full_name?.charAt(0).toUpperCase()}
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 relative scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="max-w-7xl mx-auto"
            >
              {activeTab === 'dashboard' && <Dashboard user={user} />}
              {activeTab === 'employees' && <Employees />}
              {activeTab === 'files' && <FileCenter />}
              {activeTab === 'settings' && <Settings user={user} />} {/* <--- 3. SAYFA EKLENDİ */}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;