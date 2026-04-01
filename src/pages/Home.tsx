import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Search, Store, Utensils, Award, Wrench, Star, ChevronRight, Bell, Sparkles, Loader2, X, Map, ShoppingBag, Coffee, Scissors, Car, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { VideoGenerator } from '../components/VideoGenerator';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

import { Link } from 'react-router-dom';

const CATEGORIES = [
  { icon: Store, label: 'Tiendas', color: 'bg-blue-100 text-primary', path: '/mercados' },
  { icon: Utensils, label: 'Comida', color: 'bg-orange-100 text-orange-600', path: '/mercados' },
  { icon: Award, label: 'Talentos', color: 'bg-purple-100 text-purple-600', path: '/bienestar' },
  { icon: Wrench, label: 'Servicios', color: 'bg-teal-100 text-teal-600', path: '/seguridad' },
];

const FEATURED_BUSINESSES = [
  {
    id: '1',
    name: 'Miga & Grano',
    category: 'PANADERÍA',
    rating: 4.9,
    location: 'San Ángel',
    image: 'https://picsum.photos/seed/bakery/600/400',
    path: '/chat'
  },
  {
    id: '2',
    name: 'La Huerta CDMX',
    category: 'MERCADO',
    rating: 4.7,
    location: 'Guadalupe Inn',
    image: 'https://picsum.photos/seed/market/600/400',
    path: '/mercados'
  },
];

const NEARBY_SERVICES = [
  {
    id: '1',
    name: 'Plomería "El Rayo"',
    distance: '500m',
    status: 'Disponible ahora',
    icon: Wrench,
    color: 'bg-teal-100 text-teal-600',
    path: '/chat'
  },
  {
    id: '2',
    name: 'Estética Canina Luna',
    distance: '1.2km',
    status: 'Cierra a las 18:00',
    icon: Store,
    color: 'bg-blue-100 text-primary',
    path: '/chat'
  },
];

