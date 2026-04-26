import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Trash2, Trophy, Download, UserPlus, History, X, TrendingUp, TrendingDown, CreditCard, LogOut, Copy, Eye, EyeOff, Users, Send, Palette, Check, ArrowRightLeft, Sparkles, Lock, ShoppingCart, Building2, Clock, CheckCircle, XCircle, Upload, Image as ImageIcon, KeyRound, RotateCcw, Globe, Settings } from 'lucide-react';
import { saveBankData, subscribeToData } from './firebase';

const TEACHER_PASSWORD = 'urbina2026';
const CENTRAL_BANK_ID = 'CENTRAL_BANK';
const CURRENCY_NAME = 'IGOs';

const DEFAULT_DATA = {
  students: [],
  transactions: [],
  bonusRequests: [],
  centralBank: { balance: 0, name: 'P4 Central Bank' }
};

// ===== 15 TEMAS GLOBALES =====
const GLOBAL_THEMES = {
  black_gold: {
    name: 'Black & Gold',
    icon: '✨',
    primary: '#000000',
    secondary: '#d4af37',
    accent: '#f5e7b8',
    dark: '#0a0a0a',
    light: '#1a1a1a',
    border: '#d4af37',
    bgGradient: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
    buttonGradient: 'linear-gradient(135deg, #8b7500 0%, #d4af37 100%)',
    hoverColor: '#f5e7b8',
    textColor: '#ffffff'
  },
  midnight: {
    name: 'Midnight Blue',
    icon: '🌙',
    primary: '#0a1628',
    secondary: '#3b82f6',
    accent: '#bfdbfe',
    dark: '#051018',
    light: '#1e3a8a',
    border: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, #0a1628 0%, #1e2a4a 50%, #0a1628 100%)',
    buttonGradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    hoverColor: '#dbeafe',
    textColor: '#ffffff'
  },
  rose_magic: {
    name: 'Rose Magic',
    icon: '🌸',
    primary: '#500724',
    secondary: '#ec4899',
    accent: '#fce7f3',
    dark: '#3a0a17',
    light: '#831843',
    border: '#ec4899',
    bgGradient: 'linear-gradient(135deg, #500724 0%, #831843 50%, #be185d 100%)',
    buttonGradient: 'linear-gradient(135deg, #be185d 0%, #ec4899 100%)',
    hoverColor: '#fce7f3',
    textColor: '#ffffff'
  },
  lavender_dream: {
    name: 'Lavender Dream',
    icon: '💜',
    primary: '#4c1d95',
    secondary: '#a78bfa',
    accent: '#ede9fe',
    dark: '#2d1047',
    light: '#7c3aed',
    border: '#a78bfa',
    bgGradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)',
    buttonGradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    hoverColor: '#ede9fe',
    textColor: '#ffffff'
  },
  coral_sunset: {
    name: 'Coral Sunset',
    icon: '🪸',
    primary: '#881337',
    secondary: '#fb7185',
    accent: '#ffe4e6',
    dark: '#5a0a1f',
    light: '#be185d',
    border: '#fb7185',
    bgGradient: 'linear-gradient(135deg, #881337 0%, #be185d 50%, #fb7185 100%)',
    buttonGradient: 'linear-gradient(135deg, #be185d 0%, #fb7185 100%)',
    hoverColor: '#ffe4e6',
    textColor: '#ffffff'
  },
  peach_cream: {
    name: 'Peach Cream',
    icon: '🍑',
    primary: '#92400e',
    secondary: '#fb923c',
    accent: '#ffedd5',
    dark: '#5a2505',
    light: '#c2410c',
    border: '#fb923c',
    bgGradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #fb923c 100%)',
    buttonGradient: 'linear-gradient(135deg, #c2410c 0%, #fb923c 100%)',
    hoverColor: '#ffedd5',
    textColor: '#ffffff'
  },
  emerald_forest: {
    name: 'Emerald Forest',
    icon: '🌿',
    primary: '#022c22',
    secondary: '#10b981',
    accent: '#d1fae5',
    dark: '#001f17',
    light: '#064e3b',
    border: '#10b981',
    bgGradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #10b981 100%)',
    buttonGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    hoverColor: '#d1fae5',
    textColor: '#ffffff'
  },
  ocean_cyan: {
    name: 'Ocean Cyan',
    icon: '🌊',
    primary: '#0c4a6e',
    secondary: '#06b6d4',
    accent: '#cffafe',
    dark: '#061f28',
    light: '#0369a1',
    border: '#06b6d4',
    bgGradient: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #06b6d4 100%)',
    buttonGradient: 'linear-gradient(135deg, #0369a1 0%, #06b6d4 100%)',
    hoverColor: '#cffafe',
    textColor: '#ffffff'
  },
  sunset_orange: {
    name: 'Sunset Orange',
    icon: '🌅',
    primary: '#7c2d12',
    secondary: '#f97316',
    accent: '#fed7aa',
    dark: '#431407',
    light: '#c2410c',
    border: '#f97316',
    bgGradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #f97316 100%)',
    buttonGradient: 'linear-gradient(135deg, #c2410c 0%, #f97316 100%)',
    hoverColor: '#fed7aa',
    textColor: '#ffffff'
  },
  mint_fresh: {
    name: 'Mint Fresh',
    icon: '🍃',
    primary: '#064e3b',
    secondary: '#14b8a6',
    accent: '#ccfbf1',
    dark: '#031f1a',
    light: '#0d9488',
    border: '#14b8a6',
    bgGradient: 'linear-gradient(135deg, #064e3b 0%, #0d9488 50%, #14b8a6 100%)',
    buttonGradient: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
    hoverColor: '#ccfbf1',
    textColor: '#ffffff'
  },
  blueberry: {
    name: 'Blueberry',
    icon: '🫐',
    primary: '#1e3a8a',
    secondary: '#3b82f6',
    accent: '#dbeafe',
    dark: '#0f1729',
    light: '#1e40af',
    border: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
    buttonGradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    hoverColor: '#dbeafe',
    textColor: '#ffffff'
  },
  amber_fire: {
    name: 'Amber Fire',
    icon: '🔥',
    primary: '#78350f',
    secondary: '#f59e0b',
    accent: '#fef3c7',
    dark: '#3f1d06',
    light: '#b45309',
    border: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)',
    buttonGradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
    hoverColor: '#fef3c7',
    textColor: '#ffffff'
  },
  violet_dark: {
    name: 'Violet Dark',
    icon: '⚫',
    primary: '#2e1065',
    secondary: '#7c3aed',
    accent: '#ede9fe',
    dark: '#1a0a3e',
    light: '#5b21b6',
    border: '#7c3aed',
    bgGradient: 'linear-gradient(135deg, #2e1065 0%, #5b21b6 50%, #7c3aed 100%)',
    buttonGradient: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
    hoverColor: '#ede9fe',
    textColor: '#ffffff'
  },
  slate_pro: {
    name: 'Slate Pro',
    icon: '💼',
    primary: '#1e293b',
    secondary: '#64748b',
    accent: '#f1f5f9',
    dark: '#0f172a',
    light: '#334155',
    border: '#64748b',
    bgGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
    buttonGradient: 'linear-gradient(135deg, #334155 0%, #64748b 100%)',
    hoverColor: '#e2e8f0',
    textColor: '#ffffff'
  },
  jade_green: {
    name: 'Jade Green',
    icon: '💚',
    primary: '#0a5f4a',
    secondary: '#2dd4bf',
    accent: '#ccfbf1',
    dark: '#032f28',
    light: '#0d9488',
    border: '#2dd4bf',
    bgGradient: 'linear-gradient(135deg, #0a5f4a 0%, #0d9488 50%, #2dd4bf 100%)',
    buttonGradient: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)',
    hoverColor: '#ccfbf1',
    textColor: '#ffffff'
  },
};

