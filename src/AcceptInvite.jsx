import { useState } from 'react';
import api from './api';

function AcceptInvite({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    token: '',
    full_name: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend'deki "Davet Kabul Et" servisine gidiyoruz
      await api.post('/invitations/accept-invite', formData);
      
      setIsSuccess(true);
      setMessage(' Hesap başarıyla oluşturuldu! Şimdi giriş yapabilirsin.');
    } catch (err) {
      setIsSuccess(false);
      setMessage(' Hata: ' + (err.response?.data?.detail || 'İşlem başarısız.'));
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Aramıza Katıl 🚀
        </h2>
        
        {isSuccess ? (
          <div className="text-center">
            <div className="text-green-600 font-bold mb-4">{message}</div>
            <button 
              onClick={onSwitchToLogin}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700"
            >
              Giriş Yap
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-600 text-sm font-bold mb-1">Davet Kodu (Token)</label>
              <input 
                type="text" 
                placeholder="Maildeki uzun kod..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                value={formData.token}
                onChange={(e) => setFormData({...formData, token: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-600 text-sm font-bold mb-1">Ad Soyad</label>
              <input 
                type="text" 
                placeholder="Mehmet Yılmaz"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-bold mb-1">Yeni Şifreniz</label>
              <input 
                type="password" 
                placeholder="******"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            {message && <div className="text-red-500 text-sm font-bold">{message}</div>}

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition">
              Kaydı Tamamla
            </button>
            
            <div className="text-center mt-4">
              <button type="button" onClick={onSwitchToLogin} className="text-sm text-gray-500 hover:text-blue-600 underline">
                Zaten hesabın var mı? Giriş Yap
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AcceptInvite;