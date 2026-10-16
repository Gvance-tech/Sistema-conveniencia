import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../../services/api'; // Ajusta o caminho se necessário

type ThemeType = 'light' | 'dark';

interface ThemeContextData {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: {
    background: string;
    cardBackground: string;
    textPrimary: string;
    textSecondary: string;
    cardText: string;
    border: string;
  };
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>('light');

  // Carrega o tema guardado ao abrir o app
  useEffect(() => {
    try {
      const savedMode = api.getUiMode() as ThemeType;
      if (savedMode === 'dark' || savedMode === 'light') {
        setTheme(savedMode);
      }
    } catch (error) {
      console.log("A usar tema padrão (light)");
    }
  }, []);

  // Alterna o tema e guarda no SQLite instantaneamente
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme); // Muda a cor na hora
    try {
      api.setUiMode(nextTheme); // Guarda para a próxima vez
    } catch (error) {
      console.error("Erro ao salvar tema no SQLite:", error);
    }
  };

  const colors = theme === 'light' ? {
    background: '#FFE800',       // Amarelo vibrante
    cardBackground: '#1B2A4A',   // Azul escuro
    textPrimary: '#1B2A4A',
    textSecondary: '#A0AEC0',
    cardText: '#FFFFFF',
    border: '#E2E8F0',
  } : {
    background: '#121212',       // Fundo Escuro
    cardBackground: '#1E1E1E',   // Cartões em cinzento escuro
    textPrimary: '#FFE800',      // Texto amarelo em destaque
    textSecondary: '#9CA3AF',
    cardText: '#FFFFFF',
    border: '#2D3748',
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}