import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export type Usuario = { id: string; nome: string; email: string };
export type DadosUsuario = Pick<Usuario, 'nome' | 'email'>;
const usuarios = collection(db, 'usuarios');

export async function listarUsuarios(): Promise<Usuario[]> {
  const snapshot = await getDocs(usuarios);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Usuario));
}
export async function cadastrarUsuario(dados: DadosUsuario): Promise<string> {
  const referencia = await addDoc(usuarios, dados);
  return referencia.id;
}
export async function atualizarUsuario(id: string, dados: DadosUsuario): Promise<void> {
  await updateDoc(doc(db, 'usuarios', id), dados);
}
export async function excluirUsuario(id: string): Promise<void> {
  await deleteDoc(doc(db, 'usuarios', id));
}
