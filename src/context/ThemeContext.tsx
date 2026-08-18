import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isCursorEnabled: boolean;
  toggleCursor: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  isCursorEnabled: true,
  toggleCursor: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('viewlight_dark_mode');
    return saved === 'true';
  });

  const [isCursorEnabled, setIsCursorEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('viewlight_cursor');
    return saved !== 'false'; // Default is ON (true)
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('viewlight_dark_mode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('viewlight_dark_mode', 'false');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('viewlight_cursor', isCursorEnabled ? 'true' : 'false');
  }, [isCursorEnabled]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const toggleCursor = () => {
    setIsCursorEnabled(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, isCursorEnabled, toggleCursor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
