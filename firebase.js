import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, get } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

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
const auth = getAuth(app);

// Inicia sesión anónima automáticamente al cargar la app.
// Esto no identifica al estudiante, solo evita que alguien
// fuera de la app pueda leer o escribir en la base de datos.
signInAnonymously(auth).catch((err) => console.error('Error de autenticación anónima:', err));

// ID de la clase
