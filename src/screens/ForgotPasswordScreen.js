import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button, Field, styles } from '../components/UI';
export default function ForgotPasswordScreen({ navigation }) {
  const { resetPassword } = useAuth(); const [email, setEmail] = useState(''); const [busy, setBusy] = useState(false);
  async function handleReset() { if (!email) return Alert.alert('Atenção', 'Informe seu e-mail.'); try { setBusy(true); await resetPassword(email); Alert.alert('Solicitação enviada', 'Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.', [{ text: 'OK', onPress: () => navigation.goBack() }]); } catch (e) { Alert.alert('Solicitação enviada', 'Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.'); } finally { setBusy(false); } }
  return <TouchableOpacity activeOpacity={1} style={[styles.screen, styles.content]}><Text style={styles.title}>Recuperar senha</Text><Text style={styles.subtitle}>Informe seu e-mail para receber o link de redefinição.</Text><Field label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="seu@email.com" /><Button title="Enviar instruções" onPress={handleReset} loading={busy} /><TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.link}>Voltar para o login</Text></TouchableOpacity></TouchableOpacity>;
}
