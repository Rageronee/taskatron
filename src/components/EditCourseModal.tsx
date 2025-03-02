import { motion } from 'framer-motion';
import styled from 'styled-components';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Course } from '../types/Task';
import { useState } from 'react';
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
  max-width: 400px;
  position: relative;
`;

interface EditCourseModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (courseId: string, name: string) => void;
  isDark: boolean;
}

export function EditCourseModal({ course, isOpen, onClose, onUpdate, isDark }: EditCourseModalProps) {
  const [name, setName] = useState(course.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Nama matkul tidak boleh kosong!');
      return;
    }

    onUpdate(course.id, name.trim());
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
          Edit Mata Kuliah
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Nama Mata Kuliah
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg
                ${isDark 
                  ? 'bg-slate-800 border-slate-600 text-white focus:border-primary-500' 
                  : 'bg-white border-slate-300 text-slate-900 focus:border-primary-500'} 
                border focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors`}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                isDark 
                  ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              } transition-colors`}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg 
                hover:bg-emerald-700 transition-colors"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </Overlay>
  );
} 