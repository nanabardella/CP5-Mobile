import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, Card, styles } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { firestoreError, removeTask, watchTasks } from '../services/taskService';

export default function TasksScreen({ navigation }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    setTasks([]);
    setLoading(true);
    setError('');
    return watchTasks(user.uid, (records) => {
      setTasks(records);
      setLoading(false);
    }, (e) => {
      setError(firestoreError(e));
      setLoading(false);
    });
  }, [user.uid, retry]);

  function confirmDelete(task) {
    Alert.alert('Excluir tarefa', `Tem certeza que deseja excluir "${task.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        try {
          setDeleting(task.id);
          await removeTask(user.uid, task.id);
          Alert.alert('Sucesso', 'Tarefa excluída.');
        } catch (e) { Alert.alert('Não foi possível excluir', firestoreError(e)); }
        finally { setDeleting(null); }
      } }
    ]);
  }

  return <View style={styles.screen}>
    <FlatList
      data={error ? [] : tasks}
      keyExtractor={(item) => item.id}
      contentContainerStyle={local.content}
      ListHeaderComponent={<View style={local.header}>
        <Text style={styles.title}>Minhas tarefas</Text>
        <Text style={styles.subtitle}>Olá, {user.displayName || 'estudante'}! Organize seu dia.</Text>
        <Button title="Nova tarefa" onPress={() => navigation.navigate('TaskForm')} />
        <Button title="Meu perfil" secondary onPress={() => navigation.navigate('Profile')} />
        {!loading && !error && <Text style={local.count}>{tasks.length} tarefa(s) • {tasks.filter((task) => task.status === 'Concluída').length} concluída(s)</Text>}
      </View>}
      ListEmptyComponent={loading ? <ActivityIndicator size="large" color="#2563eb" /> :
        error ? <Card><Text style={styles.error}>{error}</Text><Button title="Tentar novamente" onPress={() => setRetry((value) => value + 1)} /></Card> :
          <Card><Text style={styles.sectionTitle}>Nenhum registro encontrado.</Text><Text style={styles.muted}>Toque em Nova tarefa para cadastrar sua primeira tarefa.</Text></Card>}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      renderItem={({ item }) => <Card>
        <Text style={local.badge}>{item.status}</Text>
        <Text style={styles.sectionTitle}>{item.title}</Text>
        <Text style={styles.muted}>{item.description}</Text>
        <Text style={local.date}>Data: {item.date}</Text>
        <Button title="Editar" secondary onPress={() => navigation.navigate('TaskForm', { task: item })} />
        <Button title="Excluir" danger loading={deleting === item.id} disabled={deleting !== null} onPress={() => confirmDelete(item)} />
      </Card>}
    />
  </View>;
}

const local = StyleSheet.create({
  content: { padding: 24, paddingBottom: 40, flexGrow: 1 },
  header: { marginBottom: 24 },
  count: { color: '#64748b', marginTop: 18 },
  badge: { color: '#2563eb', fontWeight: '700', marginBottom: 10 },
  date: { color: '#334155', fontWeight: '600', marginVertical: 14 }
});
