import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Course } from '../types/Task';
import { useState } from 'react';
import { EditCourseModal } from './EditCourseModal';

const CourseList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const CourseTag = styled(motion.button)<{ $active: boolean; $color: string; $isDark: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  position: relative;
  font-size: 0.875rem;
  transition: all 0.2s;
  border: 1px solid ${props => props.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
  background: ${props => props.$active ? props.$color : 'transparent'};
  color: ${props => props.$active 
    ? (props.$isDark ? 'white' : 'black')
    : (props.$isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)')};

  &:hover {
    background: ${props => props.$color};
    color: ${props => props.$isDark ? 'white' : 'black'};
    padding-right: 2.5rem;
  }
`;

interface CourseSelectorProps {
  courses: Course[];
  selectedCourseId: string | null;
  onSelectCourse: (courseId: string | null) => void;
  onAddCourse: () => void;
  onDeleteCourse: (courseId: string) => void;
  onEditCourse: (courseId: string, name: string) => void;
  isDark: boolean;
}

const defaultColors = [
  'rgba(59, 130, 246, 0.2)',  // blue
  'rgba(16, 185, 129, 0.2)',  // green
  'rgba(245, 158, 11, 0.2)',  // amber
  'rgba(239, 68, 68, 0.2)',   // red
  'rgba(168, 85, 247, 0.2)',  // purple
  'rgba(236, 72, 153, 0.2)',  // pink
  'rgba(14, 165, 233, 0.2)',  // sky
  'rgba(234, 88, 12, 0.2)',   // orange
  'rgba(132, 204, 22, 0.2)',  // lime
  'rgba(6, 182, 212, 0.2)',   // cyan
];

export function CourseSelector({ 
  courses, 
  selectedCourseId, 
  onSelectCourse, 
  onAddCourse,
  onDeleteCourse,
  onEditCourse,
  isDark 
}: CourseSelectorProps) {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Urutkan courses berdasarkan nama
  const sortedCourses = [...courses].sort((a, b) => 
    a.name.localeCompare(b.name, 'id', { sensitivity: 'base' })
  );

  return (
    <>
      <CourseList>
        <CourseTag
          as={motion.button}
          $active={selectedCourseId === null}
          $color={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
          $isDark={isDark}
          onClick={() => onSelectCourse(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Semua Matkul
        </CourseTag>
        
        {sortedCourses.map((course, index) => (
          <div key={course.id} className="relative group">
            <CourseTag
              as={motion.button}
              $active={selectedCourseId === course.id}
              $color={course.color || defaultColors[index % defaultColors.length]}
              $isDark={isDark}
              onClick={() => onSelectCourse(course.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {course.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Hapus matkul ${course.name}?`)) {
                    onDeleteCourse(course.id);
                  }
                }}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full 
                  opacity-0 group-hover:opacity-100 transition-all
                  ${isDark 
                    ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200' 
                    : 'hover:bg-slate-200 text-slate-500 hover:text-slate-700'}`}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </CourseTag>
          </div>
        ))}
        
        <CourseTag
          as={motion.button}
          $active={false}
          $color={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
          $isDark={isDark}
          onClick={onAddCourse}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1"
        >
          <PlusIcon className="w-4 h-4" />
          Tambah Matkul
        </CourseTag>
      </CourseList>

      <AnimatePresence>
        {editingCourse && (
          <EditCourseModal
            course={editingCourse}
            isOpen={true}
            onClose={() => setEditingCourse(null)}
            onUpdate={onEditCourse}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
    </>
  );
}