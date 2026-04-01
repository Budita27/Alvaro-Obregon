import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Search, MapPin, Clock, Map as MapIcon, Star, Filter, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const ALL_BUSINESSES = [
  {
    id: '1',
    name: 'Mercado San Ángel',
    category: 'tiendas',
    address: 'Av. Revolución s/n, San Ángel',
    hours: 'Lun - Dom: 8:00 AM - 6:00 PM',
    status: 'open',
    image: 'https://picsum.photos/seed/market1/800/600',
    featured: true,
  },
  {
    id: '2',
    name: 'Mercado Tlacopac',
    category: 'tiendas',
    address: 'Corregidora 12, Tlacopac',
    hours: 'Lun - Dom: 8:00 AM - 6:00 PM',
    status: 'open',
    image: 'https://picsum.photos/seed/market2/800/600',
  },
  {
    id: '3',
    name: 'Antojitos Doña Lupe',
    category: 'restaurantes',
    address: 'Calle de la Amargura 5, San Ángel',
    hours: 'Lun - Dom: 9:00 AM - 10:00 PM',
    status: 'open',
    image: 'https://picsum.photos/seed/food1/800/600',
  },
  {
    id: '4',
    name: 'Café de la Selva',
    category: 'cafes',
    address: 'Plaza San Jacinto 12',
    hours: 'Lun - Dom: 8:00 AM - 9:00 PM',
    status: 'open',
    image: 'https://picsum.photos/seed/cafe1/800/600',
  },
  {
    id: '5',
    name: 'Estética Glamour',
    category: 'belleza',
    address: 'Altavista 45',
    hours: 'Mar - Sáb: 10:00 AM - 7:00 PM',
    status: 'open',
    image: 'https://picsum.photos/seed/beauty1/800/600',
  },
  {
    id: '6',
    name: 'Ferretería El Martillo',
    category: 'talleres',
    address: 'Av. Toluca 120',
    hours: 'Lun - Vie: 9:00 AM - 6:00 PM',
    status: 'open',
    image: 'https://picsum.photos/seed/tools1/800/600',
  },
  {
    id: '7',
    name: 'Farmacia San José',
    category: 'salud',
    address: 'Desierto de los Leones 450',
    hours: '24 Horas',
    status: 'open',
    image: 'https://picsum.photos/seed/health1/800/600',
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  restaurantes: 'Restaurantes',
  tiendas: 'Tiendas y Mercados',
  cafes: 'Cafeterías',
  belleza: 'Belleza y Estética',
  talleres: 'Talleres y Servicios',
  transporte: 'Transporte',
  salud: 'Salud y Farmacias',
  otros: 'Otros Negocios',
};

export default function Markets() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const filteredBusinesses = categoryFilter 
    ? ALL_BUSINESSES.filter(b => b.category === categoryFilter)
    : ALL_BUSINESSES;

  const clearFilter = () => {
    setSearchParams({});
  };

  return (
    <Layout title={categoryFilter ? CATEGORY_LABELS[categoryFilter] : "Directorio Local"}>
      <div className="space-y-8">
        {/* Hero & Search */}
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight leading-tight">
            {categoryFilter ? (
              <>Explora <span className="text-primary italic">{CATEGORY_LABELS[categoryFilter]}</span></>
            ) : (
              <>Directorio de <span className="text-primary italic">Negocios</span></>
            )}
          </h2>
          
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full max-w-md group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder={`Busca en ${categoryFilter ? CATEGORY_LABELS[categoryFilter] : 'todos los negocios'}...`}
                className="w-full h-14 pl-12 pr-4 bg-surface border-none rounded-full shadow-sm text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            {categoryFilter && (
              <button 
                onClick={clearFilter}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold hover:bg-primary/20 transition-colors"
              >
                <X className="w-3 h-3" />
                Limpiar filtro: {CATEGORY_LABELS[categoryFilter]}
              </button>
            )}
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((market) => (
              <motion.div
                key={market.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4 }}
                className={cn(
                  "bg-surface rounded-3xl overflow-hidden shadow-sm border border-gray-50 dark:border-gray-800 flex flex-col",
                  market.featured && !categoryFilter && "md:col-span-2"
                )}
              >
                <div className={cn("flex flex-col", market.featured && !categoryFilter ? "md:flex-row" : "flex-col")}>
                  <div className={cn("relative overflow-hidden", market.featured && !categoryFilter ? "md:w-1/2 h-64 md:h-auto" : "h-48")}>
                    <img
                      src={market.image}
                      alt={market.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {(!market.featured || categoryFilter) && (
                      <div className={cn(
                        "absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md",
                        market.status === 'open' ? "bg-tertiary-container/90 text-on-tertiary-container" : "bg-error-container/90 text-white"
                      )}>
                        {market.status === 'open' ? 'Abierto' : 'Cerrado'}
                      </div>
                    )}
                  </div>

                  <div className={cn("p-6 flex flex-col justify-center", market.featured && !categoryFilter ? "md:w-1/2 md:p-8" : "w-full")}>
                    {market.featured && !categoryFilter && (
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-4 py-1 bg-tertiary-container text-on-tertiary-container text-xs font-bold rounded-full uppercase tracking-widest">
                          Recomendado
                        </span>
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Star className="w-4 h-4 text-primary fill-current" />
                        </div>
                      </div>
                    )}
                    
                    <h3 className={cn("font-extrabold text-on-surface mb-2", market.featured && !categoryFilter ? "text-3xl" : "text-xl")}>
                      {market.name}
                    </h3>
                    
                    <div className="space-y-2 mb-6">
                      <p className="text-on-surface-variant flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        {market.address}
                      </p>
                      <p className="text-on-surface-variant flex items-center gap-2 text-xs font-medium">
                        <Clock className="w-4 h-4 text-primary" />
                        {market.hours}
                      </p>
                    </div>

                    <Link to="/chat" className={cn(
                      "w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all active:scale-95",
                      market.featured && !categoryFilter
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "bg-blue-50 dark:bg-blue-900/20 text-primary border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    )}>
                      <MapIcon className="w-5 h-5" />
                      Contactar Negocio
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-on-surface-variant">
                <Filter className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-on-surface">No se encontraron negocios</h3>
              <p className="text-on-surface-variant max-w-xs mx-auto">Intenta con otra categoría o busca en el directorio general.</p>
              <button 
                onClick={clearFilter}
                className="text-primary font-bold hover:underline"
              >
                Ver todos los negocios
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
