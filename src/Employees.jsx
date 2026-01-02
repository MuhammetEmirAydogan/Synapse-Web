import { useState, useEffect } from 'react';
import api from './api';

function Employees() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee'); 
  const [invites, setInvites] = useState([]);  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true); 

  // 1. Sayfa açıldığında (veya davet atıldığında) listeyi çek
  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {
      // Backend'deki GET fonksiyonuna istek atıyoruz
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
    try {
      // Backend'e hem email hem rol gönderiyoruz
      const res = await api.post('/invitations/invite', { email: email, role: role });
      
      setMessage(` Davet gitti! Token: ${res.data.token}`);
      setEmail('');
      
      // Listeyi hemen güncelle ki tabloya yeni kişi düşsün
      fetchInvites(); 
    } catch (err) {
      setMessage(" Hata: " + (err.response?.data?.detail || "Bir sorun oluştu"));
    }
  };

  return (
    <div className="space-y-6">
      {/* --- FORM KISMI --- */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Yeni Personel Davet Et</h2>
        <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-4">
          <input 
            type="email" 
            placeholder="personel@sirket.com"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* Rol Seçimi Eklendi */}
          <select 
            className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="employee">Çalışan (Employee)</option>
            <option value="company_admin">Yönetici (Admin)</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
            Davet Gönder
          </button>
        </form>
        {message && <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm break-all border border-blue-100">{message}</div>}
      </div>

      {/* --- TABLO KISMI --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Aktif Davetiyeler</h2>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
            Toplam: {invites.length}
          </span>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
        ) : invites.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Henüz gönderilmiş bir davet yok.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">E-posta</th>
                  <th className="px-6 py-3">Rol</th>
                  <th className="px-6 py-3">Durum</th>
                  <th className="px-6 py-3">Token (Gizli)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">{invite.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${invite.role === 'company_admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                        {invite.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {invite.is_used ? (
                        <span className="text-green-600 font-bold text-sm">✅ Kabul Edildi</span>
                      ) : (
                        <span className="text-yellow-600 font-bold text-sm">⏳ Bekliyor</span>
                      )}
                    </td>
                    {/* Token uzun olduğu için sadece başını gösteriyoruz, üzerine gelince tamamı görünür */}
                    <td className="px-6 py-4 text-gray-400 text-xs font-mono truncate max-w-[150px]" title={invite.token}>
                      {invite.is_used ? '******' : invite.token}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Employees;