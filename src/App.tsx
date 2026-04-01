import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FirebaseProvider } from './lib/FirebaseProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import Home from './pages/Home';
import Trivia from './pages/Trivia';
import Markets from './pages/Markets';
import Transport from './pages/Transport';
import Wellbeing from './pages/Wellbeing';
import Security from './pages/Security';
import Profile from './pages/Profile';
import Chat from './pages/Chat';

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trivia" element={<Trivia />} />
            <Route path="/directorio" element={<Home />} />
            <Route path="/mercados" element={<Markets />} />
            <Route path="/transporte" element={<Transport />} />
            <Route path="/bienestar" element={<Wellbeing />} />
            <Route path="/seguridad" element={<Security />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/mapa" element={<Navigate to="/transporte" replace />} />
          </Routes>
        </Router>
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
