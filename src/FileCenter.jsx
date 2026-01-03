import { useState, useRef, useEffect } from 'react';
import api from './api';
import ReactMarkdown from 'react-markdown'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { UploadCloud, FileText, Send, Loader2, Bot, User, Sparkles, X, Download } from 'lucide-react'; 
import toast from 'react-hot-toast'; 

function FileCenter() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentFileName, setCurrentFileName] = useState(null); 
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Merhaba! **PDF**, **Word** veya **Metin** dosyası yükle, içeriği hakkında detaylı konuşalım. 🦁' }
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false); 

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  // --- SOHBETİ İNDİRME FONKSİYONU ---
  const handleDownloadChat = () => {
    if (messages.length < 2) {
      toast.error("İndirilecek bir sohbet geçmişi yok.");
      return;
    }

    const chatContent = messages.map(m => `[${m.role === 'ai' ? 'AI' : 'Siz'}] ${m.content}`).join('\n\n-------------------\n\n');
    const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `synapse_chat_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Sohbet geçmişi bilgisayarına indirildi! 📥");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
        toast.error("Lütfen önce bir dosya seçin!");
        return;
    }

    setUploading(true);
    
    // Yükleme sırasında 'Loading...' bildirimi göster
    const uploadPromise = api.post('/upload', { file }, {
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: [function (data, headers) {
             const formData = new FormData();
             formData.append('file', file);
             return formData;
        }]
    });

    toast.promise(uploadPromise, {
        loading: 'Dosya analiz ediliyor...',
        success: (res) => {
            setCurrentFileName(res.data.filename);
            setMessages(prev => [...prev, { 
                role: 'ai', 
                content: `✅ **${res.data.filename}** başarıyla analiz edildi! \n\n📄 Toplam **${res.data.total_chunks}** parçaya bölündü.` 
            }]);
            return `Başarılı: ${res.data.filename}`;
        },
        error: (err) => {
            console.error(err);
            return `Hata: ${err.response?.data?.detail || 'Yükleme başarısız'}`;
        },
    });

    try {
        await uploadPromise;
    } catch (e) {} finally {
        setUploading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!currentFileName) {
      toast("Lütfen sohbete başlamadan önce dosya yükle.", { icon: '⚠️' });
      return;
    }

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setThinking(true);

    try {
      const res = await api.post('/ask', {
        question: userMessage.content,
        file_name: currentFileName,
        model_type: "gemini" 
      });

      setMessages(prev => [...prev, { role: 'ai', content: res.data.answer }]);
    } catch (err) {
      toast.error("Cevap alınamadı. Bağlantıyı kontrol et.");
      setMessages(prev => [...prev, { role: 'ai', content: '❌ Üzgünüm, cevap veremiyorum.' }]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6 pb-2">
      
      {/* HERO BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 p-8 text-white shadow-xl shadow-blue-900/20 shrink-0"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <Bot className="text-blue-100" size={32} />
              AI Dosya Analiz İstasyonu
            </h2>
            <p className="text-blue-50 mt-2 font-medium max-w-lg text-sm">
              Belgelerini yükle, yapay zeka saniyeler içinde okusun. Raporlar, özetler ve detaylı analizler için dilediğini sor.
            </p>
          </div>
          
           <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-lg">
              <label className="cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition group">
                <input 
                  type="file" 
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                      setFile(e.target.files[0]);
                      toast.success(`Seçildi: ${e.target.files[0].name}`);
                  }}
                />
                <div className={`p-2 rounded-lg ${file ? 'bg-green-400 text-green-900' : 'bg-white text-blue-600'} transition shadow-sm`}>
                  {file ? <FileText size={20} /> : <UploadCloud size={20} />}
                </div>
                <div className="flex flex-col">
                   <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Dosya Seç</span>
                   <span className="text-sm font-bold truncate max-w-[150px]">{file ? file.name : 'Henüz Seçilmedi'}</span>
                </div>
              </label>

              <button 
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`h-full px-6 py-3 rounded-lg font-bold text-sm shadow-md transition flex items-center gap-2 ${
                  uploading 
                    ? 'bg-gray-500 cursor-not-allowed text-gray-200' 
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                {uploading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                {uploading ? 'Analiz...' : 'Başlat'}
              </button>
           </div>
        </div>
        
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-teal-300 opacity-20 rounded-full blur-2xl"></div>
      </motion.div>

      {/* CHAT EKRANI */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden relative"
      >
        {/* Üst Bilgi Çubuğu */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
           <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${currentFileName ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {currentFileName ? `Aktif: ${currentFileName}` : 'AI Beklemede...'}
              </span>
           </div>

           {/* Sağ Üst Araçlar (İndir ve Temizle) */}
           <div className="flex items-center gap-4">
              {messages.length > 1 && (
                  <button onClick={handleDownloadChat} className="text-xs text-blue-500 hover:text-blue-600 font-bold flex items-center gap-1 transition" title="Sohbeti İndir">
                    <Download size={14}/> Kaydet
                  </button>
              )}

              {currentFileName && (
                <button onClick={() => {
                    setCurrentFileName(null); 
                    setMessages([]);
                    toast.success("Sohbet temizlendi");
                }} className="text-xs text-red-400 hover:text-red-500 font-bold flex items-center gap-1 transition">
                  <X size={14}/> Temizle
                </button>
              )}
           </div>
        </div>

        {/* Mesaj Alanı */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ai' && (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0 mt-1">
                    <Bot size={20} />
                  </div>
                )}
                <div 
                  className={`max-w-[80%] p-5 rounded-3xl shadow-sm text-sm leading-7 ${
                    msg.role === 'user' 
                      ? 'bg-slate-800 dark:bg-blue-600 text-white rounded-tr-none shadow-md' 
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-600 rounded-tl-none'
                  }`}
                >
                  <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'dark:prose-invert'}`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300 shadow-sm shrink-0 mt-1">
                    <User size={20} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {thinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shrink-0 mt-1">
                 <Bot size={20} />
              </div>
              <div className="bg-white dark:bg-slate-700 p-4 rounded-3xl rounded-tl-none border border-slate-100 dark:border-slate-600 flex items-center gap-1 shadow-sm">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Alanı */}
        <div className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border-t border-slate-100 dark:border-slate-700">
          <form onSubmit={handleSend} className="relative group">
            <input 
              type="text" 
              placeholder={currentFileName ? "Bu dosya hakkında ne öğrenmek istersin?" : "Sohbete başlamak için önce dosya yükle..."}
              className="w-full pl-6 pr-32 py-4 bg-slate-100 dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-500 rounded-2xl outline-none transition-all text-slate-700 dark:text-white placeholder:text-slate-400 shadow-inner"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!currentFileName || thinking}
            />
            <button 
              type="submit" 
              disabled={!currentFileName || thinking || !input.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:bg-slate-400 flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <span>Yolla</span>
              <Send size={18} />
            </button>
          </form>
        </div>

      </motion.div>
    </div>
  );
}

export default FileCenter;