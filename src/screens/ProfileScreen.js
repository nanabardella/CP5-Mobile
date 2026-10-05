import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Field, styles } from '../components/UI';

export default function ProfileScreen() {
  const { user, logout, removeAccount } = useAuth();
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  async function handleLogout() {
    try { setBusy(true); await logout(); }
    catch (e) { Alert.alert('Não foi possível sair', 'Tente novamente.'); }
    finally { setBusy(false); }
  }
  function confirmDelete() {
    if (!password) return Alert.alert('Atenção', 'Informe sua senha atual para confirmar.');
    Alert.alert('Excluir conta', 'Sua conta e todas as suas tarefas serão excluídas permanentemente. Deseja continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        try { setBusy(true); await removeAccount(password); }
        catch (e) {
          const credentialErrors = ['auth/invalid-credential', 'auth/wrong-password', 'auth/invalid-login-credentials'];
          Alert.alert('Não foi possível excluir', credentialErrors.includes(e.code)
            ? 'Senha incorreta. Confira sua senha atual.'
            : 'Confira a conexão e as regras do Firestore e tente novamente. Se a limpeza já começou, algumas tarefas podem ter sido excluídas.');
        } finally { setBusy(false); setPassword(''); }
      } }
    ]);
  }
  return <ScrollView style={styles.screen} contentContainerStyle={{ padding: 24, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
    <Text style={styles.title}>Meu perfil</Text>
    <Text style={styles.subtitle}>Dados da sua conta.</Text>
    <Card><Text style={styles.sectionTitle}>Dados do usuário</Text><Text style={styles.muted}>Nome: {user?.displayName || 'Não informado'}</Text><Text style={styles.muted}>E-mail: {user?.email}</Text></Card>
    <View style={{ marginTop: 18 }}>
      <Button title="Sair da conta" onPress={handleLogout} secondary loading={busy} />
      {showDelete ? <View style={{ marginTop: 20 }}>
        <Text style={styles.muted}>Confirme sua senha para excluir a conta e suas tarefas.</Text>
        <Field label="Senha atual" value={password} onChangeText={setPassword} secureTextEntry editable={!busy} />
        <Button title="Confirmar exclusão da conta" onPress={confirmDelete} danger loading={busy} />
        <Button title="Cancelar" secondary disabled={busy} onPress={() => { setShowDelete(false); setPassword(''); }} />
      </View> : <Button title="Excluir conta" onPress={() => setShowDelete(true)} danger disabled={busy} />}
    </View>
  </ScrollView>;
}
