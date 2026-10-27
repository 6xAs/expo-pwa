import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { obterFirestore } from '@/config/firebase';
import { garantirAutenticacao } from '@/services/authService';

export type Usuario = { id: string; nome: string; email: string };
export type DadosUsuario = Pick<Usuario, 'nome' | 'email'>;

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
  const referencia = await addDoc(colecaoUsuarios(), dados);
  return referencia.id;
}
export async function atualizarUsuario(id: string, dados: DadosUsuario): Promise<void> {
  await garantirAutenticacao();
  await updateDoc(doc(obterFirestore(), 'usuarios', id), dados);
}
export async function excluirUsuario(id: string): Promise<void> {
  await garantirAutenticacao();
  await deleteDoc(doc(obterFirestore(), 'usuarios', id));
}
