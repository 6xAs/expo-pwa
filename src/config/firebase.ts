import { getApp, getApps, initializeApp } from 'firebase/app';
import { initializeFirestore, type Firestore } from 'firebase/firestore';

// Expo substitui referências estáticas EXPO_PUBLIC_* durante o bundle Web.
// Não inicialize o SDK durante a renderização estática do Expo Router.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

let instanciaFirestore: Firestore | null = null;

export function obterFirestore() {
  if (typeof window === 'undefined') {
    throw new Error('O Firestore deve ser acessado somente no cliente Web.');
  }
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.appId) {
    throw new Error('Firebase não configurado: confira EXPO_PUBLIC_FIREBASE_* no ambiente Preview do Vercel.');
  }
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  if (!instanciaFirestore) {
    // Transporte long-polling: contorna bloqueios de WebChannel/streaming
    // em determinados navegadores, proxies e redes.
    instanciaFirestore = initializeFirestore(
      app,
      { experimentalForceLongPolling: true },
      process.env.EXPO_PUBLIC_FIREBASE_DATABASE_ID || '(default)',
    );
  }
  return instanciaFirestore;
}
