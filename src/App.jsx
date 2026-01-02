import { useState, useEffect } from 'react';
import Login from './Login';
import api from './api';
import Employees from './Employees'; // Yeni oluşturduğumuz bileşeni import ettik

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // Sekme yönetimi için state

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
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => { setIsLoggedIn(true); fetchUser(); }} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* 1. SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-800 text-blue-400">
          Synapse Web 🦁
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left py-2.5 px-4 rounded transition ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('employees')}
            className={`w-full text-left py-2.5 px-4 rounded transition ${activeTab === 'employees' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
          >
            Personel Yönetimi
          </button>
          <button 
            onClick={() => setActiveTab('files')}
            className={`w-full text-left py-2.5 px-4 rounded transition ${activeTab === 'files' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
          >
            Dosya Merkezi
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full bg-red-600 py-2 rounded hover:bg-red-700 transition font-bold">
            Güvenli Çıkış
          </button>
        </div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOPBAR */}
        <header className="flex justify-between items-center py-4 px-8 bg-white shadow-sm border-b border-gray-200">
          <div className="text-xl font-bold text-gray-800 uppercase tracking-wide">
            {activeTab === 'dashboard' ? 'Genel Bakış' : activeTab === 'employees' ? 'Personel Listesi' : 'Dosyalarım'}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{user?.full_name || 'Yükleniyor...'}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full uppercase font-black border border-blue-200">
              {user?.role}
            </span>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          {activeTab === 'dashboard' ? (
            /* DASHBOARD GÖRÜNÜMÜ */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Şirket ID</h3>
                <p className="text-3xl font-bold text-gray-800">{user?.company_id || '-'}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Aktif Plan</h3>
                <p className="text-2xl font-bold text-green-600">Pro Plan</p>
              </div>
            </div>
          ) : activeTab === 'employees' ? (
            /* PERSONEL YÖNETİMİ GÖRÜNÜMÜ */
            <Employees />
          ) : (
            /* DİĞER (FILES) GÖRÜNÜMÜ */
            <div className="bg-white p-20 rounded-xl shadow-sm border border-gray-200 text-center">
               <p className="text-gray-400 text-lg">Dosya Merkezi Modülü Çok Yakında!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;