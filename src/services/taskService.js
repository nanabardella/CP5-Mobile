import {
  collection, deleteDoc, doc, getDocs, limit, onSnapshot, orderBy,
  query, serverTimestamp, updateDoc, writeBatch
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

import { validateTask } from '../utils/taskValidation';
export { TASK_STATUSES, validateTask } from '../utils/taskValidation';

function userRecords(uid) {
  if (!uid || auth.currentUser?.uid !== uid) {
    throw new Error('Faça login para acessar suas tarefas.');
  }
  return collection(db, 'usuarios', uid, 'registros');
}

export function watchTasks(uid, onData, onError) {
  return onSnapshot(query(userRecords(uid), orderBy('createdAt', 'desc')),
    (snapshot) => onData(snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))),
    onError);
}

export async function saveTask(uid, values, id) {
  if (Object.keys(validateTask(values)).length) throw new Error('Revise os campos da tarefa.');
  const records = userRecords(uid);
  const data = {
    title: values.title.trim(), description: values.description.trim(),
    date: values.date.trim(), status: values.status.trim(), updatedAt: serverTimestamp()
  };
  if (id) {
    await updateDoc(doc(records, id), data);
  } else {
    const batch = writeBatch(db);
    batch.set(doc(db, 'usuarios', uid), {
      name: auth.currentUser.displayName || '', email: auth.currentUser.email || ''
    }, { merge: true });
    batch.set(doc(records), { ...data, createdAt: serverTimestamp() });
    await batch.commit();
  }
}

export function removeTask(uid, id) {
  return deleteDoc(doc(userRecords(uid), id));
}

export async function removeUserData(uid) {
  const records = userRecords(uid);
  // Lotes pequenos permitem excluir também contas com muitos registros.
  let snapshot = await getDocs(query(records, limit(400)));
  while (!snapshot.empty) {
    const batch = writeBatch(db);
    snapshot.docs.forEach((record) => batch.delete(record.ref));
    await batch.commit();
    snapshot = await getDocs(query(records, limit(400)));
  }
  await deleteDoc(doc(db, 'usuarios', uid));
}

export function firestoreError(error) {
  if (error.code === 'permission-denied') {
    return 'Acesso negado. Confira se as regras de firestore.rules foram publicadas no seu projeto Firebase.';
  }
  if (error.code === 'unavailable') return 'Não foi possível conectar ao banco. Confira a internet e tente novamente.';
  return 'Não foi possível concluir a operação. Confira a conexão e se o Cloud Firestore está ativado.';
}
