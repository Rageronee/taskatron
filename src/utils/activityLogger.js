import { ref, push } from 'firebase/database';
import { db, auth } from '../firebase';

export const logActivity = async (action, taskId, details) => {
  if (!auth.currentUser) return;
  
  const logsRef = ref(db, `activity_logs/${auth.currentUser.uid}`);
  await push(logsRef, {
    action,
    taskId,
    details,
    timestamp: new Date().toISOString(),
    userId: auth.currentUser.uid,
    userEmail: auth.currentUser.email
  });
}; 