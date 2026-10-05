import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Button, Field, styles } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { firestoreError, saveTask, TASK_STATUSES, validateTask } from '../services/taskService';

export default function TaskFormScreen({ navigation, route }) {
  const { user } = useAuth();
  const task = route.params?.task;
  const [values, setValues] = useState({
    title: task?.title || '', description: task?.description || '',
    date: task?.date || '', status: task?.status || 'Pendente'
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  function change(field, value) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }
  async function submit() {
    if (busy) return;
    const validation = validateTask(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    try {
      setBusy(true);
      await saveTask(user.uid, values, task?.id);
      Alert.alert('Sucesso', task ? 'Tarefa atualizada.' : 'Tarefa cadastrada.');
      navigation.goBack();
    } catch (e) { Alert.alert('Não foi possível salvar', firestoreError(e)); }
    finally { setBusy(false); }
  }
  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{task ? 'Editar tarefa' : 'Nova tarefa'}</Text>
      <Text style={styles.subtitle}>Preencha os quatro campos para organizar sua tarefa.</Text>
      <Field label="Título" value={values.title} onChangeText={(value) => change('title', value)} error={errors.title} maxLength={100} editable={!busy} placeholder="Ex.: Finalizar trabalho de Mobile" />
      <Field label="Descrição" value={values.description} onChangeText={(value) => change('description', value)} error={errors.description} maxLength={1000} editable={!busy} multiline placeholder="O que precisa ser feito?" />
      <Field label="Data (DD/MM/AAAA)" value={values.date} onChangeText={(value) => change('date', value)} error={errors.date} maxLength={10} editable={!busy} keyboardType="numbers-and-punctuation" placeholder="Ex.: 20/10/2026" />
      <Field label="Status" value={values.status} onChangeText={(value) => change('status', value)} error={errors.status} editable={!busy} placeholder="Pendente, Em andamento ou Concluída" />
      <Text style={styles.muted}>Você também pode escolher o status abaixo:</Text>
      <View style={{ marginBottom: 18 }}>
        {TASK_STATUSES.map((status) => <Button key={status} title={`${values.status === status ? '✓ ' : ''}${status}`} secondary={values.status !== status} disabled={busy} onPress={() => change('status', status)} />)}
      </View>
      <Button title={task ? 'Salvar alterações' : 'Cadastrar tarefa'} loading={busy} onPress={submit} />
      <Button title="Cancelar" secondary disabled={busy} onPress={() => navigation.goBack()} />
    </ScrollView>
  </KeyboardAvoidingView>;
}
