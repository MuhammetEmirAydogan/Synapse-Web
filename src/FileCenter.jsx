import { useState, useRef, useEffect } from 'react';
import api from './api';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion'; 
import { UploadCloud, FileText, Send, Loader2, Bot, User, FileType } from 'lucide-react'; 

function FileCenter() {
  // --- STATE'LER ---
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentFileName, setCurrentFileName] = useState(null); 
  const [fileType, setFileType] = useState(null); 
  
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Merhaba! **PDF**, **Word** veya **Metin** dosyası yükle, içeriği hakkında detaylı konuşalım.' }
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false); 

  const chatEndRef = useRef(null);

  // Mesaj gelince veya düşünme bitince kaydır
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  // --- 1. DOSYA YÜKLEME ---
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload', formData);
      setCurrentFileName(res.data.filename);
      setFileType(res.data.type);
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `✅ **${res.data.filename}** başarıyla analiz edildi! \n\n📄 Toplam **${res.data.total_chunks}** parçaya bölündü. \n\nŞimdi dosya hakkında sorular sorabilirsin.` 
      }]);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Dosya yüklenirken bir hata oluştu.';
      setMessages(prev => [...prev, { role: 'ai', content: `❌ **Hata:** ${errorMsg}` }]);
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
      setMessages(prev => [...prev, { role: 'ai', content: '❌ Üzgünüm, cevap veremiyorum. Bağlantıyı kontrol et.' }]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="flex flex-col h-[calc(100vh-140px)] gap-6"
    >
      
      {/* --- ÜST KISIM: UPLOAD --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <UploadCloud size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Dosya Merkezi</h2>
            <p className="text-sm text-gray-500">Analiz için belgeni seç ve yükle.</p>
          </div>
        </div>
        
        <form onSubmit={handleUpload} className="flex items-center gap-3 w-full md:w-auto bg-gray-50 p-2 rounded-xl border border-gray-200">
          <input 
            type="file" 
            accept=".pdf,.docx,.txt"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-white file:text-blue-600 hover:file:bg-blue-50 cursor-pointer transition"
          />
          <button 
            type="submit" 
            disabled={!file || uploading}
            className={`px-6 py-2 rounded-lg font-bold text-white transition flex items-center gap-2 ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'}`}
          >
            {uploading ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
            {uploading ? 'Yükleniyor...' : 'Analiz Et'}
          </button>
        </form>
      </div>

      {/* --- ALT KISIM: CHAT EKRANI --- */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden relative">
        
        {/* Mesaj Alanı */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* AI İkonu */}
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mt-1 shadow-sm shrink-0">
                    <Bot size={18} />
                  </div>
                )}

                {/* Mesaj Baloncuğu */}
                <div 
                  className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {/* MARKDOWN RENDER ALANI */}
                  <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : ''}`}>
                    <ReactMarkdown
                      components={{
                        // Listelerin ve metinlerin düzgün görünmesi için özel ayarlar
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 my-2 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-4 my-2 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="pl-1" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-extrabold" {...props} />,
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        a: ({node, ...props}) => <a className="underline hover:text-blue-200" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Kullanıcı İkonu */}
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mt-1 shadow-sm shrink-0">
                    <User size={18} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Düşünme Animasyonu */}
          {thinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mt-1 shrink-0">
                 <Bot size={18} />
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 text-gray-400 text-sm flex items-center gap-1 shadow-sm">
                <span className="text-xs font-bold mr-2 text-indigo-500">Düşünüyor</span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Alanı */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="flex gap-3">
            <input 
              type="text" 
              placeholder={currentFileName ? "Dosya içeriği hakkında bir soru sor..." : "Sohbet etmek için önce dosya yükleyin..."}
              className="flex-1 px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!currentFileName || thinking}
            />
            <button 
              type="submit" 
              disabled={!currentFileName || thinking || !input.trim()}
              className="bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-200"
            >
              <span>Gönder</span>
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </motion.div>
  );
}

export default FileCenter;