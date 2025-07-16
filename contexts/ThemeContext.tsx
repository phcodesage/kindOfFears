import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
    gradient: string[];
  };
}

const lightColors = {
  primary: '#667eea',
  secondary: '#764ba2',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1a202c',
  textSecondary: '#4a5568',
  accent: '#ed8936',
  gradient: ['#667eea', '#764ba2'],
};

const darkColors = {
  primary: '#9f7aea',
  secondary: '#b794f6',
  background: '#1a202c',
  surface: '#2d3748',
  text: '#f7fafc',
  textSecondary: '#e2e8f0',
  accent: '#fbb6ce',
  gradient: ['#9f7aea', '#b794f6'],
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme || 'light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};