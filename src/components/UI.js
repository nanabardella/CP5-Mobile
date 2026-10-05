import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export function Field({ label, error, ...props }) {
  return <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput placeholderTextColor="#9ca3af" style={[styles.input, error && styles.inputError]} {...props} />
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>;
}

export function Button({ title, onPress, secondary = false, danger = false, loading = false, disabled = false }) {
  return <TouchableOpacity accessibilityRole="button" disabled={loading || disabled} onPress={onPress} style={[styles.button, secondary && styles.secondary, danger && styles.danger, (loading || disabled) && { opacity: 0.6 }]}>
    {loading ? <ActivityIndicator color={secondary ? '#334155' : '#fff'} /> : <Text style={[styles.buttonText, secondary && styles.secondaryText]}>{title}</Text>}
  </TouchableOpacity>;
}

export function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f7fb' },
  content: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 30, fontWeight: '800', color: '#172554', marginBottom: 8 },
  subtitle: { color: '#64748b', fontSize: 15, lineHeight: 22, marginBottom: 26 },
  field: { marginBottom: 15 }, label: { color: '#334155', fontWeight: '700', marginBottom: 7 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#dbe2ea', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 13, fontSize: 16, color: '#0f172a' },
  inputError: { borderColor: '#ef4444' }, error: { color: '#dc2626', marginTop: 5, fontSize: 12 },
  button: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '800' }, secondary: { backgroundColor: '#e2e8f0' }, secondaryText: { color: '#334155' }, danger: { backgroundColor: '#dc2626' },
  link: { color: '#2563eb', fontWeight: '700', textAlign: 'center', marginTop: 20 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 20, shadowColor: '#0f172a', shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  muted: { color: '#64748b', lineHeight: 22 },
  sectionTitle: { color: '#172554', fontWeight: '800', fontSize: 18, marginBottom: 10 }
});
