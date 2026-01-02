import { useState } from 'react';
import api from './api';

function Login({ onLoginSuccess, onSwitchToAccept }) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Backend'e giriş isteği at 
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/token', formData);
      
      // Token'ı tarayıcı hafızasına kaydet
      localStorage.setItem('token', response.data.access_token);
      onLoginSuccess();
    } catch (err) {
      setError('Hatalı email veya şifre!');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      {/* Form yapısını div içine aldık ki alt kısma link ekleyebilelim */}
      <div className="p-10 bg-white rounded-xl shadow-2xl w-96">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Synapse Giriş</h2>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded">{error}</p>}
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Şifre</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition duration-300">
            Giriş Yap
          </button>
        </form>

        {/* 2. Değişiklik: Davet Kodu Linki */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm mb-2">Şirketinden davet mi aldın?</p>
          <button 
            type="button" 
            onClick={onSwitchToAccept}
            className="text-blue-600 font-bold hover:underline text-sm"
          >
            Davet Kodu ile Kayıt Ol →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;