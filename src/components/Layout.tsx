import React, { useState, createContext, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Store, Map as MapIcon, MessageSquare, User, Bell, Menu, Search, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Chatbot } from './Chatbot';
import { AnimatePresence, motion } from 'motion/react';

const ToastContext = createContext<{ showToast: (msg: string) => void } | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within Layout');
  return context;
}

export function TopAppBar({ title, showSearch = true }: { title: string; showSearch?: boolean }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 h-16 flex justify-between items-center px-6">
      <div className="flex items-center gap-4">
        <Link to="/perfil" className="text-primary active:scale-90 transition-transform">
          <Menu className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-extrabold text-primary tracking-tighter uppercase">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {showSearch && (
          <Link to="/" className="text-primary active:scale-90 transition-transform">
            <Search className="w-6 h-6" />
          </Link>
        )}
        <Link to="/perfil" className="text-primary active:scale-90 transition-transform">
          <Bell className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
}

export function BottomNavBar() {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: Store, label: 'Directorio', path: '/mercados' },
    { icon: MapIcon, label: 'Transporte', path: '/transporte' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: User, label: 'Perfil', path: '/perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 z-50 rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.06)] px-4 pb-6 pt-3">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center transition-all duration-300 active:scale-90",
                isActive ? "bg-primary/10 text-primary rounded-full w-14 h-14" : "text-on-surface-variant w-14 h-14"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
              <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Layout({ children, title }: { children: React.ReactNode; title: string }) {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="min-h-screen pb-32">
        <TopAppBar title={title} />
        <main className="pt-20 px-4 max-w-5xl mx-auto">
          {children}
        </main>
        <BottomNavBar />
        <Chatbot />

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-36 left-1/2 -translate-x-1/2 z-[100] bg-on-surface text-surface px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 min-w-[200px] justify-center"
            >
              <span className="text-sm font-bold">{toast}</span>
              <button onClick={() => setToast(null)}>
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
