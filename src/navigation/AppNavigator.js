import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TasksScreen from '../screens/TasksScreen';
import TaskFormScreen from '../screens/TaskFormScreen';
const Stack = createNativeStackNavigator();
export default function AppNavigator() {
  const { user, loading } = useAuth();
  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color="#2563eb" /></View>;
  return <NavigationContainer><Stack.Navigator screenOptions={{ headerTitle: '', headerShadowVisible: false, headerBackTitle: 'Voltar', contentStyle: { backgroundColor: '#f6f7fb' } }}>{user ? <Stack.Group navigationKey={user.uid}><Stack.Screen name="Tasks" component={TasksScreen} options={{ title: 'Minhas tarefas' }} /><Stack.Screen name="TaskForm" component={TaskFormScreen} options={{ title: 'Tarefa' }} /><Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Meu perfil' }} /></Stack.Group> : <Stack.Group navigationKey="guest"><Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} /><Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastro' }} /><Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Recuperar senha' }} /></Stack.Group>}</Stack.Navigator></NavigationContainer>;
}
