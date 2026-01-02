import { useState, useRef, useEffect } from 'react';
import api from './api';

function FileCenter() {
  // --- STATE'LER ---
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentFileName, setCurrentFileName] = useState(null); 
  
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Merhaba! Bana bir PDF dosyası yükle, içeriği hakkında konuşalım.' }
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false); 

  // Otomatik scroll için referans
  const chatEndRef = useRef(null);

  // Mesaj gelince en alta kaydır
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- 1. DOSYA YÜKLEME ---
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload', formData);
      setCurrentFileName(res.data.filename); // Backend'den dönen dosya ismini sakla
      setMessages(prev => [...prev, { role: 'ai', content: `✅ "${res.data.filename}" başarıyla analiz edildi! Şimdi sorularını sorabilirsin.` }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: '❌ Dosya yüklenirken bir hata oluştu.' }]);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // --- 2. SORU SORMA ---
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!currentFileName) {
      alert("Lütfen önce bir dosya yükle!");
      return;
    }

    // Kullanıcı mesajını ekle
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setThinking(true);

    try {
      // Backend'e sor
      const res = await api.post('/ask', {
        question: userMessage.content,
        file_name: currentFileName,
        model_type: "gemini" 
      });

      // AI cevabını ekle
      setMessages(prev => [...prev, { role: 'ai', content: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: ' Üzgünüm, cevap veremiyorum. Bağlantıyı kontrol et.' }]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
      
      {/* --- ÜST KISIM: UPLOAD --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            📂 Dosya Yükle
          </h2>
          <p className="text-sm text-gray-500">Analiz etmek istediğin PDF'i seç.</p>
        </div>
        
        <form onSubmit={handleUpload} className="flex items-center gap-4 w-full md:w-auto">
          <input 
            type="file" 
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button 
            type="submit" 
            disabled={!file || uploading}
            className={`px-6 py-2 rounded-lg font-bold text-white transition ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {uploading ? 'Yükleniyor...' : 'Analiz Et'}
          </button>
        </form>
      </div>

      {/* --- ALT KISIM: CHAT EKRANI --- */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Mesaj Alanı */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}
              >
                {msg.role === 'ai' && <span className="block text-xs font-bold mb-1 opacity-50">Synapse AI 🦁</span>}
                {msg.content}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 text-gray-500 text-sm animate-pulse">
                Yazıyor... 🖊️
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Alanı */}
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSend} className="flex gap-4">
            <input 
              type="text" 
              placeholder={currentFileName ? "Dosya hakkında bir soru sor..." : "Önce yukarıdan dosya yükleyin..."}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!currentFileName || thinking}
            />
            <button 
              type="submit" 
              disabled={!currentFileName || thinking || !input.trim()}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Gönder 🚀
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default FileCenter;