const FONT_DISPLAY = "'Didot', 'Bodoni 72', 'Bodoni MT', 'Playfair Display', Georgia, serif";
const FONT_BODY = "'Helvetica Neue', 'Helvetica', 'Arial', system-ui, sans-serif";
const FONT_MONO = "'SF Mono', 'Monaco', 'Consolas', 'Courier New', monospace";

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

const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
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
          const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
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

const hasUnlocked = (student, design, transactions) => {
  if (design.tier === 'basic') return true;
  const totalEarned = (transactions || []).filter(t => t.studentId === student.id && t.amount > 0).reduce((s, t) => s + t.amount, 0);
  return totalEarned >= (design.minBalance || 0);
};

export default function App() {
  const [view, setView] = useState('home');
  const [globalTheme, setGlobalTheme] = useState('black_gold');
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [studentCode, setStudentCode] = useState('');
  const [studentPin, setStudentPin] = useState('');
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [teacherPass, setTeacherPass] = useState('');
  const [teacherAuth, setTeacherAuth] = useState(false);
  const [teacherError, setTeacherError] = useState('');

  const activeTheme = GLOBAL_THEMES[globalTheme];

  useEffect(() => {
    const unsubscribe = subscribeToData((newData) => {
      const safeData = {
        students: newData?.students || [],
        transactions: newData?.transactions || [],
        bonusRequests: newData?.bonusRequests || [],
        centralBank: newData?.centralBank || { balance: 0, name: 'P4 Central Bank' }
      };
      setData(safeData);
      setLoading(false);
    });
    
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (view === 'teacher' && !teacherAuth) setView('teacher-login');
  }, [view, teacherAuth]);

  useEffect(() => {
    if (currentStudent && data.students && data.students.length > 0) {
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
    
    if (!student.pin) {
      if (studentPin.length !== 4 || !/^\d{4}$/.test(studentPin)) {
        setLoginError('Create a 4-digit PIN for first login.');
        return;
      }
      const updated = { ...data, students: data.students.map(s => s.id === student.id ? { ...s, pin: studentPin, theme: globalTheme } : s) };
      saveData(updated);
      const updatedStudent = { ...student, pin: studentPin, theme: globalTheme };
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

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{background: activeTheme.bgGradient, color: activeTheme.accent}}><div className="text-xl" style={{fontFamily: FONT_BODY}}>Loading...</div></div>;

  if (view === 'home') return <HomeView setView={setView} globalTheme={globalTheme} setGlobalTheme={setGlobalTheme} />;
  if (view === 'teacher-login') return <TeacherLoginView teacherPass={teacherPass} setTeacherPass={setTeacherPass} handleLogin={handleTeacherLogin} error={teacherError} setView={setView} globalTheme={globalTheme} setGlobalTheme={setGlobalTheme} />;
  if (view === 'teacher' && teacherAuth) return <TeacherView data={data} saveData={saveData} setView={setView} onLogout={() => { setTeacherAuth(false); setView('home'); }} globalTheme={globalTheme} setGlobalTheme={setGlobalTheme} />;
  if (view === 'student-login') return <StudentLoginView studentCode={studentCode} setStudentCode={setStudentCode} studentPin={studentPin} setStudentPin={setStudentPin} handleLogin={handleStudentLogin} loginError={loginError} setView={setView} students={data.students || []} globalTheme={globalTheme} setGlobalTheme={setGlobalTheme} />;
  if (view === 'student' && currentStudent) return <StudentView student={currentStudent} data={data} saveData={saveData} onLogout={() => { setCurrentStudent(null); setView('home'); }} globalTheme={globalTheme} setGlobalTheme={setGlobalTheme} />;
  
  return <HomeView setView={setView} globalTheme={globalTheme} setGlobalTheme={setGlobalTheme} />;
}

// ===== HOME VIEW =====
function HomeView({ setView, globalTheme, setGlobalTheme }) {
  const theme = GLOBAL_THEMES[globalTheme];
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{fontFamily: FONT_BODY, background: theme.bgGradient}}>
      <div className="absolute top-4 right-4 z-20">
        <ThemeSelector globalTheme={globalTheme} setGlobalTheme={setGlobalTheme} />
      </div>

      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full" style={{background: `radial-gradient(circle, ${theme.secondary} 0%, transparent 70%)`}}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full" style={{background: `radial-gradient(circle, ${theme.secondary} 0%, transparent 70%)`}}></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-12">
          <Globe className="mx-auto mb-4" size={48} style={{color: theme.secondary}} />
          <div className="text-xs tracking-[0.5em] mb-3" style={{color: theme.secondary}}>EST. 2022</div>
          <h1 className="text-5xl md:text-7xl font-bold mb-3" style={{fontFamily: FONT_DISPLAY, color: theme.secondary, letterSpacing: '0.02em'}}>P4 Central Bank</h1>
          <div className="h-px w-32 mx-auto mb-4" style={{background: `linear-gradient(90deg, transparent, ${theme.secondary}, transparent)`}}></div>
          <p className="italic text-sm tracking-widest" style={{color: theme.accent}}>ISSUED BY PROFESSOR TOMÁS URBINA</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <button onClick={() => setView('teacher-login')} className="relative p-8 transition-all hover:scale-105 group overflow-hidden border-2" style={{borderColor: theme.secondary, background: theme.light}}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition" style={{background: `radial-gradient(circle, ${theme.secondary}, transparent)`}}></div>
            <div className="relative z-10">
              <Building2 size={40} className="mx-auto mb-3" style={{color: theme.secondary}} />
              <div className="text-xs tracking-[0.3em] mb-1" style={{color: theme.secondary}}>ADMIN ACCESS</div>
              <div className="text-2xl font-bold" style={{fontFamily: FONT_DISPLAY, color: theme.accent}}>PROFESSOR</div>
              <div className="text-xs mt-2" style={{color: theme.accent}}>Manage accounts</div>
            </div>
          </button>

          <button onClick={() => setView('student-login')} className="relative p-8 transition-all hover:scale-105 group overflow-hidden border-2" style={{borderColor: theme.secondary, background: theme.light}}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition" style={{background: `radial-gradient(circle, ${theme.secondary}, transparent)`}}></div>
            <div className="relative z-10">
              <CreditCard size={40} className="mx-auto mb-3" style={{color: theme.secondary}} />
              <div className="text-xs tracking-[0.3em] mb-1" style={{color: theme.secondary}}>CLIENT ACCESS</div>
              <div className="text-2xl font-bold" style={{fontFamily: FONT_DISPLAY, color: theme.accent}}>STUDENT</div>
              <div className="text-xs mt-2" style={{color: theme.accent}}>View your card</div>
            </div>
          </button>
        </div>

        <div className="mt-8 border p-3 text-xs text-center italic" style={{background: theme.dark, borderColor: theme.border, color: theme.accent}}>
          Secure banking system. Use your access code or professor credentials to sign in.
        </div>
      </div>
    </div>
  );
}

// ===== THEME SELECTOR (para todas las vistas) =====
function ThemeSelector({ globalTheme, setGlobalTheme }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 rounded border-2 hover:scale-110 transition" style={{borderColor: GLOBAL_THEMES[globalTheme].secondary, color: GLOBAL_THEMES[globalTheme].secondary}}>
        <Palette size={20} />
      </button>

      {open && (
        <div className="absolute top-12 right-0 bg-white rounded-lg border-2 p-3 grid grid-cols-3 gap-2 max-w-xs z-50" style={{borderColor: GLOBAL_THEMES[globalTheme].secondary}}>
          {Object.entries(GLOBAL_THEMES).map(([id, t]) => (
            <button key={id} onClick={() => {setGlobalTheme(id); setOpen(false);}} className="p-2 rounded text-center text-xs font-bold border-2 hover:scale-105 transition" style={{background: t.bgGradient, borderColor: id === globalTheme ? t.secondary : 'transparent', color: t.accent}} title={t.name}>
              {t.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== TEACHER LOGIN =====
function TeacherLoginView({ teacherPass, setTeacherPass, handleLogin, error, setView, globalTheme, setGlobalTheme }) {
  const theme = GLOBAL_THEMES[globalTheme];
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{fontFamily: FONT_BODY, background: theme.bgGradient}}>
      <div className="absolute top-4 right-4">
        <ThemeSelector globalTheme={globalTheme} setGlobalTheme={setGlobalTheme} />
      </div>

      <div className="max-w-md w-full">
        <button onClick={() => setView('home')} className="mb-6 text-sm" style={{color: theme.secondary}}>← Back</button>
        <div className="border-2 p-8" style={{borderColor: theme.secondary, background: theme.dark}}>
          <Lock size={48} className="mx-auto mb-4" style={{color: theme.secondary}} />
          <h2 className="text-2xl font-bold text-center mb-2" style={{fontFamily: FONT_DISPLAY, color: theme.accent}}>Professor Access</h2>
          <p className="text-sm text-center mb-6" style={{color: theme.accent}}>Enter your password</p>
          <input type="password" value={teacherPass} onChange={(e) => setTeacherPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} placeholder="Password" className="w-full px-4 py-3 border-2 outline-none" style={{borderColor: theme.secondary, background: theme.primary, color: theme.accent}} />
          {error && <div className="text-red-400 text-sm mt-3 text-center">{error}</div>}
          <button onClick={handleLogin} className="w-full mt-4 py-3 font-bold tracking-widest" style={{background: theme.buttonGradient, color: theme.textColor}}>SIGN IN</button>
        </div>
      </div>
    </div>
  );
}

// ===== STUDENT LOGIN =====
function StudentLoginView({ studentCode, setStudentCode, studentPin, setStudentPin, handleLogin, loginError, setView, students, globalTheme, setGlobalTheme }) {
  const theme = GLOBAL_THEMES[globalTheme];
  const codeExists = students && students.find(s => s.accessCode === studentCode.trim().toUpperCase());
  const isFirstTime = codeExists && !codeExists.pin;
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{fontFamily: FONT_BODY, background: theme.bgGradient}}>
      <div className="absolute top-4 right-4">
        <ThemeSelector globalTheme={globalTheme} setGlobalTheme={setGlobalTheme} />
      </div>

      <div className="max-w-md w-full">
        <button onClick={() => setView('home')} className="mb-6 text-sm" style={{color: theme.secondary}}>← Back</button>
        <div className="border-2 p-8" style={{borderColor: theme.secondary, background: theme.dark}}>
          <CreditCard size={48} className="mx-auto mb-4" style={{color: theme.secondary}} />
          <h2 className="text-2xl font-bold text-center mb-2" style={{fontFamily: FONT_DISPLAY, color: theme.accent}}>Student Access</h2>
          <p className="text-sm text-center mb-6" style={{color: theme.accent}}>Enter your code and PIN</p>
          
          <label className="block text-xs tracking-widest mb-1 font-bold" style={{color: theme.secondary}}>ACCESS CODE</label>
          <input type="text" value={studentCode} onChange={(e) => setStudentCode(e.target.value.toUpperCase())} placeholder="EX: A3K9P2" maxLength={6} className="w-full px-4 py-2 border-2 text-center text-xl font-mono tracking-[0.4em] outline-none mb-3" style={{borderColor: theme.secondary, background: theme.primary, color: theme.accent}} />
          
          <label className="block text-xs tracking-widest mb-1 font-bold" style={{color: theme.secondary}}>
            {isFirstTime ? 'CREATE 4-DIGIT PIN (FIRST LOGIN)' : '4-DIGIT PIN'}
          </label>
          <input type="password" value={studentPin} onChange={(e) => setStudentPin(e.target.value.replace(/\D/g, '').slice(0,4))} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} placeholder="••••" maxLength={4} className="w-full px-4 py-2 border-2 text-center text-2xl font-mono tracking-[0.6em] outline-none" style={{borderColor: theme.secondary, background: theme.primary, color: theme.accent}} />
          
          {isFirstTime && <div className="mt-2 text-xs text-center italic" style={{color: theme.accent}}>Welcome! Choose a PIN you'll remember.</div>}
          {loginError && <div className="text-red-400 text-sm mt-3 text-center">{loginError}</div>}
          <button onClick={handleLogin} className="w-full mt-4 py-3 font-bold tracking-widest" style={{background: theme.buttonGradient, color: theme.textColor}}>SIGN IN</button>
          <p className="text-xs italic text-center mt-4" style={{color: theme.accent}}>Forgot your PIN? Ask your professor to reset it.</p>
        </div>
      </div>
    </div>
  );
}

// ===== STUDENT VIEW (simplificada para la demostración) =====
function StudentView({ student, data, saveData, onLogout, globalTheme, setGlobalTheme }) {
  const theme = GLOBAL_THEMES[globalTheme];
  const [showCard, setShowCard] = useState(true);

  return (
    <div className="min-h-screen p-4" style={{fontFamily: FONT_BODY, background: theme.bgGradient}}>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-xs tracking-widest" style={{color: theme.secondary}}>WELCOME</div>
            <div className="text-2xl font-bold" style={{fontFamily: FONT_DISPLAY, color: theme.accent, letterSpacing: '0.02em'}}>{student.displayName || student.name}</div>
          </div>
          <div className="flex gap-2">
            <ThemeSelector globalTheme={globalTheme} setGlobalTheme={setGlobalTheme} />
            <button onClick={onLogout} className="p-2 border-2" style={{borderColor: theme.secondary, color: theme.secondary}}><LogOut size={18} /></button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg mb-4 text-center border-2" style={{borderColor: theme.secondary}}>
          <div style={{color: theme.primary}}>Balance: <span style={{color: theme.secondary, fontWeight: 'bold'}}>{formatMoney(student.balance)}</span></div>
        </div>

        <button onClick={() => setShowCard(!showCard)} className="w-full py-2 border-2 text-sm font-bold" style={{borderColor: theme.secondary, background: theme.dark, color: theme.accent}}>
          {showCard ? 'HIDE' : 'SHOW'} BALANCE
        </button>

        <p className="text-center mt-8" style={{color: theme.accent}}>✅ Theme sistema está funcionando en toda la app</p>
      </div>
    </div>
  );
}

// ===== TEACHER VIEW (simplificada) =====
function TeacherView({ data, saveData, setView, onLogout, globalTheme, setGlobalTheme }) {
  const theme = GLOBAL_THEMES[globalTheme];
  
  return (
    <div style={{fontFamily: FONT_BODY, background: theme.bgGradient, minHeight: '100vh'}}>
      <header className="border-b-4 p-4" style={{borderColor: theme.secondary, background: theme.dark}}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <button onClick={onLogout} className="text-sm mb-1" style={{color: theme.secondary}}>← Sign out</button>
            <div className="text-xs tracking-[0.3em]" style={{color: theme.secondary}}>ADMINISTRATIVE PANEL</div>
            <h1 className="text-2xl font-bold" style={{fontFamily: FONT_DISPLAY, color: theme.secondary}}>P4 Central Bank</h1>
          </div>
          <ThemeSelector globalTheme={globalTheme} setGlobalTheme={setGlobalTheme} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4" style={{color: theme.secondary, fontFamily: FONT_DISPLAY}}>Students: {data.students.length}</h2>
        <p style={{color: theme.accent}}>✅ Tema global está aplicado a todo: landing, professor panel, student view.</p>
      </main>
    </div>
  );
}
