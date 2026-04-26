import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Trash2, Trophy, Download, UserPlus, History, X, TrendingUp, TrendingDown, CreditCard, LogOut, Copy, Eye, EyeOff, Users, Send, Palette, Check, ArrowRightLeft, Sparkles, Lock, ShoppingCart, Building2, Clock, CheckCircle, XCircle, Upload, Image as ImageIcon, KeyRound, RotateCcw, Globe } from 'lucide-react';
import { saveBankData, subscribeToData } from './firebase';

const TEACHER_PASSWORD = 'urbina2026';
const CENTRAL_BANK_ID = 'CENTRAL_BANK';
const CURRENCY_NAME = 'IGOs';

// Themes for student interface
const STUDENT_THEMES = {
  black_gold: { name: 'Black & Gold', primary: '#000000', secondary: '#d4af37', accent: '#f5e7b8', bgGradient: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)' },
  midnight: { name: 'Midnight Blue', primary: '#0a1628', secondary: '#d4af37', accent: '#f5e7b8', bgGradient: 'linear-gradient(135deg, #0a1628 0%, #1e2a4a 50%, #0a1628 100%)' },
};

// Use system fonts that are elegant and always available
// These are pre-installed on Mac, Windows, iOS, and Android — no internet needed
const FONT_DISPLAY = "'Didot', 'Bodoni 72', 'Bodoni MT', 'Playfair Display', Georgia, 'Times New Roman', serif";
const FONT_BODY = "'Helvetica Neue', 'Helvetica', 'Arial', system-ui, sans-serif";
const FONT_MONO = "'SF Mono', 'Monaco', 'Consolas', 'Courier New', monospace";

