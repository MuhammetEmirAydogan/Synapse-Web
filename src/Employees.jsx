import { useState, useEffect } from 'react';
import api from './api';

function Employees() {
  const [email, setEmail] = useState('');
  const [invites, setInvites] = useState([]);
  const [message, setMessage] = useState('');

  // Sayfa açıldığında daha önce atılmış davetleri getir (Backend'de bu API hazır!)
  // Not: Şimdilik sadece davet göndermeye odaklanalım.

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/invite', { email: email, role: 'employee' });
      setMessage(`Davet başarıyla gönderildi! Token: ${res.data.token}`);
      setEmail('');
    } catch (err) {
      setMessage("Hata: " + err.response?.data?.detail);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Yeni Personel Davet Et</h2>
        <form onSubmit={handleInvite} className="flex space-x-4">
          <input 
            type="email" 
            placeholder="personel@sirket.com"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
            Davet Gönder
          </button>
        </form>
        {message && <p className="mt-4 text-sm font-medium text-blue-600 bg-blue-50 p-3 rounded-lg">{message}</p>}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Aktif Davetiyeler</h2>
        </div>
        <div className="p-6 text-gray-500 text-center">
          Henüz listeleyecek bir veri yok. İlk daveti yukarıdan atabilirsin!
        </div>
      </div>
    </div>
  );
}

export default Employees;