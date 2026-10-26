import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const obrigatorias = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;
const faltantes = obrigatorias.filter((campo) => !firebaseConfig[campo]);
if (faltantes.length) {
  throw new Error('Configuração Firebase incompleta: defina as variáveis EXPO_PUBLIC_FIREBASE_* no Vercel.');
}

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp, process.env.EXPO_PUBLIC_FIREBASE_DATABASE_ID || '(default)');
