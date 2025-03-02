import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import styled from 'styled-components';
import { Task, Course } from './types/Task';
import { TaskCard } from './components/TaskCard';
import { AddTaskModal } from './components/AddTaskModal';
import { CourseSelector } from './components/CourseSelector';
import { AddCourseModal } from './components/AddCourseModal';
import { Footer } from './components/Footer';
import { SunIcon, MoonIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { ClassSelection } from './components/ClassSelection';
import { TaskDetailModal } from './components/TaskDetailModal';

const Container = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${props => props.$isDark
    ? 'linear-gradient(to bottom right, rgb(15 23 42), rgb(30 41 59))'
    : 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)'};
  transition: background 0.3s ease;
  display: flex;
  flex-direction: column;
`;

const TaskGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
  align-items: start;
`;

const defaultCourses: Course[] = [
  { id: '1', name: 'Sistem Hidraulika' },
  { id: '2', name: 'Statistika' },
  { id: '3', name: 'IMK' },
  { id: '4', name: 'Dinamika Teknik' },
  { id: '5', name: 'Pneumatik' },
  { id: '6', name: 'AOK' },
  { id: '7', name: 'PJOK' },
  { id: '8', name: 'Termodinamika' },
  { id: '9', name: 'PLC' },
  { id: '10', name: 'Pendidikan Pancasila' },
];

function App() {
  // Inisialisasi currentClass terlebih dahulu
  const [currentClass, setCurrentClass] = useState(() => {
    // Cek apakah ini pertama kali user mengakses
    const isFirstVisit = !localStorage.getItem('hasVisited');
    if (isFirstVisit) {
      // Jika pertama kali, hapus kelas yang mungkin tersimpan
      localStorage.removeItem('selectedClass');
      localStorage.setItem('hasVisited', 'true');
      return '';
    }
    // Jika bukan pertama kali, ambil kelas yang tersimpan
    return localStorage.getItem('selectedClass') || '';
  });

  // Kemudian gunakan currentClass untuk inisialisasi tasks dan courses
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (!currentClass) return [];
    const saved = localStorage.getItem(`tasks_${currentClass}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [courses, setCourses] = useState<Course[]>(() => {
    if (!currentClass) return defaultCourses;
    const saved = localStorage.getItem(`courses_${currentClass}`);
    return saved ? JSON.parse(saved) : defaultCourses;
  });

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Save tasks when they change
  useEffect(() => {
    if (currentClass) {
      localStorage.setItem(`tasks_${currentClass}`, JSON.stringify(tasks));
    }
  }, [tasks, currentClass]);

  // Save courses when they change
  useEffect(() => {
    if (currentClass) {
      localStorage.setItem(`courses_${currentClass}`, JSON.stringify(courses));
    }
  }, [courses, currentClass]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('darkMode');
      if (saved === null) setIsDark(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleAddTask = (newTask: Omit<Task, 'id' | 'completed'>) => {
    try {
      const task: Task = {
        ...newTask,
        id: crypto.randomUUID(),
        completed: false,
        deadline: new Date(newTask.deadline).toISOString()
      };
      
      setTasks(prev => [...prev, task]);
      toast.success('Tugas berhasil ditambahkan!');
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Gagal menambahkan tugas');
    }
  };

  const handleAddCourse = (newCourse: Omit<Course, 'id'>) => {
    const course: Course = {
      ...newCourse,
      id: crypto.randomUUID(),
    };
    
    setCourses(prev => [...prev, course]);
    toast.success('Course added successfully!', {
      style: {
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#e2e8f0' : '#0f172a',
      },
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => {
      const newTasks = prev.filter(task => task.id !== id);
      return newTasks;
    });
    toast.success('Task berhasil dihapus!', {
      style: {
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#e2e8f0' : '#0f172a',
      },
    });
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { 
          ...task, 
          ...updates,
          deadline: updates.deadline 
            ? (updates.deadline instanceof Date 
                ? updates.deadline.toISOString() 
                : updates.deadline)
            : task.deadline
        } : task
      ));

      toast.success('Tugas berhasil diperbarui!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Gagal memperbarui tugas');
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
    setTasks(prev => prev.map(task => 
      task.courseId === courseId ? { ...task, courseId: undefined } : task
    ));
    if (selectedCourseId === courseId) {
      setSelectedCourseId(null);
    }
    toast.success('Matkul berhasil dihapus!', {
      style: {
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#e2e8f0' : '#0f172a',
      },
    });
  };

  const handleEditCourse = (courseId: string, newName: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId ? { ...course, name: newName } : course
    ));
    toast.success('Matkul berhasil diperbarui!', {
      style: {
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#e2e8f0' : '#0f172a',
      },
    });
  };

  const handleToggleComplete = (taskId: string) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ));
    } catch (error) {
      console.error('Error toggling task completion:', error);
      toast.error('Gagal mengubah status tugas');
    }
  };

  const filteredTasks = selectedCourseId
    ? tasks.filter(task => task.courseId === selectedCourseId)
    : tasks;

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('darkMode', String(newTheme));
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handle class selection
  const handleSelectClass = (className: string) => {
    setCurrentClass(className);
    localStorage.setItem('selectedClass', className);
    
    // Load data for the selected class
    const savedTasks = localStorage.getItem(`tasks_${className}`);
    const savedCourses = localStorage.getItem(`courses_${className}`);
    
    setTasks(savedTasks ? JSON.parse(savedTasks) : []);
    setCourses(savedCourses ? JSON.parse(savedCourses) : defaultCourses);
  };

  // Handle class switching
  const handleSwitchClass = () => {
    // Save current class data before switching
    if (currentClass) {
      localStorage.setItem(`tasks_${currentClass}`, JSON.stringify(tasks));
      localStorage.setItem(`courses_${currentClass}`, JSON.stringify(courses));
    }
    
    // Reset class selection
    setCurrentClass('');
    localStorage.removeItem('selectedClass');
  };

  // Show class selection if no class is selected
  if (!currentClass) {
    return (
      <ClassSelection 
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onSelectClass={handleSelectClass}
      />
    );
  }

  return (
    <Container $isDark={isDark}>
      <Toaster />
      
      <div className="flex-1 max-w-7xl mx-auto w-full py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              TaskaTronika
            </h1>
            <span className={`text-sm px-3 py-1 rounded-full ${
              isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'
            }`}>
              Kelas {currentClass}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Tombol ganti kelas */}
            <button
              onClick={handleSwitchClass}
              className={`p-2 rounded-lg ${
                isDark 
                  ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              } transition-colors`}
              title="Ganti Kelas"
            >
              <span className="material-icons">meeting_room</span>
            </button>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                isDark 
                  ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              } transition-colors`}
            >
              {isDark ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>
            
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 
                transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Tambah Tugas
            </button>
          </div>
        </div>

        <CourseSelector
          courses={courses}
          selectedCourseId={selectedCourseId}
          onSelectCourse={setSelectedCourseId}
          onAddCourse={() => setIsCourseModalOpen(true)}
          onDeleteCourse={handleDeleteCourse}
          onEditCourse={handleEditCourse}
          isDark={isDark}
        />

        <TaskGrid>
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredTasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <TaskCard
                  task={task}
                  onDelete={handleDeleteTask}
                  onUpdate={handleUpdateTask}
                  onToggleComplete={handleToggleComplete}
                  isDark={isDark}
                  courses={courses}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </TaskGrid>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-lg ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {selectedCourseId 
                ? "Belum ada tugas untuk matkul ini. Klik 'Tambah Tugas' untuk memulai!"
                : "Belum ada tugas yang ditambahkan. Klik 'Tambah Tugas' untuk memulai!"}
            </p>
          </div>
        )}
      </div>

      <Footer isDark={isDark} />

      <AnimatePresence>
        {isTaskModalOpen && (
          selectedTaskId ? (
            <TaskDetailModal
              task={tasks.find(t => t.id === selectedTaskId)!}
              courses={courses}
              isOpen={isTaskModalOpen}
              onClose={() => {
                setIsTaskModalOpen(false);
                setSelectedTaskId(null);
              }}
              isDark={isDark}
              onUpdate={handleUpdateTask}
              onToggleComplete={handleToggleComplete}
            />
          ) : (
            <AddTaskModal
              isOpen={isTaskModalOpen}
              onClose={() => setIsTaskModalOpen(false)}
              onAdd={handleAddTask}
              isDark={isDark}
              courses={courses}
            />
          )
        )}
        {isCourseModalOpen && (
          <AddCourseModal
            isOpen={isCourseModalOpen}
            onClose={() => setIsCourseModalOpen(false)}
            onAdd={handleAddCourse}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
    </Container>
  );
}

export default App;