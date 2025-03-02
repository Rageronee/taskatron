import { HeartIcon } from '@heroicons/react/24/solid';

interface FooterProps {
  isDark: boolean;
}

export function Footer({ isDark }: FooterProps) {
  return (
    <footer className={`py-6 text-center ${
      isDark ? 'text-slate-400' : 'text-slate-600'
    }`}>
      <p className="flex items-center justify-center gap-1 text-sm">
        Made with <HeartIcon className="w-4 h-4 text-rose-500" /> and Sleepless Nights by{' '}
        <a
          href="https://github.com/Rageronee"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:underline"
        >
          M Afnan Risandi
        </a>
      </p>
    </footer>
  );
}