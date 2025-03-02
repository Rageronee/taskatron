import styled from 'styled-components';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Container = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${props => props.$isDark
    ? 'linear-gradient(to bottom right, rgb(15 23 42), rgb(30 41 59))'
    : 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)'};
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Card = styled(motion.div)<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)'};
  backdrop-filter: blur(12px);
  border-radius: 1.5rem;
  padding: 3rem;
  width: 90%;
  max-width: 450px;
  box-shadow: ${props => props.$isDark 
    ? '0 25px 30px -12px rgba(0, 0, 0, 0.5)' 
    : '0 25px 30px -12px rgba(0, 0, 0, 0.2)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'};
`;

const ClassButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  border-radius: 1rem;
  font-size: 1.125rem;
  font-weight: 500;
  transition: all 0.2s ease;
  background: rgb(16 185 129);
  color: white;
  border: none;
  cursor: pointer;
  
  &:hover {
    background: rgb(4 120 87);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface ClassSelectionProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onSelectClass: (className: string) => void;
}

export function ClassSelection({ isDark, onToggleTheme, onSelectClass }: ClassSelectionProps) {
  return (
    <Container $isDark={isDark}>
      <motion.div 
        className="absolute top-4 right-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={onToggleTheme}
          className={`p-3 rounded-full ${
            isDark 
              ? 'bg-slate-800/50 text-slate-200 hover:bg-slate-700/50' 
              : 'bg-white/50 text-slate-700 hover:bg-slate-100/50'
          } transition-all shadow-lg backdrop-blur-sm`}
        >
          {isDark ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
        </button>
      </motion.div>

      <Card 
        $isDark={isDark}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className={`text-5xl font-bold mb-3 text-center ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            TaskaTronika
          </h1>
          <h2 className={`text-xl mb-2 text-center ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            MKB 2023
          </h2>
          <p className={`mb-10 text-center ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Silakan pilih kelas Anda untuk melanjutkan
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ClassButton
              onClick={() => onSelectClass('A')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Kelas A
            </ClassButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ClassButton
              onClick={() => onSelectClass('B')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Kelas B
            </ClassButton>
          </motion.div>
        </div>
      </Card>
    </Container>
  );
} 