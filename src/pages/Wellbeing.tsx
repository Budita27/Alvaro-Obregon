import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Search, Heart, UserCheck, Stethoscope, Users, Star, ChevronRight, MessageCircle, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const CATEGORIES = [
  { icon: Heart, label: 'Salud Mental', color: 'bg-rose-100 text-rose-600' },
  { icon: Stethoscope, label: 'Médicos', color: 'bg-blue-100 text-primary' },
  { icon: UserCheck, label: 'Asesoría', color: 'bg-purple-100 text-purple-600' },
  { icon: Users, label: 'Grupos', color: 'bg-teal-100 text-teal-600' },
];

const SPECIALISTS = [
  {
    id: '1',
    name: 'Dra. Elena Martínez',
    title: 'Psicóloga Clínica',
    specialty: 'Ansiedad y Depresión',
    rating: 4.9,
    reviews: 124,
    photo: 'https://i.pravatar.cc/150?u=elena',
    available: true,
  },
  {
    id: '2',
    name: 'Dr. Roberto Silva',
    title: 'Médico General',
    specialty: 'Atención Familiar',
    rating: 4.8,
    reviews: 89,
    photo: 'https://i.pravatar.cc/150?u=roberto',
    available: true,
  },
];

export default function Wellbeing() {
  return (
    <Layout title="Apoyo y Bienestar">
      <div className="space-y-8">
        <section className="text-center space-y-4">
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight leading-tight">
            Tu Bienestar es <span className="text-rose-500 italic">Nuestra Prioridad</span>
          </h2>
          <p className="text-on-surface-variant text-lg max-w-md mx-auto">
            Encuentra especialistas locales, grupos de apoyo y servicios de salud en Álvaro Obregón.
          </p>
        </section>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Buscar psicólogos, médicos, asesoría..."
            className="w-full h-14 pl-12 pr-4 bg-surface border-none rounded-full shadow-sm text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-rose-500 transition-all"
          />
        </div>

        {/* Categories */}
        <section>
          <div className="flex justify-between items-end mb-6 px-2">
            <h3 className="text-xl font-bold tracking-tight">Especialidades</h3>
            <button className="text-rose-500 text-sm font-semibold hover:underline flex items-center gap-1">
              Ver Todas <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <motion.div
                key={cat.label}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center gap-3 p-6 bg-surface rounded-3xl shadow-sm border border-gray-50 dark:border-gray-800 cursor-pointer group"
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-sm",
                  cat.color,
                  "dark:bg-opacity-20"
                )}>
                  <cat.icon className="w-8 h-8" />
                </div>
                <span className="text-sm font-bold text-on-surface-variant text-center">
                  {cat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Specialists */}
        <section className="pb-10">
          <div className="flex justify-between items-end mb-6 px-2">
            <h3 className="text-xl font-bold tracking-tight">Especialistas Recomendados</h3>
          </div>
          <div className="space-y-4">
            {SPECIALISTS.map((specialist) => (
              <motion.div
                key={specialist.id}
                whileHover={{ scale: 1.01 }}
                className="bg-surface p-6 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-800 flex flex-col md:flex-row gap-6 items-center md:items-start"
              >
                <div className="relative shrink-0">
                  <img
                    src={specialist.photo}
                    alt={specialist.name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-surface shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  {specialist.available && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-tertiary rounded-full border-4 border-surface shadow-sm" />
                  )}
                </div>

                <div className="flex-1 text-center md:text-left space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xl font-extrabold text-on-surface">{specialist.name}</h4>
                      <p className="text-rose-500 font-bold text-sm uppercase tracking-wider">{specialist.title}</p>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-1">
                      <Star className="w-4 h-4 fill-secondary text-secondary" />
                      <span className="text-sm font-bold">{specialist.rating}</span>
                      <span className="text-on-surface-variant text-xs">({specialist.reviews} reseñas)</span>
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-sm font-medium">
                    Especialista en <span className="text-on-surface">{specialist.specialty}</span>. 
                    Atención presencial y en línea.
                  </p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-full text-sm font-bold shadow-lg shadow-rose-500/20 active:scale-95 transition-all">
                      <Calendar className="w-4 h-4" />
                      Agendar Cita
                    </button>
                    <Link to="/chat" className="flex items-center gap-2 px-6 py-3 bg-surface text-rose-500 border border-rose-100 dark:border-rose-900/30 rounded-full text-sm font-bold active:scale-95 transition-all hover:bg-rose-50 dark:hover:bg-rose-900/20">
                      <MessageCircle className="w-4 h-4" />
                      Enviar Mensaje
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Support Groups Banner */}
        <section className="bg-teal-50 rounded-3xl p-8 overflow-hidden relative border border-teal-100">
          <div className="relative z-10 max-w-[70%] space-y-4">
            <h4 className="text-2xl font-extrabold text-on-tertiary-container">Grupos de Apoyo Local</h4>
            <p className="text-on-tertiary-container/80 text-sm font-medium leading-relaxed">
              Únete a comunidades de vecinos compartiendo experiencias y apoyo mutuo. 
              Totalmente gratuito y seguro.
            </p>
            <button className="bg-tertiary text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-tertiary/20 active:scale-95 transition-all">
              Explorar Grupos
            </button>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none">
             <Users className="w-full h-full text-tertiary" />
          </div>
        </section>
      </div>
    </Layout>
  );
}
