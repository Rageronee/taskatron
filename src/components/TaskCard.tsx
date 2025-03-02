import { motion } from 'framer-motion';
import styled from 'styled-components';
import { format, isPast, differenceInDays } from 'date-fns';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Task, TaskStatus } from '../types/Task';
import { Course } from '../types/Course';
import { useState } from 'react';
import { TaskDetailModal } from './TaskDetailModal';
import { toast } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

const StyledCard = styled(motion.div)<{ $status: TaskStatus; $isDark: boolean }>`
  ${({ $status, $isDark }) => {
    const colors = {
      completed: $isDark 
        ? 'bg-emerald-900/30 border-emerald-700/50' 
        : 'bg-emerald-50 border-emerald-200',
      far: $isDark 
        ? 'bg-slate-800/50 border-slate-700' 
        : 'bg-white border-slate-200',
      approaching: $isDark 
        ? 'bg-sky-900/30 border-sky-700/50' 
        : 'bg-sky-50 border-sky-200',
      near: $isDark 
        ? 'bg-amber-900/30 border-amber-700/50' 
        : 'bg-amber-50 border-amber-200',
      urgent: $isDark 
        ? 'bg-rose-900/30 border-rose-700/50' 
        : 'bg-rose-50 border-rose-200',
      overdue: $isDark 
        ? 'bg-gray-900/30 border-gray-700/30 opacity-75'
        : 'bg-gray-50 border-gray-200 opacity-75',
    };
    return colors[$status];
  }}
`;

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  isDark: boolean;
  courses: Course[];
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export function TaskCard({ task, onDelete, onToggleComplete, onUpdate, isDark, courses }: TaskCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedDeadline, setEditedDeadline] = useState(new Date(task.deadline));
  const [editedSubmissionLink, setEditedSubmissionLink] = useState(task.submissionLink || '');
  const [editedCourseId, setEditedCourseId] = useState(task.courseId || '');

  const MAX_DESCRIPTION_LENGTH = 2500; // Sesuaikan dengan modal

  const getTaskStatus = (): TaskStatus => {
    if (task.completed) return 'completed';
    if (isPast(task.deadline)) return 'overdue';
    
    const daysUntilDeadline = differenceInDays(task.deadline, new Date());
    
    if (daysUntilDeadline <= 1) return 'urgent';
    if (daysUntilDeadline <= 3) return 'near';
    if (daysUntilDeadline <= 7) return 'approaching';
    return 'far';
  };

  const getStatusColor = (status: TaskStatus) => {
    const colors = {
      completed: isDark ? 'text-emerald-400' : 'text-emerald-600',
      far: isDark ? 'text-slate-400' : 'text-slate-600',
      approaching: isDark ? 'text-sky-400' : 'text-sky-600',
      near: isDark ? 'text-amber-400' : 'text-amber-600',
      urgent: isDark ? 'text-rose-400' : 'text-rose-600',
      overdue: isDark ? 'text-gray-400' : 'text-gray-600',
    };
    return colors[status];
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

  const courseName = task.courseId 
    ? courses.find(c => c.id === task.courseId)?.name 
    : null;

  const handleDelete = () => {
    if (window.confirm('Yakin mau hapus tugas ini?')) {
      onDelete(task.id);
    }
  };

  const status = getTaskStatus();
  const statusColor = getStatusColor(status);

  const handleSave = () => {
    if (!editedTitle.trim()) {
      toast.error('Judul tugas tidak boleh kosong!');
      return;
    }

    onUpdate(task.id, {
      title: editedTitle.trim(),
      description: editedDescription.trim(),
      deadline: editedDeadline,
      submissionLink: editedSubmissionLink || undefined,
      courseId: editedCourseId || undefined,
    });
    setIsEditing(false);
    toast.success('Tugas berhasil diperbarui!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedDeadline(new Date(task.deadline));
    setEditedSubmissionLink(task.submissionLink || '');
    setEditedCourseId(task.courseId || '');
  };

  return (
    <>
      <StyledCard
        $status={status}
        $isDark={isDark}
        className={`relative p-4 rounded-lg border shadow-sm cursor-pointer transition-all hover:shadow-md
          ${status === 'overdue' ? 'grayscale' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        layout
        onClick={() => setIsDetailOpen(true)}
      >
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            {courseName && (
              <p className={`text-base font-medium ${getCourseColor(task.courseId)}`}>
                {courseName}
              </p>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(!isEditing);
                }}
                className={`p-1.5 rounded-full 
                  ${isDark 
                    ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200' 
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'} 
                  transition-colors`}
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className={`p-1.5 rounded-full 
                  ${isDark 
                    ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200' 
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'} 
                  transition-colors`}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {isEditing ? (
            <div 
              className="space-y-3 p-3 rounded-lg border transition-all
                ${isDark 
                  ? 'bg-slate-800/50 border-slate-700' 
                  : 'bg-white border-slate-200'}" 
              onClick={e => e.stopPropagation()}
            >
              <input
                type="text"
                value={editedTitle}
                onChange={e => setEditedTitle(e.target.value)}
                className={`w-full px-3 py-2 text-lg font-semibold rounded-lg
                  ${isDark 
                    ? 'bg-slate-800 text-white border-slate-700' 
                    : 'bg-white text-slate-900 border-slate-200'} 
                  border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                  transition-colors`}
                placeholder="Judul tugas"
              />
              
              <div className="space-y-1">
                <label className={`text-xs font-medium
                  ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Mata Kuliah
                </label>
                <select
                  value={editedCourseId}
                  onChange={e => setEditedCourseId(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-lg
                    ${isDark 
                      ? 'bg-slate-800 text-white border-slate-700' 
                      : 'bg-white text-slate-900 border-slate-200'} 
                    border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                    transition-colors`}
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
                  className={`w-full px-3 py-2 text-sm rounded-lg resize-none
                    ${isDark 
                      ? 'bg-slate-800 text-slate-300 border-slate-700' 
                      : 'bg-white text-slate-600 border-slate-200'} 
                    border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                    transition-colors`}
                  rows={3}
                  placeholder="Deskripsi tugas"
                />
                <div className={`absolute bottom-2 right-2 text-xs 
                  ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {editedDescription.length}/{MAX_DESCRIPTION_LENGTH}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`text-xs font-medium
                    ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={format(editedDeadline, "yyyy-MM-dd'T'HH:mm")}
                    onChange={e => setEditedDeadline(new Date(e.target.value))}
                    className={`w-full px-3 py-2 text-sm rounded-lg
                      ${isDark 
                        ? 'bg-slate-800 text-white border-slate-700' 
                        : 'bg-white text-slate-900 border-slate-200'} 
                      border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                      transition-colors`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-medium
                    ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Link Pengumpulan
                  </label>
                  <input
                    type="url"
                    value={editedSubmissionLink}
                    onChange={e => setEditedSubmissionLink(e.target.value)}
                    placeholder="https://..."
                    className={`w-full px-3 py-2 text-sm rounded-lg
                      ${isDark 
                        ? 'bg-slate-800 text-white border-slate-700' 
                        : 'bg-white text-slate-900 border-slate-200'} 
                      border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                      transition-colors`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleCancel}
                  className={`px-4 py-2 text-sm rounded-lg font-medium
                    ${isDark 
                      ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} 
                    transition-colors`}
                  >
                    Batal
                  </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm rounded-lg font-medium
                    bg-emerald-600 text-white hover:bg-emerald-700 
                    transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-slate-900'
              } ${task.completed ? 'line-through opacity-50' : ''}`}>
                {task.title}
              </h3>
              
              <p className={`text-sm mt-1 line-clamp-2 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {truncateText(task.description, 100)}
              </p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor} ${
                  isDark 
                    ? 'bg-slate-800' 
                    : 'bg-white'
                } border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  {status === 'completed' ? 'Completed' : 
                   status === 'overdue' ? 'Telat coy' :
                   `Tenggat: ${format(task.deadline, 'PPP')}`}
                </span>
                
                {task.submissionLink && (
                  <a
                    href={task.submissionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-xs px-2 py-1 rounded-full 
                      ${isDark 
                        ? 'bg-emerald-900/50 text-emerald-200 hover:bg-emerald-800/50' 
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'} 
                      transition-colors`}
                  >
                    Link Pengumpulan
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </StyledCard>

      <TaskDetailModal
        task={task}
        courses={courses}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        isDark={isDark}
        onUpdate={onUpdate}
      />
    </>
  );
}