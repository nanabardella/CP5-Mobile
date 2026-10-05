import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button, Field, styles } from '../components/UI';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [busy, setBusy] = useState(false);
  async function handleLogin() {
    if (!email || !password) return Alert.alert('Atenção', 'Preencha o e-mail e a senha.');
    try { setBusy(true); await login(email, password); } catch (e) { Alert.alert('Não foi possível entrar', 'Verifique seu e-mail e senha.'); } finally { setBusy(false); }
  }
  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
      <Text style={styles.title}>Bem-vindo</Text><Text style={styles.subtitle}>Entre na sua conta para continuar.</Text>
      <Field label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="seu@email.com" />
      <Field label="Senha" value={password} onChangeText={setPassword} secureTextEntry placeholder="Sua senha" />
      <Button title="Entrar" onPress={handleLogin} loading={busy} />
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}><Text style={styles.link}>Esqueci minha senha</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}><Text style={styles.link}>Ainda não tenho uma conta</Text></TouchableOpacity>
    </ScrollView>
  </KeyboardAvoidingView>;
}
