import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, get } from 'firebase/database';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCBk4xfOXBvCMiGMiNlg-eZdkriSNo2f_g",
  authDomain: "banco-p4.firebaseapp.com",
  databaseURL: "https://banco-p4-default-rtdb.firebaseio.com",
  projectId: "banco-p4",
  storageBucket: "banco-p4.firebasestorage.app",
  messagingSenderId: "88021829093",
  appId: "1:88021829093:web:2dab3d1c87988cb28bdb0c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const CLASS_ID = 'p4-rrii-default';

export const dataRef = ref(db, `clases/${CLASS_ID}`);

// Espera a que la sesion anonima este lista antes de leer o escribir
const authReady = new Promise((resolve, reject) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      resolve(user);
    } else {
      signInAnonymously(auth).catch((err) => {
        console.error('Error de autenticacion anonima:', err);
        reject(err);
      });

    }
  });
});

const DEFAULT_DATA = {
  students: [],
  transactions: [],
  bonusRequests: [],
  centralBank: { balance: 0, name: 'P4 Central Bank' }
};

export const saveBankData = async (data) => {
  await authReady;
  return set(dataRef, { ...data, updatedAt: Date.now() });
};

export const subscribeToData = (callback) => {
  let unsubscribe = () => {};
  authReady.then(() => {
    unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      callback(data || { ...DEFAULT_DATA });
    }, (error) => {
      console.error('Error leyendo la base de datos:', error);
    });
  });
  return () => unsubscribe();
};

export const getDataOnce = async () => {
  await authReady;
  const snapshot = await get(dataRef);

  return snapshot.val() || { ...DEFAULT_DATA };
};
