import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, type User } from 'firebase/auth';

let autenticacaoPendente: Promise<User> | null = null;

export function garantirAutenticacao(): Promise<User> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Autenticação disponível apenas no navegador.'));
  if (autenticacaoPendente) return autenticacaoPendente;
  autenticacaoPendente = (async () => {
    const config = {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    };
    if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
      throw new Error('Configuração Firebase incompleta no build Web.');
    }
    const app = getApps().length ? getApps()[0] : initializeApp(config);
    const auth = getAuth(app);
    await auth.authStateReady();
    if (auth.currentUser) return auth.currentUser;
    const credencial = await signInAnonymously(auth);
    return credencial.user;
  })().catch((error) => {
    autenticacaoPendente = null;
    throw error;
  });
  return autenticacaoPendente;
}
