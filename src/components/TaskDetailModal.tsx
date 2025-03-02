import { motion, AnimatePresence } from 'framer-motion';
import styled, { createGlobalStyle } from 'styled-components';
import { XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { Task, Course } from '../types/Task';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const Modal = styled(motion.div)<{ $isDark: boolean }>`
  ${({ $isDark }) => $isDark 
    ? 'background: rgb(15 23 42); border: 1px solid rgb(51 65 85);' 
    : 'background: white; border: 1px solid rgb(226 232 240);'}
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

interface TaskDetailModalProps {
  task: Task;
  courses: Course[];
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
}

// Tambahkan CSS global untuk scrollbar
const GlobalStyle = createGlobalStyle`
  * {
    scrollbar-width: thin;
    scrollbar-color: ${props => props.theme.isDark ? '#475569 #1e293b' : '#cbd5e1 #f1f5f9'};
  }

  *::-webkit-scrollbar {
    width: 8px;
  }

  *::-webkit-scrollbar-track {
    background: ${props => props.theme.isDark ? '#1e293b' : '#f1f5f9'};
    border-radius: 4px;
  }

  *::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.isDark ? '#475569' : '#cbd5e1'};
    border-radius: 4px;
  }
`;

export function TaskDetailModal({ 
  task, 
  courses, 
  isOpen, 
  onClose, 
  isDark,
  onUpdate,
  onToggleComplete
}: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedDeadline, setEditedDeadline] = useState(() => new Date(task.deadline));
  const [editedSubmissionLink, setEditedSubmissionLink] = useState(task.submissionLink || '');

  const MAX_DESCRIPTION_LENGTH = 2500;

  // Reset form ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      setEditedTitle(task.title);
      setEditedDescription(task.description);
      setEditedDeadline(new Date(task.deadline));
      setEditedSubmissionLink(task.submissionLink || '');
    }
  }, [isOpen, task]);

  const courseName = task.courseId 
    ? courses.find(c => c.id === task.courseId)?.name 
    : null;

  const handleSave = () => {
    if (!editedTitle.trim()) {
      toast.error('Judul tugas tidak boleh kosong!');
      return;
    }

    try {
      onUpdate(task.id, {
        title: editedTitle.trim(),
        description: editedDescription.trim(),
        deadline: editedDeadline.toISOString(),
        submissionLink: editedSubmissionLink.trim(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Gagal menyimpan perubahan');
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newDate = new Date(e.target.value);
      if (!isNaN(newDate.getTime())) {
        // Preserve the current time when changing date
        const currentDate = editedDeadline;
        newDate.setHours(currentDate.getHours());
        newDate.setMinutes(currentDate.getMinutes());
        setEditedDeadline(newDate);
      }
    } catch (error) {
      console.error('Error setting date:', error);
    }
  };

  // Format date for input
  const formatDateForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedDeadline(new Date(task.deadline));
    setEditedSubmissionLink(task.submissionLink || '');
  };

  const getCourseColor = (courseId?: string) => {
    if (!courseId) return '';
    const index = courses.findIndex(c => c.id === courseId);
    const modernColors = [
      'text-blue-500',    // Biru Modern
      'text-emerald-500', // Emerald
      'text-violet-500',  // Ungu
      'text-amber-500',   // Amber
      'text-rose-500',    // Rose
      'text-cyan-500',    // Cyan
      'text-indigo-500',  // Indigo
      'text-fuchsia-500', // Fuchsia
      'text-teal-500',    // Teal
      'text-orange-500',  // Orange
    ];
    return modernColors[index % modernColors.length];
  };

  if (!isOpen) return null;

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Modal
        $isDark={isDark}
        onClick={e => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        <GlobalStyle theme={{ isDark }} />
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            {courseName && (
              <p className={`text-xl font-medium ${getCourseColor(task.courseId)}`}>
                {courseName}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className={`p-2 rounded-lg ${
                  isDark 
                    ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200' 
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
                } transition-colors`}
              >
                <PencilIcon className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                isDark 
                  ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200' 
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
              } transition-colors`}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={e => setEditedTitle(e.target.value)}
                className={`text-2xl font-bold w-full px-3 py-2 rounded-lg
                  ${isDark 
                    ? 'bg-slate-800 text-slate-100 border-slate-700' 
                    : 'bg-white text-slate-900 border-slate-200'
                  } border focus:outline-none focus:ring-2 focus:ring-emerald-500/20
                  placeholder-slate-500`}
                placeholder="Judul tugas"
              />
            ) : (
              <h2 className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {task.title}
              </h2>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className={`text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Mata Kuliah
                </label>
                <select
                  value={task.courseId || ''}
                  onChange={e => onUpdate(task.id, { courseId: e.target.value || undefined })}
                  className={`w-full px-3 py-2 rounded-lg
                    ${isDark 
                      ? 'bg-slate-800 text-slate-300 border-slate-700' 
                      : 'bg-white text-slate-600 border-slate-200'
                    } border focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                >
                  <option value="">Pilih Mata Kuliah</option>
                  {courses
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="relative">
                <textarea
                  value={editedDescription}
                  onChange={e => {
                    if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                      setEditedDescription(e.target.value);
                    }
                  }}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  className={`w-full px-3 py-2 rounded ${
                    isDark 
                      ? 'bg-slate-800 text-slate-300 border-slate-700' 
                      : 'bg-white text-slate-600 border-slate-200'
                  } border focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                  rows={8}
                  placeholder="Deskripsi tugas"
                />
                <div className={`absolute bottom-2 right-2 text-xs 
                  ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {editedDescription.length}/{MAX_DESCRIPTION_LENGTH}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={formatDateForInput(editedDeadline)}
                    onChange={handleDateChange}
                    className={`w-full px-3 py-2 rounded ${
                      isDark 
                        ? 'bg-slate-800 text-slate-300 border-slate-700' 
                        : 'bg-white text-slate-600 border-slate-200'
                    } border focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-medium ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Link Pengumpulan
                  </label>
                  <input
                    type="url"
                    value={editedSubmissionLink}
                    onChange={e => setEditedSubmissionLink(e.target.value)}
                    placeholder="https://..."
                    className={`w-full px-3 py-2 rounded ${
                      isDark 
                        ? 'bg-slate-800 text-slate-300 border-slate-700' 
                        : 'bg-white text-slate-600 border-slate-200'
                    } border focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg bg-slate-600 text-white 
                    hover:bg-slate-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white 
                    hover:bg-emerald-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={`text-base whitespace-pre-wrap ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {task.description || 'Tidak ada deskripsi'}
              </div>

              <div className="flex flex-wrap gap-3">
                <span className={`text-sm px-3 py-1.5 rounded-full ${
                  isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
                }`}>
                  Deadline: {format(new Date(task.deadline), 'PPP')}
                </span>

                {task.submissionLink && (
                  <a
                    href={task.submissionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm px-3 py-1.5 rounded-full 
                      ${isDark 
                        ? 'bg-emerald-900/50 text-emerald-200 hover:bg-emerald-800/50' 
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'} 
                      transition-colors`}
                  >
                    Link Pengumpulan
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </Modal>
    </Overlay>
  );
} 