// Card designs (24 total)
const CARD_DESIGNS = [
  { id: 'emerald', name: 'Emerald', tier: 'basic', gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 35%, #047857 65%, #0d9488 100%)', accent: '#fcd34d', textColor: '#ffffff' },
  { id: 'midnight', name: 'Midnight', tier: 'basic', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', accent: '#facc15', textColor: '#ffffff' },
  { id: 'crimson', name: 'Crimson', tier: 'basic', gradient: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 35%, #b91c1c 65%, #dc2626 100%)', accent: '#fde047', textColor: '#ffffff' },
  { id: 'royal', name: 'Royal', tier: 'basic', gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #3730a3 65%, #4338ca 100%)', accent: '#fbbf24', textColor: '#ffffff' },
  { id: 'sunset', name: 'Sunset', tier: 'basic', gradient: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 35%, #c2410c 65%, #ea580c 100%)', accent: '#fef3c7', textColor: '#ffffff' },
  { id: 'rose', name: 'Rose', tier: 'basic', gradient: 'linear-gradient(135deg, #831843 0%, #9d174d 35%, #be185d 65%, #db2777 100%)', accent: '#fef3c7', textColor: '#ffffff' },
  { id: 'ocean', name: 'Ocean', tier: 'basic', gradient: 'linear-gradient(135deg, #0c4a6e 0%, #075985 35%, #0369a1 65%, #0284c7 100%)', accent: '#fde68a', textColor: '#ffffff' },
  { id: 'forest', name: 'Forest', tier: 'basic', gradient: 'linear-gradient(135deg, #14532d 0%, #166534 35%, #15803d 65%, #16a34a 100%)', accent: '#fef9c3', textColor: '#ffffff' },
  { id: 'gold', name: 'Gold', tier: 'premium', minBalance: 25000, gradient: 'linear-gradient(135deg, #422006 0%, #713f12 25%, #a16207 50%, #ca8a04 75%, #fbbf24 100%)', accent: '#fffbeb', textColor: '#ffffff' },
  { id: 'platinum', name: 'Platinum', tier: 'premium', minBalance: 25000, gradient: 'linear-gradient(135deg, #18181b 0%, #27272a 25%, #52525b 50%, #a1a1aa 75%, #d4d4d8 100%)', accent: '#fafafa', textColor: '#ffffff' },
  { id: 'rosegold', name: 'Rose Gold', tier: 'premium', minBalance: 25000, gradient: 'linear-gradient(135deg, #4c0519 0%, #881337 30%, #be123c 55%, #f43f5e 80%, #fda4af 100%)', accent: '#fff1f2', textColor: '#ffffff' },
  { id: 'obsidian', name: 'Obsidian', tier: 'premium', minBalance: 25000, gradient: 'linear-gradient(135deg, #000000 0%, #18181b 50%, #3f3f46 100%)', accent: '#fbbf24', textColor: '#ffffff' },
  { id: 'sapphire', name: 'Sapphire', tier: 'premium', minBalance: 25000, gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #1e40af 50%, #2563eb 75%, #60a5fa 100%)', accent: '#dbeafe', textColor: '#ffffff' },
  { id: 'holographic', name: 'Holographic', tier: 'elite', minBalance: 75000, gradient: 'linear-gradient(135deg, #f0abfc 0%, #c084fc 16%, #818cf8 33%, #60a5fa 50%, #34d399 66%, #fbbf24 83%, #fb7185 100%)', accent: '#ffffff', textColor: '#1e1b4b' },
  { id: 'galaxy', name: 'Galaxy', tier: 'elite', minBalance: 75000, gradient: 'radial-gradient(ellipse at top left, #4c1d95 0%, #1e1b4b 30%, #000000 70%)', accent: '#fbbf24', textColor: '#ffffff', stars: true },
  { id: 'aurora', name: 'Aurora', tier: 'elite', minBalance: 75000, gradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 20%, #047857 40%, #0d9488 60%, #06b6d4 80%, #a78bfa 100%)', accent: '#fef9c3', textColor: '#ffffff' },
  { id: 'volcano', name: 'Volcano', tier: 'elite', minBalance: 75000, gradient: 'linear-gradient(135deg, #000000 0%, #450a0a 25%, #7f1d1d 50%, #dc2626 75%, #fbbf24 100%)', accent: '#fffbeb', textColor: '#ffffff' },
  { id: 'jade', name: 'Imperial Jade', tier: 'elite', minBalance: 75000, gradient: 'linear-gradient(135deg, #052e16 0%, #14532d 25%, #166534 50%, #16a34a 75%, #86efac 100%)', accent: '#fef3c7', textColor: '#ffffff' },
  { id: 'diamond', name: 'Diamond', tier: 'legendary', minBalance: 130000, gradient: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 20%, #a5b4fc 40%, #818cf8 60%, #6366f1 80%, #4f46e5 100%)', accent: '#1e1b4b', textColor: '#1e1b4b' },
  { id: 'rainbow', name: 'Rainbow', tier: 'legendary', minBalance: 130000, gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 16%, #fbbf24 33%, #22c55e 50%, #06b6d4 66%, #6366f1 83%, #d946ef 100%)', accent: '#ffffff', textColor: '#ffffff' },
  { id: 'cosmic', name: 'Cosmic', tier: 'legendary', minBalance: 130000, gradient: 'linear-gradient(135deg, #1e1b4b 0%, #000000 100%)', accent: '#fbbf24', textColor: '#ffffff', stars: true },
  { id: 'phoenix', name: 'Phoenix', tier: 'legendary', minBalance: 130000, gradient: 'linear-gradient(135deg, #450a0a 0%, #991b1b 20%, #ea580c 40%, #f59e0b 60%, #fbbf24 80%, #fef3c7 100%)', accent: '#ffffff', textColor: '#ffffff' },
  { id: 'mythic', name: 'Mythic', tier: 'mythic', minBalance: 180000, gradient: 'conic-gradient(from 0deg, #fbbf24, #ec4899, #8b5cf6, #06b6d4, #10b981, #fbbf24)', accent: '#ffffff', textColor: '#ffffff', stars: true },
];

// Bonus shop
const BONUS_SHOP = [
  { id: 'country', name: 'Choose a Country for the Simulation', value: null, icon: '🌍' },
  { id: 'paper', name: 'Position Paper Presentation', value: 0.5, icon: '📄' },
  { id: 'exam', name: 'Exam', value: 0.5, icon: '📝' },
  { id: 'igo', name: 'IGO Characterization', value: 0.5, icon: '🏛️' },
  { id: 'negotiation', name: 'Strategic Negotiation Proposal', value: 0.25, icon: '🤝' },
];

const TIER_LABELS = {
  basic: { label: 'Basic', icon: '○' },
  premium: { label: 'Premium', icon: '◆' },
  elite: { label: 'Elite', icon: '★' },
  legendary: { label: 'Legendary', icon: '✦' },
  mythic: { label: 'Mythic', icon: '♛' },
};

const generateCardNumber = () => Array.from({length: 4}, () => Math.floor(1000 + Math.random() * 9000)).join(' ');
const generateAccessCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length: 6}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};
const generateCVV = () => Math.floor(100 + Math.random() * 900).toString();
const formatMoney = (n) => `${n.toLocaleString('en-US')} IGOs`;

// Robust copy to clipboard with fallback for older browsers
const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for non-secure contexts and older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
};

const hasUnlocked = (student, design, transactions) => {
  if (design.tier === 'basic') return true;
  const totalEarned = transactions.filter(t => t.studentId === student.id && t.amount > 0).reduce((s, t) => s + t.amount, 0);
  return totalEarned >= (design.minBalance || 0);
};

// Compress image to reduce size aggressively (must fit in <500KB for storage)
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxWidth = 600;
          const maxHeight = 400;
          let width = img.width;
          let height = img.height;
          
          // Scale down to fit within max dimensions
          const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          
          // Try progressively lower quality until size is acceptable
          let quality = 0.7;
          let result = canvas.toDataURL('image/jpeg', quality);
          while (result.length > 400000 && quality > 0.2) {
            quality -= 0.1;
            result = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Could not load image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
};

export default function App() {
  const [view, setView] = useState('home');
  const [data, setData] = useState({ students: [], transactions: [], bonusRequests: [], centralBank: { balance: 0, name: 'P4 Central Bank' } });
  const [loading, setLoading] = useState(true);
  const [studentCode, setStudentCode] = useState('');
  const [studentPin, setStudentPin] = useState('');
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [teacherPass, setTeacherPass] = useState('');
  const [teacherAuth, setTeacherAuth] = useState(false);
  const [teacherError, setTeacherError] = useState('');

  useEffect(() => {
    // Subscribe to Firebase real-time updates
    const unsubscribe = subscribeToData((newData) => {
      setData(newData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentStudent) {
      const u = data.students.find(s => s.id === currentStudent.id);
      if (u) setCurrentStudent(u);
    }
  }, [data.students]);

  const saveData = async (newData) => {
    setData(newData);
    try {
      await saveBankData(newData);
      return true;
    } catch (e) {
      console.error('Save error:', e);
      alert('Error saving. Check your internet connection.');
      return false;
    }
  };

  const handleStudentLogin = () => {
    const code = studentCode.trim().toUpperCase();
    const student = data.students.find(s => s.accessCode === code);
    if (!student) { setLoginError('Invalid access code.'); return; }
    
    // First time login - set PIN
    if (!student.pin) {
      if (studentPin.length !== 4 || !/^\d{4}$/.test(studentPin)) {
        setLoginError('Create a 4-digit PIN for first login.');
        return;
      }
      const updated = { ...data, students: data.students.map(s => s.id === student.id ? { ...s, pin: studentPin } : s) };
      saveData(updated);
      const updatedStudent = { ...student, pin: studentPin };
      setCurrentStudent(updatedStudent);
      setView('student');
      setLoginError('');
      setStudentCode(''); setStudentPin('');
      return;
    }
    
    if (student.pin !== studentPin) { setLoginError('Incorrect PIN.'); return; }
    setCurrentStudent(student);
    setView('student');
    setLoginError('');
    setStudentCode(''); setStudentPin('');
  };

  const handleTeacherLogin = () => {
    if (teacherPass === TEACHER_PASSWORD) {
      setTeacherAuth(true); setTeacherError('');
      setView('teacher'); setTeacherPass('');
    } else setTeacherError('Incorrect password.');
  };

  // Auto-redirect to login if not authenticated when trying to access teacher view
  useEffect(() => {
    if (view === 'teacher' && !teacherAuth) setView('teacher-login');
  }, [view, teacherAuth]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-amber-400 text-xl" style={{fontFamily: FONT_BODY}}>Loading...</div></div>;

  if (view === 'home') return <HomeView setView={setView} />;
  if (view === 'teacher-login') return <TeacherLoginView teacherPass={teacherPass} setTeacherPass={setTeacherPass} handleLogin={handleTeacherLogin} error={teacherError} setView={setView} />;
  if (view === 'teacher' && teacherAuth) return <TeacherView data={data} saveData={saveData} setView={setView} onLogout={() => { setTeacherAuth(false); setView('home'); }} />;
  if (view === 'student-login') return <StudentLoginView studentCode={studentCode} setStudentCode={setStudentCode} studentPin={studentPin} setStudentPin={setStudentPin} handleLogin={handleStudentLogin} loginError={loginError} setView={setView} students={data.students} />;
  if (view === 'student' && currentStudent) return <StudentView student={currentStudent} data={data} saveData={saveData} onLogout={() => { setCurrentStudent(null); setView('home'); }} />;
  
  return <HomeView setView={setView} />;
}

// ============= HOME =============
function HomeView({ setView }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{fontFamily: FONT_BODY, background: 'radial-gradient(ellipse at center, #1c1917 0%, #000000 100%)'}}>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full" style={{background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)'}}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full" style={{background: 'radial-gradient(circle, #7f1d1d 0%, transparent 70%)'}}></div>
      </div>
      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-12">
          <Globe className="mx-auto text-amber-400 mb-4" size={48} />
          <div className="text-amber-500 text-xs tracking-[0.5em] mb-3">EST. 2022</div>
          <h1 className="text-5xl md:text-7xl font-bold mb-3" style={{fontFamily: FONT_DISPLAY, background: 'linear-gradient(135deg, #d4af37 0%, #f5e7b8 50%, #d4af37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.02em'}}>P4 Central Bank</h1>
          <div className="h-px w-32 mx-auto mb-4" style={{background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)'}}></div>
          <p className="text-amber-200/80 italic text-sm tracking-widest">ISSUED BY PROFESSOR TOMÁS URBINA</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <button onClick={() => setView('teacher-login')} className="relative bg-gradient-to-br from-stone-900 to-black border-2 border-amber-600 p-8 transition-all hover:scale-105 hover:border-amber-400 group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition" style={{background: 'radial-gradient(circle, #fbbf24, transparent)'}}></div>
            <Building2 size={40} className="mx-auto text-amber-400 mb-3 relative z-10" />
            <div className="text-xs tracking-[0.3em] text-amber-500 mb-1 relative z-10">ADMIN ACCESS</div>
            <div className="text-2xl font-bold text-amber-100 relative z-10">PROFESSOR</div>
            <div className="text-xs text-stone-400 mt-2 relative z-10">Manage accounts</div>
          </button>
          <button onClick={() => setView('student-login')} className="relative bg-gradient-to-br from-red-950 to-black border-2 border-amber-600 p-8 transition-all hover:scale-105 hover:border-amber-400 group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition" style={{background: 'radial-gradient(circle, #fbbf24, transparent)'}}></div>
            <CreditCard size={40} className="mx-auto text-amber-400 mb-3 relative z-10" />
            <div className="text-xs tracking-[0.3em] text-amber-500 mb-1 relative z-10">CLIENT ACCESS</div>
            <div className="text-2xl font-bold text-amber-100 relative z-10">STUDENT</div>
            <div className="text-xs text-stone-400 mt-2 relative z-10">View your card</div>
          </button>
        </div>
        <div className="mt-8 bg-stone-900/50 border border-amber-700/30 text-amber-200/60 p-3 text-xs text-center italic">
          Welcome. Choose your access type to enter.
        </div>
      </div>
    </div>
  );
}

// ============= TEACHER LOGIN =============
function TeacherLoginView({ teacherPass, setTeacherPass, handleLogin, error, setView }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{fontFamily: FONT_BODY, background: 'radial-gradient(ellipse at center, #1c1917 0%, #000000 100%)'}}>
      <div className="max-w-md w-full">
        <button onClick={() => setView('home')} className="text-amber-400 mb-6 text-sm">← Back</button>
        <div className="bg-gradient-to-br from-stone-900 to-black border-2 border-amber-600 p-8">
          <Lock size={48} className="mx-auto text-amber-400 mb-4" />
          <h2 className="text-2xl font-bold text-amber-100 text-center mb-2" style={{fontFamily: FONT_DISPLAY, letterSpacing: '0.02em'}}>Professor Access</h2>
          <p className="text-stone-400 text-sm text-center mb-6">Enter your password</p>
          <input type="password" value={teacherPass} onChange={(e) => setTeacherPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} placeholder="Password" className="w-full px-4 py-3 border-2 border-amber-700 bg-black text-amber-100 outline-none focus:border-amber-400" />
          {error && <div className="text-red-400 text-sm mt-3 text-center">{error}</div>}
          <button onClick={handleLogin} className="w-full mt-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black py-3 font-bold tracking-widest">SIGN IN</button>
        </div>
      </div>
    </div>
  );
}

// ============= STUDENT LOGIN =============
function StudentLoginView({ studentCode, setStudentCode, studentPin, setStudentPin, handleLogin, loginError, setView, students }) {
  const codeExists = students.find(s => s.accessCode === studentCode.trim().toUpperCase());
  const isFirstTime = codeExists && !codeExists.pin;
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{fontFamily: FONT_BODY, background: 'radial-gradient(ellipse at center, #1c1917 0%, #000000 100%)'}}>
      <div className="max-w-md w-full">
        <button onClick={() => setView('home')} className="text-amber-400 mb-6 text-sm">← Back</button>
        <div className="bg-gradient-to-br from-red-950 to-black border-2 border-amber-600 p-8">
          <CreditCard size={48} className="mx-auto text-amber-400 mb-4" />
          <h2 className="text-2xl font-bold text-amber-100 text-center mb-2" style={{fontFamily: FONT_DISPLAY, letterSpacing: '0.02em'}}>Student Access</h2>
          <p className="text-stone-400 text-sm text-center mb-6">Enter your code and PIN</p>
          
          <label className="block text-xs tracking-widest text-amber-500 mb-1 font-bold">ACCESS CODE</label>
          <input type="text" value={studentCode} onChange={(e) => setStudentCode(e.target.value.toUpperCase())} placeholder="EX: A3K9P2" maxLength={6} className="w-full px-4 py-3 border-2 border-amber-700 bg-black text-amber-100 text-center text-xl font-mono tracking-[0.4em] outline-none mb-3 focus:border-amber-400" />
          
          <label className="block text-xs tracking-widest text-amber-500 mb-1 font-bold">
            {isFirstTime ? 'CREATE 4-DIGIT PIN (FIRST LOGIN)' : '4-DIGIT PIN'}
          </label>
          <input type="password" value={studentPin} onChange={(e) => setStudentPin(e.target.value.replace(/\D/g, '').slice(0,4))} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} placeholder="••••" maxLength={4} className="w-full px-4 py-3 border-2 border-amber-700 bg-black text-amber-100 text-center text-2xl font-mono tracking-[0.6em] outline-none focus:border-amber-400" />
          
          {isFirstTime && <div className="text-amber-300 text-xs mt-2 text-center italic">Welcome! Choose a PIN you'll remember.</div>}
          {loginError && <div className="text-red-400 text-sm mt-3 text-center">{loginError}</div>}
          <button onClick={handleLogin} className="w-full mt-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black py-3 font-bold tracking-widest">SIGN IN</button>
          <p className="text-stone-500 text-xs italic text-center mt-4">Forgot your PIN? Ask your professor to reset it.</p>
        </div>
      </div>
    </div>
  );
}

// ============= CREDIT CARD VISUAL =============
function CreditCardVisual({ student, showCard }) {
  const useCustomImage = student.customImage;
  const design = CARD_DESIGNS.find(d => d.id === (student.cardDesign || 'emerald')) || CARD_DESIGNS[0];
  const displayName = student.displayName || student.name;
  const tier = TIER_LABELS[design.tier];

  const bgStyle = useCustomImage 
    ? { backgroundImage: `url(${student.customImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: design.gradient };
  
  const textColor = useCustomImage ? '#ffffff' : design.textColor;
  const accent = useCustomImage ? '#fbbf24' : design.accent;

  return (
    <div className="relative aspect-[1.586/1] rounded-2xl shadow-2xl overflow-hidden p-6" style={{ ...bgStyle, color: textColor }}>
      {useCustomImage && <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/70 pointer-events-none"></div>}
      
      {!useCustomImage && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: accent }}></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-1/2 -translate-x-1/2" style={{ background: accent }}></div>
        </div>
      )}
      
      {!useCustomImage && design.stars && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white animate-pulse" style={{
              width: Math.random() * 3 + 1 + 'px', height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%', left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's', opacity: Math.random() * 0.8 + 0.2
            }}></div>
          ))}
        </div>
      )}
      
      {!useCustomImage && design.tier !== 'basic' && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-bold tracking-widest" style={{ color: accent }}>
            {tier.icon} {tier.label.toUpperCase()}
          </div>
        </div>
      )}
      
      <div className="relative h-full flex flex-col justify-between z-[1]">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[10px] tracking-[0.3em]" style={{ color: accent, fontFamily: FONT_BODY }}>P4 CENTRAL BANK</div>
            <div className="text-xs italic mt-1 opacity-70" style={{fontFamily: FONT_DISPLAY}}>PLATINUM ACADEMIC</div>
          </div>
          <div className="text-right" style={{ marginRight: !useCustomImage && design.tier !== 'basic' ? '70px' : '0' }}>
            <div className="text-[10px] tracking-widest" style={{ color: accent }}>BALANCE</div>
            <div className="text-2xl md:text-3xl font-bold" style={{fontFamily: FONT_DISPLAY}}>
              {showCard ? formatMoney(student.balance) : '•••••• IGOs'}
            </div>
          </div>
        </div>
        <div className="my-2">
          <div className="w-12 h-9 bg-gradient-to-br from-amber-300 to-amber-600 rounded-md relative overflow-hidden">
            <div className="absolute inset-1 border border-amber-700/40 rounded-sm"></div>
            <div className="absolute top-1/2 left-1 right-1 h-px bg-amber-700/40"></div>
            <div className="absolute top-1 bottom-1 left-1/2 w-px bg-amber-700/40"></div>
          </div>
        </div>
        <div>
          <div className="font-mono text-lg md:text-2xl tracking-[0.2em] mb-3">
            {showCard ? student.cardNumber : '•••• •••• •••• ' + student.cardNumber.slice(-4)}
          </div>
          <div className="flex justify-between items-end gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-[9px] tracking-widest" style={{ color: accent }}>CARDHOLDER</div>
              <div className="text-sm font-semibold uppercase tracking-wider truncate">{displayName}</div>
            </div>
            <div>
              <div className="text-[9px] tracking-widest" style={{ color: accent }}>CVV</div>
              <div className="text-sm font-mono">{showCard ? student.cvv : '•••'}</div>
            </div>
            <div>
              <div className="text-[9px] tracking-widest" style={{ color: accent }}>VALID</div>
              <div className="text-sm font-mono">{student.validThru}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= STUDENT VIEW =============
function StudentView({ student, data, saveData, onLogout }) {
  const [showCard, setShowCard] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // customize, transfer, shop, pin, theme
  const [editName, setEditName] = useState(student.displayName || student.name);
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNote, setTransferNote] = useState('');
  const [transferTarget, setTransferTarget] = useState('student'); // student or central
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');
  const [shopAmount, setShopAmount] = useState({});
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const themeId = student.theme || 'black_gold';
  const theme = STUDENT_THEMES[themeId];

  const myTx = data.transactions.filter(t => t.studentId === student.id);
  const totalEarned = myTx.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalSpent = myTx.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const myRequests = data.bonusRequests.filter(r => r.studentId === student.id);

  const updateMyData = async (changes) => {
    return await saveData({ ...data, students: data.students.map(s => s.id === student.id ? { ...s, ...changes } : s) });
  };

  const handleTransfer = () => {
    setTransferError(''); setTransferSuccess('');
    const amt = parseInt(transferAmount);
    if (!amt || amt <= 0) { setTransferError('Invalid amount.'); return; }
    if (amt > student.balance) { setTransferError('Insufficient balance.'); return; }

    if (transferTarget === 'central') {
      const updated = {
        ...data,
        students: data.students.map(s => s.id === student.id ? { ...s, balance: s.balance - amt } : s),
        centralBank: { ...data.centralBank, balance: data.centralBank.balance + amt },
        transactions: [
          { id: Date.now() + 'a', studentId: student.id, amount: -amt, reason: `Transfer to Central Bank${transferNote.trim() ? ' — ' + transferNote.trim() : ''}`, date: new Date().toISOString() },
          { id: Date.now() + 'b', studentId: CENTRAL_BANK_ID, amount: amt, reason: `Received from ${student.displayName || student.name}${transferNote.trim() ? ' — ' + transferNote.trim() : ''}`, date: new Date().toISOString() },
          ...data.transactions
        ]
      };
      saveData(updated);
      setTransferSuccess(`✓ ${formatMoney(amt)} sent to Central Bank`);
    } else {
      const recipient = data.students.find(s => s.accessCode === transferTo.trim().toUpperCase());
      if (!recipient) { setTransferError('Invalid recipient code.'); return; }
      if (recipient.id === student.id) { setTransferError("You can't transfer to yourself."); return; }
      const updated = {
        ...data,
        students: data.students.map(s => {
          if (s.id === student.id) return { ...s, balance: s.balance - amt };
          if (s.id === recipient.id) return { ...s, balance: s.balance + amt };
          return s;
        }),
        transactions: [
          { id: Date.now() + 'a', studentId: student.id, amount: -amt, reason: `Transfer to ${recipient.displayName || recipient.name}${transferNote.trim() ? ' — ' + transferNote.trim() : ''}`, date: new Date().toISOString() },
          { id: Date.now() + 'b', studentId: recipient.id, amount: amt, reason: `Transfer from ${student.displayName || student.name}${transferNote.trim() ? ' — ' + transferNote.trim() : ''}`, date: new Date().toISOString() },
          ...data.transactions
        ]
      };
      saveData(updated);
      setTransferSuccess(`✓ ${formatMoney(amt)} sent to ${recipient.displayName || recipient.name}`);
    }
    setTransferAmount(''); setTransferTo(''); setTransferNote('');
    setTimeout(() => { setActiveModal(null); setTransferSuccess(''); }, 1800);
  };

  const handleBonusRequest = (bonus) => {
    const amt = parseInt(shopAmount[bonus.id] || '0');
    if (!amt || amt <= 0) { alert('Please enter a valid amount.'); return; }
    if (amt > student.balance) { alert('Insufficient balance.'); return; }

    const request = {
      id: Date.now().toString() + Math.random(),
      studentId: student.id,
      studentName: student.displayName || student.name,
      bonusId: bonus.id,
      bonusName: bonus.name,
      bonusValue: bonus.value,
      amount: amt,
      status: 'pending',
      date: new Date().toISOString()
    };
    
    // Reserve money: subtract from student, mark in transaction
    const updated = {
      ...data,
      students: data.students.map(s => s.id === student.id ? { ...s, balance: s.balance - amt, reservedBalance: (s.reservedBalance || 0) + amt } : s),
      bonusRequests: [request, ...data.bonusRequests],
      transactions: [
        { id: Date.now() + 'r', studentId: student.id, amount: -amt, reason: `⏳ Bonus request: ${bonus.name} (pending)`, date: new Date().toISOString(), pending: true, requestId: request.id },
        ...data.transactions
      ]
    };
    saveData(updated);
    setShopAmount({ ...shopAmount, [bonus.id]: '' });
    alert(`✓ Request sent for ${bonus.name}. Awaiting professor approval.`);
  };

  const handleChangePin = () => {
    setPinError(''); setPinSuccess('');
    if (oldPin !== student.pin) { setPinError('Current PIN is incorrect.'); return; }
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) { setPinError('New PIN must be 4 digits.'); return; }
    updateMyData({ pin: newPin });
    setPinSuccess('PIN updated successfully.');
    setOldPin(''); setNewPin('');
    setTimeout(() => { setActiveModal(null); setPinSuccess(''); }, 1500);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { 
      alert('Image too large (max 10MB). Please select a smaller image.'); 
      e.target.value = '';
      return; 
    }
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const sizeKB = Math.round(compressed.length / 1024);
      if (compressed.length > 500000) {
        alert(`Could not compress image enough (${sizeKB}KB). Please try a smaller or simpler image.`);
        setUploading(false);
        e.target.value = '';
        return;
      }
      const success = await updateMyData({ customImage: compressed });
      if (!success) {
        alert('Could not save the image. Storage may be full. Try a smaller image.');
      }
      setTimeout(() => setUploading(false), 300);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Could not process the image. Try another one.');
      setUploading(false);
    }
    e.target.value = ''; // reset so same file can be uploaded again
  };

  const removeCustomImage = () => {
    updateMyData({ customImage: null });
  };

  const unlockedDesigns = CARD_DESIGNS.filter(d => hasUnlocked(student, d, data.transactions));
  const lockedDesigns = CARD_DESIGNS.filter(d => !hasUnlocked(student, d, data.transactions));

  return (
    <div className="min-h-screen p-4" style={{fontFamily: FONT_BODY, background: theme.bgGradient}}>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div style={{color: theme.accent}}>
            <div className="text-xs tracking-widest" style={{color: theme.secondary}}>WELCOME</div>
            <div className="text-2xl font-bold" style={{fontFamily: FONT_DISPLAY, letterSpacing: '0.02em'}}>{student.displayName || student.name}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveModal('theme')} className="bg-black/40 border p-2" style={{borderColor: theme.secondary, color: theme.secondary}} title="Theme"><Palette size={18} /></button>
            <button onClick={onLogout} className="bg-black/40 border p-2" style={{borderColor: theme.secondary, color: theme.secondary}}><LogOut size={18} /></button>
          </div>
        </div>

        <CreditCardVisual student={student} showCard={showCard} />

        <div className="grid grid-cols-2 gap-2 my-3">
          <button onClick={() => setShowCard(!showCard)} className="bg-black/40 border py-2 px-3 text-xs flex items-center justify-center gap-1" style={{borderColor: theme.secondary + '60', color: theme.accent}}>
            {showCard ? <EyeOff size={14} /> : <Eye size={14} />} {showCard ? 'HIDE' : 'SHOW'}
          </button>
          <button onClick={() => setActiveModal('customize')} className="text-black py-2 px-3 text-xs font-bold flex items-center justify-center gap-1" style={{background: theme.secondary}}>
            <Palette size={14} /> CUSTOMIZE
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <button onClick={() => setActiveModal('transfer')} className="bg-black/40 border py-3 px-3 text-sm font-bold flex items-center justify-center gap-2" style={{borderColor: theme.secondary, color: theme.accent}}>
            <Send size={16} /> TRANSFER
          </button>
          <button onClick={() => setActiveModal('shop')} className="text-black py-3 px-3 text-sm font-bold flex items-center justify-center gap-2 relative" style={{background: theme.secondary}}>
            <ShoppingCart size={16} /> BONUS SHOP
            {myRequests.filter(r => r.status === 'pending').length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{myRequests.filter(r => r.status === 'pending').length}</span>
            )}
          </button>
        </div>

        <button onClick={() => setActiveModal('pin')} className="w-full bg-black/40 border py-2 text-xs flex items-center justify-center gap-1 mb-6" style={{borderColor: theme.secondary + '60', color: theme.accent}}>
          <KeyRound size={14} /> CHANGE PIN
        </button>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-black/40 border p-3 text-center" style={{borderColor: theme.secondary + '40'}}>
            <TrendingUp className="mx-auto mb-1" size={18} style={{color: theme.secondary}} />
            <div className="text-[10px]" style={{color: theme.secondary}}>EARNED</div>
            <div className="text-sm font-bold" style={{color: theme.accent}}>{formatMoney(totalEarned)}</div>
          </div>
          <div className="bg-black/40 border p-3 text-center" style={{borderColor: theme.secondary + '40'}}>
            <TrendingDown className="mx-auto mb-1" size={18} style={{color: theme.secondary}} />
            <div className="text-[10px]" style={{color: theme.secondary}}>SPENT</div>
            <div className="text-sm font-bold" style={{color: theme.accent}}>{formatMoney(totalSpent)}</div>
          </div>
          <div className="bg-black/40 border p-3 text-center" style={{borderColor: theme.secondary + '40'}}>
            <Sparkles className="mx-auto mb-1" size={18} style={{color: theme.secondary}} />
            <div className="text-[10px]" style={{color: theme.secondary}}>CARDS</div>
            <div className="text-sm font-bold" style={{color: theme.accent}}>{unlockedDesigns.length}/{CARD_DESIGNS.length}</div>
          </div>
        </div>

        <div className="bg-stone-50 border-2" style={{borderColor: theme.secondary}}>
          <div className="p-3 px-4" style={{background: theme.primary, color: theme.accent}}>
            <div className="text-xs tracking-widest" style={{color: theme.secondary}}>STATEMENT</div>
            <div className="font-bold">Recent Activity</div>
          </div>
          <div className="max-h-96 overflow-y-auto bg-white">
            {myTx.length === 0 ? (
              <p className="text-stone-500 italic text-center py-12 text-sm">No activity yet.</p>
            ) : (
              myTx.map(tx => (
                <div key={tx.id} className={`border-b border-stone-200 p-3 flex justify-between items-center ${tx.pending ? 'bg-amber-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    {tx.pending ? <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center"><Clock className="text-amber-700" size={16} /></div> :
                     tx.amount > 0 ? <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"><TrendingUp className="text-emerald-700" size={16} /></div> :
                     <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center"><TrendingDown className="text-red-700" size={16} /></div>}
                    <div>
                      <div className="font-semibold text-stone-800 text-sm">{tx.reason}</div>
                      <div className="text-xs text-stone-500">{new Date(tx.date).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}</div>
                    </div>
                  </div>
                  <div className={`font-bold ${tx.pending ? 'text-amber-700' : tx.amount > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatMoney(tx.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* THEME MODAL */}
      {activeModal === 'theme' && (
        <Modal onClose={() => setActiveModal(null)} theme={theme} title="CHOOSE YOUR THEME">
          <div className="grid grid-cols-2 gap-3 p-5">
            {Object.entries(STUDENT_THEMES).map(([id, t]) => (
              <button key={id} onClick={() => { updateMyData({ theme: id }); setActiveModal(null); }} className={`p-4 border-2 ${themeId === id ? 'border-amber-500 ring-2 ring-amber-500' : 'border-stone-300'}`} style={{background: t.bgGradient, color: t.accent}}>
                <div className="text-xs tracking-widest" style={{color: t.secondary}}>{t.name.toUpperCase()}</div>
                <div className="flex gap-1 mt-2 justify-center">
                  <div className="w-4 h-4 rounded-full" style={{background: t.primary, border: '1px solid ' + t.secondary}}></div>
                  <div className="w-4 h-4 rounded-full" style={{background: t.secondary}}></div>
                  <div className="w-4 h-4 rounded-full" style={{background: t.accent}}></div>
                </div>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* CUSTOMIZE MODAL */}
      {activeModal === 'customize' && (
        <Modal onClose={() => setActiveModal(null)} theme={theme} title="MY CARD" wide>
          <div className="p-5">
            <div className="mb-5">
              <label className="block text-xs tracking-widest text-stone-700 mb-2 font-bold">CARDHOLDER NAME</label>
              <div className="flex gap-2">
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} maxLength={24} className="flex-1 px-3 py-2 border-2 border-stone-700 bg-white" />
                <button onClick={() => editName.trim() && updateMyData({ displayName: editName.trim() })} className="bg-stone-800 text-amber-100 px-4 flex items-center gap-1 font-bold">
                  <Check size={16} /> SAVE
                </button>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs tracking-widest text-stone-700 mb-2 font-bold">CUSTOM IMAGE (OPTIONAL)</label>
              <p className="text-xs text-stone-500 italic mb-2">Upload your own background. Use only appropriate images. Professor can remove inappropriate content.</p>
              <div className="flex gap-2">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={uploading}
                  className="flex-1 bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-amber-100 px-4 py-2 flex items-center justify-center gap-2 font-bold transition-colors"
                >
                  <Upload size={16} /> {uploading ? 'PROCESSING...' : student.customImage ? 'REPLACE IMAGE' : 'UPLOAD IMAGE'}
                </button>
                {student.customImage && !uploading && (
                  <button onClick={removeCustomImage} className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 flex items-center gap-2">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              {student.customImage && !uploading && <p className="text-xs text-emerald-700 mt-2 italic">✓ Custom image active. Hides the selected card design.</p>}
              {uploading && <p className="text-xs text-amber-700 mt-2 italic">⏳ Compressing and saving image...</p>}
            </div>

            <label className="block text-xs tracking-widest text-stone-700 mb-2 font-bold">UNLOCKED DESIGNS ({unlockedDesigns.length})</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-5">
              {unlockedDesigns.map(d => {
                const tier = TIER_LABELS[d.tier];
                const isSelected = !student.customImage && (student.cardDesign || 'emerald') === d.id;
                return (
                  <button key={d.id} onClick={() => updateMyData({ cardDesign: d.id, customImage: null })} className={`relative p-3 rounded-lg text-left text-xs font-semibold ${isSelected ? 'ring-4 ring-amber-500 scale-105' : ''}`} style={{ background: d.gradient, color: d.textColor }}>
                    <div className="text-[9px] opacity-80 tracking-widest">{tier.icon} {tier.label.toUpperCase()}</div>
                    <div className="font-bold mt-1">{d.name}</div>
                    {isSelected && <Check size={14} className="absolute top-1 right-1" />}
                  </button>
                );
              })}
            </div>

            {lockedDesigns.length > 0 && (
              <div>
                <label className="block text-xs tracking-widest text-stone-600 mb-2 font-bold">🔒 LOCKED ({lockedDesigns.length})</label>
                <p className="text-xs text-stone-500 italic mb-2">Earn more to unlock. Total earned: {formatMoney(totalEarned)}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {lockedDesigns.map(d => {
                    const tier = TIER_LABELS[d.tier];
                    const needed = (d.minBalance || 0) - totalEarned;
                    return (
                      <div key={d.id} className="relative p-3 rounded-lg text-left text-xs font-semibold bg-stone-300">
                        <div className="absolute inset-0 opacity-30 rounded-lg" style={{ background: d.gradient }}></div>
                        <div className="relative z-10 text-stone-700">
                          <div className="text-[9px] tracking-widest">{tier.icon} {tier.label.toUpperCase()}</div>
                          <div className="font-bold mt-1">{d.name}</div>
                          <div className="text-[10px] mt-1">Need {formatMoney(needed)}</div>
                        </div>
                        <Lock size={14} className="absolute top-2 right-2 text-stone-700" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* TRANSFER MODAL */}
      {activeModal === 'transfer' && (
        <Modal onClose={() => setActiveModal(null)} theme={theme} title="TRANSFER">
          <div className="p-5">
            <div className="bg-stone-100 border border-stone-300 p-3 mb-4 text-center">
              <div className="text-xs text-stone-600">AVAILABLE BALANCE</div>
              <div className="text-2xl font-bold text-stone-800" style={{fontFamily: FONT_DISPLAY}}>{formatMoney(student.balance)}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={() => setTransferTarget('student')} className={`py-2 text-sm font-bold border-2 ${transferTarget === 'student' ? 'bg-stone-800 text-amber-100 border-stone-800' : 'bg-white text-stone-700 border-stone-300'}`}>
                TO STUDENT
              </button>
              <button onClick={() => setTransferTarget('central')} className={`py-2 text-sm font-bold border-2 flex items-center justify-center gap-1 ${transferTarget === 'central' ? 'bg-stone-800 text-amber-100 border-stone-800' : 'bg-white text-stone-700 border-stone-300'}`}>
                <Building2 size={14} /> CENTRAL BANK
              </button>
            </div>

            {transferTarget === 'student' && (
              <>
                <label className="block text-xs tracking-widest text-stone-700 mb-1 font-bold">RECIPIENT CODE</label>
                <input type="text" value={transferTo} onChange={(e) => setTransferTo(e.target.value.toUpperCase())} maxLength={6} placeholder="EX: A3K9P2" className="w-full px-3 py-2 border-2 border-stone-700 bg-white text-center font-mono tracking-widest text-lg mb-3" />
              </>
            )}

            <label className="block text-xs tracking-widest text-stone-700 mb-1 font-bold">AMOUNT</label>
            <input type="number" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="0" className="w-full px-3 py-2 border-2 border-stone-700 bg-white mb-3" />

            <label className="block text-xs tracking-widest text-stone-700 mb-1 font-bold">MESSAGE (OPTIONAL)</label>
            <input type="text" value={transferNote} onChange={(e) => setTransferNote(e.target.value)} maxLength={50} className="w-full px-3 py-2 border-2 border-stone-300 bg-white mb-4" />

            {transferError && <div className="bg-red-100 border border-red-400 text-red-800 p-2 text-sm mb-3">{transferError}</div>}
            {transferSuccess && <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 p-2 text-sm mb-3">{transferSuccess}</div>}

            <button onClick={handleTransfer} className="w-full bg-stone-800 text-amber-100 py-3 font-bold tracking-widest flex items-center justify-center gap-2">
              <Send size={18} /> SEND
            </button>
          </div>
        </Modal>
      )}

      {/* SHOP MODAL */}
      {activeModal === 'shop' && (
        <Modal onClose={() => setActiveModal(null)} theme={theme} title="BONUS SHOP" wide>
          <div className="p-5">
            <div className="bg-stone-100 border border-stone-300 p-3 mb-4 text-center">
              <div className="text-xs text-stone-600">YOUR BALANCE</div>
              <div className="text-2xl font-bold text-stone-800" style={{fontFamily: FONT_DISPLAY}}>{formatMoney(student.balance)}</div>
            </div>

            <p className="text-xs text-stone-600 italic mb-4">Choose a bonus, propose your price. The professor will approve or reject your request.</p>

            <div className="space-y-3">
              {BONUS_SHOP.map(bonus => (
                <div key={bonus.id} className="bg-white border-2 border-stone-300 p-3">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-3xl">{bonus.icon}</div>
                    <div className="flex-1">
                      <div className="font-bold text-stone-800">{bonus.name}</div>
                      {bonus.value !== null && <div className="text-emerald-700 font-bold text-sm">+{bonus.value} Academic Bonus</div>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input type="number" value={shopAmount[bonus.id] || ''} onChange={(e) => setShopAmount({...shopAmount, [bonus.id]: e.target.value})} placeholder="Your offer (IGOs)" className="flex-1 px-3 py-2 border-2 border-stone-300 bg-stone-50 text-sm" />
                    <button onClick={() => handleBonusRequest(bonus)} className="bg-stone-800 text-amber-100 px-4 py-2 text-sm font-bold tracking-widest">REQUEST</button>
                  </div>
                </div>
              ))}
            </div>

            {myRequests.length > 0 && (
              <div className="mt-6">
                <h4 className="font-bold text-stone-800 mb-2 text-sm tracking-widest">MY REQUESTS</h4>
                <div className="space-y-2">
                  {myRequests.slice(0, 10).map(r => (
                    <div key={r.id} className={`p-2 border text-sm flex justify-between items-center ${r.status === 'pending' ? 'bg-amber-50 border-amber-300' : r.status === 'approved' ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'}`}>
                      <div>
                        <div className="font-semibold">{r.bonusName}</div>
                        <div className="text-xs text-stone-500">{formatMoney(r.amount)} · {new Date(r.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-xs font-bold uppercase flex items-center gap-1">
                        {r.status === 'pending' && <><Clock size={14} className="text-amber-700" /><span className="text-amber-700">Pending</span></>}
                        {r.status === 'approved' && <><CheckCircle size={14} className="text-emerald-700" /><span className="text-emerald-700">Approved</span></>}
                        {r.status === 'rejected' && <><XCircle size={14} className="text-red-700" /><span className="text-red-700">Rejected</span></>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* PIN MODAL */}
      {activeModal === 'pin' && (
        <Modal onClose={() => setActiveModal(null)} theme={theme} title="CHANGE PIN">
          <div className="p-5">
            <label className="block text-xs tracking-widest text-stone-700 mb-1 font-bold">CURRENT PIN</label>
            <input type="password" value={oldPin} onChange={(e) => setOldPin(e.target.value.replace(/\D/g, '').slice(0,4))} maxLength={4} className="w-full px-3 py-2 border-2 border-stone-700 bg-white text-center text-xl font-mono tracking-[0.5em] mb-3" />
            <label className="block text-xs tracking-widest text-stone-700 mb-1 font-bold">NEW PIN</label>
            <input type="password" value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0,4))} maxLength={4} className="w-full px-3 py-2 border-2 border-stone-700 bg-white text-center text-xl font-mono tracking-[0.5em] mb-4" />
            {pinError && <div className="bg-red-100 border border-red-400 text-red-800 p-2 text-sm mb-3">{pinError}</div>}
            {pinSuccess && <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 p-2 text-sm mb-3">{pinSuccess}</div>}
            <button onClick={handleChangePin} className="w-full bg-stone-800 text-amber-100 py-3 font-bold tracking-widest">UPDATE PIN</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose, theme, title, wide }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className={`bg-stone-50 ${wide ? 'max-w-2xl' : 'max-w-md'} w-full max-h-[90vh] overflow-y-auto border-4`} style={{borderColor: theme.secondary}} onClick={(e) => e.stopPropagation()}>
        <div className="p-4 flex items-center justify-between sticky top-0 z-10" style={{background: theme.primary, color: theme.accent}}>
          <h3 className="text-lg font-bold tracking-widest" style={{fontFamily: FONT_DISPLAY}}>{title}</h3>
          <button onClick={onClose} className="hover:opacity-70 p-1"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ============= STUDENT CODE CARD (Teacher view) =============
function StudentCodeCard({ student, copiedCode, setCopiedCode }) {
  const [showPin, setShowPin] = useState(false);
  
  const handleCopy = async (value, key) => {
    if (!value) return;
    const success = await copyToClipboard(value);
    if (success) {
      setCopiedCode(key);
      setTimeout(() => setCopiedCode(''), 2000);
    } else {
      alert(`Could not copy automatically. Manually copy: ${value}`);
    }
  };

  return (
    <div className="bg-black border border-amber-700 p-3">
      <div className="text-amber-100 mb-3" style={{fontFamily: FONT_DISPLAY, fontSize: '1.25rem', fontWeight: 600}}>{student.name}</div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between bg-stone-900 p-2 border border-stone-700">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] tracking-widest text-amber-500 mb-1">ACCESS CODE</div>
            <div className="text-lg tracking-widest text-amber-400" style={{fontFamily: FONT_MONO, fontWeight: 500}}>{student.accessCode}</div>
          </div>
          <button onClick={() => handleCopy(student.accessCode, 'code-' + student.id)} className="text-amber-400 hover:text-amber-300 hover:bg-stone-800 p-2 transition-colors flex items-center gap-1" title="Copy code">
            {copiedCode === 'code-' + student.id ? (
              <><Check size={16} className="text-emerald-400" /><span className="text-xs text-emerald-400">Copied!</span></>
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between bg-stone-900 p-2 border border-stone-700">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] tracking-widest text-amber-500 mb-1">PIN</div>
            <div className="text-lg tracking-widest text-amber-400" style={{fontFamily: FONT_MONO, fontWeight: 500}}>
              {!student.pin ? (
                <span className="text-stone-500 text-sm italic">Not created yet</span>
              ) : showPin ? student.pin : '••••'}
            </div>
          </div>
          {student.pin && (
            <div className="flex items-center">
              <button onClick={() => setShowPin(!showPin)} className="text-amber-400 hover:text-amber-300 hover:bg-stone-800 p-2 transition-colors" title={showPin ? 'Hide PIN' : 'Show PIN'}>
                {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button onClick={() => handleCopy(student.pin, 'pin-' + student.id)} className="text-amber-400 hover:text-amber-300 hover:bg-stone-800 p-2 transition-colors flex items-center gap-1" title="Copy PIN">
                {copiedCode === 'pin-' + student.id ? (
                  <><Check size={16} className="text-emerald-400" /><span className="text-xs text-emerald-400">Copied!</span></>
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============= TEACHER VIEW =============
function TeacherView({ data, saveData, setView, onLogout }) {
  const [tab, setTab] = useState('students'); // students, requests, central
  const [newStudentName, setNewStudentName] = useState('');
  const [customAmount, setCustomAmount] = useState({});
  const [reason, setReason] = useState({});
  const [showHistory, setShowHistory] = useState(null);
  const [showCodes, setShowCodes] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');

  const pendingRequests = data.bonusRequests.filter(r => r.status === 'pending');

  const addStudent = () => {
    if (!newStudentName.trim()) return;
    const today = new Date();
    const validThru = `${String(today.getMonth() + 1).padStart(2, '0')}/${String((today.getFullYear() + 4) % 100).padStart(2, '0')}`;
    let accessCode;
    do { accessCode = generateAccessCode(); } while (data.students.some(s => s.accessCode === accessCode));
    const newStudent = {
      id: Date.now().toString(), name: newStudentName.trim(), displayName: newStudentName.trim(),
      balance: 0, cardNumber: generateCardNumber(), cvv: generateCVV(),
      validThru, accessCode, cardDesign: 'emerald', pin: null, theme: 'black_gold',
      reservedBalance: 0
    };
    saveData({ ...data, students: [...data.students, newStudent] });
    setNewStudentName('');
  };

  const removeStudent = (id) => {
    if (!confirm('Delete this student?')) return;
    saveData({ ...data, students: data.students.filter(s => s.id !== id), transactions: data.transactions.filter(t => t.studentId !== id), bonusRequests: data.bonusRequests.filter(r => r.studentId !== id) });
  };

  const resetStudentPin = (id) => {
    if (!confirm('Reset this student\'s PIN? They will create a new one on next login.')) return;
    saveData({ ...data, students: data.students.map(s => s.id === id ? { ...s, pin: null } : s) });
    alert('PIN reset. Student will create new PIN on next login.');
  };

  const removeStudentImage = (id) => {
    if (!confirm('Remove this student\'s custom image?')) return;
    saveData({ ...data, students: data.students.map(s => s.id === id ? { ...s, customImage: null } : s) });
  };

  const updateBalance = (studentId, amount, txReason = '') => {
    const updated = {
      ...data,
      students: data.students.map(s => s.id === studentId ? { ...s, balance: s.balance + amount } : s),
      transactions: [{ id: Date.now() + Math.random(), studentId, amount, reason: txReason || (amount > 0 ? 'Correct answer' : 'Penalty'), date: new Date().toISOString() }, ...data.transactions]
    };
    saveData(updated);
  };

  const handleCustom = (studentId, sign) => {
    const amt = parseInt(customAmount[studentId] || '0');
    if (!amt || amt <= 0) return;
    updateBalance(studentId, sign * amt, reason[studentId] || '');
    setCustomAmount({ ...customAmount, [studentId]: '' });
    setReason({ ...reason, [studentId]: '' });
  };

  const approveRequest = (request) => {
    const bonusLabel = request.bonusValue !== null ? ` (+${request.bonusValue})` : '';
    const updated = {
      ...data,
      students: data.students.map(s => s.id === request.studentId ? { ...s, reservedBalance: Math.max(0, (s.reservedBalance || 0) - request.amount) } : s),
      centralBank: { ...data.centralBank, balance: data.centralBank.balance + request.amount },
      bonusRequests: data.bonusRequests.map(r => r.id === request.id ? { ...r, status: 'approved', resolvedAt: new Date().toISOString() } : r),
      transactions: data.transactions.map(t => t.requestId === request.id ? { ...t, reason: `✓ Bonus approved: ${request.bonusName}${bonusLabel}`, pending: false } : t)
    };
    updated.transactions = [
      { id: Date.now() + 'c', studentId: CENTRAL_BANK_ID, amount: request.amount, reason: `Bonus payment from ${request.studentName}: ${request.bonusName}`, date: new Date().toISOString() },
      ...updated.transactions
    ];
    saveData(updated);
  };

  const rejectRequest = (request) => {
    if (!confirm('Reject this request? Money will be returned to the student.')) return;
    const updated = {
      ...data,
      students: data.students.map(s => s.id === request.studentId ? { ...s, balance: s.balance + request.amount, reservedBalance: Math.max(0, (s.reservedBalance || 0) - request.amount) } : s),
      bonusRequests: data.bonusRequests.map(r => r.id === request.id ? { ...r, status: 'rejected', resolvedAt: new Date().toISOString() } : r),
      transactions: data.transactions.map(t => t.requestId === request.id ? { ...t, reason: `✗ Bonus rejected: ${request.bonusName} (refunded)`, pending: false } : t)
    };
    // Add refund transaction
    updated.transactions = [
      { id: Date.now() + 'rf', studentId: request.studentId, amount: request.amount, reason: `Refund: ${request.bonusName}`, date: new Date().toISOString() },
      ...updated.transactions
    ];
    saveData(updated);
  };

  const resetAll = () => {
    if (!confirm('DELETE EVERYTHING? This cannot be undone.')) return;
    saveData({ students: [], transactions: [], bonusRequests: [], centralBank: { balance: 0, name: 'P4 Central Bank' } });
  };

  const sortedStudents = [...data.students].sort((a, b) => b.balance - a.balance);
  const totalDistributed = data.transactions.filter(t => t.amount > 0 && t.studentId !== CENTRAL_BANK_ID && !t.reason.startsWith('Transfer') && !t.reason.startsWith('Refund')).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-screen" style={{fontFamily: FONT_BODY, background: 'linear-gradient(135deg, #0c0a09 0%, #1c1917 50%, #0c0a09 100%)'}}>
      <header className="border-b-4 border-amber-600" style={{background: 'linear-gradient(135deg, #000000 0%, #1c1917 100%)'}}>
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <button onClick={onLogout} className="text-amber-400 text-xs mb-1 hover:text-amber-300">← Sign out</button>
              <div className="text-xs tracking-[0.3em] text-amber-500">ADMINISTRATIVE PANEL</div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{fontFamily: FONT_DISPLAY, background: 'linear-gradient(135deg, #d4af37 0%, #f5e7b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.01em'}}>P4 Central Bank</h1>
              <p className="text-amber-200/60 italic text-xs">ISSUED BY PROFESSOR TOMÁS URBINA</p>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-widest text-amber-500">Distributed</div>
              <div className="text-2xl font-bold text-amber-100" style={{fontFamily: FONT_DISPLAY}}>{formatMoney(totalDistributed)}</div>
              <div className="text-xs text-amber-400">{data.students.length} accounts</div>
            </div>
          </div>
        </div>
      </header>

      {/* TABS */}
      <div className="bg-black border-b border-amber-700">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          <button onClick={() => setTab('students')} className={`px-4 py-3 text-sm font-bold tracking-widest transition-colors ${tab === 'students' ? 'text-amber-400 border-b-2 border-amber-500' : 'text-stone-500 hover:text-amber-200'}`}>
            <Users size={16} className="inline mr-1" /> STUDENTS
          </button>
          <button onClick={() => setTab('requests')} className={`px-4 py-3 text-sm font-bold tracking-widest transition-colors relative ${tab === 'requests' ? 'text-amber-400 border-b-2 border-amber-500' : 'text-stone-500 hover:text-amber-200'}`}>
            <ShoppingCart size={16} className="inline mr-1" /> REQUESTS
            {pendingRequests.length > 0 && <span className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{pendingRequests.length}</span>}
          </button>
          <button onClick={() => setTab('central')} className={`px-4 py-3 text-sm font-bold tracking-widest transition-colors ${tab === 'central' ? 'text-amber-400 border-b-2 border-amber-500' : 'text-stone-500 hover:text-amber-200'}`}>
            <Building2 size={16} className="inline mr-1" /> CENTRAL BANK
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {tab === 'students' && (
          <>
            <section className="bg-gradient-to-br from-stone-900 to-black border border-amber-700 p-5 mb-4">
              <h2 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2"><UserPlus size={20} /> Open New Account</h2>
              <div className="flex gap-2 flex-wrap">
                <input type="text" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addStudent()} placeholder="Student name" className="flex-1 min-w-[200px] px-4 py-2 border-2 border-amber-700 bg-black text-amber-100 outline-none focus:border-amber-400" />
                <button onClick={addStudent} className="bg-gradient-to-r from-amber-600 to-amber-700 text-black px-6 py-2 font-bold tracking-wide">REGISTER</button>
              </div>
            </section>

            {data.students.length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                <button onClick={() => setShowCodes(!showCodes)} className="flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-black px-4 py-2 text-sm font-bold">
                  {showCodes ? <EyeOff size={16} /> : <Eye size={16} />} {showCodes ? 'HIDE' : 'SHOW'} CODES
                </button>
                <button onClick={resetAll} className="flex items-center gap-2 bg-red-900 hover:bg-red-800 text-amber-100 px-4 py-2 text-sm font-bold border border-red-700"><Trash2 size={16} /> RESET ALL</button>
              </div>
            )}

            {showCodes && data.students.length > 0 && (
              <section className="bg-stone-900/80 border-2 border-amber-700 p-4 mb-4">
                <h3 className="font-bold text-amber-400 mb-3 text-sm tracking-widest">ACCESS CODES</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {data.students.map(s => (
                    <StudentCodeCard key={s.id} student={s} copiedCode={copiedCode} setCopiedCode={setCopiedCode} />
                  ))}
                </div>
              </section>
            )}

            {data.students.length === 0 ? (
              <div className="bg-stone-900 border border-amber-700 p-12 text-center">
                <Trophy size={48} className="mx-auto text-amber-700 mb-3" />
                <p className="text-amber-200/60 italic">No accounts yet. Register your first student above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedStudents.map((student, idx) => {
                  const unlockedCount = CARD_DESIGNS.filter(d => hasUnlocked(student, d, data.transactions)).length;
                  return (
                  <article key={student.id} className="bg-gradient-to-br from-stone-900 to-black border border-amber-700">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 flex items-center justify-center font-bold ${idx === 0 ? 'bg-amber-500 text-black' : idx === 1 ? 'bg-stone-400 text-black' : idx === 2 ? 'bg-amber-700 text-black' : 'bg-stone-700 text-stone-300'}`}>{idx + 1}</div>
                          <div>
                            <h3 className="text-xl font-bold text-amber-100">{student.name}</h3>
                            {student.displayName && student.displayName !== student.name && <div className="text-xs text-amber-400 italic">"{student.displayName}"</div>}
                            <div className="text-xs text-stone-500 font-mono">Code: {student.accessCode} · {unlockedCount}/{CARD_DESIGNS.length} cards {student.customImage && '· 📷'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs uppercase text-amber-500">Balance</div>
                          <div className={`text-3xl font-bold ${student.balance > 0 ? 'text-emerald-400' : student.balance < 0 ? 'text-red-400' : 'text-stone-400'}`} style={{fontFamily: FONT_DISPLAY}}>{formatMoney(student.balance)}</div>
                          {student.reservedBalance > 0 && <div className="text-xs text-amber-400 italic">+{formatMoney(student.reservedBalance)} reserved</div>}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
                        {[5000, 10000, 20000, 50000, 100000].map(amt => (
                          <button key={amt} onClick={() => updateBalance(student.id, amt)} className="bg-black hover:bg-amber-700 hover:text-black border border-amber-700 text-amber-400 py-2 text-sm font-bold transition-colors">
                            +{amt.toLocaleString('en-US')}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-2 flex-wrap items-center pt-3 border-t border-amber-900">
                        <input type="text" value={reason[student.id] || ''} onChange={(e) => setReason({ ...reason, [student.id]: e.target.value })} placeholder="Reason" className="flex-1 min-w-[120px] px-3 py-2 border border-amber-800 text-sm bg-black text-amber-100" />
                        <input type="number" value={customAmount[student.id] || ''} onChange={(e) => setCustomAmount({ ...customAmount, [student.id]: e.target.value })} placeholder="Amount" className="w-24 px-3 py-2 border border-amber-800 text-sm bg-black text-amber-100" />
                        <button onClick={() => handleCustom(student.id, 1)} className="bg-emerald-700 hover:bg-emerald-600 text-white p-2"><Plus size={18} /></button>
                        <button onClick={() => handleCustom(student.id, -1)} className="bg-red-800 hover:bg-red-700 text-white p-2"><Minus size={18} /></button>
                        <button onClick={() => setShowHistory(student.id)} className="bg-stone-700 hover:bg-stone-600 text-amber-100 p-2"><History size={18} /></button>
                        <button onClick={() => resetStudentPin(student.id)} className="bg-amber-800 hover:bg-amber-700 text-amber-100 p-2" title="Reset PIN"><RotateCcw size={18} /></button>
                        {student.customImage && <button onClick={() => removeStudentImage(student.id)} className="bg-red-900 hover:bg-red-800 text-amber-100 p-2" title="Remove image"><ImageIcon size={18} /></button>}
                        <button onClick={() => removeStudent(student.id)} className="bg-stone-800 hover:bg-red-900 text-stone-400 hover:text-red-300 p-2"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  </article>
                )})}
              </div>
            )}
          </>
        )}

        {tab === 'requests' && (
          <div>
            <h2 className="text-2xl font-bold text-amber-400 mb-4" style={{fontFamily: FONT_DISPLAY, letterSpacing: '0.02em'}}>Bonus Requests</h2>
            {pendingRequests.length === 0 && data.bonusRequests.length === 0 && (
              <div className="bg-stone-900 border border-amber-700 p-12 text-center">
                <ShoppingCart size={48} className="mx-auto text-amber-700 mb-3" />
                <p className="text-amber-200/60 italic">No requests yet.</p>
              </div>
            )}
            
            {pendingRequests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-amber-300 mb-2 tracking-widest">PENDING ({pendingRequests.length})</h3>
                <div className="space-y-2">
                  {pendingRequests.map(r => (
                    <div key={r.id} className="bg-amber-950/50 border-2 border-amber-600 p-4">
                      <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                        <div>
                          <div className="font-bold text-amber-100 text-lg">{r.bonusName}</div>
                          {r.bonusValue !== null && <div className="text-emerald-400 font-bold">+{r.bonusValue} academic bonus</div>}
                          <div className="text-stone-400 text-sm mt-1">From: <span className="text-amber-200 font-semibold">{r.studentName}</span></div>
                          <div className="text-stone-500 text-xs">{new Date(r.date).toLocaleString('en-US')}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-amber-500">PROPOSED</div>
                          <div className="text-2xl font-bold text-amber-300" style={{fontFamily: FONT_DISPLAY}}>{formatMoney(r.amount)}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => approveRequest(r)} className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white py-2 font-bold tracking-widest flex items-center justify-center gap-2">
                          <CheckCircle size={18} /> APPROVE
                        </button>
                        <button onClick={() => rejectRequest(r)} className="flex-1 bg-red-800 hover:bg-red-700 text-white py-2 font-bold tracking-widest flex items-center justify-center gap-2">
                          <XCircle size={18} /> REJECT
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.bonusRequests.filter(r => r.status !== 'pending').length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-stone-400 mb-2 tracking-widest">HISTORY</h3>
                <div className="space-y-2">
                  {data.bonusRequests.filter(r => r.status !== 'pending').slice(0, 30).map(r => (
                    <div key={r.id} className="bg-stone-900 border border-stone-700 p-3 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-amber-100">{r.bonusName}</div>
                        <div className="text-xs text-stone-400">{r.studentName} · {formatMoney(r.amount)} · {new Date(r.date).toLocaleDateString()}</div>
                      </div>
                      <div className={`text-xs font-bold uppercase flex items-center gap-1 ${r.status === 'approved' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {r.status === 'approved' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {r.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'central' && (
          <div>
            <div className="bg-gradient-to-br from-stone-900 to-black border-2 border-amber-500 p-6 mb-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <Building2 size={48} className="text-amber-400" />
                  <div>
                    <div className="text-xs tracking-widest text-amber-500">CENTRAL TREASURY</div>
                    <h2 className="text-2xl font-bold text-amber-100" style={{fontFamily: FONT_DISPLAY}}>P4 Central Bank</h2>
                    <p className="text-amber-200/60 italic text-xs">Issued by Professor Tomás Urbina</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs tracking-widest text-amber-500">TOTAL HOLDINGS</div>
                  <div className="text-4xl font-bold" style={{fontFamily: FONT_DISPLAY, background: 'linear-gradient(135deg, #d4af37 0%, #f5e7b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                    {formatMoney(data.centralBank.balance)}
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-sm font-bold text-amber-400 mb-2 tracking-widest">CENTRAL BANK ACTIVITY</h3>
            <div className="bg-stone-900 border border-amber-700">
              {data.transactions.filter(t => t.studentId === CENTRAL_BANK_ID).length === 0 ? (
                <p className="text-amber-200/60 italic text-center py-8">No transactions yet.</p>
              ) : (
                data.transactions.filter(t => t.studentId === CENTRAL_BANK_ID).map(tx => (
                  <div key={tx.id} className="border-b border-stone-800 p-3 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-amber-100 text-sm">{tx.reason}</div>
                      <div className="text-xs text-stone-500">{new Date(tx.date).toLocaleString('en-US')}</div>
                    </div>
                    <div className="font-bold text-emerald-400">+{formatMoney(tx.amount)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {showHistory && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setShowHistory(null)}>
          <div className="bg-stone-50 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col border-4 border-amber-600" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 flex items-center justify-between" style={{background: 'linear-gradient(135deg, #000000 0%, #1c1917 100%)', color: '#fbbf24'}}>
              <div>
                <div className="text-xs tracking-widest text-amber-500">STATEMENT</div>
                <h3 className="text-xl font-bold">{data.students.find(s => s.id === showHistory)?.name}</h3>
              </div>
              <button onClick={() => setShowHistory(null)} className="hover:opacity-70 p-2"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto p-4 flex-1">
              {data.transactions.filter(t => t.studentId === showHistory).length === 0 ? <p className="text-stone-500 italic text-center py-8">No activity.</p> : (
                <div className="space-y-2">
                  {data.transactions.filter(t => t.studentId === showHistory).map(tx => (
                    <div key={tx.id} className={`bg-white border p-3 flex items-center justify-between ${tx.pending ? 'border-amber-400 bg-amber-50' : 'border-stone-200'}`}>
                      <div className="flex items-center gap-3">
                        {tx.pending ? <Clock className="text-amber-700" size={20} /> :
                         tx.amount > 0 ? <TrendingUp className="text-emerald-700" size={20} /> :
                         <TrendingDown className="text-red-700" size={20} />}
                        <div>
                          <div className="font-semibold text-stone-800">{tx.reason}</div>
                          <div className="text-xs text-stone-500">{new Date(tx.date).toLocaleString('en-US')}</div>
                        </div>
                      </div>
                      <div className={`font-bold text-lg ${tx.amount > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                        {tx.amount > 0 ? '+' : ''}{formatMoney(tx.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
