import React, { useState } from 'react';
import { Layout, useToast } from '../components/Layout';
import { Stars, Heart, CheckCircle, Lock, PlayCircle, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const LEVELS = [
  { id: 11, name: 'SAN ÁNGEL', status: 'completed', position: 'top-1/4 left-1/4' },
  { id: 12, name: 'BARRIO LORETO', status: 'current', position: 'top-1/2 left-1/2' },
  { id: 13, name: 'LAS ÁGUILAS', status: 'locked', position: 'bottom-1/4 right-1/4' },
];

export default function Trivia() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { showToast } = useToast();

  return (
    <Layout title="ÁO Trivia">
      <div className="space-y-8">
        {/* Game Status Bar */}
        <div className="bg-surface rounded-2xl p-4 shadow-sm flex justify-between items-center border border-gray-50 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Stars className="w-6 h-6 text-primary fill-current" />
            </div>
            <div>
              <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">Nivel Actual</p>
              <p className="text-lg font-extrabold text-primary">Level 12</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Heart key={i} className="w-5 h-5 text-error fill-current" />
              ))}
            </div>
            <p className="text-[10px] font-bold text-on-surface-variant mt-1 uppercase tracking-tighter">5 VIDAS</p>
          </div>
        </div>

        {/* Interactive Map */}
        <section className="relative bg-blue-50 dark:bg-blue-900/10 rounded-3xl overflow-hidden min-h-[400px] border border-blue-100 dark:border-blue-900/30 shadow-inner">
          <div 
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: "url('https://picsum.photos/seed/map/800/800')" }}
          />
          
          {/* Map Decorative Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 400 400">
            <path 
              d="M 50 350 Q 150 350 150 250 T 250 150 T 350 50" 
              fill="none" 
              className="stroke-primary/30 stroke-[4] stroke-dash-8"
              strokeDasharray="8 8"
            />
          </svg>

          {/* Level Pins */}
          <div className="relative z-20 w-full h-full p-8 min-h-[400px]">
            {LEVELS.map((level) => (
              <motion.div
                key={level.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={cn("absolute flex flex-col items-center", level.position)}
              >
                {level.status === 'completed' && (
                  <div className="w-14 h-14 bg-tertiary rounded-full shadow-lg flex items-center justify-center border-4 border-surface cursor-pointer active:scale-90 transition-transform">
                    <CheckCircle className="w-8 h-8 text-white fill-current" />
                  </div>
                )}
                {level.status === 'current' && (
                  <div className="relative">
                    <div className="absolute -inset-2 bg-primary/20 rounded-full animate-ping" />
                    <div className="relative w-16 h-16 bg-primary rounded-full shadow-xl flex items-center justify-center border-4 border-surface cursor-pointer active:scale-95 transition-all">
                      <span className="text-white font-black text-xl">{level.id}</span>
                    </div>
                  </div>
                )}
                {level.status === 'locked' && (
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center border-4 border-surface opacity-60">
                    <Lock className="w-6 h-6 text-on-surface-variant" />
                  </div>
                )}
                <span className={cn(
                  "block text-center text-[10px] font-black mt-2 uppercase tracking-wider",
                  level.status === 'completed' ? "text-tertiary" : level.status === 'current' ? "text-primary" : "text-on-surface-variant"
                )}>
                  {level.name}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Daily Bonus & Trivia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Spin */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-orange-50 p-6 rounded-3xl relative overflow-hidden flex items-center justify-between group cursor-pointer border border-orange-100"
          >
            <div className="z-10">
              <h3 className="text-xl font-extrabold text-on-secondary-container">Giro Diario</h3>
              <p className="text-sm font-medium text-secondary mt-1">¡Gana hasta 500 monedas!</p>
              <button className="mt-4 bg-secondary text-white px-6 py-2 rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform">
                GIRAR AHORA
              </button>
            </div>
            <div className="relative z-10 w-24 h-24 rounded-full border-8 border-white flex items-center justify-center bg-orange-100 shadow-inner">
              <HelpCircle className="w-10 h-10 text-secondary" />
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-secondary/5 rounded-full blur-2xl" />
          </motion.div>

          {/* Trivia Card */}
          <div className="bg-surface p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-tertiary" />
              <span className="text-[10px] font-black text-tertiary uppercase tracking-widest">Reto Trivia</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface leading-tight mb-6">
              ¿Dónde se encuentra el Bazar del Sábado?
            </h3>
            <div className="space-y-3">
              {['Plaza San Jacinto', 'Plaza Loreto', 'Parque la Bombilla'].map((opt, idx) => (
                <button
                  key={opt}
                  onClick={() => setSelectedOption(idx)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all text-sm font-medium flex justify-between items-center",
                    selectedOption === idx 
                      ? "border-primary bg-blue-50 dark:bg-blue-900/20 text-primary font-bold" 
                      : "border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  {opt}
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    selectedOption === idx ? "border-primary bg-primary" : "border-gray-200 dark:border-gray-700"
                  )}>
                    {selectedOption === idx && <CheckCircle className="w-4 h-4 text-white fill-current" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Action Section */}
        <section className="flex flex-col items-center py-6">
          <div className="w-full max-w-sm">
            <button 
              onClick={() => showToast("¡Próximamente! Estamos preparando nuevas preguntas.")}
              className="w-full bg-primary text-white py-5 rounded-full text-xl font-black shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
            >
              <PlayCircle className="w-8 h-8 fill-current" />
              JUGAR
            </button>
            <p className="text-center text-on-surface-variant text-xs mt-4 font-medium italic">
              Gasta 1 vida para iniciar un nuevo reto
            </p>
          </div>
        </section>

        {/* Featured Landmark */}
        <section className="bg-blue-100 rounded-3xl p-8 overflow-hidden relative min-h-[200px] flex items-center border border-blue-200">
          <div className="relative z-10 max-w-[60%]">
            <h4 className="text-2xl font-extrabold text-on-surface">Explora Álvaro Obregón</h4>
            <p className="text-on-surface-variant mt-2 text-sm">
              Desbloquea historias y cupones exclusivos mientras avanzas por el mapa.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/2 overflow-hidden">
            <img 
              className="w-full h-full object-cover opacity-80" 
              src="https://picsum.photos/seed/landmark/600/400"
              alt="Landmark"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-transparent to-transparent" />
          </div>
        </section>
      </div>
    </Layout>
  );
}
