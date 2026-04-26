/ ============================================================================
// 🔥 FIREBASE CONFIGURATION
// ============================================================================

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCBk4xfOXBvCMiGMiNlg-eZdkriSNo2f_g",
  authDomain: "banco-p4.firebaseapp.com",
  databaseURL: "https://banco-p4-default-rtdb.firebaseio.com",
  projectId: "banco-p4",
  storageBucket: "banco-p4.firebasestorage.app",
  messagingSenderId: "88021829093",
  appId: "1:88021829093:web:2dab3d1c87988cb28bdb0c"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ID de la clase
const CLASS_ID = 'p4-rrii-default';

// Referencia a la base de datos
export const dataRef = ref(db, `clases/${CLASS_ID}`);

// Guardar datos
export const saveBankData = (data) => {
  return set(dataRef, { ...data, updatedAt: Date.now() });
};

// Escuchar cambios en tiempo real
export const subscribeToData = (callback) => {
  return onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || { 
      students: [], 
      transactions: [], 
      bonusRequests: [], 
      centralBank: { balance: 0, name: 'P4 Central Bank' } 
    });
  });
};

// Obtener datos una sola vez
export const getDataOnce = async () => {
  const snapshot = await get(dataRef);
  return snapshot.val() || { 
    students: [], 
    transactions: [], 
    bonusRequests: [], 
    centralBank: { balance: 0, name: 'P4 Central Bank' } 
  };
};