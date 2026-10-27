import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { excluirUsuario, listarUsuarios, type Usuario } from '@/services/usuariosService';

export default function PessoasScreen() {
  const [pessoas, setPessoas] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [excluindoId, setExcluindoId] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const registros = await listarUsuarios();
      setPessoas(registros);
    } catch (error) {
      const codigo = (error as { code?: string }).code;
      setErro(codigo === 'permission-denied'
        ? 'O Firestore bloqueou a leitura. Verifique a autenticação e as regras de segurança; não libere acesso público.'
        : 'Não foi possível consultar o Firestore. Confira a configuração do Firebase e tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { void carregar(); }, [carregar]);

  async function excluir(id: string) {
    setExcluindoId(id);
    setErro('');
    try {
      await excluirUsuario(id);
      setPessoas((atuais) => atuais.filter((pessoa) => pessoa.id !== id));
    } catch (error) {
      const codigo = (error as { code?: string }).code;
      setErro(codigo === 'permission-denied'
        ? 'O Firestore não autorizou a exclusão. Verifique a autenticação e as regras de segurança.'
        : 'Não foi possível excluir a pessoa. Tente novamente.');
    } finally {
      setExcluindoId(null);
    }
  }

  function confirmarExclusao(pessoa: Usuario) {
    if (excluindoId) return;
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(`Excluir ${pessoa.nome}? Esta ação não pode ser desfeita.`)) {
        void excluir(pessoa.id);
      }
      return;
    }
    Alert.alert('Confirmar exclusão', `Excluir ${pessoa.nome}? Esta ação não pode ser desfeita.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => void excluir(pessoa.id) },
    ]);
  }

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.shell}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>EXPO PWA • CRUD FIRESTORE</Text>
          <Text style={styles.title}>Pessoas cadastradas</Text>
          <Text style={styles.subtitle}>Dados consultados diretamente na coleção usuarios do Firestore.</Text>
        </View>

        {carregando ? (
          <View style={styles.status}><ActivityIndicator size="large" color="#7458d6" /><Text style={styles.statusText}>Consultando Firestore...</Text></View>
        ) : erro ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{erro}</Text>
            <Pressable onPress={() => void carregar()} style={styles.retryButton}><Text style={styles.retryText}>Tentar novamente</Text></Pressable>
          </View>
        ) : (
          <>
            <View style={styles.summary}>
              <Text style={styles.summaryNumber}>{pessoas.length}</Text>
              <Text style={styles.summaryText}>pessoas encontradas no Firestore</Text>
            </View>
            {pessoas.length === 0 ? (
              <View style={styles.status}><Text style={styles.statusText}>Nenhuma pessoa cadastrada na coleção usuarios.</Text></View>
            ) : (
              <View style={styles.list}>
                {pessoas.map((pessoa) => (
                  <View key={pessoa.id} style={styles.card}>
                    <View style={styles.avatar}><Text style={styles.avatarText}>{(pessoa.nome || '?').charAt(0)}</Text></View>
                    <View style={styles.info}>
                      <Text style={styles.name}>{pessoa.nome}</Text>
                      <Text style={styles.email}>{pessoa.email}</Text>
                    </View>
                    <View style={styles.actions}>
                      <Pressable onPress={() => router.push({ pathname: '/', params: { id: pessoa.id, nome: pessoa.nome, email: pessoa.email } })} style={styles.editButton}><Text style={styles.editText}>Editar</Text></Pressable>
                      <Pressable disabled={Boolean(excluindoId)} onPress={() => confirmarExclusao(pessoa)} style={styles.deleteButton}><Text style={styles.deleteText}>{excluindoId === pessoa.id ? 'Excluindo...' : 'Excluir'}</Text></Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        <Pressable onPress={() => void carregar()} style={styles.refreshButton}><Text style={styles.refreshText}>Atualizar lista</Text></Pressable>
        <Pressable onPress={() => router.replace('/')} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>+ Cadastrar nova pessoa</Text>
        </Pressable>
        <Text style={styles.note}>Cadastro, consulta, edição e exclusão integrados ao Firestore.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page:{flex:1,backgroundColor:'#f7f5ff'},shell:{width:'100%',maxWidth:820,alignSelf:'center',paddingHorizontal:24,paddingVertical:48},
  header:{marginBottom:24},eyebrow:{color:'#7458d6',fontSize:12,fontWeight:'800',letterSpacing:1.3,marginBottom:12},
  title:{color:'#211a35',fontSize:38,fontWeight:'800',lineHeight:44,marginBottom:10},subtitle:{color:'#6d657b',fontSize:17,lineHeight:25,maxWidth:650},
  summary:{flexDirection:'row',alignItems:'baseline',gap:8,marginBottom:18},summaryNumber:{color:'#7458d6',fontSize:26,fontWeight:'800'},summaryText:{color:'#756d82',fontSize:14},
  list:{gap:12,marginBottom:24},card:{backgroundColor:'#fff',borderRadius:18,padding:18,borderWidth:1,borderColor:'#ebe7f3',flexDirection:'row',alignItems:'center',gap:14},
  avatar:{width:46,height:46,borderRadius:23,backgroundColor:'#eee9ff',alignItems:'center',justifyContent:'center'},avatarText:{color:'#654bbd',fontSize:18,fontWeight:'800'},
  info:{flex:1,minWidth:140},name:{color:'#2b233b',fontSize:16,fontWeight:'800',marginBottom:4},email:{color:'#777080',fontSize:14},
  actions:{flexDirection:'row',gap:8},editButton:{paddingVertical:10,paddingHorizontal:14,borderRadius:10,backgroundColor:'#eee9ff'},editText:{color:'#654bbd',fontWeight:'700'},
  deleteButton:{paddingVertical:10,paddingHorizontal:14,borderRadius:10,backgroundColor:'#fff0f0'},deleteText:{color:'#a33a3a',fontWeight:'700'},
  primaryButton:{minHeight:54,alignItems:'center',justifyContent:'center',borderRadius:14,backgroundColor:'#7458d6'},
  primaryButtonText:{color:'#fff',fontSize:16,fontWeight:'800'},refreshButton:{alignItems:'center',paddingVertical:16},refreshText:{color:'#654bbd',fontWeight:'700'},
  note:{color:'#81798e',fontSize:13,textAlign:'center',marginTop:16},
  status:{paddingVertical:45,alignItems:'center',gap:14},statusText:{color:'#6d657b',fontSize:15,textAlign:'center'},
  errorBox:{backgroundColor:'#fff0f0',padding:20,borderRadius:14,marginBottom:20},errorText:{color:'#a33a3a',fontSize:15,lineHeight:23},
  retryButton:{marginTop:16,alignSelf:'flex-start'},retryText:{color:'#7458d6',fontWeight:'800'},
});
