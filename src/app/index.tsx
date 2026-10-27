import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { atualizarUsuario, cadastrarUsuario } from '@/services/usuariosService';

export default function CadastroScreen() {
  const params = useLocalSearchParams<{ id?: string; nome?: string; email?: string }>();
  const id = typeof params.id === 'string' ? params.id : '';
  const editando = Boolean(id);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'erro' | 'sucesso' | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setNome(typeof params.nome === 'string' ? params.nome : '');
    setEmail(typeof params.email === 'string' ? params.email : '');
    setMensagem('');
    setTipoMensagem(null);
  }, [params.id, params.nome, params.email]);

  async function salvar() {
    if (salvando) return;
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();
    if (!nomeLimpo || !emailLimpo) {
      setTipoMensagem('erro'); setMensagem('Preencha o nome e o e-mail.'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)) {
      setTipoMensagem('erro'); setMensagem('Informe um e-mail válido.'); return;
    }
    setSalvando(true);
    setMensagem('');
    setTipoMensagem(null);
    try {
      if (editando) {
        await atualizarUsuario(id, { nome: nomeLimpo, email: emailLimpo });
      } else {
        await cadastrarUsuario({ nome: nomeLimpo, email: emailLimpo });
        setNome('');
        setEmail('');
      }
      setTipoMensagem('sucesso');
      setMensagem(editando ? 'Cadastro atualizado no Firestore com sucesso!' : 'Pessoa cadastrada no Firestore com sucesso!');
    } catch (error) {
      const codigo = (error as { code?: string }).code;
      setTipoMensagem('erro');
      setMensagem(codigo === 'permission-denied'
        ? 'O Firestore não autorizou a gravação. Verifique a autenticação e as regras de segurança.'
        : 'Não foi possível salvar no Firestore. Confira a conexão e tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.shell} keyboardShouldPersistTaps="handled">
        <View style={styles.intro}>
          <Text style={styles.eyebrow}>EXPO PWA • FIRESTORE</Text>
          <Text style={styles.title}>{editando ? 'Editar pessoa' : 'Cadastro de pessoas'}</Text>
          <Text style={styles.subtitle}>{editando ? 'Atualize o nome ou e-mail da pessoa cadastrada.' : 'Cadastre nome e e-mail diretamente no Firebase Firestore.'}</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Nome</Text>
            <TextInput value={nome} editable={!salvando} onChangeText={(value) => { setNome(value); setMensagem(''); setTipoMensagem(null); }}
              placeholder="Ex.: Maria Silva" autoCapitalize="words" style={styles.input} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput value={email} editable={!salvando} onChangeText={(value) => { setEmail(value); setMensagem(''); setTipoMensagem(null); }}
              placeholder="Ex.: maria@email.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={styles.input} />
          </View>
          {mensagem ? (
            <View style={[styles.feedback, tipoMensagem === 'erro' ? styles.feedbackErro : styles.feedbackSucesso]}>
              <Text style={[styles.feedbackText, tipoMensagem === 'erro' ? styles.feedbackTextErro : styles.feedbackTextSucesso]}>{mensagem}</Text>
            </View>
          ) : null}
          <Pressable disabled={salvando} onPress={() => void salvar()} style={({ pressed }) => [styles.primaryButton, (pressed || salvando) && styles.pressed]}>
            {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>{editando ? 'Salvar alterações' : 'Cadastrar'}</Text>}
          </Pressable>
          <Pressable disabled={salvando} onPress={() => router.replace('/pessoas')} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>Ver pessoas cadastradas</Text>
          </Pressable>
        </View>
        <Text style={styles.footer}>Os dados são armazenados na coleção usuarios do Firestore.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page:{flex:1,backgroundColor:'#f7f5ff'}, shell:{flexGrow:1,width:'100%',maxWidth:620,alignSelf:'center',justifyContent:'center',paddingHorizontal:24,paddingVertical:40},
  intro:{marginBottom:28}, eyebrow:{color:'#7458d6',fontSize:12,fontWeight:'800',letterSpacing:1.3,marginBottom:12},
  title:{color:'#211a35',fontSize:38,fontWeight:'800',lineHeight:44,marginBottom:10}, subtitle:{color:'#6d657b',fontSize:17,lineHeight:25},
  card:{backgroundColor:'#fff',borderRadius:24,padding:24,borderWidth:1,borderColor:'#ebe7f3',shadowColor:'#211a35',shadowOpacity:.08,shadowRadius:24,shadowOffset:{width:0,height:10}},
  field:{marginBottom:18}, label:{color:'#302842',fontSize:14,fontWeight:'700',marginBottom:8},
  input:{width:'100%',minHeight:52,borderWidth:1,borderColor:'#dcd6e8',borderRadius:14,paddingHorizontal:16,fontSize:16,color:'#211a35',backgroundColor:'#fff'},
  feedback:{borderRadius:12,paddingHorizontal:14,paddingVertical:12,marginBottom:18}, feedbackErro:{backgroundColor:'#fff0f0'},feedbackSucesso:{backgroundColor:'#effaf3'},
  feedbackText:{fontSize:14,fontWeight:'600'},feedbackTextErro:{color:'#a33a3a'},feedbackTextSucesso:{color:'#287345'},
  primaryButton:{minHeight:54,alignItems:'center',justifyContent:'center',borderRadius:14,backgroundColor:'#7458d6',marginTop:2},
  primaryButtonText:{color:'#fff',fontSize:16,fontWeight:'800'},secondaryButton:{minHeight:50,alignItems:'center',justifyContent:'center',marginTop:10},
  secondaryButtonText:{color:'#654bbd',fontSize:15,fontWeight:'700'},pressed:{opacity:.65},footer:{color:'#81798e',fontSize:13,textAlign:'center',marginTop:20},
});
