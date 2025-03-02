import { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Task, Course } from '../types/Task';

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
  max-width: 500px;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'completed'>) => void;
  isDark: boolean;
  courses: Course[];
}

export function AddTaskModal({ isOpen, onClose, onAdd, isDark, courses }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [courseId, setCourseId] = useState('');

  const sortedCourses = [...courses].sort((a, b) => 
    a.name.localeCompare(b.name, 'id', { sensitivity: 'base' })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAdd({
      title,
      description,
      deadline: new Date(deadline),
      submissionLink: submissionLink || undefined,
      courseId: courseId || undefined,
    });

    setTitle('');
    setDescription('');
    setDeadline('');
    setSubmissionLink('');
    setCourseId('');
    onClose();
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
        transition={{ type: "spring", damping: 20 }}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-full 
            ${isDark 
              ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200' 
              : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'} 
            transition-colors`}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className={`text-2xl font-bold mb-6 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Tambah Tugas Baru
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Mata Kuliah
            </label>
            <select
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              className={`w-full px-3 py-2 rounded-md 
                ${isDark 
                  ? 'bg-slate-800 border-slate-600 text-white focus:border-primary-500' 
                  : 'bg-white border-slate-300 text-slate-900 focus:border-primary-500'} 
                border focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors`}
            >
              <option value="">Pilih Mata Kuliah</option>
              {sortedCourses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Nama
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={`w-full px-3 py-2 rounded-md 
                ${isDark 
                  ? 'bg-slate-800 border-slate-600 text-white focus:border-primary-500' 
                  : 'bg-white border-slate-300 text-slate-900 focus:border-primary-500'} 
                border focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Deskripsi
            </label>
            <textarea
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              className={`w-full px-3 py-2 rounded-md 
                ${isDark 
                  ? 'bg-slate-800 border-slate-600 text-white focus:border-primary-500' 
                  : 'bg-white border-slate-300 text-slate-900 focus:border-primary-500'} 
                border focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors`}
              rows={3}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Deadline
            </label>
            <input
              type="datetime-local"
              required
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className={`w-full px-3 py-2 rounded-md 
                ${isDark 
                  ? 'bg-slate-800 border-slate-600 text-white focus:border-primary-500' 
                  : 'bg-white border-slate-300 text-slate-900 focus:border-primary-500'} 
                border focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Link Pengumpulan (Opsional)
            </label>
            <input
              type="url"
              value={submissionLink}
              onChange={e => setSubmissionLink(e.target.value)}
              className={`w-full px-3 py-2 rounded-md 
                ${isDark 
                  ? 'bg-slate-800 border-slate-600 text-white focus:border-primary-500' 
                  : 'bg-white border-slate-300 text-slate-900 focus:border-primary-500'} 
                border focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors`}
              placeholder="https://..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 
              transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tambah Tugas
          </button>
        </form>
      </Modal>
    </Overlay>
  );
}