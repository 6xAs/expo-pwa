import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'erro' | 'sucesso' | null>(null);

  function validarFormulario() {
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo);

    if (!nomeLimpo || !emailLimpo) {
      setTipoMensagem('erro');
      setMensagem('Preencha o nome e o e-mail.');
      return;
    }

    if (!emailValido) {
      setTipoMensagem('erro');
      setMensagem('Informe um e-mail válido.');
      return;
    }

    setTipoMensagem('sucesso');
    setMensagem('Dados válidos. O Firebase será conectado no próximo checkpoint.');
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.shell}>
        <View style={styles.intro}>
          <Text style={styles.eyebrow}>EXPO PWA • CHECKPOINT 3</Text>
          <Text style={styles.title}>Cadastro de pessoas</Text>
          <Text style={styles.subtitle}>
            Preencha os dados abaixo para validar a primeira tela da aplicação.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              value={nome}
              onChangeText={(value) => {
                setNome(value);
                setMensagem('');
                setTipoMensagem(null);
              }}
              placeholder="Ex.: Maria Silva"
              autoCapitalize="words"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setMensagem('');
                setTipoMensagem(null);
              }}
              placeholder="Ex.: maria@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
          </View>

          {mensagem ? (
            <View
              style={[
                styles.feedback,
                tipoMensagem === 'erro' ? styles.feedbackErro : styles.feedbackSucesso,
              ]}
            >
              <Text
                style={[
                  styles.feedbackText,
                  tipoMensagem === 'erro'
                    ? styles.feedbackTextErro
                    : styles.feedbackTextSucesso,
                ]}
              >
                {mensagem}
              </Text>
            </View>
          ) : null}

          <Pressable
            onPress={validarFormulario}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.primaryButtonText}>Cadastrar</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setTipoMensagem('sucesso');
              setMensagem('A tela de listagem será adicionada na próxima etapa deste checkpoint.');
            }}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.secondaryButtonText}>Ver pessoas cadastradas</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          Nesta etapa os dados ainda não são enviados ao Firebase.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f7f5ff',
  },
  shell: {
    flex: 1,
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  intro: {
    marginBottom: 28,
  },
  eyebrow: {
    color: '#7458d6',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.3,
    marginBottom: 12,
  },
  title: {
    color: '#211a35',
    fontSize: 38,
    fontWeight: '800',
    lineHeight: 44,
    marginBottom: 10,
  },
  subtitle: {
    color: '#6d657b',
    fontSize: 17,
    lineHeight: 25,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#ebe7f3',
    shadowColor: '#211a35',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  field: {
    marginBottom: 18,
  },
  label: {
    color: '#302842',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#dcd6e8',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#211a35',
    backgroundColor: '#ffffff',
  },
  feedback: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
  },
  feedbackErro: {
    backgroundColor: '#fff0f0',
  },
  feedbackSucesso: {
    backgroundColor: '#effaf3',
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: '600',
  },
  feedbackTextErro: {
    color: '#a33a3a',
  },
  feedbackTextSucesso: {
    color: '#287345',
  },
  primaryButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#7458d6',
    marginTop: 2,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#654bbd',
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.78,
  },
  footer: {
    color: '#81798e',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
  },
});
