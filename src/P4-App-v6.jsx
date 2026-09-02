import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Trash2, Trophy, Download, UserPlus, History, X, TrendingUp, TrendingDown, CreditCard, LogOut, Copy, Eye, EyeOff, Users, Send, Check, Sparkles, Lock, ShoppingCart, Building2, Clock, CheckCircle, XCircle, Upload, Image as ImageIcon, KeyRound, RotateCcw, Home, Gift, Crown, WalletCards, User, Bell, ChevronRight, Medal, ArrowUpRight, ArrowDownLeft, Zap, Star, Gem, Activity, Search, Snowflake, Ban } from 'lucide-react';
import { saveBankData, subscribeToData } from './firebase';

const TEACHER_PASSWORD = 'urbina2026';
const CENTRAL_BANK_ID = 'CENTRAL_BANK';
const CLASS_CODE = 'RRII2026';
const CURRENCY_NAME = 'IGOs';

// Default data structure - SIEMPRE tiene estos campos
const DEFAULT_DATA = {
  students: [],
  transactions: [],
  bonusRequests: [],
  payRequests: [],
  settings: { selfSignup: true },
  centralBank: { balance: 0, name: 'P4 Central Bank' }
};

// Premium visual systems for the student experience.
// Each palette keeps money/status accents restrained so the interface feels more like a modern members club than a game.

const STUDENT_THEMES = {
  imperial_blue: {
    name: 'Imperial Blue', eyebrow: 'PRIVATE BANK',
    primary: '#315BFF', secondary: '#6685FF', accent: '#F5F7FC', money: '#D9C08A',
    surface: '#0D1730', surface2: '#111D3A', muted: '#9AA7BD', success: '#55D6A7', danger: '#FF6B7D',
    border: 'rgba(49,91,255,.22)', glow: 'rgba(49,91,255,.20)',
    bgGradient: 'radial-gradient(circle at 85% 6%, rgba(49,91,255,.20), transparent 32%), radial-gradient(circle at 4% 74%, rgba(20,40,110,.18), transparent 34%), linear-gradient(180deg, #050810 0%, #081020 48%, #050810 100%)'
  },
  midnight_plum: {
    name: 'Midnight Plum', eyebrow: 'FASHION TECH',
    primary: '#A66BFF', secondary: '#D2B6FF', accent: '#F6F2FA', money: '#D9BE88',
    surface: '#120E17', surface2: '#191220', muted: '#8F8499', success: '#62D9B0', danger: '#F07682',
    border: 'rgba(166,107,255,.24)', glow: 'rgba(132,72,255,.18)',
    bgGradient: 'radial-gradient(circle at 86% 8%, rgba(128,67,212,.22), transparent 30%), radial-gradient(circle at 0% 70%, rgba(82,31,117,.14), transparent 32%), linear-gradient(180deg, #070509 0%, #0B0810 45%, #060507 100%)'
  },
  private_club: {
    name: 'Private Club', eyebrow: 'MEMBERS CLUB',
    primary: '#C39B63', secondary: '#E0C28E', accent: '#F3ECE2', money: '#D8B16E',
    surface: '#15110F', surface2: '#201714', muted: '#9D8C80', success: '#6FC8A6', danger: '#D96D72',
    border: 'rgba(195,155,99,.23)', glow: 'rgba(111,35,49,.20)',
    bgGradient: 'radial-gradient(circle at 85% 10%, rgba(113,42,52,.24), transparent 30%), radial-gradient(circle at 4% 72%, rgba(88,48,31,.16), transparent 34%), linear-gradient(180deg, #090807 0%, #100C0A 52%, #070706 100%)'
  },
  obsidian_cobalt: {
    name: 'Obsidian Cobalt', eyebrow: 'MODERN FINTECH',
    primary: '#5B70FF', secondary: '#98A4FF', accent: '#F4F6FB', money: '#DFC27E',
    surface: '#0F131C', surface2: '#151B28', muted: '#8993A8', success: '#55D6AA', danger: '#F27480',
    border: 'rgba(91,112,255,.25)', glow: 'rgba(55,87,255,.20)',
    bgGradient: 'radial-gradient(circle at 88% 8%, rgba(51,76,255,.22), transparent 30%), radial-gradient(circle at 0% 75%, rgba(29,54,124,.15), transparent 35%), linear-gradient(180deg, #06080C 0%, #0A0E15 48%, #05070A 100%)'
  },
  titanium: {
    name: 'Titanium', eyebrow: 'MINIMAL LUXURY',
    primary: '#E7E4DC', secondary: '#AEB7C6', accent: '#F7F6F2', money: '#CEAE6E',
    surface: '#111316', surface2: '#181B20', muted: '#8A909A', success: '#64CFAB', danger: '#E87680',
    border: 'rgba(220,224,232,.15)', glow: 'rgba(148,165,202,.12)',
    bgGradient: 'radial-gradient(circle at 84% 8%, rgba(126,142,176,.14), transparent 28%), linear-gradient(180deg, #070809 0%, #0C0E11 48%, #060708 100%)'
  },
  // Legacy ids kept so existing student records continue to render without migration.
  black_gold: {
    name: 'Private Club', eyebrow: 'MEMBERS CLUB', primary: '#C39B63', secondary: '#E0C28E', accent: '#F3ECE2', money: '#D8B16E',
    surface: '#15110F', surface2: '#201714', muted: '#9D8C80', success: '#6FC8A6', danger: '#D96D72',
    border: 'rgba(195,155,99,.23)', glow: 'rgba(111,35,49,.20)',
    bgGradient: 'radial-gradient(circle at 85% 10%, rgba(113,42,52,.24), transparent 30%), linear-gradient(180deg, #090807 0%, #100C0A 52%, #070706 100%)'
  },
  midnight: {
    name: 'Obsidian Cobalt', eyebrow: 'MODERN FINTECH', primary: '#5B70FF', secondary: '#98A4FF', accent: '#F4F6FB', money: '#DFC27E',
    surface: '#0F131C', surface2: '#151B28', muted: '#8993A8', success: '#55D6AA', danger: '#F27480',
    border: 'rgba(91,112,255,.25)', glow: 'rgba(55,87,255,.20)',
    bgGradient: 'radial-gradient(circle at 88% 8%, rgba(51,76,255,.22), transparent 30%), linear-gradient(180deg, #06080C 0%, #0A0E15 48%, #05070A 100%)'
  },
};

const FONT_DISPLAY = "'Cormorant Garamond', 'Didot', 'Bodoni 72', Georgia, serif";
const FONT_BODY = "'Manrope', 'Helvetica Neue', Arial, system-ui, sans-serif";
const FONT_MONO = "'Space Mono', 'SF Mono', 'Monaco', 'Consolas', monospace";

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

const MEMBER_LEVELS = [
  { key: 'member',   name: 'Member',   min: 0,      icon: Star },
  { key: 'silver',   name: 'Silver',   min: 10000,  icon: Medal },
  { key: 'gold',     name: 'Gold',     min: 25000,  icon: Trophy },
  { key: 'platinum', name: 'Platinum', min: 50000,  icon: Sparkles },
  { key: 'diamond',  name: 'Diamond',  min: 100000, icon: Gem },
  { key: 'p4black',  name: 'P4 Black', min: 175000, icon: Crown }
];

const getMemberStatus = (totalEarned) => {
  const currentIndex = MEMBER_LEVELS.reduce((best, level, index) => totalEarned >= level.min ? index : best, 0);
  const current = MEMBER_LEVELS[currentIndex];
  const next = MEMBER_LEVELS[currentIndex + 1] || null;
  const progress = next ? Math.max(0, Math.min(100, ((totalEarned - current.min) / (next.min - current.min)) * 100)) : 100;
  return { ...current, next, progress };
};

