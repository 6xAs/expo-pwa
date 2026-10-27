import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { obterFirestore } from '@/config/firebase';
import { garantirAutenticacao } from '@/services/authService';

export type Usuario = { id: string; nome: string; email: string };
export type DadosUsuario = Pick<Usuario, 'nome' | 'email'>;

function limiteFirestore<T>(operacao: Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(Object.assign(new Error('Firestore não confirmou a operação em 20 segundos.'), { code: 'firestore/timeout' })), 20000);
    operacao.then(
      (resultado) => { clearTimeout(timer); resolve(resultado); },
      (erro) => { clearTimeout(timer); reject(erro); },
    );
  });
}

function colecaoUsuarios() {
  return collection(obterFirestore(), 'usuarios');
}
export async function listarUsuarios(): Promise<Usuario[]> {
  await garantirAutenticacao();
  const snapshot = await getDocs(colecaoUsuarios());
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Usuario));
}
export async function cadastrarUsuario(dados: DadosUsuario): Promise<string> {
  await garantirAutenticacao();
  const referencia = await limiteFirestore(addDoc(colecaoUsuarios(), dados));
  return referencia.id;
}
export async function atualizarUsuario(id: string, dados: DadosUsuario): Promise<void> {
  await garantirAutenticacao();
  await limiteFirestore(updateDoc(doc(obterFirestore(), 'usuarios', id), dados));
}
export async function excluirUsuario(id: string): Promise<void> {
  await garantirAutenticacao();
  await limiteFirestore(deleteDoc(doc(obterFirestore(), 'usuarios', id)));
}
