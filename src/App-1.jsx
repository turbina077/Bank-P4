import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Trash2, Trophy, UserPlus, X, CreditCard, LogOut, Copy, Eye, EyeOff, Send, Check, Lock, ShoppingCart, Building2, Clock, CheckCircle, XCircle, Image as ImageIcon, KeyRound, RotateCcw, Snowflake, Target, Activity, Radio, MoreHorizontal, ArrowDownLeft, Ban, Search, Download } from 'lucide-react';
import { saveBankData, subscribeToData } from './firebase';

const TEACHER_PASSWORD = 'urbina2026';
const CLASS_CODE = 'RRII2026';
const CENTRAL_BANK_ID = 'CENTRAL_BANK';
const CURRENCY = 'IGOs';

const DEFAULT_DATA = {
  students: [],
  transactions: [],
  bonusRequests: [],
  payRequests: [],
  centralBank: { balance: 0, name: 'P4 Central Bank' },
  settings: { selfSignup: true }
};

const FONT = "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const NUM = "'Space Grotesk', 'SF Mono', Menlo, monospace";
const DISPLAY = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const MONO = NUM;
const CAPS = { textTransform: 'uppercase', letterSpacing: '.14em' };

const C = {
  bg: '#07060A',
  bg2: '#0D0A12',
  surface: '#15101C',
  raised: '#1C1426',
  border: '#2A2035',
  borderStrong: '#443452',
  primary: '#8B5CF6',
  primaryBtn: '#8154F0',
  primaryLight: '#A78BFA',
  primaryDark: '#6D3FEA',
  gold: '#E1C078',
  goldBright: '#F2D58E',
  onGold: '#09070B',
  text: '#F5F2F7',
  text2: '#A59EAC',
  text3: '#716A78',
  up: '#4DDBA8',
  down: '#FF667A',
  pending: '#F4B860',
  info: '#5B8CFF'
};

const CARD_DESIGNS = [
  { id: 'graphite',  name: 'Grafito',       tier: 'basic', bg: '#15101C', ink: '#EDE8F2', sub: '#948CA0', chip: '#332843' },
  { id: 'slate',     name: 'Pizarra',       tier: 'basic', bg: '#171A21', ink: '#E6EAF0', sub: '#8F98A8', chip: '#333B49' },
  { id: 'sand',      name: 'Arena',         tier: 'basic', bg: '#241D16', ink: '#F1E5D3', sub: '#B39E80', chip: '#4E4032' },
  { id: 'sage',      name: 'Salvia',        tier: 'basic', bg: '#18241F', ink: '#DCEDE3', sub: '#84A995', chip: '#31473D' },

  { id: 'obsidian',  name: 'Obsidiana',     tier: 'premium', minEarned: 25000, bg: '#0C0A10', ink: '#F2EEF6', sub: '#9C94A6', chip: '#2B2337' },
  { id: 'plum',      name: 'Ciruela',       tier: 'premium', minEarned: 25000, bg: '#241733', ink: '#EDDDFA', sub: '#A78BC4', chip: '#452C60' },
  { id: 'champagne', name: 'Champagne',     tier: 'premium', minEarned: 25000, bg: '#2E2618', ink: '#F7E6BE', sub: '#C0A469', chip: '#5A4B2C' },
  { id: 'rosegold',  name: 'Oro rosa',      tier: 'premium', minEarned: 25000, bg: '#33211F', ink: '#FBDDD2', sub: '#CE9D8C', chip: '#5F3E39' },

  { id: 'amethyst',  name: 'Amatista',      tier: 'elite', minEarned: 75000, bg: '#241A45', ink: '#DFD3FA', sub: '#A190D3', chip: '#3F3172' },
  { id: 'ruby',      name: 'Rubi',          tier: 'elite', minEarned: 75000, bg: '#3A1020', ink: '#FBCFDA', sub: '#C87F94', chip: '#661E38' },
  { id: 'sapphire',  name: 'Zafiro',        tier: 'elite', minEarned: 75000, bg: '#0D2245', ink: '#CBDEF7', sub: '#7A9CC8', chip: '#1D3D6E' },
  { id: 'emerald',   name: 'Esmeralda',     tier: 'elite', minEarned: 75000, bg: '#0D3229', ink: '#C8F0DE', sub: '#5CAC90', chip: '#1C574A' },

  { id: 'pearl',     name: 'Nacar',         tier: 'legendary', minEarned: 150000, bg: '#EDE7F0', ink: '#33203C', sub: '#6E5A78', chip: '#CDC0D4' },
  { id: 'opal',      name: 'Opalo',         tier: 'legendary', minEarned: 150000, bg: '#DFE3EE', ink: '#1F2C48', sub: '#455C82', chip: '#B9C2D6' },
  { id: 'iridium',   name: 'Iridio',        tier: 'legendary', minEarned: 150000, bg: '#14161B', ink: '#E2E9F1', sub: '#8FA0B2', chip: '#333C48' },
  { id: 'aurora',    name: 'Aurora',        tier: 'legendary', minEarned: 150000, bg: '#122A33', ink: '#CBEFF4', sub: '#69A6B3', chip: '#204F5C' }
];

const TIERS = {
  basic: { label: 'Basico', min: 0 },
  premium: { label: 'Premium', min: 25000 },
  elite: { label: 'Elite', min: 75000 },
  legendary: { label: 'Legendaria', min: 150000 }
};

const BONUS_SHOP = [
  { id: 'country', name: 'Elegir pais para la simulacion', value: null },
  { id: 'paper', name: 'Presentacion de position paper', value: 0.5 },
  { id: 'exam', name: 'Examen', value: 0.5 },
  { id: 'igo', name: 'Caracterizacion de OIG', value: 0.5 },
  { id: 'negotiation', name: 'Propuesta de negociacion estrategica', value: 0.25 }
];

const genCardNumber = () => Array.from({length: 4}, () => Math.floor(1000 + Math.random() * 9000)).join(' ');
const genAccessCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length: 6}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};
const genCVV = () => Math.floor(100 + Math.random() * 900).toString();
const money = (n) => `${Number(n || 0).toLocaleString('es-CO')} ${CURRENCY}`;
const shortMoney = (n) => Number(n || 0).toLocaleString('es-CO');

const REFUND_PREFIX = /^(Reembolso|Refund)/;
const TRANSFER_PREFIX = /^(Transferencia|Transfer|Ayuda|Cobro)/;

const earnedBy = (id, txs) => (txs || [])
  .filter(t => t.studentId === id && t.amount > 0 && !REFUND_PREFIX.test(String(t.reason || '')))
  .reduce((s, t) => s + t.amount, 0);

const hasUnlocked = (student, design, txs) => {
  if (design.tier === 'basic') return true;
  return earnedBy(student.id, txs) >= (design.minEarned || 0);
};