const shortDate = (value) => {
  const date = new Date(value);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

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

const hasUnlocked = (student, design, transactions) => {
  if (design.tier === 'basic') return true;
  const totalEarned = transactions.filter(t => t.studentId === student.id && t.amount > 0).reduce((s, t) => s + t.amount, 0);
  return totalEarned >= (design.minBalance || 0);
};

// ===== MAIN APP COMPONENT =====
const P4_ANIM = `
@keyframes p4fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes p4pop { 0% { transform: scale(.86); opacity: 0 } 60% { transform: scale(1.03); opacity: 1 } 100% { transform: scale(1); opacity: 1 } }
`;

export default function App() {
  const [view, setView] = useState('home');
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [studentCode, setStudentCode] = useState('');
  const [studentPin, setStudentPin] = useState('');
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [teacherPass, setTeacherPass] = useState('');
  const [teacherAuth, setTeacherAuth] = useState(false);
  const [teacherError, setTeacherError] = useState('');
  const [suName, setSuName] = useState('');
  const [suCode, setSuCode] = useState('');
  const [suPin, setSuPin] = useState('');
  const [suError, setSuError] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [toastKind, setToastKind] = useState('ok');
  const toastTimer = useRef();

  const toast = (msg, kind = 'ok') => {
    setToastMsg(msg); setToastKind(kind);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(''), 2600);
  };

  useEffect(() => {
    // Subscribe to Firebase real-time updates with safety checks
    const unsubscribe = subscribeToData((newData) => {
      // Ensure all required fields exist
      const safeData = {
        students: newData?.students || [],
        transactions: newData?.transactions || [],
        bonusRequests: newData?.bonusRequests || [],
        payRequests: newData?.payRequests || [],
        settings: newData?.settings || { selfSignup: true },
        centralBank: newData?.centralBank || { balance: 0, name: 'P4 Central Bank' }
      };
      setData(safeData);
      setLoading(false);
    });
    
    // Set timeout to show app even if Firebase fails
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
      toast('Could not save. Check your connection.', 'bad');
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

  const handleSignup = async () => {
    setSuError('');
    const name = suName.trim();
    if (name.length < 3) { setSuError('Enter your full name.'); return; }
    if (suCode.trim().toUpperCase() !== CLASS_CODE) { setSuError('Incorrect class code.'); return; }
    if (!/^\d{4}$/.test(suPin)) { setSuError('Create a 4-digit PIN.'); return; }
    if ((data.students || []).some(s => (s.name || '').trim().toLowerCase() === name.toLowerCase())) {
      setSuError('An account with that name already exists. Sign in with your code.'); return;
    }
    let access;
    do { access = generateAccessCode(); } while ((data.students || []).some(s => s.accessCode === access));
    const t = new Date();
    const fresh = {
      id: Date.now().toString(), name, displayName: name, balance: 0,
      cardNumber: generateCardNumber(), cvv: generateCVV(),
      validThru: `${String(t.getMonth() + 1).padStart(2, '0')}/${String((t.getFullYear() + 4) % 100).padStart(2, '0')}`,
      accessCode: access, cardDesign: 'emerald', pin: suPin, theme: 'imperial_blue',
      reservedBalance: 0, frozen: false, sanctioned: false
    };
    const ok = await saveData({ ...data, students: [...(data.students || []), fresh] });
    if (!ok) { setSuError('Could not create the account.'); return; }
    setCurrentStudent(fresh);
    setView('student');
    setSuName(''); setSuCode(''); setSuPin('');
    toast(`Account created. Your code is ${access}`);
  };

  const handleTeacherLogin = () => {
    if (teacherPass === TEACHER_PASSWORD) {
      setTeacherAuth(true); setTeacherError('');
      setView('teacher'); setTeacherPass('');
    } else setTeacherError('Incorrect password.');
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-amber-400 text-xl" style={{fontFamily: FONT_BODY}}>Loading...</div></div>;

  const selfSignup = data.settings?.selfSignup !== false;

  const screen = () => {
    if (view === 'teacher-login') return <TeacherLoginView teacherPass={teacherPass} setTeacherPass={setTeacherPass} handleLogin={handleTeacherLogin} error={teacherError} setView={setView} />;
    if (view === 'teacher' && teacherAuth) return <TeacherView data={data} saveData={saveData} setView={setView} toast={toast} onLogout={() => { setTeacherAuth(false); setView('home'); }} />;
    if (view === 'student-login') return <StudentLoginView studentCode={studentCode} setStudentCode={setStudentCode} studentPin={studentPin} setStudentPin={setStudentPin} handleLogin={handleStudentLogin} loginError={loginError} setView={setView} students={data.students || []} />;
    if (view === 'signup' && selfSignup) return <SignupView name={suName} setName={setSuName} classCode={suCode} setClassCode={setSuCode} pin={suPin} setPin={setSuPin} handleSignup={handleSignup} error={suError} setView={setView} />;
    if (view === 'student' && currentStudent) return <StudentView student={currentStudent} data={data} saveData={saveData} toast={toast} onLogout={() => { setCurrentStudent(null); setView('home'); }} />;
    return <HomeView setView={setView} selfSignup={selfSignup} />;
  };

  return (
    <>
      <style>{P4_ANIM}</style>
      <Toast msg={toastMsg} kind={toastKind} />
      {screen()}
    </>
  );
}

function Toast({ msg, kind }) {
  if (!msg) return null;
  return (
    <div style={{
      position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 90,
      background: '#161018', border: `1px solid ${kind === 'bad' ? 'rgba(255,138,150,.45)' : 'rgba(255,255,255,.14)'}`,
      borderRadius: 14, padding: '12px 18px', color: kind === 'bad' ? '#FF8A96' : '#F3EFF7',
      fontSize: 14, maxWidth: '90vw', textAlign: 'center', fontFamily: FONT_BODY,
      boxShadow: '0 18px 50px rgba(0,0,0,.55)'
    }}>{msg}</div>
  );
}

// ============= HOME =============
function Avatar({ student, size = 40, ring }) {
  const initials = String(student?.displayName || student?.name || '?')
    .split(' ').filter(Boolean).map(x => x[0]).slice(0, 2).join('').toUpperCase();
  const base = {
    width: size, height: size, borderRadius: size / 2, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: `1px solid ${ring || 'rgba(255,255,255,.16)'}`, overflow: 'hidden'
  };
  if (student?.profilePhoto) {
    return <div style={{ ...base, backgroundImage: `url(${student.profilePhoto})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />;
  }
  return (
    <div style={{ ...base, background: 'rgba(49,91,255,.16)', color: '#C9D6FF', fontSize: Math.max(10, size * 0.34), fontWeight: 600 }}>
      {initials}
    </div>
  );
}

function BrandMark({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`${compact ? 'w-9 h-9 text-sm' : 'w-12 h-12 text-lg'} rounded-2xl border flex items-center justify-center font-bold tracking-[-0.08em]`} style={{borderColor:'rgba(217,190,136,.45)', color:'#E4C78A', background:'linear-gradient(145deg, rgba(255,255,255,.08), rgba(255,255,255,.01))', boxShadow:'inset 0 1px 0 rgba(255,255,255,.08)'}}>P4</div>
      <div>
        <div className={`${compact ? 'text-sm' : 'text-lg'} tracking-[0.22em] text-white font-semibold`}>P4 RESERVE</div>
      </div>
    </div>
  );
}

function HomeView({ setView, selfSignup }) {
  return (
    <div className="min-h-screen relative overflow-hidden text-white" style={{fontFamily: FONT_BODY, background:'radial-gradient(circle at 84% 6%, rgba(103,58,183,.20), transparent 30%), #060609'}}>
      <div className="max-w-md mx-auto min-h-screen px-6 py-8 flex flex-col relative z-10">
        <BrandMark />

        <div className="flex-1 flex flex-col justify-center">
          <button onClick={() => setView('student-login')} className="w-full rounded-[20px] p-4 mb-3 flex items-center gap-3 border transition-all hover:-translate-y-0.5" style={{background:'linear-gradient(145deg, rgba(132,77,255,.15), rgba(255,255,255,.025))', borderColor:'rgba(157,109,255,.28)'}}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'#A66BFF', color:'#100A16'}}><WalletCards size={18}/></div>
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold">Student</div>
              <div className="text-[11px] text-white/38">Sign in with your code</div>
            </div>
            <ChevronRight size={15} className="text-white/30"/>
          </button>

          {selfSignup && (
            <button onClick={() => setView('signup')} className="w-full rounded-[20px] p-4 mb-3 flex items-center gap-3 border transition-all hover:-translate-y-0.5" style={{background:'rgba(255,255,255,.03)', borderColor:'rgba(255,255,255,.10)'}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{borderColor:'rgba(217,190,136,.30)', color:'#D9BE88'}}><UserPlus size={18}/></div>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold">Open an account</div>
                <div className="text-[11px] text-white/38">Class code required</div>
              </div>
              <ChevronRight size={15} className="text-white/30"/>
            </button>
          )}

          <button onClick={() => setView('teacher-login')} className="w-full rounded-[20px] p-4 flex items-center gap-3 border transition-all hover:-translate-y-0.5" style={{background:'rgba(255,255,255,.02)', borderColor:'rgba(217,190,136,.20)'}}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{borderColor:'rgba(217,190,136,.32)', color:'#D9BE88'}}><Building2 size={18}/></div>
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold text-white/80">Professor</div>
            </div>
            <ChevronRight size={15} className="text-white/25"/>
          </button>
        </div>

        <div className="text-[11px] text-white/25 text-center pt-6">Prof. Tomás Urbina</div>
      </div>
    </div>
  );
}

function SignupView({ name, setName, classCode, setClassCode, pin, setPin, handleSignup, error, setView }) {
  return (
    <div className="min-h-screen text-white flex items-center justify-center px-5" style={{fontFamily: FONT_BODY, background:'radial-gradient(circle at 80% 8%, rgba(103,58,183,.22), transparent 30%), #060609'}}>
      <div className="w-full max-w-sm">
        <button onClick={() => setView('home')} className="text-white/40 text-sm mb-7 hover:text-white/70">Back</button>
        <div className="text-[10px] tracking-[0.34em] text-[#D9BE88] mb-3">MEMBERSHIP REQUEST</div>
        <h2 className="text-3xl font-medium mb-2" style={{fontFamily: FONT_DISPLAY}}>Join the Reserve</h2>
        <p className="text-sm text-white/42 mb-8">Every account opens at 0 IGOs.</p>

        <label className="block text-[10px] tracking-[0.24em] text-white/40 mb-2">FULL NAME</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ana Perez"
          className="w-full rounded-2xl px-4 py-3 mb-4 bg-white/[0.04] border border-white/10 outline-none focus:border-[#A66BFF] text-white placeholder-white/25" />

        <label className="block text-[10px] tracking-[0.24em] text-white/40 mb-2">CLASS CODE</label>
        <input value={classCode} onChange={(e) => setClassCode(e.target.value.toUpperCase())} placeholder="RRII2026"
          className="w-full rounded-2xl px-4 py-3 mb-4 bg-white/[0.04] border border-white/10 outline-none focus:border-[#A66BFF] text-white text-center tracking-[0.24em] placeholder-white/25" style={{fontFamily: FONT_MONO}} />

        <label className="block text-[10px] tracking-[0.24em] text-white/40 mb-2">CREATE 4-DIGIT PIN</label>
        <input type="password" inputMode="numeric" value={pin} maxLength={4}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="0000"
          className="w-full rounded-2xl px-4 py-3 bg-white/[0.04] border border-white/10 outline-none focus:border-[#A66BFF] text-white text-center text-2xl tracking-[0.5em] placeholder-white/20" style={{fontFamily: FONT_MONO}} />

        {error && <div className="text-[#FF8A96] text-sm mt-4">{error}</div>}
        <button onClick={handleSignup} className="w-full mt-6 rounded-2xl py-3.5 font-semibold" style={{background:'#A66BFF', color:'#100A16'}}>Create account</button>
      </div>
    </div>
  );
}

function TeacherLoginView({ teacherPass, setTeacherPass, handleLogin, error, setView }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-5 text-white" style={{fontFamily:FONT_BODY, background:'radial-gradient(circle at 80% 0%, rgba(195,155,99,.15), transparent 30%), #080706'}}>
      <div className="max-w-sm w-full">
        <button onClick={() => setView('home')} className="text-white/45 mb-7 text-xs flex items-center gap-1">← Back</button>
        <div className="rounded-[28px] border p-7" style={{background:'linear-gradient(150deg, #15110F, #0B0908)', borderColor:'rgba(195,155,99,.25)', boxShadow:'0 32px 90px rgba(0,0,0,.45)'}}>
          <BrandMark compact />
          <div className="mt-10 mb-7">
            <div className="text-[9px] tracking-[0.3em] text-[#C39B63]">PROFESSOR CONSOLE</div>
            <h2 className="text-3xl mt-2" style={{fontFamily:FONT_DISPLAY}}>Private access</h2>
          </div>
          <label className="block text-[9px] tracking-[0.24em] text-white/38 mb-2">PASSWORD</label>
          <input type="password" value={teacherPass} onChange={(e) => setTeacherPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} placeholder="Enter password" className="w-full px-4 py-3.5 rounded-2xl border bg-black/35 text-white outline-none placeholder:text-white/20" style={{borderColor:'rgba(195,155,99,.22)'}} />
          {error && <div className="text-red-300 text-xs mt-3">{error}</div>}
          <button onClick={handleLogin} className="w-full mt-4 rounded-2xl py-3.5 text-sm font-bold tracking-[0.12em]" style={{background:'#C39B63', color:'#120E0B'}}>ENTER CONSOLE</button>
        </div>
      </div>
    </div>
  );
}

// ============= STUDENT LOGIN =============
function StudentLoginView({ studentCode, setStudentCode, studentPin, setStudentPin, handleLogin, loginError, setView, students }) {
  const codeExists = students && students.find(s => s.accessCode === studentCode.trim().toUpperCase());
  const isFirstTime = codeExists && !codeExists.pin;
  return (
    <div className="min-h-screen flex items-center justify-center p-5 text-white" style={{fontFamily:FONT_BODY, background:'radial-gradient(circle at 80% 0%, rgba(139,76,255,.22), transparent 31%), #070509'}}>
      <div className="max-w-sm w-full">
        <button onClick={() => setView('home')} className="text-white/45 mb-7 text-xs">← Back</button>
        <div className="rounded-[28px] border p-7" style={{background:'linear-gradient(150deg, rgba(25,18,32,.96), rgba(9,7,12,.98))', borderColor:'rgba(166,107,255,.25)', boxShadow:'0 32px 90px rgba(44,15,76,.35)'}}>
          <BrandMark compact />
          <div className="mt-10 mb-7">
            <div className="text-[9px] tracking-[0.3em] text-[#B985FF]">MEMBER ACCESS</div>
            <h2 className="text-3xl mt-2" style={{fontFamily:FONT_DISPLAY}}>Welcome back</h2>
            <p className="text-white/35 text-xs mt-2">Use your private access code and PIN.</p>
          </div>
          <label className="block text-[9px] tracking-[0.24em] text-white/38 mb-2">ACCESS CODE</label>
          <input type="text" value={studentCode} onChange={(e) => setStudentCode(e.target.value.toUpperCase())} placeholder="A3K9P2" maxLength={6} className="w-full px-4 py-3 rounded-2xl border bg-black/35 text-white text-center text-lg tracking-[0.36em] outline-none mb-4" style={{fontFamily:FONT_MONO, borderColor:'rgba(166,107,255,.22)'}} />
          <label className="block text-[9px] tracking-[0.24em] text-white/38 mb-2">{isFirstTime ? 'CREATE YOUR 4-DIGIT PIN' : '4-DIGIT PIN'}</label>
          <input type="password" value={studentPin} onChange={(e) => setStudentPin(e.target.value.replace(/\D/g, '').slice(0,4))} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} placeholder="••••" maxLength={4} className="w-full px-4 py-3 rounded-2xl border bg-black/35 text-white text-center text-xl tracking-[0.55em] outline-none" style={{fontFamily:FONT_MONO, borderColor:'rgba(166,107,255,.22)'}} />
          {isFirstTime && <div className="text-[#C7A7FF] text-[11px] mt-3">First login. Choose a PIN you will remember.</div>}
          {loginError && <div className="text-red-300 text-xs mt-3">{loginError}</div>}
          <button onClick={handleLogin} className="w-full mt-5 rounded-2xl py-3.5 text-sm font-bold tracking-[0.12em]" style={{background:'#A66BFF', color:'#120A18'}}>ENTER RESERVE</button>
        </div>
      </div>
    </div>
  );
}

// ============= CREDIT CARD VISUAL =============
function EmvChip({ light }) {
  const line = light ? 'rgba(120,95,40,.78)' : 'rgba(88,66,26,.78)';
  return (
    <div style={{
      width: 46, height: 34, borderRadius: 6, position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(140deg, #F0DBA4 0%, #D2B573 32%, #A98B4E 68%, #8A6E38 100%)',
      boxShadow: 'inset 0 1px 0 rgba(255,250,232,.85), inset 0 -1px 0 rgba(70,52,20,.5), 0 1px 3px rgba(0,0,0,.55)'
    }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 10, height: 1, background: line }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 23, height: 1, background: line }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 14, width: 1, background: line }} />
      <div style={{ position: 'absolute', top: 10, height: 13, left: 14, right: 14, border: '1px solid ' + line, borderRadius: 2 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, transparent 38%, rgba(255,255,255,.35) 50%, transparent 60%)' }} />
    </div>
  );
}

function Contactless({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: .8 }} aria-hidden="true">
      <path d="M6 8.5a7 7 0 0 1 0 7" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M10 6a10.5 10.5 0 0 1 0 12" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M14 3.5a14 14 0 0 1 0 17" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CreditCardVisual({ student, showCard }) {
  const useCustomImage = student.customImage;
  const design = CARD_DESIGNS.find(d => d.id === (student.cardDesign || 'emerald')) || CARD_DESIGNS[0];
  const displayName = student.displayName || student.name;
  const tier = TIER_LABELS[design.tier];

  const light = !useCustomImage && String(design.textColor || '').toLowerCase() !== '#ffffff';

  const bgStyle = useCustomImage
    ? { backgroundImage: 'url(' + student.customImage + ')', backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: design.gradient };

  const textColor = useCustomImage ? '#ffffff' : design.textColor;
  const accent = useCustomImage ? '#d4af37' : design.accent;

  const emboss = light
    ? '0 1px 0 rgba(255,255,255,.6), 0 1px 2px rgba(0,0,0,.28)'
    : '0 1px 0 rgba(255,255,255,.22), 0 2px 3px rgba(0,0,0,.62)';

  const edge = light
    ? 'inset 0 1px 0 rgba(255,255,255,.9), inset 0 -1px 0 rgba(0,0,0,.18), inset 1px 0 0 rgba(255,255,255,.4), inset -1px 0 0 rgba(0,0,0,.12)'
    : 'inset 0 1px 0 rgba(255,255,255,.20), inset 0 -1px 0 rgba(0,0,0,.55), inset 1px 0 0 rgba(255,255,255,.07), inset -1px 0 0 rgba(0,0,0,.4)';

  const dropShadow = light ? '0 20px 40px rgba(0,0,0,.42)' : '0 20px 40px rgba(0,0,0,.62)';

  return (
    <div className="relative aspect-[1.586/1] rounded-[13px] overflow-hidden" style={{
      ...bgStyle, color: textColor,
      boxShadow: dropShadow + ', 0 3px 8px rgba(0,0,0,.45), ' + edge,
      padding: '5.5%'
    }}>
      {useCustomImage && <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(150deg, rgba(0,0,0,.55), rgba(0,0,0,.28) 45%, rgba(0,0,0,.68))' }} />}

      <div className="absolute pointer-events-none" style={{
        top: '-50%', left: '-25%', width: '85%', height: '200%',
        background: 'linear-gradient(102deg, transparent 30%, rgba(255,255,255,' + (light ? '.55' : '.09') + ') 50%, transparent 66%)',
        transform: 'rotate(14deg)'
      }} />

      {!useCustomImage && design.stars && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white animate-pulse" style={{
              width: Math.random() * 3 + 1 + 'px', height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%', left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's', opacity: Math.random() * 0.8 + 0.2
            }} />
          ))}
        </div>
      )}

      <div className="relative h-full flex flex-col justify-between z-[1]">

        <div className="flex justify-between items-start">
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: '.02em', color: textColor }}>P4 Reserve</div>
            <div style={{ fontSize: 7, letterSpacing: '.26em', marginTop: 2, color: accent, opacity: .95 }}>
              {String(design.name || '').toUpperCase()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {design.tier !== 'basic' && !useCustomImage && (
              <span style={{ fontSize: 7, letterSpacing: '.2em', color: accent, opacity: .9 }}>{tier.label.toUpperCase()}</span>
            )}
            <Contactless color={light ? 'rgba(0,0,0,.55)' : 'rgba(255,255,255,.85)'} />
          </div>
        </div>

        <div style={{ marginTop: '3%' }}><EmvChip light={light} /></div>

        <div>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 'clamp(13px, 4.6vw, 20px)', letterSpacing: '.13em',
            textShadow: emboss, whiteSpace: 'nowrap'
          }}>
            {showCard ? student.cardNumber : '•••• •••• •••• ' + String(student.cardNumber || '').slice(-4)}
          </div>

          <div className="flex justify-between items-end gap-3" style={{ marginTop: '3.5%' }}>
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 6, letterSpacing: '.2em', color: accent, marginBottom: 2 }}>CARDHOLDER</div>
              <div style={{ fontSize: 'clamp(9px, 3vw, 12px)', letterSpacing: '.07em', textTransform: 'uppercase', textShadow: emboss, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 6, letterSpacing: '.2em', color: accent, marginBottom: 2 }}>CVV</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 'clamp(9px, 3vw, 12px)', textShadow: emboss }}>{showCard ? student.cvv : '•••'}</div>
            </div>
            <div>
              <div style={{ fontSize: 6, letterSpacing: '.2em', color: accent, marginBottom: 2 }}>VALID THRU</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 'clamp(9px, 3vw, 12px)', textShadow: emboss }}>{student.validThru}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ============= STUDENT VIEW =============
function StudentView({ student, data, saveData, onLogout, toast }) {
  const [studentTab, setStudentTab] = useState('home');
  const [showCard, setShowCard] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [editName, setEditName] = useState(student.displayName || student.name);
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNote, setTransferNote] = useState('');
  const [transferTarget, setTransferTarget] = useState('student');
  const [transferError, setTransferError] = useState('');
  const [reqTo, setReqTo] = useState('');
  const [reqAmount, setReqAmount] = useState('');
  const [reqNote, setReqNote] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');
  const [shopAmount, setShopAmount] = useState({});
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [creditFlash, setCreditFlash] = useState(null);
  const fileInputRef = useRef();
  const previousBalance = useRef(student.balance);

  const themeId = (student.theme && STUDENT_THEMES[student.theme]) ? student.theme : 'imperial_blue';
  const theme = STUDENT_THEMES[themeId] || STUDENT_THEMES.imperial_blue;
  const myTx = (data.transactions || []).filter(t => t.studentId === student.id);
  const totalEarned = myTx.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = myTx.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const myRequests = (data.bonusRequests || []).filter(r => r.studentId === student.id);
  const unlockedDesigns = CARD_DESIGNS.filter(d => hasUnlocked(student, d, data.transactions || []));
  const lockedDesigns = CARD_DESIGNS.filter(d => !hasUnlocked(student, d, data.transactions || []));
  const status = getMemberStatus(totalEarned);
  const StatusIcon = status.icon || Star;
  const sortedStudents = [...(data.students || [])].sort((a, b) => b.balance - a.balance);
  const myRank = sortedStudents.findIndex(s => s.id === student.id) + 1;
  const memberNumber = String((parseInt(String(student.id).slice(-6), 10) || 18) % 1000).padStart(3, '0');
  const now = Date.now();
  const publicFeed = (data.transactions || []).filter(t => t.public && t.amount > 0);
  const weeklyGain = myTx.filter(t => t.amount > 0 && now - new Date(t.date).getTime() <= 7 * 86400000).reduce((sum, t) => sum + t.amount, 0);

  useEffect(() => {
    const before = previousBalance.current;
    if (student.balance > before) {
      const diff = student.balance - before;
      setCreditFlash(diff);
      if (navigator.vibrate) navigator.vibrate(35);
      const timer = setTimeout(() => setCreditFlash(null), 2400);
      previousBalance.current = student.balance;
      return () => clearTimeout(timer);
    }
    previousBalance.current = student.balance;
  }, [student.balance]);

  const updateMyData = async (changes) => {
    return await saveData({ ...data, students: data.students.map(s => s.id === student.id ? { ...s, ...changes } : s) });
  };

  const incomingReqs = (data.payRequests || []).filter(r => r.toId === student.id && r.status === 'pending');

  const sendPayRequest = () => {
    const amt = parseInt(reqAmount, 10);
    if (!amt || amt <= 0) { toast && toast('Enter a valid amount', 'bad'); return; }
    const rec = (data.students || []).find(x => x.accessCode === reqTo.trim().toUpperCase());
    if (!rec) { toast && toast('Invalid member code', 'bad'); return; }
    if (rec.id === student.id) { toast && toast("You can't request from yourself", 'bad'); return; }
    saveData({
      ...data,
      payRequests: [{
        id: Date.now().toString() + Math.random(), fromId: student.id,
        fromName: student.displayName || student.name, toId: rec.id,
        toName: rec.displayName || rec.name, amount: amt, note: reqNote.trim(),
        status: 'pending', date: new Date().toISOString()
      }, ...(data.payRequests || [])]
    });
    toast && toast(`Request sent to ${rec.displayName || rec.name}`);
    setReqAmount(''); setReqTo(''); setReqNote('');
    setTimeout(() => setActiveModal(null), 700);
  };

  const resolvePayRequest = (req, accept) => {
    if (!accept) {
      saveData({ ...data, payRequests: (data.payRequests || []).map(r => r.id === req.id ? { ...r, status: 'rejected' } : r) });
      toast && toast('Request declined');
      return;
    }
    if (req.amount > student.balance) { toast && toast('Insufficient balance', 'bad'); return; }
    const now = new Date().toISOString();
    saveData({
      ...data,
      students: data.students.map(x => {
        if (x.id === student.id) return { ...x, balance: x.balance - req.amount };
        if (x.id === req.fromId) return { ...x, balance: x.balance + req.amount };
        return x;
      }),
      payRequests: (data.payRequests || []).map(r => r.id === req.id ? { ...r, status: 'paid' } : r),
      transactions: [
        { id: Date.now() + 'q1', studentId: student.id, amount: -req.amount, reason: `Request paid to ${req.fromName}`, date: now },
        { id: Date.now() + 'q2', studentId: req.fromId, amount: req.amount, reason: `Request collected from ${student.displayName || student.name}`, date: now, public: true, fromName: student.displayName || student.name, toName: req.fromName, note: req.note },
        ...(data.transactions || [])
      ]
    });
    toast && toast(`Paid ${req.amount.toLocaleString('en-US')} IGOs`);
  };

  const downloadStatement = () => {
    const L = ['P4 RESERVE — ACCOUNT STATEMENT', '', `Member: ${student.displayName || student.name}`,
      `Code: ${student.accessCode}`, `Status: ${status.name}`, `Issued: ${new Date().toLocaleString('en-US')}`, '',
      `Current balance: ${student.balance.toLocaleString('en-US')} IGOs`,
      `Total earned:    ${totalEarned.toLocaleString('en-US')} IGOs`,
      `Total spent:     ${totalSpent.toLocaleString('en-US')} IGOs`,
      `Cards unlocked:  ${unlockedDesigns.length}/${CARD_DESIGNS.length}`,
      '', 'TRANSACTIONS', '-'.repeat(64)];
    myTx.forEach(t => L.push(
      `${new Date(t.date).toLocaleString('en-US').padEnd(24)} ${((t.amount > 0 ? '+' : '') + t.amount.toLocaleString('en-US')).padStart(12)}  ${t.reason}`
    ));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([L.join('\n')], { type: 'text/plain;charset=utf-8' }));
    a.download = `p4-statement-${student.accessCode}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast && toast('Statement downloaded');
  };

  const handleTransfer = () => {
    setTransferError(''); setTransferSuccess('');
    if (student.sanctioned) { setTransferError('Your account is suspended. Speak with the professor.'); return; }
    if (student.frozen) { setTransferError('Your card is frozen. Unfreeze it first.'); return; }
    const amt = parseInt(transferAmount);
    if (!amt || amt <= 0) { setTransferError('Enter a valid amount.'); return; }
    if (amt > student.balance) { setTransferError('Insufficient balance.'); return; }

    if (transferTarget === 'central') {
      const updated = {
        ...data,
        students: data.students.map(s => s.id === student.id ? { ...s, balance: s.balance - amt } : s),
        centralBank: { ...data.centralBank, balance: data.centralBank.balance + amt },
        transactions: [
          { id: Date.now() + 'a', studentId: student.id, amount: -amt, reason: `Transfer to Central Bank${transferNote.trim() ? ' — ' + transferNote.trim() : ''}`, date: new Date().toISOString() },
          { id: Date.now() + 'b', studentId: CENTRAL_BANK_ID, amount: amt, reason: `Received from ${student.displayName || student.name}${transferNote.trim() ? ' — ' + transferNote.trim() : ''}`, date: new Date().toISOString() },
          ...(data.transactions || [])
        ]
      };
      saveData(updated);
      setTransferSuccess(`${formatMoney(amt)} sent to Central Bank`);
    } else {
      const recipient = data.students.find(s => s.accessCode === transferTo.trim().toUpperCase());
      if (!recipient) { setTransferError('Invalid recipient code.'); return; }
      if (recipient.id === student.id) { setTransferError("You can't transfer to yourself."); return; }
      if (recipient.sanctioned) { setTransferError('That member is suspended and cannot receive funds.'); return; }
      const updated = {
        ...data,
        students: data.students.map(s => {
          if (s.id === student.id) return { ...s, balance: s.balance - amt };
          if (s.id === recipient.id) return { ...s, balance: s.balance + amt };
          return s;
        }),
        transactions: [
          { id: Date.now() + 'a', studentId: student.id, amount: -amt, reason: `Transfer to ${recipient.displayName || recipient.name}${transferNote.trim() ? ' — ' + transferNote.trim() : ''}`, date: new Date().toISOString() },
          { id: Date.now() + 'b', studentId: recipient.id, amount: amt, reason: `Transfer from ${student.displayName || student.name}${transferNote.trim() ? ' — ' + transferNote.trim() : ''}`, date: new Date().toISOString(), public: true, fromName: student.displayName || student.name, toName: recipient.displayName || recipient.name, note: transferNote.trim() },
          ...(data.transactions || [])
        ]
      };
      saveData(updated);
      setTransferSuccess(`${formatMoney(amt)} sent to ${recipient.displayName || recipient.name}`);
    }
    setTransferAmount(''); setTransferTo(''); setTransferNote('');
    setTimeout(() => { setActiveModal(null); setTransferSuccess(''); }, 1400);
  };

  const handleBonusRequest = (bonus) => {
    const amt = parseInt(shopAmount[bonus.id] || '0');
    if (!amt || amt <= 0) { alert('Enter a valid offer.'); return; }
    if (amt > student.balance) { alert('Insufficient balance.'); return; }
    const request = {
      id: Date.now().toString() + Math.random(), studentId: student.id,
      studentName: student.displayName || student.name, bonusId: bonus.id,
      bonusName: bonus.name, bonusValue: bonus.value, amount: amt,
      status: 'pending', date: new Date().toISOString()
    };
    const updated = {
      ...data,
      students: data.students.map(s => s.id === student.id ? { ...s, balance: s.balance - amt, reservedBalance: (s.reservedBalance || 0) + amt } : s),
      bonusRequests: [request, ...(data.bonusRequests || [])],
      transactions: [{ id: Date.now() + 'r', studentId: student.id, amount: -amt, reason: `Bonus offer: ${bonus.name}`, date: new Date().toISOString(), pending: true, requestId: request.id }, ...(data.transactions || [])]
    };
    saveData(updated);
    setShopAmount({ ...shopAmount, [bonus.id]: '' });
  };

  const handleChangePin = () => {
    setPinError(''); setPinSuccess('');
    if (oldPin !== student.pin) { setPinError('Current PIN is incorrect.'); return; }
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) { setPinError('New PIN must be 4 digits.'); return; }
    updateMyData({ pin: newPin });
    setPinSuccess('PIN updated.'); setOldPin(''); setNewPin('');
    setTimeout(() => { setActiveModal(null); setPinSuccess(''); }, 1200);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('Image too large. Max 10MB.'); e.target.value = ''; return; }
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      if (compressed.length > 500000) { alert('Image is still too large after compression.'); setUploading(false); e.target.value = ''; return; }
      await updateMyData({ customImage: compressed });
    } catch (err) {
      console.error(err); alert('Could not process image.');
    }
    setUploading(false); e.target.value = '';
  };

  const removeCustomImage = () => updateMyData({ customImage: null });

  const cardStyle = {
    background: `linear-gradient(145deg, ${theme.surface2}, ${theme.surface})`,
    borderColor: theme.border,
    boxShadow: `0 18px 55px ${theme.glow}`
  };

  const SectionTitle = ({ eyebrow, title, action }) => (
    <div className="flex items-end justify-between mb-3">
      <div>
        {eyebrow && <div className="text-[8px] tracking-[0.28em] mb-1" style={{color:theme.primary}}>{eyebrow}</div>}
        <div className="text-lg font-semibold" style={{color:theme.accent}}>{title}</div>
      </div>
      {action}
    </div>
  );

  const ActivityRow = ({ tx }) => {
    const positive = tx.amount > 0;
    return (
      <div className="flex items-center gap-3 py-3 border-b last:border-b-0" style={{borderColor:theme.border}}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{borderColor:theme.border, color: positive ? theme.success : theme.danger, background:'rgba(255,255,255,.025)'}}>
          {tx.pending ? <Clock size={15}/> : positive ? <ArrowDownLeft size={16}/> : <ArrowUpRight size={16}/>} 
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold truncate" style={{color:theme.accent}}>{tx.reason}</div>
          <div className="text-[10px] mt-0.5" style={{color:theme.muted}}>{shortDate(tx.date)}</div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold" style={{color: tx.pending ? theme.money : positive ? theme.success : theme.danger}}>{positive ? '+' : ''}{tx.amount.toLocaleString('en-US')}</div>
          <div className="text-[8px] tracking-[0.14em]" style={{color:theme.muted}}>IGOs</div>
        </div>
      </div>
    );
  };

  const renderHome = () => (
    <div className="space-y-5 pb-28">
      {student.sanctioned && (
        <div className="rounded-2xl border p-4 flex items-center gap-3" style={{borderColor:'rgba(255,138,150,.42)', background:'rgba(70,16,24,.55)'}}>
          <Ban size={18} color="#FF8A96" />
          <div className="text-sm" style={{color:'#FFC9CE'}}>Account suspended. You cannot send or receive funds.</div>
        </div>
      )}
      <div className="flex items-center justify-between pt-2">
        <div>
          <div className="text-[9px] tracking-[0.26em]" style={{color:theme.muted}}>WELCOME BACK</div>
          <div className="text-2xl font-semibold mt-1" style={{color:theme.accent}}>{student.displayName || student.name}</div>
        </div>
        <button onClick={() => setStudentTab('profile')}>
          <Avatar student={student} size={44} ring={theme.border} />
        </button>
      </div>

      <section className="rounded-[26px] border p-5 relative overflow-hidden" style={cardStyle}>
        <div className="absolute -right-16 -top-20 w-52 h-52 rounded-full blur-3xl" style={{background:theme.glow}} />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="text-[9px] tracking-[0.24em]" style={{color:theme.muted}}>TOTAL BALANCE</div>
            <div className="text-[9px] tracking-[0.16em] flex items-center gap-1" style={{color:theme.money}}><StatusIcon size={12}/> {status.name}</div>
          </div>
          <div className="mt-4 flex items-end gap-2">
            <div className="text-[42px] leading-none font-semibold tracking-[-0.05em]" style={{color:theme.accent}}>{student.balance.toLocaleString('en-US')}</div>
            <div className="text-sm pb-1.5" style={{color:theme.money}}>IGOs</div>
          </div>
          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-1 text-xs" style={{color:theme.success}}><TrendingUp size={13}/> +{weeklyGain.toLocaleString('en-US')} this week</div>
            <div className="text-[9px] tracking-[0.18em]" style={{color:theme.muted}}>MEMBER {memberNumber}</div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-4 gap-2">
        {[
          {label:'Transfer', icon:Send, action:()=>setActiveModal('transfer'), badge:0},
          {label:'Request', icon:ArrowDownLeft, action:()=>setActiveModal('request'), badge:incomingReqs.length},
          {label:'Rewards', icon:Gift, action:()=>setStudentTab('rewards'), badge:0},
          {label:'Card', icon:CreditCard, action:()=>setStudentTab('card'), badge:0}
        ].map(item => <button key={item.label} onClick={item.action} className="relative rounded-2xl border py-3 px-1 flex flex-col items-center gap-2 text-[9px]" style={{borderColor:theme.border, background:'rgba(255,255,255,.025)', color:theme.muted}}><item.icon size={18} style={{color:theme.primary}}/><span>{item.label}</span>{item.badge > 0 && <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{background:theme.money}}/>}</button>)}
      </div>

      <section className="rounded-[24px] border p-4" style={{...cardStyle, boxShadow:'none'}}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[8px] tracking-[0.27em]" style={{color:theme.primary}}>P4 RESERVE</div>
            <div className="text-xl mt-1" style={{fontFamily:FONT_DISPLAY, color:theme.accent}}>{status.name} Member</div>
          </div>
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center border" style={{borderColor:theme.border, color:theme.money}}><StatusIcon size={19}/></div>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,.06)'}}><div className="h-full rounded-full transition-all" style={{width:`${status.progress}%`, background:theme.primary}} /></div>
        <div className="flex justify-between mt-2 text-[9px]" style={{color:theme.muted}}>
          <span>{totalEarned.toLocaleString('en-US')} lifetime IGOs</span>
          <span>{status.next ? `${Math.max(0, status.next.min - totalEarned).toLocaleString('en-US')} to ${status.next.name}` : 'Highest status'}</span>
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="STATEMENT" title="Recent activity" action={<button onClick={()=>setStudentTab('profile')} className="text-[9px]" style={{color:theme.primary}}>VIEW ALL</button>} />
        <div className="rounded-[24px] border px-4" style={{...cardStyle, boxShadow:'none'}}>
          {myTx.length ? myTx.slice(0,5).map(tx => <ActivityRow key={tx.id} tx={tx}/>) : <div className="py-10 text-center text-xs" style={{color:theme.muted}}>Your first IGO transaction will appear here.</div>}
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="THE FLOOR" title="Member activity" />
        <div className="rounded-[24px] border" style={{...cardStyle, boxShadow:'none'}}>
          {publicFeed.length ? publicFeed.slice(0,6).map((tx, i) => (
            <div key={tx.id} className="px-4 py-3" style={{borderTop: i === 0 ? 'none' : `1px solid ${theme.border}`}}>
              <div className="flex justify-between gap-3">
                <div className="text-xs flex-1" style={{color:theme.muted}}>
                  <span style={{color:theme.accent}}>{tx.fromName}</span> paid <span style={{color:theme.accent}}>{tx.toName}</span>
                </div>
                <div className="text-xs shrink-0" style={{color:theme.success, fontFamily:FONT_MONO}}>{tx.amount.toLocaleString('en-US')}</div>
              </div>
              {tx.note && <div className="text-[11px] mt-1" style={{color:theme.muted}}>"{tx.note}"</div>}
              <div className="text-[10px] mt-1" style={{color:theme.muted, opacity:.7}}>{shortDate(tx.date)}</div>
            </div>
          )) : <div className="py-10 text-center text-xs" style={{color:theme.muted}}>No public transfers yet.</div>}
        </div>
      </section>
    </div>
  );

  const renderRanking = () => (
    <div className="pb-28 pt-2">
      <SectionTitle eyebrow="CLASSROOM" title="Ranking" />
      <section className="rounded-[26px] border p-5 mb-5" style={cardStyle}>
        <div className="text-[9px] tracking-[0.22em]" style={{color:theme.muted}}>YOUR POSITION</div>
        <div className="flex items-end justify-between mt-2">
          <div className="text-5xl font-semibold" style={{color:theme.accent}}>#{myRank || '—'}</div>
          <div className="text-right"><div className="text-xs" style={{color:theme.money}}>{student.balance.toLocaleString('en-US')} IGOs</div><div className="text-[9px] mt-1" style={{color:theme.muted}}>of {sortedStudents.length} members</div></div>
        </div>
      </section>
      <div className="space-y-2">
        {sortedStudents.map((s, idx) => {
          const me = s.id === student.id;
          return <div key={s.id} className="rounded-[20px] border p-3.5 flex items-center gap-3" style={{borderColor:me ? theme.primary : theme.border, background:me ? theme.glow : 'rgba(255,255,255,.02)'}}>
            <div className="w-8 text-center text-sm font-bold" style={{color:idx < 3 ? theme.money : theme.muted}}>{idx + 1}</div>
            <Avatar student={s} size={36} ring={theme.border} />
            <div className="flex-1 min-w-0"><div className="text-xs font-semibold truncate" style={{color:theme.accent}}>{s.displayName || s.name}{me ? ' · YOU' : ''}</div><div className="text-[9px] mt-1" style={{color:theme.muted}}>{idx < 3 ? 'Top classroom member' : 'Class member'}</div></div>
            <div className="text-xs font-semibold" style={{color:me ? theme.primary : theme.money}}>{s.balance.toLocaleString('en-US')}</div>
          </div>
        })}
      </div>
    </div>
  );

  const renderRewards = () => (
    <div className="pb-28 pt-2">
      <SectionTitle eyebrow="PRIVATE ACCESS" title="Rewards" />
      <p className="text-xs leading-5 mb-5" style={{color:theme.muted}}>Make an IGO offer for an academic privilege. Your professor approves or rejects it.</p>
      <div className="space-y-3">
        {BONUS_SHOP.map((bonus, index) => {
          const pending = myRequests.find(r => r.bonusId === bonus.id && r.status === 'pending');
          return <div key={bonus.id} className="rounded-[24px] border p-4" style={{...cardStyle, boxShadow:'none'}}>
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl border flex items-center justify-center text-xl" style={{borderColor:theme.border, background:'rgba(255,255,255,.025)'}}>{bonus.icon}</div>
              <div className="flex-1"><div className="text-sm font-semibold" style={{color:theme.accent}}>{bonus.name}</div>{bonus.value !== null && <div className="text-[10px] mt-1" style={{color:theme.success}}>+{bonus.value} academic bonus</div>}</div>
              <div className="text-[9px] tracking-[0.18em]" style={{color:theme.muted}}>0{index+1}</div>
            </div>
            {pending ? <div className="mt-4 rounded-2xl px-3 py-2.5 flex items-center justify-between" style={{background:'rgba(217,190,136,.08)', color:theme.money}}><span className="text-[10px] flex items-center gap-1"><Clock size={12}/> OFFER PENDING</span><span className="text-xs font-bold">{pending.amount.toLocaleString('en-US')} IGOs</span></div> : <div className="flex gap-2 mt-4"><input type="number" value={shopAmount[bonus.id] || ''} onChange={(e)=>setShopAmount({...shopAmount,[bonus.id]:e.target.value})} placeholder="Your offer" className="min-w-0 flex-1 rounded-2xl border bg-black/25 px-3 py-2.5 text-xs outline-none" style={{borderColor:theme.border, color:theme.accent}}/><button onClick={()=>handleBonusRequest(bonus)} className="rounded-2xl px-4 text-[10px] font-bold tracking-[0.1em]" style={{background:theme.primary, color:'#09070B'}}>OFFER</button></div>}
          </div>
        })}
      </div>
      {myRequests.filter(r=>r.status !== 'pending').length > 0 && <div className="mt-7"><SectionTitle eyebrow="HISTORY" title="Past requests"/><div className="rounded-[24px] border px-4" style={{...cardStyle,boxShadow:'none'}}>{myRequests.filter(r=>r.status !== 'pending').slice(0,8).map(r=><div key={r.id} className="py-3 border-b last:border-0 flex justify-between gap-3" style={{borderColor:theme.border}}><div><div className="text-xs" style={{color:theme.accent}}>{r.bonusName}</div><div className="text-[9px] mt-1" style={{color:theme.muted}}>{shortDate(r.date)}</div></div><div className="text-[10px] font-bold uppercase" style={{color:r.status==='approved'?theme.success:theme.danger}}>{r.status}</div></div>)}</div></div>}
    </div>
  );

  const renderCard = () => (
    <div className="pb-28 pt-2">
      <SectionTitle eyebrow="WALLET" title="Your card" action={<button onClick={()=>setShowCard(!showCard)} className="w-9 h-9 rounded-xl border flex items-center justify-center" style={{borderColor:theme.border,color:theme.primary}}>{showCard?<EyeOff size={15}/>:<Eye size={15}/>}</button>} />
      <div className="relative">
        <CreditCardVisual student={student} showCard={showCard} />
        {student.frozen && (
          <div className="absolute inset-0 rounded-[22px] flex items-center justify-center" style={{background:'rgba(4,6,12,.62)', backdropFilter:'blur(2px)'}}>
            <div className="flex items-center gap-2 rounded-xl px-4 py-2" style={{background:'rgba(0,0,0,.55)', border:'1px solid rgba(159,216,236,.45)'}}>
              <Snowflake size={15} color="#9FD8EC" /><span className="text-xs" style={{color:'#D5EEF8'}}>Frozen</span>
            </div>
          </div>
        )}
      </div>
      <button onClick={() => updateMyData({ frozen: !student.frozen })}
        className="w-full mt-3 rounded-2xl border py-3 text-xs font-semibold flex items-center justify-center gap-2"
        style={{borderColor: student.frozen ? 'rgba(159,216,236,.45)' : theme.border, color: student.frozen ? '#9FD8EC' : theme.accent}}>
        <Snowflake size={15} />{student.frozen ? 'UNFREEZE CARD' : 'FREEZE CARD'}
      </button>
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="rounded-2xl border p-3" style={{borderColor:theme.border,background:'rgba(255,255,255,.02)'}}><div className="text-[8px] tracking-[0.16em]" style={{color:theme.muted}}>EARNED</div><div className="text-xs font-bold mt-1" style={{color:theme.success}}>{totalEarned.toLocaleString('en-US')}</div></div>
        <div className="rounded-2xl border p-3" style={{borderColor:theme.border,background:'rgba(255,255,255,.02)'}}><div className="text-[8px] tracking-[0.16em]" style={{color:theme.muted}}>SPENT</div><div className="text-xs font-bold mt-1" style={{color:theme.danger}}>{totalSpent.toLocaleString('en-US')}</div></div>
        <div className="rounded-2xl border p-3" style={{borderColor:theme.border,background:'rgba(255,255,255,.02)'}}><div className="text-[8px] tracking-[0.16em]" style={{color:theme.muted}}>CARDS</div><div className="text-xs font-bold mt-1" style={{color:theme.money}}>{unlockedDesigns.length}/{CARD_DESIGNS.length}</div></div>
      </div>

      <div className="mt-7"><SectionTitle eyebrow="COLLECTION" title="Card designs"/><div className="grid grid-cols-2 gap-2">
        {unlockedDesigns.map(d=><button key={d.id} onClick={()=>updateMyData({cardDesign:d.id,customImage:null})} className="relative h-24 rounded-[18px] overflow-hidden border text-left p-3" style={{background:d.gradient,borderColor:(student.cardDesign||'emerald')===d.id?theme.primary:'rgba(255,255,255,.12)',color:d.textColor}}><div className="text-[8px] tracking-[0.18em] opacity-70">{TIER_LABELS[d.tier].label.toUpperCase()}</div><div className="text-sm font-bold mt-1">{d.name}</div>{(student.cardDesign||'emerald')===d.id&&<Check size={15} className="absolute top-3 right-3"/>}</button>)}
        {lockedDesigns.slice(0,6).map(d=><div key={d.id} className="relative h-24 rounded-[18px] overflow-hidden border p-3 opacity-45" style={{background:d.gradient,borderColor:'rgba(255,255,255,.1)',color:d.textColor}}><Lock size={13} className="absolute top-3 right-3"/><div className="text-[8px] tracking-[0.18em]">LOCKED</div><div className="text-sm font-bold mt-1">{d.name}</div><div className="text-[8px] mt-2">{Math.max(0,(d.minBalance||0)-totalEarned).toLocaleString('en-US')} more</div></div>)}
      </div></div>

      <div className="mt-7"><SectionTitle eyebrow="PERSONAL" title="Custom artwork"/><input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/><div className="flex gap-2"><button onClick={()=>fileInputRef.current?.click()} disabled={uploading} className="flex-1 rounded-2xl border py-3 text-xs font-semibold flex items-center justify-center gap-2" style={{borderColor:theme.border,color:theme.accent}}><Upload size={15}/>{uploading?'PROCESSING':'UPLOAD IMAGE'}</button>{student.customImage&&<button onClick={removeCustomImage} className="w-12 rounded-2xl border flex items-center justify-center" style={{borderColor:theme.border,color:theme.danger}}><Trash2 size={15}/></button>}</div></div>
    </div>
  );

  const renderProfile = () => (
    <div className="pb-28 pt-2">
      <SectionTitle eyebrow="MEMBER" title="Profile" />
      <section className="rounded-[26px] border p-5 mb-6" style={cardStyle}>
        <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-full border flex items-center justify-center font-bold" style={{borderColor:theme.border,color:theme.primary}}>{(student.displayName||student.name).split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div><div className="text-xl font-semibold" style={{color:theme.accent}}>{student.displayName||student.name}</div><div className="text-[9px] tracking-[0.2em] mt-1" style={{color:theme.money}}>{status.name} · MEMBER {memberNumber}</div></div></div>
      </section>

      <SectionTitle eyebrow="APPEARANCE" title="Visual theme"/>
      <div className="grid grid-cols-2 gap-2 mb-7">{Object.entries(STUDENT_THEMES).filter(([id])=>!['black_gold','midnight'].includes(id)).map(([id,t])=><button key={id} onClick={()=>updateMyData({theme:id})} className="rounded-[20px] border p-3 text-left relative overflow-hidden" style={{background:t.bgGradient,borderColor:themeId===id?t.primary:'rgba(255,255,255,.1)'}}><div className="flex gap-1.5 mb-7"><span className="w-3 h-3 rounded-full" style={{background:t.primary}}/><span className="w-3 h-3 rounded-full" style={{background:t.money}}/><span className="w-3 h-3 rounded-full" style={{background:t.surface2}}/></div><div className="text-[8px] tracking-[0.18em]" style={{color:t.secondary}}>{t.eyebrow}</div><div className="text-xs font-bold mt-1" style={{color:t.accent}}>{t.name}</div>{themeId===id&&<Check size={14} className="absolute top-3 right-3" style={{color:t.primary}}/>}</button>)}</div>

      <SectionTitle eyebrow="IDENTITY" title="Display name"/>
      <div className="flex gap-2 mb-7"><input value={editName} onChange={(e)=>setEditName(e.target.value)} maxLength={30} className="flex-1 min-w-0 rounded-2xl border bg-black/25 px-3 py-3 text-xs outline-none" style={{borderColor:theme.border,color:theme.accent}}/><button onClick={()=>updateMyData({displayName:editName.trim()||student.name})} className="rounded-2xl px-4 text-xs font-bold" style={{background:theme.primary,color:'#09070B'}}>SAVE</button></div>

      <div className="space-y-2">
        <button onClick={()=>setActiveModal('pin')} className="w-full rounded-2xl border p-4 flex items-center gap-3 text-left" style={{borderColor:theme.border,color:theme.accent}}><KeyRound size={17} style={{color:theme.primary}}/><span className="flex-1 text-xs">Change PIN</span><ChevronRight size={15} style={{color:theme.muted}}/></button>
        <button onClick={downloadStatement} className="w-full rounded-2xl border p-4 flex items-center gap-3 text-left" style={{borderColor:theme.border,color:theme.accent}}><Download size={17} style={{color:theme.primary}}/><span className="flex-1 text-xs">Download statement</span><ChevronRight size={15} style={{color:theme.muted}}/></button>
        <button onClick={onLogout} className="w-full rounded-2xl border p-4 flex items-center gap-3 text-left" style={{borderColor:theme.border,color:theme.danger}}><LogOut size={17}/><span className="flex-1 text-xs">Sign out</span><ChevronRight size={15}/></button>
      </div>

      <div className="mt-7"><SectionTitle eyebrow="FULL STATEMENT" title="Activity history"/><div className="rounded-[24px] border px-4" style={{...cardStyle,boxShadow:'none'}}>{myTx.length?myTx.map(tx=><ActivityRow key={tx.id} tx={tx}/>):<div className="py-8 text-center text-xs" style={{color:theme.muted}}>No activity yet.</div>}</div></div>
    </div>
  );

  const nav = [
    {id:'home',label:'Home',icon:Home},
    {id:'ranking',label:'Rank',icon:Trophy},
    {id:'card',label:'Card',icon:CreditCard},
    {id:'rewards',label:'Rewards',icon:Gift},
    {id:'profile',label:'Profile',icon:User},
  ];

  return (
    <div className="min-h-screen" style={{fontFamily:FONT_BODY, background:theme.bgGradient, color:theme.accent}}>
      <div className="max-w-md mx-auto min-h-screen px-4 relative">
        {creditFlash && <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[70] rounded-full px-5 py-3 border backdrop-blur-xl p4-credit-flash" style={{background:`${theme.surface}EE`,borderColor:theme.money,color:theme.money,boxShadow:`0 12px 50px ${theme.glow}`}}><div className="text-[9px] tracking-[0.2em] text-center opacity-70">LIVE CREDIT</div><div className="text-lg font-bold">+{creditFlash.toLocaleString('en-US')} IGOs</div></div>}

        <div className="py-4 flex items-center justify-between">
          <div className="text-[10px] tracking-[0.24em] font-semibold" style={{color:theme.accent}}>P4 RESERVE</div>
          <div className="flex items-center gap-2"><div className="text-[8px] tracking-[0.18em]" style={{color:theme.muted}}>{theme.name.toUpperCase()}</div><Bell size={15} style={{color:theme.muted}}/></div>
        </div>

        {studentTab === 'home' && renderHome()}
        {studentTab === 'ranking' && renderRanking()}
        {studentTab === 'rewards' && renderRewards()}
        {studentTab === 'card' && renderCard()}
        {studentTab === 'profile' && renderProfile()}

        <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[420px] rounded-[24px] border p-1.5 backdrop-blur-2xl z-40" style={{background:`${theme.surface}E8`,borderColor:theme.border,boxShadow:'0 18px 50px rgba(0,0,0,.40)'}}>
          <div className="grid grid-cols-5">{nav.map(item=><button key={item.id} onClick={()=>setStudentTab(item.id)} className="rounded-[18px] py-2.5 flex flex-col items-center gap-1 transition-all" style={{background:studentTab===item.id?theme.glow:'transparent',color:studentTab===item.id?theme.primary:theme.muted}}><item.icon size={17}/><span className="text-[8px]">{item.label}</span></button>)}</div>
        </nav>
      </div>

      {activeModal === 'transfer' && <Modal onClose={()=>setActiveModal(null)} theme={theme} title="Transfer IGOs">
        <div className="p-5">
          <div className="rounded-2xl border p-4 mb-4" style={{borderColor:theme.border,background:'rgba(255,255,255,.025)'}}><div className="text-[9px] tracking-[0.2em]" style={{color:theme.muted}}>AVAILABLE</div><div className="text-2xl font-semibold mt-1" style={{color:theme.money}}>{student.balance.toLocaleString('en-US')} IGOs</div></div>
          <div className="grid grid-cols-2 gap-2 mb-4"><button onClick={()=>setTransferTarget('student')} className="rounded-xl py-2.5 text-[10px] border" style={{borderColor:transferTarget==='student'?theme.primary:theme.border,color:transferTarget==='student'?theme.primary:theme.muted}}>MEMBER</button><button onClick={()=>setTransferTarget('central')} className="rounded-xl py-2.5 text-[10px] border" style={{borderColor:transferTarget==='central'?theme.primary:theme.border,color:transferTarget==='central'?theme.primary:theme.muted}}>CENTRAL BANK</button></div>
          {transferTarget==='student'&&<input type="text" value={transferTo} onChange={(e)=>setTransferTo(e.target.value.toUpperCase())} maxLength={6} placeholder="RECIPIENT CODE" className="w-full rounded-2xl border bg-black/25 px-3 py-3 text-center text-xs tracking-[0.25em] outline-none mb-3" style={{borderColor:theme.border,color:theme.accent,fontFamily:FONT_MONO}}/>}
          <input type="number" value={transferAmount} onChange={(e)=>setTransferAmount(e.target.value)} placeholder="AMOUNT" className="w-full rounded-2xl border bg-black/25 px-3 py-3 text-xs outline-none mb-3" style={{borderColor:theme.border,color:theme.accent}}/>
          <input type="text" value={transferNote} onChange={(e)=>setTransferNote(e.target.value)} maxLength={50} placeholder="MESSAGE · OPTIONAL" className="w-full rounded-2xl border bg-black/25 px-3 py-3 text-xs outline-none mb-3" style={{borderColor:theme.border,color:theme.accent}}/>
          {transferError&&<div className="text-xs mb-3" style={{color:theme.danger}}>{transferError}</div>}{transferSuccess&&<div className="text-xs mb-3" style={{color:theme.success}}>{transferSuccess}</div>}
          <button onClick={handleTransfer} className="w-full rounded-2xl py-3 text-xs font-bold tracking-[0.12em]" style={{background:theme.primary,color:'#09070B'}}>SEND IGOs</button>
        </div>
      </Modal>}

      {activeModal === 'request' && <Modal onClose={()=>setActiveModal(null)} theme={theme} title="Requests">
        <div className="p-5">
          {incomingReqs.length > 0 && (
            <div className="mb-6">
              <div className="text-[9px] tracking-[0.2em] mb-3" style={{color:theme.muted}}>THEY'RE ASKING YOU</div>
              {incomingReqs.map(r => (
                <div key={r.id} className="rounded-2xl border p-4 mb-2" style={{borderColor:theme.border, background:'rgba(255,255,255,.025)'}}>
                  <div className="flex justify-between mb-1">
                    <div className="text-sm" style={{color:theme.accent}}>{r.fromName}</div>
                    <div className="text-sm" style={{color:theme.money, fontFamily:FONT_MONO}}>{r.amount.toLocaleString('en-US')}</div>
                  </div>
                  {r.note && <div className="text-[11px] mb-3" style={{color:theme.muted}}>"{r.note}"</div>}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button onClick={() => resolvePayRequest(r, true)} className="rounded-xl py-2.5 text-[10px] font-bold" style={{background:theme.primary, color:'#09070B'}}>PAY</button>
                    <button onClick={() => resolvePayRequest(r, false)} className="rounded-xl py-2.5 text-[10px] font-bold border" style={{borderColor:theme.border, color:theme.danger}}>DECLINE</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-[9px] tracking-[0.2em] mb-3" style={{color:theme.muted}}>REQUEST FROM A MEMBER</div>
          <input type="text" value={reqTo} onChange={(e)=>setReqTo(e.target.value.toUpperCase())} maxLength={6} placeholder="MEMBER CODE" className="w-full rounded-2xl border bg-black/25 px-3 py-3 text-center text-xs tracking-[0.25em] outline-none mb-3" style={{borderColor:theme.border,color:theme.accent,fontFamily:FONT_MONO}}/>
          <input type="number" value={reqAmount} onChange={(e)=>setReqAmount(e.target.value)} placeholder="AMOUNT" className="w-full rounded-2xl border bg-black/25 px-3 py-3 text-xs outline-none mb-3" style={{borderColor:theme.border,color:theme.accent}}/>
          <input type="text" value={reqNote} onChange={(e)=>setReqNote(e.target.value)} maxLength={50} placeholder="REASON · OPTIONAL" className="w-full rounded-2xl border bg-black/25 px-3 py-3 text-xs outline-none mb-4" style={{borderColor:theme.border,color:theme.accent}}/>
          <button onClick={sendPayRequest} className="w-full rounded-2xl py-3 text-xs font-bold tracking-[0.12em]" style={{background:theme.primary,color:'#09070B'}}>SEND REQUEST</button>
        </div>
      </Modal>}

      {activeModal === 'pin' && <Modal onClose={()=>setActiveModal(null)} theme={theme} title="Change PIN"><div className="p-5"><input type="password" value={oldPin} onChange={(e)=>setOldPin(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="CURRENT PIN" className="w-full rounded-2xl border bg-black/25 px-3 py-3 text-center text-xs tracking-[0.3em] outline-none mb-3" style={{borderColor:theme.border,color:theme.accent}}/><input type="password" value={newPin} onChange={(e)=>setNewPin(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="NEW 4-DIGIT PIN" className="w-full rounded-2xl border bg-black/25 px-3 py-3 text-center text-xs tracking-[0.3em] outline-none mb-3" style={{borderColor:theme.border,color:theme.accent}}/>{pinError&&<div className="text-xs mb-3" style={{color:theme.danger}}>{pinError}</div>}{pinSuccess&&<div className="text-xs mb-3" style={{color:theme.success}}>{pinSuccess}</div>}<button onClick={handleChangePin} className="w-full rounded-2xl py-3 text-xs font-bold" style={{background:theme.primary,color:'#09070B'}}>UPDATE PIN</button></div></Modal>}
    </div>
  );
}

function Modal({ children, onClose, theme, title, wide }) {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 z-50" onClick={onClose}>
      <div className={`${wide?'max-w-2xl':'max-w-md'} w-full max-h-[88vh] overflow-y-auto rounded-[28px] border`} style={{background:theme.surface,borderColor:theme.border,boxShadow:'0 30px 90px rgba(0,0,0,.55)'}} onClick={(e)=>e.stopPropagation()}>
        <div className="p-5 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xl" style={{background:`${theme.surface}F0`,color:theme.accent}}><div><div className="text-[8px] tracking-[0.24em] mb-1" style={{color:theme.primary}}>P4 RESERVE</div><h3 className="text-lg font-semibold">{title}</h3></div><button onClick={onClose} className="w-9 h-9 rounded-full border flex items-center justify-center" style={{borderColor:theme.border,color:theme.muted}}><X size={17}/></button></div>{children}
      </div>
    </div>
  );
}

// ============= TEACHER VIEW =============
function TeacherView({ data, saveData, setView, onLogout, toast }) {
  const [tab, setTab] = useState('students');
  const [newStudentName, setNewStudentName] = useState('');
  const [customAmount, setCustomAmount] = useState({});
  const [reason, setReason] = useState({});
  const [showHistory, setShowHistory] = useState(null);
  const [showCodes, setShowCodes] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');
  const [liveSearch, setLiveSearch] = useState('');
  const selfSignupOn = data.settings?.selfSignup !== false;

  const nameOfAccount = (id) => {
    if (id === CENTRAL_BANK_ID) return 'Central Bank';
    const st = (data.students || []).find(x => x.id === id);
    return st ? (st.displayName || st.name) : 'Unknown';
  };

  const filteredTx = liveSearch.trim()
    ? (data.transactions || []).filter(t => (String(t.reason || '') + ' ' + nameOfAccount(t.studentId)).toLowerCase().includes(liveSearch.trim().toLowerCase()))
    : (data.transactions || []);

  const exportCSV = () => {
    const rows = [['Date', 'Account', 'Amount', 'Reason', 'Status']];
    (data.transactions || []).forEach(t => rows.push([
      new Date(t.date).toLocaleString('en-US'), nameOfAccount(t.studentId), t.amount,
      String(t.reason || '').replace(/"/g, "'"), t.pending ? 'pending' : 'settled'
    ]));
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `p4-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    if (toast) toast('CSV downloaded');
  };
  const [classAmount, setClassAmount] = useState(1000);
  const [classReason, setClassReason] = useState('Live class answer');
  const [classAwarded, setClassAwarded] = useState(null);

  const pendingRequests = (data.bonusRequests || []).filter(r => r.status === 'pending');

  const addStudent = () => {
    if (!newStudentName.trim()) return;
    const today = new Date();
    const validThru = `${String(today.getMonth() + 1).padStart(2, '0')}/${String((today.getFullYear() + 4) % 100).padStart(2, '0')}`;
    let accessCode;
    do { accessCode = generateAccessCode(); } while (data.students.some(s => s.accessCode === accessCode));
    const newStudent = {
      id: Date.now().toString(), name: newStudentName.trim(), displayName: newStudentName.trim(),
      balance: 0, cardNumber: generateCardNumber(), cvv: generateCVV(),
      validThru, accessCode, cardDesign: 'midnight', pin: null, theme: 'imperial_blue',
      reservedBalance: 0
    };
    saveData({ ...data, students: [...data.students, newStudent] });
    setNewStudentName('');
  };

  const removeStudent = (id) => {
    if (!confirm('Delete this student?')) return;
    saveData({ ...data, students: data.students.filter(s => s.id !== id), transactions: (data.transactions || []).filter(t => t.studentId !== id), bonusRequests: (data.bonusRequests || []).filter(r => r.studentId !== id) });
  };

  const resetStudentPin = (id) => {
    if (!confirm('Reset this student\'s PIN? They will create a new one on next login.')) return;
    saveData({ ...data, students: data.students.map(s => s.id === id ? { ...s, pin: null } : s) });
    alert('PIN reset. Student will create new PIN on next login.');
  };

  const toggleSanction = (id) => {
    const st = data.students.find(x => x.id === id);
    saveData({ ...data, students: data.students.map(x => x.id === id ? { ...x, sanctioned: !x.sanctioned } : x) });
    if (toast) toast(st?.sanctioned ? 'Suspension lifted' : 'Account suspended');
  };

  const removeStudentImage = (id) => {
    if (!confirm('Remove this student\'s custom image?')) return;
    saveData({ ...data, students: data.students.map(s => s.id === id ? { ...s, customImage: null } : s) });
  };

  const updateBalance = (studentId, amount, txReason = '') => {
    const updated = {
      ...data,
      students: data.students.map(s => s.id === studentId ? { ...s, balance: s.balance + amount } : s),
      transactions: [{ id: Date.now() + Math.random(), studentId, amount, reason: txReason || (amount > 0 ? 'Correct answer' : 'Penalty'), date: new Date().toISOString() }, ...(data.transactions || [])]
    };
    saveData(updated);
  };

  const quickAward = (studentId) => {
    const amount = parseInt(classAmount || '0');
    if (!amount || amount <= 0) return;
    const selected = data.students.find(s => s.id === studentId);
    updateBalance(studentId, amount, classReason.trim() || 'Live class answer');
    setClassAwarded({ name: selected?.displayName || selected?.name || 'Student', amount });
    setTimeout(() => setClassAwarded(null), 1200);
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
      bonusRequests: (data.bonusRequests || []).map(r => r.id === request.id ? { ...r, status: 'approved', resolvedAt: new Date().toISOString() } : r),
      transactions: (data.transactions || []).map(t => t.requestId === request.id ? { ...t, reason: `✓ Bonus approved: ${request.bonusName}${bonusLabel}`, pending: false } : t)
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
      bonusRequests: (data.bonusRequests || []).map(r => r.id === request.id ? { ...r, status: 'rejected', resolvedAt: new Date().toISOString() } : r),
      transactions: (data.transactions || []).map(t => t.requestId === request.id ? { ...t, reason: `✗ Bonus rejected: ${request.bonusName} (refunded)`, pending: false } : t)
    };
    updated.transactions = [
      { id: Date.now() + 'rf', studentId: request.studentId, amount: request.amount, reason: `Refund: ${request.bonusName}`, date: new Date().toISOString() },
      ...updated.transactions
    ];
    saveData(updated);
  };

  const resetAll = () => {
    if (!confirm('DELETE EVERYTHING? This cannot be undone.')) return;
    saveData({ students: [], transactions: [], bonusRequests: [], payRequests: [], settings: data.settings || { selfSignup: true }, centralBank: { balance: 0, name: 'P4 Central Bank' } });
  };

  const sortedStudents = [...data.students].sort((a, b) => b.balance - a.balance);
  const totalDistributed = (data.transactions || []).filter(t => t.amount > 0 && t.studentId !== CENTRAL_BANK_ID && !t.reason.startsWith('Transfer') && !t.reason.startsWith('Refund')).reduce((s, t) => s + t.amount, 0);

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
          <button onClick={() => setTab('class')} className={`px-4 py-3 text-sm font-bold tracking-widest transition-colors ${tab === 'class' ? 'text-violet-300 border-b-2 border-violet-400' : 'text-stone-500 hover:text-violet-200'}`}>
            <Zap size={16} className="inline mr-1" /> CLASS MODE
          </button>
          <button onClick={() => setTab('students')} className={`px-4 py-3 text-sm font-bold tracking-widest transition-colors ${tab === 'students' ? 'text-amber-400 border-b-2 border-amber-500' : 'text-stone-500 hover:text-amber-200'}`}>
            <Users size={16} className="inline mr-1" /> STUDENTS
          </button>
          <button onClick={() => setTab('requests')} className={`px-4 py-3 text-sm font-bold tracking-widest transition-colors relative ${tab === 'requests' ? 'text-amber-400 border-b-2 border-amber-500' : 'text-stone-500 hover:text-amber-200'}`}>
            <ShoppingCart size={16} className="inline mr-1" /> REQUESTS
            {pendingRequests.length > 0 && <span className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{pendingRequests.length}</span>}
          </button>
          <button onClick={() => setTab('live')} className={`px-4 py-3 text-sm font-bold tracking-widest transition-colors ${tab === 'live' ? 'text-emerald-300 border-b-2 border-emerald-400' : 'text-stone-500 hover:text-emerald-200'}`}>
            <Activity size={16} className="inline mr-1" /> FEED
          </button>
          <button onClick={() => setTab('central')} className={`px-4 py-3 text-sm font-bold tracking-widest transition-colors ${tab === 'central' ? 'text-amber-400 border-b-2 border-amber-500' : 'text-stone-500 hover:text-amber-200'}`}>
            <Building2 size={16} className="inline mr-1" /> CENTRAL BANK
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {tab === 'live' && (
          <div>
            <div className="flex flex-wrap gap-3 mb-5">
              <div className="relative flex-1 min-w-[220px]">
                <Search size={16} className="absolute left-3 top-3.5 text-stone-500" />
                <input value={liveSearch} onChange={(e) => setLiveSearch(e.target.value)}
                  placeholder="Search by member or reason"
                  className="w-full rounded-2xl pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 outline-none focus:border-emerald-400/60 text-white text-sm placeholder-stone-500" />
              </div>
              <button onClick={exportCSV} className="rounded-2xl px-5 py-3 border border-white/12 text-sm text-white/80 hover:bg-white/5 flex items-center gap-2">
                <Download size={15} /> CSV
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[10px] tracking-[0.22em] text-stone-500">TRANSACTIONS</div>
                <div className="text-2xl font-semibold text-white mt-1" style={{fontFamily: FONT_MONO}}>{(data.transactions || []).length}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[10px] tracking-[0.22em] text-stone-500">RESERVE</div>
                <div className="text-2xl font-semibold text-amber-200 mt-1" style={{fontFamily: FONT_MONO}}>{(data.centralBank?.balance || 0).toLocaleString('en-US')}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[10px] tracking-[0.22em] text-stone-500">PENDING</div>
                <div className={`text-2xl font-semibold mt-1 ${pendingRequests.length ? 'text-amber-300' : 'text-white'}`} style={{fontFamily: FONT_MONO}}>{pendingRequests.length}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[10px] tracking-[0.22em] text-stone-500">MEMBERS</div>
                <div className="text-2xl font-semibold text-white mt-1" style={{fontFamily: FONT_MONO}}>{(data.students || []).length}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-stone-300">Live transaction feed</span>
            </div>

            <div className="rounded-3xl border border-white/10 overflow-hidden bg-white/[0.02]">
              {filteredTx.length === 0 ? (
                <div className="p-10 text-center text-stone-500 text-sm">No matching transactions.</div>
              ) : filteredTx.slice(0, 60).map((t, i) => (
                <div key={t.id} className={`px-4 py-3 flex items-center justify-between gap-3 ${i === 0 ? '' : 'border-t border-white/8'}`}>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-white truncate">{nameOfAccount(t.studentId)}</div>
                    <div className="text-xs text-stone-500 truncate">{t.reason}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-sm font-semibold ${t.pending ? 'text-amber-300' : t.amount > 0 ? 'text-emerald-300' : 'text-rose-300'}`} style={{fontFamily: FONT_MONO}}>
                      {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('en-US')}
                    </div>
                    <div className="text-[11px] text-stone-600">{shortDate(t.date)}</div>
                  </div>
                </div>
              ))}
            </div>
            {filteredTx.length > 60 && <div className="text-xs text-stone-500 text-center mt-3">Showing 60 of {filteredTx.length}. Download the CSV for the full list.</div>}
          </div>
        )}

        {tab === 'class' && (
          <div>
            <div className="mb-5 rounded-3xl border border-violet-500/30 p-5 md:p-6 relative overflow-hidden" style={{background:'radial-gradient(circle at 90% 0%, rgba(139,92,246,.23), transparent 35%), linear-gradient(145deg,#14101A,#09080C)'}}>
              <div className="absolute -right-16 -top-20 w-56 h-56 rounded-full bg-violet-600/10 blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
                <div>
                  <div className="text-[10px] tracking-[0.32em] text-violet-300">LIVE CLASS CONSOLE</div>
                  <h2 className="text-3xl text-white mt-2" style={{fontFamily:FONT_DISPLAY}}>One tap. Credit awarded.</h2>
                  <p className="text-stone-400 text-sm mt-2 max-w-lg">Choose the value once, then tap a student as answers happen in the room.</p>
                </div>
                <div className="text-right"><div className="text-[10px] tracking-[0.2em] text-stone-500">ACTIVE VALUE</div><div className="text-3xl font-bold text-violet-300">+{Number(classAmount || 0).toLocaleString('en-US')} IGOs</div></div>
              </div>
            </div>

            <div className="grid lg:grid-cols-[320px_1fr] gap-4">
              <aside className="rounded-3xl border border-stone-800 bg-stone-950 p-4 h-fit">
                <div className="text-xs tracking-[0.18em] text-stone-400 mb-3">AWARD VALUE</div>
                <div className="grid grid-cols-2 gap-2 mb-4">{[500,1000,1500,2000].map(amt => <button key={amt} onClick={()=>setClassAmount(amt)} className={`rounded-2xl border py-3 text-sm font-bold ${Number(classAmount)===amt?'border-violet-400 bg-violet-500/15 text-violet-200':'border-stone-800 text-stone-400 hover:border-stone-600'}`}>+{amt.toLocaleString('en-US')}</button>)}</div>
                <label className="block text-[10px] tracking-[0.18em] text-stone-500 mb-2">CUSTOM</label>
                <input type="number" value={classAmount} onChange={(e)=>setClassAmount(e.target.value)} className="w-full rounded-2xl border border-stone-800 bg-black px-4 py-3 text-white outline-none focus:border-violet-500 mb-4" />
                <label className="block text-[10px] tracking-[0.18em] text-stone-500 mb-2">REASON</label>
                <input type="text" value={classReason} onChange={(e)=>setClassReason(e.target.value)} className="w-full rounded-2xl border border-stone-800 bg-black px-4 py-3 text-white outline-none focus:border-violet-500" placeholder="Live class answer" />
                <div className="mt-4 text-[11px] text-stone-500 leading-5">Tip: keep this screen open during class. Firebase updates the student's balance immediately.</div>
              </aside>

              <section>
                {classAwarded && <div className="mb-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-300 text-sm font-semibold">+{classAwarded.amount.toLocaleString('en-US')} IGOs → {classAwarded.name}</div>}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
                  {sortedStudents.map((student, idx) => <button key={student.id} onClick={()=>quickAward(student.id)} className="group rounded-3xl border border-stone-800 bg-stone-950 hover:border-violet-500/60 hover:bg-violet-500/5 p-4 text-left transition-all active:scale-[.98]">
                    <div className="flex items-start justify-between gap-2"><div className="w-9 h-9 rounded-full border border-stone-700 flex items-center justify-center text-xs font-bold text-stone-300">{(student.displayName||student.name).split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase()}</div><div className="text-[10px] text-stone-600">#{idx+1}</div></div>
                    <div className="mt-5 text-sm font-semibold text-stone-100 truncate">{student.displayName || student.name}</div>
                    <div className="text-[11px] text-stone-500 mt-1">{student.balance.toLocaleString('en-US')} IGOs</div>
                    <div className="mt-4 text-[10px] font-bold tracking-[0.12em] text-violet-300 opacity-70 group-hover:opacity-100">AWARD +{Number(classAmount||0).toLocaleString('en-US')}</div>
                  </button>)}
                </div>
              </section>
            </div>
          </div>
        )}

        {tab === 'students' && (
          <>
            <section className="bg-gradient-to-br from-stone-900 to-black border border-amber-700 p-5 mb-4">
              <h2 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2"><UserPlus size={20} /> Open New Account</h2>
              <div className="flex gap-2 flex-wrap">
                <input type="text" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addStudent()} placeholder="Student name" className="flex-1 min-w-[200px] px-4 py-2 border-2 border-amber-700 bg-black text-amber-100 outline-none focus:border-amber-400" />
                <button onClick={addStudent} className="bg-gradient-to-r from-amber-600 to-amber-700 text-black px-6 py-2 font-bold tracking-wide">REGISTER</button>
              </div>
              <p className="text-xs text-stone-500 mt-3">A code is generated automatically. Balance always starts at 0.</p>
            </section>

            <section className="bg-stone-900/60 border border-amber-800/60 p-5 mb-4 flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="text-sm font-bold text-amber-300">Open enrollment</div>
                <div className="text-xs text-stone-400 mt-1">
                  {selfSignupOn ? `Students join on their own with code ${CLASS_CODE}` : 'Only you can create accounts'}
                </div>
              </div>
              <button onClick={() => saveData({ ...data, settings: { ...(data.settings || {}), selfSignup: !selfSignupOn } })}
                className="shrink-0 rounded-full p-1 transition-colors" style={{width: 52, height: 30, background: selfSignupOn ? '#C9A227' : '#3A3340'}}>
                <div className="rounded-full bg-black transition-transform" style={{width: 22, height: 22, transform: selfSignupOn ? 'translateX(22px)' : 'none'}} />
              </button>
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
                  const unlockedCount = CARD_DESIGNS.filter(d => hasUnlocked(student, d, data.transactions || [])).length;
                  return (
                  <article key={student.id} className="bg-gradient-to-br from-stone-900 to-black border border-amber-700">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 flex items-center justify-center font-bold ${idx === 0 ? 'bg-amber-500 text-black' : idx === 1 ? 'bg-stone-400 text-black' : idx === 2 ? 'bg-amber-700 text-black' : 'bg-stone-700 text-stone-300'}`}>{idx + 1}</div>
                          <div>
                            <h3 className="text-xl font-bold text-amber-100" style={{fontFamily: FONT_DISPLAY}}>{student.name}</h3>
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
                        <button onClick={() => toggleSanction(student.id)} className={`p-2 ${student.sanctioned ? 'bg-emerald-900 text-emerald-200' : 'bg-stone-800 text-stone-400 hover:text-rose-300'}`} title={student.sanctioned ? 'Lift suspension' : 'Suspend account'}><Ban size={18} /></button>
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
                          <div className="font-bold text-amber-100 text-lg" style={{fontFamily: FONT_DISPLAY}}>{r.bonusName}</div>
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

            {(data.bonusRequests || []).filter(r => r.status !== 'pending').length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-stone-400 mb-2 tracking-widest">HISTORY</h3>
                <div className="space-y-2">
                  {(data.bonusRequests || []).filter(r => r.status !== 'pending').slice(0, 30).map(r => (
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
              {(data.transactions || []).filter(t => t.studentId === CENTRAL_BANK_ID).length === 0 ? (
                <p className="text-amber-200/60 italic text-center py-8">No transactions yet.</p>
              ) : (
                (data.transactions || []).filter(t => t.studentId === CENTRAL_BANK_ID).map(tx => (
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
            <div className="p-4 flex items-center justify-between" style={{background: 'linear-gradient(135deg, #000000 0%, #1c1917 100%)', color: '#d4af37'}}>
              <div>
                <div className="text-xs tracking-widest text-amber-500">STATEMENT</div>
                <h3 className="text-xl font-bold" style={{fontFamily: FONT_DISPLAY}}>{data.students.find(s => s.id === showHistory)?.name}</h3>
              </div>
              <button onClick={() => setShowHistory(null)} className="hover:opacity-70 p-2"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto p-4 flex-1">
              {(data.transactions || []).filter(t => t.studentId === showHistory).length === 0 ? <p className="text-stone-500 italic text-center py-8">No activity.</p> : (
                <div className="space-y-2">
                  {(data.transactions || []).filter(t => t.studentId === showHistory).map(tx => (
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
