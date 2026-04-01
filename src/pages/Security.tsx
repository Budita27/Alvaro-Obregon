import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ShieldAlert, Phone, AlertTriangle, MessageSquare, MapPin, Bell, ShieldCheck, ChevronRight, Info, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const EMERGENCY_NUMBERS = [
  { id: '1', name: 'Emergencias 911', number: '911', color: 'bg-error text-white' },
  { id: '2', name: 'Protección Civil ÁO', number: '55 5276 6728', color: 'bg-orange-500 text-white' },
  { id: '3', name: 'Base Plata ÁO', number: '55 5272 0222', color: 'bg-primary text-white' },
];

const ALERTS = [
  { id: '1', type: 'warning', title: 'Cierre de Vialidad', description: 'Av. Revolución por mantenimiento.', time: 'Hace 15 min', icon: AlertTriangle, color: 'bg-orange-100 text-orange-600' },
  { id: '2', type: 'info', title: 'Campaña de Vacunación', description: 'Centro de Salud San Ángel.', time: 'Hace 1 hora', icon: Info, color: 'bg-blue-100 text-primary' },
];

export default function Security() {
  return (
    <Layout title="Servicios y Seguridad">
      <div className="space-y-8">
        <section className="text-center space-y-4">
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight leading-tight">
            Tu Seguridad es <span className="text-error italic">Nuestra Misión</span>
          </h2>
          <p className="text-on-surface-variant text-lg max-w-md mx-auto">
            Accede a números de emergencia, reporta incidentes y mantente informado con alertas en tiempo real.
          </p>
        </section>

        {/* Emergency Numbers */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EMERGENCY_NUMBERS.map((item) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "p-6 rounded-3xl flex flex-col items-center gap-2 shadow-lg transition-all",
                item.color
              )}
            >
              <Phone className="w-8 h-8" />
              <span className="text-sm font-black uppercase tracking-widest">{item.name}</span>
              <span className="text-xl font-extrabold tracking-tighter">{item.number}</span>
            </motion.button>
          ))}
        </section>

        {/* Report Incident Section */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-surface p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-8"
        >
          <div className="w-20 h-20 bg-error-container/20 rounded-2xl flex items-center justify-center shrink-0">
            <ShieldAlert className="w-10 h-10 text-error" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h3 className="text-2xl font-extrabold text-on-surface tracking-tight">Reporta un Incidente</h3>
            <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
              Ayúdanos a mantener Álvaro Obregón seguro. Reporta baches, fallas de luz, o cualquier actividad sospechosa.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
              <Link to="/chat" className="px-8 py-3 bg-error text-white rounded-full font-bold text-sm shadow-lg shadow-error/20 active:scale-95 transition-all">
                Iniciar Reporte
              </Link>
              <button className="px-8 py-3 bg-surface text-error border border-error-container rounded-full font-bold text-sm active:scale-95 transition-all hover:bg-error-container/10">
                Mis Reportes
              </button>
            </div>
          </div>
        </motion.div>

        {/* Community Alerts */}
        <section>
          <div className="flex justify-between items-end mb-6 px-2">
            <h3 className="text-xl font-bold tracking-tight">Alertas Comunitarias</h3>
            <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              Ver Historial <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {ALERTS.map((alert) => (
              <motion.div
                key={alert.id}
                whileHover={{ x: 4 }}
                className="bg-surface p-5 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-50 dark:border-gray-800 cursor-pointer group"
              >
                <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shrink-0", alert.color, "dark:bg-opacity-20")}>
                  <alert.icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-on-surface">{alert.title}</h4>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{alert.time}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-tight">{alert.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Safety Tips */}
        <section className="bg-primary rounded-3xl p-8 overflow-hidden relative border border-primary-dim">
          <div className="relative z-10 max-w-[70%] space-y-4">
            <h4 className="text-2xl font-extrabold text-white tracking-tight">Consejos de Seguridad</h4>
            <p className="text-blue-100 text-sm font-medium leading-relaxed">
              Aprende cómo proteger tu hogar y tu familia con nuestras guías de prevención ciudadana.
            </p>
            <button className="bg-surface text-primary px-8 py-3 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-all">
              Leer Guías
            </button>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none">
             <ShieldCheck className="w-full h-full text-white" />
          </div>
        </section>
      </div>
    </Layout>
  );
}
