import React from 'react';
import { Layout } from '../components/Layout';
import { Search, MessageSquare, UserCheck, Store, ChevronRight, Bell, MoreHorizontal, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const CHATS = [
  {
    id: '1',
    name: 'Miga & Grano',
    lastMessage: '¡Tu pedido de pan artesanal está listo!',
    time: '14:20',
    unread: 2,
    type: 'business',
    photo: 'https://picsum.photos/seed/bakery/200/200',
    verified: true,
  },
  {
    id: '2',
    name: 'Plomería "El Rayo"',
    lastMessage: 'Estaré en tu domicilio en 15 minutos.',
    time: '12:45',
    unread: 0,
    type: 'freelance',
    photo: 'https://i.pravatar.cc/150?u=plumber',
    verified: true,
  },
  {
    id: '3',
    name: 'La Huerta CDMX',
    lastMessage: 'Gracias por tu compra. ¡Vuelve pronto!',
    time: 'Ayer',
    unread: 0,
    type: 'business',
    photo: 'https://picsum.photos/seed/market/200/200',
    verified: false,
  },
];

export default function Chat() {
  return (
    <Layout title="Mensajes">
      <div className="space-y-8">
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Buscar mensajes, negocios..."
            className="w-full h-14 pl-12 pr-4 bg-surface border-none rounded-full shadow-sm text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        {/* Chat Categories */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {['Todos', 'Negocios', 'Servicios', 'Vecinos'].map((tab, idx) => (
            <button
              key={tab}
              className={cn(
                "px-8 py-3 rounded-full font-bold whitespace-nowrap transition-all active:scale-95",
                idx === 0 ? "bg-primary text-white shadow-md" : "bg-surface text-on-surface-variant border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Chat List */}
        <section className="space-y-4 pb-10">
          <div className="flex justify-between items-end mb-6 px-2">
            <h3 className="text-xl font-bold tracking-tight">Conversaciones Recientes</h3>
            <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              Marcar como leídos <CheckCircle className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {CHATS.map((chat) => (
              <motion.div
                key={chat.id}
                whileHover={{ x: 4 }}
                className="bg-surface p-5 rounded-3xl flex items-center gap-4 shadow-sm border border-gray-50 dark:border-gray-800 cursor-pointer group relative overflow-hidden"
              >
                <div className="relative shrink-0">
                  <img
                    src={chat.photo}
                    alt={chat.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-surface shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-surface flex items-center justify-center",
                    chat.type === 'business' ? "bg-blue-100 dark:bg-blue-900/30 text-primary" : "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
                  )}>
                    {chat.type === 'business' ? <Store className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-on-surface truncate">{chat.name}</h4>
                      {chat.verified && <CheckCircle className="w-4 h-4 text-primary fill-current" />}
                    </div>
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{chat.time}</span>
                  </div>
                  <p className={cn(
                    "text-sm truncate",
                    chat.unread > 0 ? "font-bold text-on-surface" : "text-on-surface-variant font-medium"
                  )}>
                    {chat.lastMessage}
                  </p>
                </div>

                {chat.unread > 0 && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-primary/20">
                    {chat.unread}
                  </div>
                )}
                
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* New Chat Button */}
        <section className="flex flex-col items-center py-6">
          <div className="w-full max-w-sm">
            <button className="w-full bg-primary text-white py-5 rounded-full text-xl font-black shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-wider">
              <MessageSquare className="w-8 h-8 fill-current" />
              NUEVO CHAT
            </button>
            <p className="text-center text-on-surface-variant text-xs mt-4 font-medium italic">
              Conecta con negocios y servicios locales
            </p>
          </div>
        </section>

        {/* Chat Support Banner */}
        <section className="bg-blue-50 rounded-3xl p-8 overflow-hidden relative border border-blue-100">
          <div className="relative z-10 max-w-[70%] space-y-4">
            <h4 className="text-2xl font-extrabold text-primary tracking-tight">Soporte ÁO Conecta</h4>
            <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
              ¿Tienes problemas con la app o con algún servicio? Nuestro equipo está listo para ayudarte.
            </p>
            <button className="bg-primary text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-all">
              Hablar con Soporte
            </button>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none">
             <Bell className="w-full h-full text-primary" />
          </div>
        </section>
      </div>
    </Layout>
  );
}
