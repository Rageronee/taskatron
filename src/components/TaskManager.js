import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { ref, onValue, push, update, remove } from 'firebase/database';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    deadline: '',
    description: ''
  });

  useEffect(() => {
    const tasksRef = ref(db, 'tasks');
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const taskList = Object.entries(data).map(([id, task]) => ({
          id,
          ...task
        }));
        setTasks(taskList);
        checkDeadlines(taskList);
      }
    });
  }, []);

  const checkDeadlines = (taskList) => {
    taskList.forEach(task => {
      const deadline = new Date(task.deadline);
      const today = new Date();
      const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 3 && diffDays > 0) {
        // Kirim notifikasi
        sendNotification(task);
      }
    });
  };

  const sendNotification = async (task) => {
    // Implementasi pengiriman notifikasi
  };

  const addTask = async () => {
    if (!auth.currentUser) return;
    
    const tasksRef = ref(db, `tasks/${auth.currentUser.uid}`);
    await push(tasksRef, {
      ...newTask,
      userId: auth.currentUser.uid,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      modifiedBy: auth.currentUser.email
    });
  };

  const updateTask = async (taskId, updatedData) => {
    if (!auth.currentUser) return;
    
    const taskRef = ref(db, `tasks/${auth.currentUser.uid}/${taskId}`);
    await update(taskRef, {
      ...updatedData,
      lastModified: new Date().toISOString(),
      modifiedBy: auth.currentUser.email
    });
  };

  const deleteTask = async (taskId) => {
    if (!auth.currentUser) return;
    
    const taskRef = ref(db, `tasks/${auth.currentUser.uid}/${taskId}`);
    await remove(taskRef);
  };

  return (
    <div>
      {/* Form tambah tugas */}
      <form onSubmit={(e) => {
        e.preventDefault();
        addTask();
      }}>
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
          placeholder="Judul Tugas"
        />
        <input
          type="date"
          value={newTask.deadline}
          onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
        />
        <textarea
          value={newTask.description}
          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
          placeholder="Deskripsi"
        />
        <button type="submit">Tambah Tugas</button>
      </form>

      {/* Daftar tugas */}
      <div>
        {tasks.map(task => (
          <div key={task.id}>
            <h3>{task.title}</h3>
            <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
            <p>{task.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskManager; 