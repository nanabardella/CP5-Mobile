import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button, Field, styles } from '../components/UI';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export default function RegisterScreen({ navigation }) {
  const { register } = useAuth(); const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [busy, setBusy] = useState(false);
  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password || !confirm) return Alert.alert('Atenção', 'Preencha todos os campos.');
    if (!emailRegex.test(email.trim())) return Alert.alert('Atenção', 'Digite um e-mail válido.');
    if (password.length < 6) return Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
    if (password !== confirm) return Alert.alert('Atenção', 'As senhas não coincidem.');
    try { setBusy(true); await register(name, email, password); } catch (e) { Alert.alert('Não foi possível cadastrar', e.code === 'auth/email-already-in-use' ? 'Este e-mail já está cadastrado.' : 'Verifique os dados e tente novamente.'); } finally { setBusy(false); }
  }
  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
    <Text style={styles.title}>Criar conta</Text><Text style={styles.subtitle}>Cadastre-se para começar a usar o aplicativo.</Text>
    <Field label="Nome" value={name} onChangeText={setName} placeholder="Seu nome completo" />
    <Field label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="seu@email.com" />
    <Field label="Senha" value={password} onChangeText={setPassword} secureTextEntry placeholder="Mínimo de 6 caracteres" />
    <Field label="Confirme a senha" value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="Repita sua senha" />
    <Button title="Cadastrar" onPress={handleRegister} loading={busy} /><TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.link}>Já tenho uma conta</Text></TouchableOpacity>
  </ScrollView></KeyboardAvoidingView>;
}