const BUSINESS_CATEGORIES = [
  { id: 'restaurantes', label: 'Comida', icon: Utensils, color: 'bg-orange-100 text-orange-600' },
  { id: 'tiendas', label: 'Tiendas', icon: ShoppingBag, color: 'bg-blue-100 text-primary' },
  { id: 'cafes', label: 'Café', icon: Coffee, color: 'bg-amber-100 text-amber-700' },
  { id: 'belleza', label: 'Belleza', icon: Scissors, color: 'bg-pink-100 text-pink-600' },
  { id: 'talleres', label: 'Talleres', icon: Wrench, color: 'bg-gray-100 text-gray-600' },
  { id: 'transporte', label: 'Taxis', icon: Car, color: 'bg-yellow-100 text-yellow-700' },
  { id: 'salud', label: 'Salud', icon: Heart, color: 'bg-rose-100 text-rose-600' },
  { id: 'otros', label: 'Otros', icon: Store, color: 'bg-purple-100 text-purple-600' },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<{ text: string; sources: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleAiSearch = async () => {
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);
    setAiResponse(null);
    try {
      const result = await geminiService.searchLocalInfo(searchQuery);
      setAiResponse(result);
    } catch (error) {
      console.error("Error in AI search:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Layout title="ÁO Conecta">
      <div className="space-y-8">
        {/* Search Bar */}
        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAiSearch()}
              placeholder="Buscar negocios, servicios, gente..."
              className="w-full h-14 pl-12 pr-32 bg-surface border-none rounded-full shadow-sm text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary transition-all"
            />
            <button 
              onClick={handleAiSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="absolute right-2 top-2 h-10 px-4 bg-primary text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Preguntar AI
            </button>
          </div>

          <AnimatePresence>
            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-blue-50 p-6 rounded-3xl border border-blue-100 shadow-sm relative group"
              >
                <button 
                  onClick={() => setAiResponse(null)}
                  className="absolute top-4 right-4 p-1 hover:bg-blue-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-primary" />
                </button>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Respuesta de AI</span>
                </div>
                <div className="prose prose-sm max-w-none text-on-surface">
                  <ReactMarkdown>{aiResponse.text}</ReactMarkdown>
                </div>
                {aiResponse.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-blue-100">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Fuentes</p>
                    <div className="flex flex-wrap gap-2">
                      {aiResponse.sources.map((source: any, idx: number) => (
                        <a 
                          key={idx} 
                          href={source.web?.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-primary hover:underline bg-surface px-2 py-1 rounded-md border border-blue-100 dark:border-blue-900/30"
                        >
                          {source.web?.title || 'Fuente'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Featured Banner */}
        <Link to="/mercados">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full h-56 rounded-3xl overflow-hidden shadow-lg group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-400/80 z-10" />
            <img
              src="https://picsum.photos/seed/obregon/1200/600"
              alt="Local Market"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 z-20 p-8 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-secondary text-white rounded-full text-[10px] font-black w-fit mb-3 uppercase tracking-wider">
                Oferta Local
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight max-w-[70%] mb-2">
                Apoya el Comercio de tu Barrio
              </h2>
              <p className="text-blue-50 font-medium">
                Hasta 20% en restaurantes seleccionados.
              </p>
            </div>
          </motion.div>
        </Link>

        {/* Categories */}
        <section>
          <div className="flex justify-between items-end mb-4 px-2">
            <h3 className="text-xl font-bold tracking-tight">Categorías</h3>
            <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              Ver Todo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.label} to={cat.path}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-sm",
                    cat.color,
                    "dark:bg-opacity-20"
                  )}>
                    <cat.icon className="w-8 h-8" />
                  </div>
                  <span className="text-[12px] font-bold text-on-surface-variant">
                    {cat.label}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Explore Map Button */}
          <div className="mt-8 px-2">
            <Link to="/transporte">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 uppercase tracking-wider active:scale-95 transition-all"
              >
                <Map className="w-6 h-6 fill-current" />
                Explorar Mapa
              </motion.button>
            </Link>
          </div>
        </section>

        {/* Video Generator Section */}
        <VideoGenerator />

        {/* Featured Businesses */}
        <section>
          <div className="flex justify-between items-end mb-4 px-2">
            <h3 className="text-xl font-bold tracking-tight">Negocios Destacados</h3>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar snap-x">
            {FEATURED_BUSINESSES.map((biz) => (
              <Link key={biz.id} to={biz.path} className="flex-none w-72 snap-start">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-surface rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 h-full"
                >
                  <div className="relative h-44">
                    <img
                      src={biz.image}
                      alt={biz.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 px-2 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-black rounded-md uppercase">
                      {biz.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-lg text-on-surface">{biz.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-secondary text-secondary" />
                      <span className="text-sm font-bold">{biz.rating}</span>
                      <span className="text-on-surface-variant text-xs ml-1">• {biz.location}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Business Directory Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <div>
              <h3 className="text-2xl font-extrabold text-on-surface tracking-tight">Directorio de Negocios</h3>
              <p className="text-on-surface-variant text-sm font-medium">Encuentra lo que necesitas en tu colonia</p>
            </div>
            <Link to="/mercados" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
              Ver todo <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-black text-on-surface-variant uppercase tracking-widest px-2">Explorar por Categoría</h4>
            <div className="grid grid-cols-2 gap-4">
              {BUSINESS_CATEGORIES.map((cat) => (
                <Link key={cat.id} to={`/mercados?category=${cat.id}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-surface p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3 group cursor-pointer"
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", cat.color, "dark:bg-opacity-20")}>
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                      {cat.label}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Nearby Services */}
        <section className="pb-10">
          <h3 className="text-xl font-bold tracking-tight mb-6 px-2">Servicios Cercanos</h3>
          <div className="space-y-4">
            {NEARBY_SERVICES.map((service) => (
              <Link key={service.id} to={service.path}>
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 p-4 bg-surface rounded-2xl shadow-sm border border-gray-50 dark:border-gray-800 hover:border-primary/20 transition-all cursor-pointer mb-4"
                >
                  <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center shrink-0", service.color, "dark:bg-opacity-20")}>
                    <service.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-on-surface">{service.name}</h4>
                    <p className="text-sm text-on-surface-variant">A {service.distance} • {service.status}</p>
                  </div>
                  <button className="bg-primary text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform shadow-md shadow-primary/20">
                    Contratar
                  </button>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
