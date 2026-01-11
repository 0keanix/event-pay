import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="relative min-h-screen">
      <style>{`
        :root[data-theme="light"] {
          --bg-primary: 248 250 252;
          --bg-secondary: 241 245 249;
          --bg-card: 255 255 255;
          --text-primary: 15 23 42;
          --text-secondary: 71 85 105;
          --text-muted: 148 163 184;
          --border: 226 232 240;
          --accent-from: 79 70 229;
          --accent-to: 147 51 234;
          --gradient-from: rgba(199, 210, 254, 0.4);
          --gradient-to: rgba(221, 214, 254, 0.4);
        }

        :root[data-theme="dark"] {
          --bg-primary: 15 23 42;
          --bg-secondary: 30 41 59;
          --bg-card: 51 65 85;
          --text-primary: 248 250 252;
          --text-secondary: 203 213 225;
          --text-muted: 148 163 184;
          --border: 71 85 105;
          --accent-from: 99 102 241;
          --accent-to: 168 85 247;
          --gradient-from: rgba(79, 70, 229, 0.2);
          --gradient-to: rgba(147, 51, 234, 0.2);
        }

        body {
          background: rgb(var(--bg-primary));
          color: rgb(var(--text-primary));
          transition: background-color 0.3s ease, color 0.3s ease;
        }
      `}</style>

      <Button
        onClick={toggleTheme}
        size="icon"
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
        style={{ 
          background: 'rgba(var(--bg-card), 0.8)', 
          border: '1px solid rgb(var(--border))' 
        }}
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5" style={{ color: 'rgb(var(--text-primary))' }} />
        ) : (
          <Sun className="h-5 w-5 text-yellow-400" />
        )}
      </Button>

      {children}
    </div>
  );
}