const designOf = (student) => CARD_DESIGNS.find(d => d.id === (student.cardDesign || 'graphite')) || CARD_DESIGNS[0];

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'ahora';
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.floor(h / 24)} d`;
};

const copyText = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; }
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch { return false; }
};

const compressImage = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(600 / img.width, 400 / img.height, 1);
        canvas.width = Math.floor(img.width * ratio);
        canvas.height = Math.floor(img.height * ratio);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      } catch (err) { reject(err); }
    };
    img.onerror = () => reject(new Error('img'));
    img.src = e.target.result;
  };
  reader.onerror = () => reject(new Error('read'));
  reader.readAsDataURL(file);
});

function Btn({ children, onClick, variant = 'ghost', full, disabled, style = {} }) {
  const base = {
    borderRadius: 12, padding: '13px 16px', fontSize: 14, fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer', width: full ? '100%' : 'auto',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'all .25s ease', opacity: disabled ? 0.4 : 1, fontFamily: FONT
  };
  const variants = {
    primary: { background: C.primaryBtn, color: '#FFFFFF', border: 'none' },
    gold: { background: C.gold, color: C.onGold, border: 'none' },
    ghost: { background: 'transparent', color: C.text2, border: `1px solid ${C.border}` },
    solid: { background: C.surface, color: C.text, border: `1px solid ${C.border}` },
    danger: { background: 'transparent', color: C.down, border: `1px solid ${C.down}44` }
  };
  return <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
}

function Field({ label, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, color: C.text3, marginBottom: 6 }}>{label}</div>}
      <input {...props} style={{
        width: '100%', background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10,
        padding: '12px 14px', color: C.text, fontSize: 15, outline: 'none', fontFamily: FONT, ...props.style
      }} />
    </div>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.82)', zIndex: 60,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 0
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: C.surface, borderTopLeftRadius: 22, borderTopRightRadius: 22,
        width: '100%', maxWidth: wide ? 720 : 520, maxHeight: '88vh',
        display: 'flex', flexDirection: 'column', border: `1px solid ${C.border}`, borderBottom: 'none'
      }}>
        <div style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 17, color: C.text, fontWeight: 500 }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.text3, cursor: 'pointer', padding: 4 }}><X size={20} /></button>
        </div>
        <div style={{ padding: 20, overflowY: 'auto' }}>{children}</div>
      </div>
    </div>
  );
}

function Toast({ msg, kind }) {
  if (!msg) return null;
  return (
    <div style={{
      position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 90,
      background: C.raised, border: `1px solid ${kind === 'bad' ? C.down + '66' : C.border}`,
      borderRadius: 12, padding: '12px 18px', color: kind === 'bad' ? C.down : C.text,
      fontSize: 14, maxWidth: '90vw', textAlign: 'center', fontFamily: FONT
    }}>{msg}</div>
  );
}

function Counter({ value }) {
  const [shown, setShown] = useState(value);
  const ref = useRef(value);
  useEffect(() => {
    const from = ref.current, to = value;
    if (from === to) return;
    const t0 = performance.now(), dur = 650;
    let raf;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(from + (to - from) * e));
      if (p < 1) raf = requestAnimationFrame(tick); else ref.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{shortMoney(shown)}</>;
}

function CardVisual({ student, reveal, compact }) {
  const d = designOf(student);
  const custom = student.customImage;
  const frozen = student.frozen;
  const bg = custom ? { backgroundImage: `url(${custom})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: d.bg };
  const ink = custom ? '#ffffff' : d.ink;
  const sub = custom ? '#d8d8d8' : d.sub;

  return (
    <div style={{
      position: 'relative', borderRadius: 18, padding: compact ? 16 : 18,
      border: `1px solid ${C.border}`, overflow: 'hidden', ...bg,
      filter: frozen ? 'grayscale(.85) brightness(.7)' : 'none', transition: 'filter .4s ease'
    }}>
      {custom && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,rgba(0,0,0,.55),rgba(0,0,0,.75))' }} />}
      {frozen && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
          <div style={{ background: 'rgba(0,0,0,.62)', borderRadius: 10, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 7 }}>
            <Snowflake size={15} color="#9fd8ec" />
            <span style={{ fontSize: 12, color: '#d5eef8' }}>Congelada</span>
          </div>
        </div>
      )}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: compact ? 26 : 34 }}>
          <div style={{ fontSize: 10, color: sub, ...CAPS }}>{custom ? 'Personalizada' : d.name}</div>
          <div style={{ width: 26, height: 18, borderRadius: 3, background: custom ? '#555' : d.chip }} />
        </div>
        <div style={{ fontFamily: MONO, fontSize: compact ? 13 : 15, color: ink, letterSpacing: '.09em' }}>
          {reveal ? student.cardNumber : '•••• •••• •••• ' + String(student.cardNumber || '').slice(-4)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12 }}>
          <div style={{ fontSize: 12, color: ink, textTransform: 'uppercase', letterSpacing: '.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
            {student.displayName || student.name}
          </div>
          <div style={{ display: 'flex', gap: 12, fontFamily: MONO, fontSize: 11, color: sub }}>
            <span>{reveal ? student.cvv : '•••'}</span>
            <span>{student.validThru}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LockedCard({ design }) {
  return (
    <div style={{
      borderRadius: 12, height: 84, padding: 11, background: '#0f0f11',
      border: `1px dashed ${C.borderStrong}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
    }}>
      <Lock size={14} color={C.text3} />
      <div>
        <div style={{ fontSize: 12, color: C.text2 }}>{design.name}</div>
        <div style={{ fontSize: 10, color: C.text3 }}>{shortMoney(design.minEarned)} ganados</div>
      </div>
    </div>
  );
}

function Home({ setView, selfSignup }) {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ marginBottom: 44 }}>
          <div style={{ fontSize: 40, color: C.text, fontWeight: 600, fontFamily: DISPLAY, letterSpacing: '.01em' }}>P4 Central Bank</div>
          <div style={{ fontSize: 14, color: C.text3, marginTop: 6 }}>Simulacion de relaciones internacionales</div>
        </div>

        <div onClick={() => setView('student-login')} style={{
          background: C.raised, borderRadius: 18, padding: 17, marginBottom: 10,
          display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer', border: `1px solid ${C.border}`
        }}>
          <CreditCard size={20} color={C.primaryLight} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, color: C.text, fontWeight: 500 }}>Entrar con mi codigo</div>
            <div style={{ fontSize: 12, color: C.text3 }}>Ya tengo cuenta</div>
          </div>
        </div>

        {selfSignup && (
          <div onClick={() => setView('signup')} style={{
            background: C.surface, borderRadius: 18, padding: 17, marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer', border: `1px solid ${C.border}`
          }}>
            <UserPlus size={20} color={C.text2} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, color: C.text, fontWeight: 500 }}>Abrir cuenta</div>
              <div style={{ fontSize: 12, color: C.text3 }}>Necesitas el codigo de la clase</div>
            </div>
          </div>
        )}

        <div onClick={() => setView('teacher-login')} style={{
          background: 'transparent', borderRadius: 18, padding: 17,
          display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer', border: `1px solid ${C.border}`
        }}>
          <Building2 size={20} color={C.text3} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, color: C.text2, fontWeight: 500 }}>Panel del profesor</div>
          </div>
        </div>

        <div style={{ marginTop: 40, fontSize: 11, color: C.text3, textAlign: 'center' }}>Prof. Tomas Urbina</div>
      </div>
    </div>
  );
}

function TeacherLogin({ pass, setPass, onLogin, error, setView }) {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: C.text3, fontSize: 14, cursor: 'pointer', marginBottom: 26, padding: 0 }}>Volver</button>
        <div style={{ fontSize: 22, color: C.text, fontWeight: 500, marginBottom: 4 }}>Panel del profesor</div>
        <div style={{ fontSize: 14, color: C.text3, marginBottom: 26 }}>Ingresa tu contrasena</div>
        <Field type="password" value={pass} onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onLogin()} placeholder="Contrasena" />
        {error && <div style={{ color: C.down, fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <Btn variant="gold" full onClick={onLogin}>Entrar</Btn>
      </div>
    </div>
  );
}

function StudentLogin({ code, setCode, pin, setPin, onLogin, error, setView, students }) {
  const found = (students || []).find(s => s.accessCode === code.trim().toUpperCase());
  const firstTime = found && !found.pin;
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: C.text3, fontSize: 14, cursor: 'pointer', marginBottom: 26, padding: 0 }}>Volver</button>
        <div style={{ fontSize: 22, color: C.text, fontWeight: 500, marginBottom: 4 }}>Entrar</div>
        <div style={{ fontSize: 14, color: C.text3, marginBottom: 26 }}>Tu codigo de acceso y tu PIN</div>
        <Field label="Codigo de acceso" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="A3K9P2" maxLength={6}
          style={{ fontFamily: MONO, fontSize: 20, letterSpacing: '.28em', textAlign: 'center' }} />
        <Field label={firstTime ? 'Crea tu PIN de 4 digitos' : 'PIN'} type="password" inputMode="numeric"
          value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          onKeyDown={(e) => e.key === 'Enter' && onLogin()} placeholder="••••" maxLength={4}
          style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '.5em', textAlign: 'center' }} />
        {firstTime && <div style={{ fontSize: 12, color: C.gold, marginBottom: 12 }}>Primera vez: elige un PIN que recuerdes.</div>}
        {error && <div style={{ color: C.down, fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <Btn variant="gold" full onClick={onLogin}>Entrar</Btn>
        <div style={{ fontSize: 12, color: C.text3, textAlign: 'center', marginTop: 18 }}>Olvidaste tu PIN? Pidele al profesor que lo reinicie.</div>
      </div>
    </div>
  );
}

function Signup({ name, setName, classCode, setClassCode, pin, setPin, onSignup, error, setView }) {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: C.text3, fontSize: 14, cursor: 'pointer', marginBottom: 26, padding: 0 }}>Volver</button>
        <div style={{ fontSize: 22, color: C.text, fontWeight: 500, marginBottom: 4 }}>Abrir cuenta</div>
        <div style={{ fontSize: 14, color: C.text3, marginBottom: 26 }}>Todas las cuentas inician en 0 {CURRENCY}</div>
        <Field label="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ana Perez" />
        <Field label="Codigo de la clase" value={classCode} onChange={(e) => setClassCode(e.target.value.toUpperCase())}
          placeholder="RRII2026" style={{ fontFamily: MONO, letterSpacing: '.18em', textAlign: 'center' }} />
        <Field label="Crea tu PIN de 4 digitos" type="password" inputMode="numeric" value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="••••" maxLength={4}
          style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '.5em', textAlign: 'center' }} />
        {error && <div style={{ color: C.down, fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <Btn variant="gold" full onClick={onSignup}>Crear cuenta</Btn>
      </div>
    </div>
  );
}

function StudentView({ student, data, saveData, onLogout, toast }) {
  const [modal, setModal] = useState(null);
  const [reveal, setReveal] = useState(false);
  const [toStudent, setToStudent] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [target, setTarget] = useState('student');
  const [isAid, setIsAid] = useState(false);
  const [txError, setTxError] = useState('');
  const [offer, setOffer] = useState({});
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinMsg, setPinMsg] = useState('');
  const [goal, setGoal] = useState(student.goalCard || '');
  const [reqTo, setReqTo] = useState('');
  const [reqAmount, setReqAmount] = useState('');
  const [reqNote, setReqNote] = useState('');
  const [editName, setEditName] = useState(student.displayName || student.name);
  const fileRef = useRef();

  const txs = data.transactions || [];
  const mine = txs.filter(t => t.studentId === student.id);
  const earned = earnedBy(student.id, txs);
  const spent = mine.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const unlocked = CARD_DESIGNS.filter(d => hasUnlocked(student, d, txs));
  const locked = CARD_DESIGNS.filter(d => !hasUnlocked(student, d, txs));
  const myBonus = (data.bonusRequests || []).filter(r => r.studentId === student.id);
  const pendingBonus = myBonus.filter(r => r.status === 'pending');
  const incomingReqs = (data.payRequests || []).filter(r => r.toId === student.id && r.status === 'pending');
  const sanctioned = !!student.sanctioned;

  const feed = txs.filter(t => t.public && t.amount > 0).slice(0, 25);

  const goalDesign = CARD_DESIGNS.find(d => d.id === goal);
  const goalProgress = goalDesign ? Math.min(100, Math.round((earned / goalDesign.minEarned) * 100)) : 0;

  const patchMe = (changes) => saveData({ ...data, students: data.students.map(s => s.id === student.id ? { ...s, ...changes } : s) });

  const doTransfer = () => {
    setTxError('');
    if (sanctioned) { setTxError('Tu cuenta esta sancionada. Habla con el profesor.'); return; }
    if (student.frozen) { setTxError('Tu tarjeta esta congelada. Descongelala primero.'); return; }
    const amt = parseInt(amount, 10);
    if (!amt || amt <= 0) { setTxError('Monto invalido.'); return; }
    if (amt > student.balance) { setTxError('Saldo insuficiente.'); return; }
    const tag = isAid ? 'Ayuda: ' : '';
    const suffix = note.trim() ? ' — ' + note.trim() : '';
    const now = new Date().toISOString();
    const me = student.displayName || student.name;

    if (target === 'central') {
      saveData({
        ...data,
        students: data.students.map(s => s.id === student.id ? { ...s, balance: s.balance - amt } : s),
        centralBank: { ...data.centralBank, balance: (data.centralBank?.balance || 0) + amt },
        transactions: [
          { id: Date.now() + 'a', studentId: student.id, amount: -amt, reason: `${tag}Transferencia al Banco Central${suffix}`, date: now },
          { id: Date.now() + 'b', studentId: CENTRAL_BANK_ID, amount: amt, reason: `${tag}Recibido de ${me}${suffix}`, date: now },
          ...txs
        ]
      });
    } else {
      const rec = data.students.find(s => s.accessCode === toStudent.trim().toUpperCase());
      if (!rec) { setTxError('Codigo de destinatario invalido.'); return; }
      if (rec.id === student.id) { setTxError('No puedes transferirte a ti mismo.'); return; }
      if (rec.sanctioned) { setTxError('Ese estudiante esta sancionado y no puede recibir fondos.'); return; }
      saveData({
        ...data,
        students: data.students.map(s => {
          if (s.id === student.id) return { ...s, balance: s.balance - amt };
          if (s.id === rec.id) return { ...s, balance: s.balance + amt };
          return s;
        }),
        transactions: [
          { id: Date.now() + 'a', studentId: student.id, amount: -amt, reason: `${tag}Transferencia a ${rec.displayName || rec.name}${suffix}`, date: now },
          { id: Date.now() + 'b', studentId: rec.id, amount: amt, reason: `${tag}Transferencia de ${me}${suffix}`, date: now, public: true, fromName: me, toName: rec.displayName || rec.name, note: note.trim(), aid: isAid },
          ...txs
        ]
      });
    }
    toast(`Enviaste ${money(amt)}`);
    setAmount(''); setToStudent(''); setNote(''); setIsAid(false);
    setTimeout(() => setModal(null), 700);
  };

  const sendPayRequest = () => {
    const amt = parseInt(reqAmount, 10);
    if (!amt || amt <= 0) { toast('Monto invalido', 'bad'); return; }
    const rec = data.students.find(s => s.accessCode === reqTo.trim().toUpperCase());
    if (!rec) { toast('Codigo invalido', 'bad'); return; }
    if (rec.id === student.id) { toast('No puedes cobrarte a ti mismo', 'bad'); return; }
    saveData({
      ...data,
      payRequests: [{
        id: Date.now().toString() + Math.random(), fromId: student.id, fromName: student.displayName || student.name,
        toId: rec.id, toName: rec.displayName || rec.name, amount: amt, note: reqNote.trim(),
        status: 'pending', date: new Date().toISOString()
      }, ...(data.payRequests || [])]
    });
    toast(`Cobro enviado a ${rec.displayName || rec.name}`);
    setReqAmount(''); setReqTo(''); setReqNote('');
    setTimeout(() => setModal(null), 700);
  };

  const resolvePayRequest = (req, accept) => {
    if (!accept) {
      saveData({ ...data, payRequests: (data.payRequests || []).map(r => r.id === req.id ? { ...r, status: 'rejected' } : r) });
      toast('Cobro rechazado');
      return;
    }
    if (req.amount > student.balance) { toast('Saldo insuficiente', 'bad'); return; }
    const now = new Date().toISOString();
    saveData({
      ...data,
      students: data.students.map(s => {
        if (s.id === student.id) return { ...s, balance: s.balance - req.amount };
        if (s.id === req.fromId) return { ...s, balance: s.balance + req.amount };
        return s;
      }),
      payRequests: (data.payRequests || []).map(r => r.id === req.id ? { ...r, status: 'paid' } : r),
      transactions: [
        { id: Date.now() + 'p1', studentId: student.id, amount: -req.amount, reason: `Cobro pagado a ${req.fromName}`, date: now },
        { id: Date.now() + 'p2', studentId: req.fromId, amount: req.amount, reason: `Cobro cobrado a ${student.displayName || student.name}`, date: now, public: true, fromName: student.displayName || student.name, toName: req.fromName, note: req.note },
        ...txs
      ]
    });
    toast(`Pagaste ${money(req.amount)}`);
  };

  const requestBonus = (bonus) => {
    const amt = parseInt(offer[bonus.id] || '0', 10);
    if (!amt || amt <= 0) { toast('Escribe una oferta valida', 'bad'); return; }
    if (amt > student.balance) { toast('Saldo insuficiente', 'bad'); return; }
    const req = {
      id: Date.now().toString() + Math.random(), studentId: student.id,
      studentName: student.displayName || student.name, bonusId: bonus.id, bonusName: bonus.name,
      bonusValue: bonus.value, amount: amt, status: 'pending', date: new Date().toISOString()
    };
    saveData({
      ...data,
      students: data.students.map(s => s.id === student.id ? { ...s, balance: s.balance - amt, reservedBalance: (s.reservedBalance || 0) + amt } : s),
      bonusRequests: [req, ...(data.bonusRequests || [])],
      transactions: [{ id: Date.now() + 'r', studentId: student.id, amount: -amt, reason: `Solicitud: ${bonus.name}`, date: new Date().toISOString(), pending: true, requestId: req.id }, ...txs]
    });
    setOffer({ ...offer, [bonus.id]: '' });
    toast('Solicitud enviada. Espera aprobacion.');
  };

  const changePin = () => {
    setPinMsg('');
    if (oldPin !== student.pin) { setPinMsg('El PIN actual no coincide.'); return; }
    if (!/^\d{4}$/.test(newPin)) { setPinMsg('El nuevo PIN debe tener 4 digitos.'); return; }
    patchMe({ pin: newPin });
    setOldPin(''); setNewPin('');
    toast('PIN actualizado');
    setTimeout(() => setModal(null), 700);
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast('Imagen muy grande (max 10MB)', 'bad'); e.target.value = ''; return; }
    try {
      const c = await compressImage(file);
      if (c.length > 500000) { toast('No se pudo comprimir lo suficiente', 'bad'); e.target.value = ''; return; }
      await patchMe({ customImage: c });
      toast('Imagen aplicada');
    } catch { toast('No se pudo procesar la imagen', 'bad'); }
    e.target.value = '';
  };

  const statement = () => {
    const lines = [`ESTADO DE CUENTA — P4 CENTRAL BANK`, `Titular: ${student.displayName || student.name}`,
      `Codigo: ${student.accessCode}`, `Emitido: ${new Date().toLocaleString('es-CO')}`, ``,
      `Saldo actual: ${money(student.balance)}`, `Total ganado: ${money(earned)}`, `Total gastado: ${money(spent)}`,
      `Tarjetas: ${unlocked.length}/${CARD_DESIGNS.length}`, ``, `MOVIMIENTOS`, `${'-'.repeat(60)}`];
    mine.forEach(t => lines.push(`${new Date(t.date).toLocaleString('es-CO').padEnd(22)} ${((t.amount > 0 ? '+' : '') + shortMoney(t.amount)).padStart(12)}  ${t.reason}`));
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `estado-cuenta-${student.accessCode}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Estado de cuenta descargado');
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT, padding: '18px 16px 40px' }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, color: C.text3, ...CAPS }}>Bienvenido</div>
            <div style={{ fontSize: 18, color: C.text, fontWeight: 500 }}>{student.displayName || student.name}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setModal('more')} style={{ background: C.raised, border: `1px solid ${C.border}`, borderRadius: 10, padding: 9, cursor: 'pointer', color: C.text2 }} aria-label="Mas opciones"><MoreHorizontal size={17} /></button>
            <button onClick={onLogout} style={{ background: C.raised, border: `1px solid ${C.border}`, borderRadius: 10, padding: 9, cursor: 'pointer', color: C.text2 }} aria-label="Salir"><LogOut size={17} /></button>
          </div>
        </div>

        {sanctioned && (
          <div style={{ background: '#2a1416', border: `1px solid ${C.down}55`, borderRadius: 12, padding: 13, marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
            <Ban size={17} color={C.down} />
            <div style={{ fontSize: 13, color: '#ffc9c4' }}>Cuenta sancionada. No puedes enviar ni recibir fondos.</div>
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: C.text3, ...CAPS }}>Saldo disponible</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 2 }}>
            <div style={{ fontSize: 40, color: C.text, fontWeight: 600, letterSpacing: '-.02em', fontFamily: NUM }}><Counter value={student.balance} /></div>
            <div style={{ fontSize: 15, color: C.text3 }}>{CURRENCY}</div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12, color: C.text3 }}>
            <span>Ganado {shortMoney(earned)}</span>
            <span>Gastado {shortMoney(spent)}</span>
            <span>Tarjetas {unlocked.length}/{CARD_DESIGNS.length}</span>
          </div>
          {(student.reservedBalance || 0) > 0 && (
            <div style={{ fontSize: 12, color: C.pending, marginTop: 6 }}>{money(student.reservedBalance)} retenidos en solicitudes</div>
          )}
        </div>

        <div style={{ marginBottom: 14 }}>
          <CardVisual student={student} reveal={reveal} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          <Btn onClick={() => setReveal(!reveal)}>{reveal ? <EyeOff size={15} /> : <Eye size={15} />}{reveal ? 'Ocultar' : 'Ver datos'}</Btn>
          <Btn onClick={() => patchMe({ frozen: !student.frozen })} style={student.frozen ? { borderColor: '#9fd8ec66', color: '#9fd8ec' } : {}}>
            <Snowflake size={15} />{student.frozen ? 'Descongelar' : 'Congelar'}
          </Btn>
        </div>

        <Btn variant="gold" full onClick={() => setModal('shop')} style={{ marginBottom: 10, position: 'relative' }}>
          <ShoppingCart size={16} />Tienda de bonos
          {pendingBonus.length > 0 && (
            <span style={{ position: 'absolute', right: 14, background: C.onGold, color: C.gold, borderRadius: 9, fontSize: 11, padding: '2px 8px' }}>{pendingBonus.length}</span>
          )}
        </Btn>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 22 }}>
          <Btn onClick={() => setModal('transfer')} style={{ flexDirection: 'column', gap: 5, padding: '13px 6px', fontSize: 12 }}><Send size={17} />Enviar</Btn>
          <Btn onClick={() => setModal('request')} style={{ flexDirection: 'column', gap: 5, padding: '13px 6px', fontSize: 12, position: 'relative' }}>
            <ArrowDownLeft size={17} />Cobrar
            {incomingReqs.length > 0 && <span style={{ position: 'absolute', top: 6, right: 8, width: 7, height: 7, borderRadius: 4, background: C.gold }} />}
          </Btn>
          <Btn onClick={() => setModal('cards')} style={{ flexDirection: 'column', gap: 5, padding: '13px 6px', fontSize: 12 }}><CreditCard size={17} />Coleccion</Btn>
        </div>

        {goalDesign && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 15, marginBottom: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Target size={15} color={C.primaryLight} />
                <span style={{ fontSize: 14, color: C.text }}>Meta: {goalDesign.name}</span>
              </div>
              <span style={{ fontSize: 13, color: C.gold }}>{goalProgress}%</span>
            </div>
            <div style={{ height: 6, background: C.bg, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${goalProgress}%`, background: C.primary, borderRadius: 3, transition: 'width .6s ease' }} />
            </div>
            <div style={{ fontSize: 12, color: C.text3, marginTop: 8 }}>
              {earned >= goalDesign.minEarned ? 'Desbloqueada' : `Faltan ${money(goalDesign.minEarned - earned)} ganados`}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 11 }}>
            <Radio size={15} color={C.primaryLight} />
            <span style={{ fontSize: 15, color: C.text, fontWeight: 500 }}>Actividad de la clase</span>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
            {feed.length === 0 ? (
              <div style={{ padding: 22, textAlign: 'center', fontSize: 13, color: C.text3 }}>Aun no hay movimientos publicos.</div>
            ) : feed.slice(0, 8).map((t, i) => (
              <div key={t.id} style={{ padding: '12px 14px', borderTop: i === 0 ? 'none' : `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ fontSize: 13, color: C.text2, flex: 1 }}>
                    <span style={{ color: C.text }}>{t.fromName}</span> pago a <span style={{ color: C.text }}>{t.toName}</span>
                    {t.aid && <span style={{ color: C.up, marginLeft: 6, fontSize: 11 }}>ayuda</span>}
                  </div>
                  <div style={{ fontSize: 13, color: C.up, whiteSpace: 'nowrap' }}>{shortMoney(t.amount)}</div>
                </div>
                {t.note && <div style={{ fontSize: 12, color: C.text3, marginTop: 3 }}>{t.note}</div>}
                <div style={{ fontSize: 11, color: C.text3, marginTop: 3 }}>{timeAgo(t.date)}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 11 }}>
            <Trophy size={15} color={C.gold} />
            <span style={{ fontSize: 15, color: C.text, fontWeight: 500 }}>Ranking</span>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
            {[...(data.students || [])].sort((a, b) => b.balance - a.balance).slice(0, 10).map((s, i) => {
              const me = s.id === student.id;
              return (
                <div key={s.id} style={{ padding: '12px 14px', borderTop: i === 0 ? 'none' : `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12, background: me ? C.raised : 'transparent' }}>
                  <div style={{ fontSize: 13, color: i < 3 ? C.gold : C.text3, width: 20, fontFamily: MONO }}>{i + 1}</div>
                  <div style={{ flex: 1, fontSize: 14, color: me ? C.text : C.text2 }}>{s.displayName || s.name}{me ? ' (tu)' : ''}</div>
                  <div style={{ fontSize: 13, color: C.text2, fontFamily: MONO }}>{shortMoney(s.balance)}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 15, color: C.text, fontWeight: 500, marginBottom: 11 }}>Mis movimientos</div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
            {mine.length === 0 ? (
              <div style={{ padding: 22, textAlign: 'center', fontSize: 13, color: C.text3 }}>Tu primer movimiento aparecera aqui.</div>
            ) : mine.slice(0, 20).map((t, i) => (
              <div key={t.id} style={{ padding: '12px 14px', borderTop: i === 0 ? 'none' : `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.text2 }}>{t.reason}</div>
                  <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{timeAgo(t.date)}</div>
                </div>
                <div style={{ fontSize: 14, color: t.pending ? C.pending : t.amount > 0 ? C.up : C.down, fontFamily: MONO, whiteSpace: 'nowrap' }}>
                  {t.amount > 0 ? '+' : ''}{shortMoney(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modal === 'transfer' && (
        <Modal title="Enviar dinero" onClose={() => { setModal(null); setTxError(''); }}>
          <div style={{ background: C.raised, borderRadius: 12, padding: 14, marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: C.text3 }}>Disponible</div>
            <div style={{ fontSize: 22, color: C.text, fontWeight: 500 }}>{money(student.balance)}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            <Btn variant={target === 'student' ? 'gold' : 'ghost'} onClick={() => setTarget('student')}>Estudiante</Btn>
            <Btn variant={target === 'central' ? 'gold' : 'ghost'} onClick={() => setTarget('central')}>Banco Central</Btn>
          </div>
          {target === 'student' && (
            <Field label="Codigo del destinatario" value={toStudent} onChange={(e) => setToStudent(e.target.value.toUpperCase())}
              placeholder="A3K9P2" maxLength={6} style={{ fontFamily: MONO, letterSpacing: '.2em', textAlign: 'center' }} />
          )}
          <Field label="Monto" type="number" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
          <Field label="Mensaje (opcional)" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Por el acuerdo comercial" />
          {target === 'student' && (
            <div onClick={() => setIsAid(!isAid)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: C.raised, borderRadius: 10, marginBottom: 14, cursor: 'pointer', border: `1px solid ${isAid ? C.up + '66' : C.border}` }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, border: `1px solid ${isAid ? C.up : C.borderStrong}`, background: isAid ? C.up : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isAid && <Check size={12} color={C.bg} />}
              </div>
              <div>
                <div style={{ fontSize: 13, color: C.text }}>Marcar como ayuda</div>
                <div style={{ fontSize: 11, color: C.text3 }}>Se destaca en la actividad publica</div>
              </div>
            </div>
          )}
          {txError && <div style={{ color: C.down, fontSize: 13, marginBottom: 12 }}>{txError}</div>}
          <Btn variant="gold" full onClick={doTransfer}><Send size={15} />Enviar</Btn>
        </Modal>
      )}

      {modal === 'request' && (
        <Modal title="Cobros" onClose={() => setModal(null)}>
          {incomingReqs.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 13, color: C.text3, marginBottom: 10 }}>Te estan cobrando</div>
              {incomingReqs.map(r => (
                <div key={r.id} style={{ background: C.raised, borderRadius: 12, padding: 14, marginBottom: 8, border: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontSize: 14, color: C.text }}>{r.fromName}</div>
                    <div style={{ fontSize: 14, color: C.text, fontFamily: MONO }}>{shortMoney(r.amount)}</div>
                  </div>
                  {r.note && <div style={{ fontSize: 12, color: C.text3, marginBottom: 10 }}>{r.note}</div>}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
                    <Btn variant="gold" onClick={() => resolvePayRequest(r, true)}>Pagar</Btn>
                    <Btn variant="danger" onClick={() => resolvePayRequest(r, false)}>Rechazar</Btn>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize: 13, color: C.text3, marginBottom: 10 }}>Cobrarle a alguien</div>
          <Field label="Codigo del estudiante" value={reqTo} onChange={(e) => setReqTo(e.target.value.toUpperCase())}
            placeholder="A3K9P2" maxLength={6} style={{ fontFamily: MONO, letterSpacing: '.2em', textAlign: 'center' }} />
          <Field label="Monto" type="number" inputMode="numeric" value={reqAmount} onChange={(e) => setReqAmount(e.target.value)} placeholder="0" />
          <Field label="Concepto (opcional)" value={reqNote} onChange={(e) => setReqNote(e.target.value)} placeholder="Tu parte del tratado" />
          <Btn variant="gold" full onClick={sendPayRequest}><ArrowDownLeft size={15} />Enviar cobro</Btn>
        </Modal>
      )}

      {modal === 'shop' && (
        <Modal title="Tienda de bonos" onClose={() => setModal(null)}>
          <div style={{ background: C.raised, borderRadius: 12, padding: 14, marginBottom: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: C.text3 }}>Tu saldo</div>
            <div style={{ fontSize: 22, color: C.gold, fontWeight: 500 }}>{money(student.balance)}</div>
          </div>
          <div style={{ fontSize: 12, color: C.text3, marginBottom: 18 }}>Propone tu precio. El profesor aprueba o rechaza.</div>

          {pendingBonus.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              {pendingBonus.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#231d0c', border: `1px solid ${C.pending}44`, borderRadius: 10, padding: 11, marginBottom: 6 }}>
                  <Clock size={15} color={C.pending} />
                  <div style={{ flex: 1, fontSize: 13, color: '#f0dfa8' }}>{r.bonusName}</div>
                  <div style={{ fontSize: 13, color: C.pending, fontFamily: MONO }}>{shortMoney(r.amount)}</div>
                </div>
              ))}
            </div>
          )}

          {BONUS_SHOP.map(b => (
            <div key={b.id} style={{ background: C.raised, borderRadius: 12, padding: 14, marginBottom: 9, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 14, color: C.text, marginBottom: b.value ? 2 : 10 }}>{b.name}</div>
              {b.value && <div style={{ fontSize: 12, color: C.up, marginBottom: 10 }}>+{b.value} en la nota</div>}
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" inputMode="numeric" value={offer[b.id] || ''} onChange={(e) => setOffer({ ...offer, [b.id]: e.target.value })}
                  placeholder="Tu oferta" style={{ flex: 1, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 12px', color: C.text, fontSize: 14, outline: 'none', fontFamily: FONT }} />
                <Btn variant="solid" onClick={() => requestBonus(b)} style={{ padding: '10px 16px' }}>Ofertar</Btn>
              </div>
            </div>
          ))}
        </Modal>
      )}

      {modal === 'cards' && (
        <Modal title="Tu coleccion" onClose={() => setModal(null)} wide>
          <div style={{ fontSize: 13, color: C.text3, marginBottom: 16 }}>{unlocked.length} de {CARD_DESIGNS.length} desbloqueadas. Se desbloquean por total ganado.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 10, marginBottom: 22 }}>
            {unlocked.map(d => (
              <div key={d.id} onClick={() => { patchMe({ cardDesign: d.id, customImage: null }); toast(`${d.name} activada`); }}
                style={{ borderRadius: 12, height: 84, padding: 11, background: d.bg, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: student.cardDesign === d.id ? `2px solid ${C.gold}` : `1px solid ${C.border}` }}>
                <div style={{ width: 20, height: 14, borderRadius: 2, background: d.chip }} />
                <div>
                  <div style={{ fontSize: 12, color: d.ink }}>{d.name}</div>
                  <div style={{ fontSize: 10, color: d.sub }}>{TIERS[d.tier].label}</div>
                </div>
              </div>
            ))}
            {locked.map(d => <LockedCard key={d.id} design={d} />)}
          </div>

          <div style={{ fontSize: 13, color: C.text3, marginBottom: 10 }}>Fijar una meta</div>
          <select value={goal} onChange={(e) => { setGoal(e.target.value); patchMe({ goalCard: e.target.value }); }}
            style={{ width: '100%', background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', color: C.text, fontSize: 14, outline: 'none', fontFamily: FONT, marginBottom: 18 }}>
            <option value="">Sin meta</option>
            {locked.map(d => <option key={d.id} value={d.id}>{d.name} — {shortMoney(d.minEarned)}</option>)}
          </select>

          <div style={{ fontSize: 13, color: C.text3, marginBottom: 10 }}>Imagen personalizada</div>
          <input ref={fileRef} type="file" accept="image/*" onChange={uploadImage} style={{ display: 'none' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Btn variant="solid" onClick={() => fileRef.current && fileRef.current.click()}><ImageIcon size={15} />Subir</Btn>
            <Btn variant="ghost" onClick={() => patchMe({ customImage: null })} disabled={!student.customImage}>Quitar</Btn>
          </div>
        </Modal>
      )}

      {modal === 'more' && (
        <Modal title="Opciones" onClose={() => setModal(null)}>
          <Field label="Nombre visible" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Como te ven los demas" />
          <Btn variant="solid" full onClick={() => { if (editName.trim()) { patchMe({ displayName: editName.trim() }); toast('Nombre actualizado'); } }} style={{ marginBottom: 20 }}>Guardar nombre</Btn>

          <div style={{ fontSize: 13, color: C.text3, marginBottom: 10 }}>Analisis de gastos</div>
          <div style={{ background: C.raised, borderRadius: 12, padding: 15, marginBottom: 20, border: `1px solid ${C.border}` }}>
            {(() => {
              const cats = {};
              mine.filter(t => t.amount < 0).forEach(t => {
                const r = String(t.reason || '');
                const key = r.startsWith('Solicitud') ? 'Bonos' : r.startsWith('Ayuda') ? 'Ayuda' : r.startsWith('Transferencia') ? 'Transferencias' : r.startsWith('Cobro') ? 'Cobros' : 'Otros';
                cats[key] = (cats[key] || 0) + Math.abs(t.amount);
              });
              const entries = Object.entries(cats).sort((a, b) => b[1] - a[1]);
              const max = entries.length ? entries[0][1] : 1;
              if (!entries.length) return <div style={{ fontSize: 13, color: C.text3, textAlign: 'center' }}>Sin gastos todavia.</div>;
              return entries.map(([k, v]) => (
                <div key={k} style={{ marginBottom: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.text2, marginBottom: 5 }}>
                    <span>{k}</span><span style={{ fontFamily: MONO }}>{shortMoney(v)}</span>
                  </div>
                  <div style={{ height: 5, background: C.bg, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.round((v / max) * 100)}%`, background: C.primary, borderRadius: 3 }} />
                  </div>
                </div>
              ));
            })()}
          </div>

          <Btn variant="solid" full onClick={statement} style={{ marginBottom: 10 }}><Download size={15} />Descargar estado de cuenta</Btn>
          <Btn variant="ghost" full onClick={() => setModal('pin')}><KeyRound size={15} />Cambiar PIN</Btn>
        </Modal>
      )}

      {modal === 'pin' && (
        <Modal title="Cambiar PIN" onClose={() => { setModal(null); setPinMsg(''); }}>
          <Field label="PIN actual" type="password" inputMode="numeric" value={oldPin}
            onChange={(e) => setOldPin(e.target.value.replace(/\D/g, '').slice(0, 4))} maxLength={4} placeholder="••••"
            style={{ fontFamily: MONO, fontSize: 20, letterSpacing: '.5em', textAlign: 'center' }} />
          <Field label="PIN nuevo" type="password" inputMode="numeric" value={newPin}
            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))} maxLength={4} placeholder="••••"
            style={{ fontFamily: MONO, fontSize: 20, letterSpacing: '.5em', textAlign: 'center' }} />
          {pinMsg && <div style={{ color: C.down, fontSize: 13, marginBottom: 12 }}>{pinMsg}</div>}
          <Btn variant="gold" full onClick={changePin}>Actualizar PIN</Btn>
        </Modal>
      )}
    </div>
  );
}

function TeacherView({ data, saveData, onLogout, toast }) {
  const [tab, setTab] = useState('live');
  const [newName, setNewName] = useState('');
  const [amt, setAmt] = useState({});
  const [why, setWhy] = useState({});
  const [showCodes, setShowCodes] = useState(false);
  const [copied, setCopied] = useState('');
  const [search, setSearch] = useState('');
  const [historyOf, setHistoryOf] = useState(null);

  const txs = data.transactions || [];
  const pending = (data.bonusRequests || []).filter(r => r.status === 'pending');
  const selfSignup = data.settings?.selfSignup !== false;

  const distributed = txs.filter(t => t.amount > 0 && t.studentId !== CENTRAL_BANK_ID
    && !TRANSFER_PREFIX.test(String(t.reason || '')) && !REFUND_PREFIX.test(String(t.reason || '')))
    .reduce((s, t) => s + t.amount, 0);

  const nameOf = (id) => id === CENTRAL_BANK_ID ? 'Banco Central'
    : (data.students.find(s => s.id === id)?.displayName || data.students.find(s => s.id === id)?.name || 'Desconocido');

  const addStudent = () => {
    if (!newName.trim()) return;
    const t = new Date();
    const validThru = `${String(t.getMonth() + 1).padStart(2, '0')}/${String((t.getFullYear() + 4) % 100).padStart(2, '0')}`;
    let code;
    do { code = genAccessCode(); } while (data.students.some(s => s.accessCode === code));
    saveData({
      ...data,
      students: [...data.students, {
        id: Date.now().toString(), name: newName.trim(), displayName: newName.trim(),
        balance: 0, cardNumber: genCardNumber(), cvv: genCVV(), validThru, accessCode: code,
        cardDesign: 'graphite', pin: null, reservedBalance: 0, frozen: false, sanctioned: false
      }]
    });
    setNewName('');
    toast(`Cuenta creada. Codigo ${code}`);
  };

  const removeStudent = (id) => {
    if (!confirm('Eliminar esta cuenta y todo su historial?')) return;
    saveData({
      ...data,
      students: data.students.filter(s => s.id !== id),
      transactions: txs.filter(t => t.studentId !== id),
      bonusRequests: (data.bonusRequests || []).filter(r => r.studentId !== id),
      payRequests: (data.payRequests || []).filter(r => r.fromId !== id && r.toId !== id)
    });
    toast('Cuenta eliminada');
  };

  const resetPin = (id) => {
    if (!confirm('Reiniciar el PIN? Creara uno nuevo al entrar.')) return;
    saveData({ ...data, students: data.students.map(s => s.id === id ? { ...s, pin: null } : s) });
    toast('PIN reiniciado');
  };

  const toggleSanction = (id) => {
    const s = data.students.find(x => x.id === id);
    saveData({ ...data, students: data.students.map(x => x.id === id ? { ...x, sanctioned: !x.sanctioned } : x) });
    toast(s.sanctioned ? 'Sancion levantada' : 'Cuenta sancionada');
  };

  const adjust = (id, delta, reason) => {
    saveData({
      ...data,
      students: data.students.map(s => s.id === id ? { ...s, balance: s.balance + delta } : s),
      transactions: [{ id: Date.now() + Math.random(), studentId: id, amount: delta, reason: reason || (delta > 0 ? 'Ajuste del profesor' : 'Penalizacion'), date: new Date().toISOString() }, ...txs]
    });
  };

  const applyCustom = (id, sign) => {
    const v = parseInt(amt[id] || '0', 10);
    if (!v || v <= 0) return;
    adjust(id, sign * v, why[id] || '');
    setAmt({ ...amt, [id]: '' });
    setWhy({ ...why, [id]: '' });
    toast(`${sign > 0 ? 'Acreditado' : 'Debitado'} ${money(v)}`);
  };

  const approve = (r) => {
    const label = r.bonusValue !== null && r.bonusValue !== undefined ? ` (+${r.bonusValue})` : '';
    let updated = {
      ...data,
      students: data.students.map(s => s.id === r.studentId ? { ...s, reservedBalance: Math.max(0, (s.reservedBalance || 0) - r.amount) } : s),
      centralBank: { ...data.centralBank, balance: (data.centralBank?.balance || 0) + r.amount },
      bonusRequests: (data.bonusRequests || []).map(x => x.id === r.id ? { ...x, status: 'approved', resolvedAt: new Date().toISOString() } : x),
      transactions: txs.map(t => t.requestId === r.id ? { ...t, reason: `Bono aprobado: ${r.bonusName}${label}`, pending: false } : t)
    };
    updated.transactions = [{ id: Date.now() + 'c', studentId: CENTRAL_BANK_ID, amount: r.amount, reason: `Pago de bono de ${r.studentName}: ${r.bonusName}`, date: new Date().toISOString() }, ...updated.transactions];
    saveData(updated);
    toast('Solicitud aprobada');
  };

  const reject = (r) => {
    if (!confirm('Rechazar? El dinero vuelve al estudiante.')) return;
    let updated = {
      ...data,
      students: data.students.map(s => s.id === r.studentId ? { ...s, balance: s.balance + r.amount, reservedBalance: Math.max(0, (s.reservedBalance || 0) - r.amount) } : s),
      bonusRequests: (data.bonusRequests || []).map(x => x.id === r.id ? { ...x, status: 'rejected', resolvedAt: new Date().toISOString() } : x),
      transactions: txs.map(t => t.requestId === r.id ? { ...t, reason: `Bono rechazado: ${r.bonusName}`, pending: false } : t)
    };
    updated.transactions = [{ id: Date.now() + 'rf', studentId: r.studentId, amount: r.amount, reason: `Reembolso: ${r.bonusName}`, date: new Date().toISOString() }, ...updated.transactions];
    saveData(updated);
    toast('Solicitud rechazada y reembolsada');
  };

  const resetAll = () => {
    if (!confirm('BORRAR TODO? Esto no se puede deshacer.')) return;
    if (!confirm('Confirma otra vez: se pierden todas las cuentas y movimientos.')) return;
    saveData({ students: [], transactions: [], bonusRequests: [], payRequests: [], centralBank: { balance: 0, name: 'P4 Central Bank' }, settings: data.settings || { selfSignup: true } });
    toast('Todo reiniciado');
  };

  const exportCSV = () => {
    const rows = [['Fecha', 'Cuenta', 'Monto', 'Concepto', 'Estado']];
    txs.forEach(t => rows.push([new Date(t.date).toLocaleString('es-CO'), nameOf(t.studentId), t.amount, String(t.reason || '').replace(/"/g, "'"), t.pending ? 'pendiente' : 'confirmado']));
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `transacciones-p4-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('CSV descargado');
  };

  const sorted = [...(data.students || [])].sort((a, b) => b.balance - a.balance);
  const filtered = search.trim()
    ? txs.filter(t => (String(t.reason || '') + nameOf(t.studentId)).toLowerCase().includes(search.trim().toLowerCase()))
    : txs;

  const tabs = [
    { id: 'live', label: 'En vivo', icon: Radio },
    { id: 'students', label: 'Cuentas', icon: CreditCard },
    { id: 'requests', label: 'Solicitudes', icon: ShoppingCart, badge: pending.length },
    { id: 'bank', label: 'Banco', icon: Building2 }
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT }}>
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '16px 16px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <button onClick={onLogout} style={{ background: 'none', border: 'none', color: C.text3, fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 4 }}>Salir</button>
              <div style={{ fontSize: 27, color: C.text, fontWeight: 600, fontFamily: DISPLAY }}>Panel del profesor</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: C.text3, ...CAPS }}>Distribuido</div>
              <div style={{ fontSize: 20, color: C.text, fontWeight: 500 }}>{money(distributed)}</div>
              <div style={{ fontSize: 12, color: C.text3 }}>{data.students.length} cuentas</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
            {tabs.map(t => {
              const Icon = t.icon;
              const on = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '11px 14px',
                  color: on ? C.primaryLight : C.text3, borderBottom: `2px solid ${on ? C.primaryLight : 'transparent'}`,
                  fontSize: 14, display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', fontFamily: FONT
                }}>
                  <Icon size={15} />{t.label}
                  {t.badge > 0 && <span style={{ background: C.primary, color: '#FFFFFF', borderRadius: 9, fontSize: 11, padding: '1px 7px' }}>{t.badge}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px 44px' }}>

        {tab === 'live' && (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                <Search size={15} color={C.text3} style={{ position: 'absolute', left: 12, top: 13 }} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o concepto"
                  style={{ width: '100%', background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '11px 12px 11px 36px', color: C.text, fontSize: 14, outline: 'none', fontFamily: FONT }} />
              </div>
              <Btn variant="solid" onClick={exportCSV}><Download size={15} />CSV</Btn>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10, marginBottom: 18 }}>
              <div style={{ background: C.surface, borderRadius: 12, padding: 14, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 12, color: C.text3 }}>Movimientos</div>
                <div style={{ fontSize: 20, color: C.text, fontWeight: 500 }}>{txs.length}</div>
              </div>
              <div style={{ background: C.surface, borderRadius: 12, padding: 14, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 12, color: C.text3 }}>Banco Central</div>
                <div style={{ fontSize: 20, color: C.text, fontWeight: 500 }}>{shortMoney(data.centralBank?.balance)}</div>
              </div>
              <div style={{ background: C.surface, borderRadius: 12, padding: 14, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 12, color: C.text3 }}>Pendientes</div>
                <div style={{ fontSize: 20, color: pending.length ? C.pending : C.text, fontWeight: 500 }}>{pending.length}</div>
              </div>
              <div style={{ background: C.surface, borderRadius: 12, padding: 14, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 12, color: C.text3 }}>Sancionadas</div>
                <div style={{ fontSize: 20, color: C.text, fontWeight: 500 }}>{data.students.filter(s => s.sanctioned).length}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 11 }}>
              <span style={{ width: 7, height: 7, borderRadius: 4, background: C.up }} />
              <span style={{ fontSize: 14, color: C.text2 }}>Transacciones en tiempo real</span>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: 30, textAlign: 'center', fontSize: 13, color: C.text3 }}>Sin movimientos que coincidan.</div>
              ) : filtered.slice(0, 60).map((t, i) => (
                <div key={t.id} style={{ padding: '12px 14px', borderTop: i === 0 ? 'none' : `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, color: C.text }}>{nameOf(t.studentId)}</div>
                    <div style={{ fontSize: 12, color: C.text3, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.reason}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontFamily: MONO, color: t.pending ? C.pending : t.amount > 0 ? C.up : C.down }}>
                      {t.amount > 0 ? '+' : ''}{shortMoney(t.amount)}
                    </div>
                    <div style={{ fontSize: 11, color: C.text3 }}>{timeAgo(t.date)}</div>
                  </div>
                </div>
              ))}
            </div>
            {filtered.length > 60 && <div style={{ fontSize: 12, color: C.text3, textAlign: 'center', marginTop: 12 }}>Mostrando 60 de {filtered.length}. Descarga el CSV para ver todo.</div>}
          </>
        )}

        {tab === 'students' && (
          <>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 15, marginBottom: 14 }}>
              <div style={{ fontSize: 14, color: C.text, marginBottom: 11 }}>Crear cuenta</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addStudent()}
                  placeholder="Nombre del estudiante"
                  style={{ flex: 1, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '11px 13px', color: C.text, fontSize: 14, outline: 'none', fontFamily: FONT }} />
                <Btn variant="gold" onClick={addStudent}>Crear</Btn>
              </div>
              <div style={{ fontSize: 12, color: C.text3, marginTop: 9 }}>Se genera un codigo automatico. El saldo inicia en 0.</div>
            </div>

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 15, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: C.text }}>Registro abierto</div>
                  <div style={{ fontSize: 12, color: C.text3, marginTop: 2 }}>
                    {selfSignup ? `Se registran solos con el codigo ${CLASS_CODE}` : 'Solo tu puedes crear cuentas'}
                  </div>
                </div>
                <div onClick={() => saveData({ ...data, settings: { ...(data.settings || {}), selfSignup: !selfSignup } })}
                  style={{ width: 46, height: 27, borderRadius: 14, background: selfSignup ? C.gold : C.borderStrong, cursor: 'pointer', padding: 3, transition: 'background .3s' }}>
                  <div style={{ width: 21, height: 21, borderRadius: 11, background: selfSignup ? C.onGold : C.text3, transform: selfSignup ? 'translateX(19px)' : 'none', transition: 'transform .3s' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              <Btn variant="solid" onClick={() => setShowCodes(!showCodes)}>{showCodes ? <EyeOff size={15} /> : <Eye size={15} />}{showCodes ? 'Ocultar codigos' : 'Ver codigos'}</Btn>
              <Btn variant="danger" onClick={resetAll}><Trash2 size={15} />Borrar todo</Btn>
            </div>

            {showCodes && (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 15, marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: C.text3, marginBottom: 12 }}>Codigos de acceso</div>
                {sorted.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: `1px solid ${C.border}` }}>
                    <div style={{ flex: 1, fontSize: 14, color: C.text }}>{s.displayName || s.name}</div>
                    <div style={{ fontFamily: MONO, fontSize: 15, color: C.gold, letterSpacing: '.1em' }}>{s.accessCode}</div>
                    <button onClick={async () => { if (await copyText(s.accessCode)) { setCopied(s.id); setTimeout(() => setCopied(''), 1600); } }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === s.id ? C.up : C.text3, padding: 4 }} aria-label="Copiar codigo">
                      {copied === s.id ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {sorted.length === 0 ? (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 34, textAlign: 'center' }}>
                <div style={{ fontSize: 15, color: C.text, marginBottom: 5 }}>Aun no hay cuentas</div>
                <div style={{ fontSize: 13, color: C.text3 }}>Crea la primera arriba o activa el registro abierto.</div>
              </div>
            ) : sorted.map((s, idx) => (
              <div key={s.id} style={{ background: C.surface, border: `1px solid ${s.sanctioned ? C.down + '44' : C.border}`, borderRadius: 18, padding: 15, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: C.text3, fontFamily: MONO }}>{idx + 1}</span>
                      <span style={{ fontSize: 16, color: C.text, fontWeight: 500 }}>{s.displayName || s.name}</span>
                      {s.sanctioned && <span style={{ fontSize: 11, color: C.down, background: '#2a1416', borderRadius: 6, padding: '2px 7px' }}>sancionada</span>}
                      {s.frozen && <span style={{ fontSize: 11, color: '#9fd8ec', background: '#12222a', borderRadius: 6, padding: '2px 7px' }}>congelada</span>}
                    </div>
                    <div style={{ fontSize: 12, color: C.text3, marginTop: 3, fontFamily: MONO }}>
                      {s.accessCode} · {s.pin ? 'PIN activo' : 'sin PIN'} · {CARD_DESIGNS.filter(d => hasUnlocked(s, d, txs)).length}/{CARD_DESIGNS.length}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, color: C.text, fontWeight: 500 }}>{shortMoney(s.balance)}</div>
                    <div style={{ fontSize: 11, color: C.text3 }}>ganado {shortMoney(earnedBy(s.id, txs))}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, marginBottom: 9, flexWrap: 'wrap' }}>
                  {[1000, 5000, 10000].map(v => (
                    <Btn key={v} variant="ghost" onClick={() => { adjust(s.id, v, 'Respuesta correcta'); toast(`+${shortMoney(v)} a ${s.displayName || s.name}`); }} style={{ padding: '8px 12px', fontSize: 13, color: C.up, borderColor: C.up + '44' }}>+{shortMoney(v)}</Btn>
                  ))}
                  {[1000, 5000].map(v => (
                    <Btn key={'m' + v} variant="ghost" onClick={() => { adjust(s.id, -v, 'Penalizacion'); toast(`-${shortMoney(v)} a ${s.displayName || s.name}`); }} style={{ padding: '8px 12px', fontSize: 13, color: C.down, borderColor: C.down + '44' }}>-{shortMoney(v)}</Btn>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 6, marginBottom: 9, flexWrap: 'wrap' }}>
                  <input type="number" inputMode="numeric" value={amt[s.id] || ''} onChange={(e) => setAmt({ ...amt, [s.id]: e.target.value })} placeholder="Monto"
                    style={{ width: 100, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 9, padding: '9px 11px', color: C.text, fontSize: 13, outline: 'none', fontFamily: FONT }} />
                  <input value={why[s.id] || ''} onChange={(e) => setWhy({ ...why, [s.id]: e.target.value })} placeholder="Concepto"
                    style={{ flex: 1, minWidth: 110, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 9, padding: '9px 11px', color: C.text, fontSize: 13, outline: 'none', fontFamily: FONT }} />
                  <Btn variant="ghost" onClick={() => applyCustom(s.id, 1)} style={{ padding: '9px 12px', color: C.up, borderColor: C.up + '44' }}><Plus size={15} /></Btn>
                  <Btn variant="ghost" onClick={() => applyCustom(s.id, -1)} style={{ padding: '9px 12px', color: C.down, borderColor: C.down + '44' }}><Minus size={15} /></Btn>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Btn variant="ghost" onClick={() => setHistoryOf(s.id)} style={{ padding: '8px 12px', fontSize: 12 }}><Activity size={14} />Historial</Btn>
                  <Btn variant="ghost" onClick={() => resetPin(s.id)} style={{ padding: '8px 12px', fontSize: 12 }}><RotateCcw size={14} />PIN</Btn>
                  <Btn variant="ghost" onClick={() => toggleSanction(s.id)} style={{ padding: '8px 12px', fontSize: 12, color: s.sanctioned ? C.up : C.text2, borderColor: s.sanctioned ? C.up + '44' : C.border }}>
                    <Ban size={14} />{s.sanctioned ? 'Levantar' : 'Sancionar'}
                  </Btn>
                  <Btn variant="danger" onClick={() => removeStudent(s.id)} style={{ padding: '8px 12px', fontSize: 12 }}><Trash2 size={14} /></Btn>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'requests' && (
          <>
            {pending.length === 0 ? (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 34, textAlign: 'center' }}>
                <div style={{ fontSize: 15, color: C.text, marginBottom: 5 }}>Sin solicitudes pendientes</div>
                <div style={{ fontSize: 13, color: C.text3 }}>Las ofertas de la tienda apareceran aqui.</div>
              </div>
            ) : pending.map(r => (
              <div key={r.id} style={{ background: C.surface, border: `1px solid ${C.pending}44`, borderRadius: 18, padding: 15, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 15, color: C.text, fontWeight: 500 }}>{r.studentName}</div>
                    <div style={{ fontSize: 13, color: C.text2, marginTop: 3 }}>{r.bonusName}</div>
                    {r.bonusValue !== null && r.bonusValue !== undefined && <div style={{ fontSize: 12, color: C.up, marginTop: 2 }}>+{r.bonusValue} en la nota</div>}
                    <div style={{ fontSize: 11, color: C.text3, marginTop: 4 }}>{timeAgo(r.date)}</div>
                  </div>
                  <div style={{ fontSize: 19, color: C.gold, fontFamily: MONO, whiteSpace: 'nowrap' }}>{shortMoney(r.amount)}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <Btn variant="gold" onClick={() => approve(r)}><CheckCircle size={15} />Aprobar</Btn>
                  <Btn variant="danger" onClick={() => reject(r)}><XCircle size={15} />Rechazar</Btn>
                </div>
              </div>
            ))}

            {(data.bonusRequests || []).filter(r => r.status !== 'pending').length > 0 && (
              <div style={{ marginTop: 22 }}>
                <div style={{ fontSize: 14, color: C.text2, marginBottom: 11 }}>Resueltas</div>
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
                  {(data.bonusRequests || []).filter(r => r.status !== 'pending').slice(0, 20).map((r, i) => (
                    <div key={r.id} style={{ padding: '11px 14px', borderTop: i === 0 ? 'none' : `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: C.text2 }}>{r.studentName} — {r.bonusName}</div>
                        <div style={{ fontSize: 11, color: C.text3 }}>{r.status === 'approved' ? 'Aprobada' : 'Rechazada'}</div>
                      </div>
                      <div style={{ fontSize: 13, fontFamily: MONO, color: r.status === 'approved' ? C.up : C.text3 }}>{shortMoney(r.amount)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'bank' && (
          <>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 20, marginBottom: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: C.text3, ...CAPS }}>Reservas del Banco Central</div>
              <div style={{ fontSize: 34, color: C.gold, fontWeight: 600, marginTop: 4, fontFamily: NUM }}><Counter value={data.centralBank?.balance || 0} /></div>
              <div style={{ fontSize: 13, color: C.text3 }}>{CURRENCY}</div>
            </div>
            <div style={{ fontSize: 14, color: C.text2, marginBottom: 11 }}>Movimientos del Banco Central</div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
              {txs.filter(t => t.studentId === CENTRAL_BANK_ID).length === 0 ? (
                <div style={{ padding: 30, textAlign: 'center', fontSize: 13, color: C.text3 }}>Sin movimientos todavia.</div>
              ) : txs.filter(t => t.studentId === CENTRAL_BANK_ID).slice(0, 40).map((t, i) => (
                <div key={t.id} style={{ padding: '12px 14px', borderTop: i === 0 ? 'none' : `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: C.text2 }}>{t.reason}</div>
                    <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{timeAgo(t.date)}</div>
                  </div>
                  <div style={{ fontSize: 14, fontFamily: MONO, color: t.amount > 0 ? C.up : C.down }}>{t.amount > 0 ? '+' : ''}{shortMoney(t.amount)}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {historyOf && (
        <Modal title={`Historial de ${nameOf(historyOf)}`} onClose={() => setHistoryOf(null)} wide>
          {txs.filter(t => t.studentId === historyOf).length === 0 ? (
            <div style={{ padding: 22, textAlign: 'center', fontSize: 13, color: C.text3 }}>Sin movimientos.</div>
          ) : txs.filter(t => t.studentId === historyOf).map((t, i) => (
            <div key={t.id} style={{ padding: '11px 0', borderTop: i === 0 ? 'none' : `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: C.text2 }}>{t.reason}</div>
                <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{new Date(t.date).toLocaleString('es-CO')}</div>
              </div>
              <div style={{ fontSize: 14, fontFamily: MONO, color: t.pending ? C.pending : t.amount > 0 ? C.up : C.down }}>{t.amount > 0 ? '+' : ''}{shortMoney(t.amount)}</div>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState('home');
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [me, setMe] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [tPass, setTPass] = useState('');
  const [tAuth, setTAuth] = useState(false);
  const [tError, setTError] = useState('');
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
    const unsub = subscribeToData((incoming) => {
      setData({
        students: incoming?.students || [],
        transactions: incoming?.transactions || [],
        bonusRequests: incoming?.bonusRequests || [],
        payRequests: incoming?.payRequests || [],
        centralBank: incoming?.centralBank || { balance: 0, name: 'P4 Central Bank' },
        settings: incoming?.settings || { selfSignup: true }
      });
      setLoading(false);
    });
    const t = setTimeout(() => setLoading(false), 3000);
    return () => { unsub(); clearTimeout(t); clearTimeout(toastTimer.current); };
  }, []);

  useEffect(() => {
    if (me && data.students?.length) {
      const fresh = data.students.find(s => s.id === me.id);
      if (fresh) setMe(fresh);
    }
  }, [data.students]);

  const saveData = async (next) => {
    setData(next);
    try { await saveBankData(next); return true; }
    catch (e) { console.error('Save error:', e); toast('No se pudo guardar. Revisa tu conexion.', 'bad'); return false; }
  };

  const studentLogin = () => {
    const c = code.trim().toUpperCase();
    const s = (data.students || []).find(x => x.accessCode === c);
    if (!s) { setLoginError('Codigo invalido.'); return; }
    if (!s.pin) {
      if (!/^\d{4}$/.test(pin)) { setLoginError('Crea un PIN de 4 digitos.'); return; }
      const updated = { ...data, students: data.students.map(x => x.id === s.id ? { ...x, pin } : x) };
      saveData(updated);
      setMe({ ...s, pin });
      setView('student'); setLoginError(''); setCode(''); setPin('');
      return;
    }
    if (s.pin !== pin) { setLoginError('PIN incorrecto.'); return; }
    setMe(s); setView('student'); setLoginError(''); setCode(''); setPin('');
  };

  const signup = async () => {
    setSuError('');
    const name = suName.trim();
    if (name.length < 3) { setSuError('Escribe tu nombre completo.'); return; }
    if (suCode.trim().toUpperCase() !== CLASS_CODE) { setSuError('Codigo de clase incorrecto.'); return; }
    if (!/^\d{4}$/.test(suPin)) { setSuError('Crea un PIN de 4 digitos.'); return; }
    if ((data.students || []).some(s => (s.name || '').trim().toLowerCase() === name.toLowerCase())) {
      setSuError('Ya existe una cuenta con ese nombre. Entra con tu codigo.'); return;
    }
    let access;
    do { access = genAccessCode(); } while ((data.students || []).some(s => s.accessCode === access));
    const t = new Date();
    const fresh = {
      id: Date.now().toString(), name, displayName: name, balance: 0,
      cardNumber: genCardNumber(), cvv: genCVV(),
      validThru: `${String(t.getMonth() + 1).padStart(2, '0')}/${String((t.getFullYear() + 4) % 100).padStart(2, '0')}`,
      accessCode: access, cardDesign: 'graphite', pin: suPin, reservedBalance: 0, frozen: false, sanctioned: false
    };
    const ok = await saveData({ ...data, students: [...(data.students || []), fresh] });
    if (!ok) { setSuError('No se pudo crear la cuenta.'); return; }
    setMe(fresh); setView('student');
    setSuName(''); setSuCode(''); setSuPin('');
    toast(`Cuenta creada. Tu codigo es ${access}`);
  };

  const teacherLogin = () => {
    if (tPass === TEACHER_PASSWORD) { setTAuth(true); setTError(''); setView('teacher'); setTPass(''); }
    else setTError('Contrasena incorrecta.');
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>
      <div style={{ fontSize: 15, color: C.text3 }}>Cargando</div>
    </div>
  );

  const selfSignup = data.settings?.selfSignup !== false;

  return (
    <>
      <Toast msg={toastMsg} kind={toastKind} />
      {view === 'teacher' && tAuth
        ? <TeacherView data={data} saveData={saveData} toast={toast} onLogout={() => { setTAuth(false); setView('home'); }} />
        : view === 'student' && me
        ? <StudentView student={me} data={data} saveData={saveData} toast={toast} onLogout={() => { setMe(null); setView('home'); }} />
        : view === 'teacher-login'
        ? <TeacherLogin pass={tPass} setPass={setTPass} onLogin={teacherLogin} error={tError} setView={setView} />
        : view === 'student-login'
        ? <StudentLogin code={code} setCode={setCode} pin={pin} setPin={setPin} onLogin={studentLogin} error={loginError} setView={setView} students={data.students} />
        : view === 'signup' && selfSignup
        ? <Signup name={suName} setName={setSuName} classCode={suCode} setClassCode={setSuCode} pin={suPin} setPin={setSuPin} onSignup={signup} error={suError} setView={setView} />
        : <Home setView={setView} selfSignup={selfSignup} />}
    </>
  );
}
