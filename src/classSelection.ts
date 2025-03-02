// Tipe data untuk event
interface ClassSelectionEvent extends CustomEvent {
    detail: {
        class: string;
        darkMode: boolean;
    };
}

declare global {
    interface Window {
        classSelection: {
            toggleTheme: () => void;
            selectInitialClass: (className: string) => void;
        };
    }
}

// State management
const state = {
    selectedClass: localStorage.getItem('selectedClass'),
    isDarkMode: localStorage.getItem('darkMode') === 'true'
};

// Theme management
export function toggleTheme() {
    try {
        state.isDarkMode = !state.isDarkMode;
        localStorage.setItem('darkMode', String(state.isDarkMode));
        
        // Update class pada HTML root
        document.documentElement.classList.toggle('dark', state.isDarkMode);
        
        // Update class pada selection page
        const container = document.querySelector('.class-selection');
        if (container) {
            container.classList.toggle('dark', state.isDarkMode);
            container.classList.toggle('light', !state.isDarkMode);
        }
        
        // Update icon
        const icon = document.querySelector('.theme-toggle .material-icons');
        if (icon) {
            icon.textContent = state.isDarkMode ? 'light_mode' : 'dark_mode';
        }
    } catch (error) {
        console.error('Error toggling theme:', error);
    }
}

// Class selection handling
export function selectInitialClass(className: string) {
    try {
        // Simpan data
        localStorage.setItem('selectedClass', className);
        localStorage.setItem('showInitialSelection', 'false');
        
        // Reload halaman dengan kelas baru
        window.location.href = `${window.location.origin}?class=${className}`;
    } catch (error) {
        console.error('Error selecting class:', error);
    }
}

// Initial setup
export function initializeClassSelection() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const classFromUrl = urlParams.get('class');
        const savedClass = localStorage.getItem('selectedClass');
        const showInitialSelection = localStorage.getItem('showInitialSelection') !== 'false';

        // Set initial theme
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            document.querySelector('.class-selection')?.classList.add('dark');
            document.querySelector('.class-selection')?.classList.remove('light');
        }

        // Handle class selection visibility
        if ((classFromUrl || savedClass) && !showInitialSelection) {
            document.getElementById('initialClassSelection')?.classList.add('hidden');
            document.getElementById('root')?.classList.remove('hidden');
        } else {
            document.getElementById('initialClassSelection')?.classList.remove('hidden');
            document.getElementById('root')?.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error initializing:', error);
    }
} 