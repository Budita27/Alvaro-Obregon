import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { MapPin, Navigation, Layers, Bus, ShieldCheck, Phone, ChevronRight, Train, Info, Loader2, Play, Pause, Heart, Trash2, Bookmark } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, doc, updateDoc, setDoc, addDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { TransportUnit, SavedRoute } from '../types';
import { useFirebase } from '../lib/FirebaseProvider';

const STATIONS = [
  { id: 'mixcoac', name: 'Mixcoac', lines: ['L7', 'L12'], colors: ['bg-orange-500', 'bg-yellow-200 text-gray-800'], status: 'Operativo' },
  { id: 'barranca', name: 'Barranca del Muerto', lines: ['L7'], colors: ['bg-orange-500'], status: 'Operativo' },
  { id: 'viveros', name: 'Viveros', lines: ['L3'], colors: ['bg-green-600'], status: 'Operativo' },
];

const TAXI_SITES = [
  { id: '12', name: 'Sitio 12 - San Ángel', location: 'Plaza del Carmen', phone: '55 1234 5678' },
  { id: '24', name: 'Sitio 24 - Olivar del Conde', location: 'Av. Santa Lucía', phone: '55 8765 4321' },
];

// --- Transport Map Component ---

function TransportMap() {
  const [units, setUnits] = useState<TransportUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useFirebase();
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const q = collection(db, 'transport_units');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const unitsData = snapshot.docs.map(doc => doc.data() as TransportUnit);
      setUnits(unitsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'transport_units');
    });

    return () => unsubscribe();
  }, []);

  // Simulation Logic (Only for Admin)
  useEffect(() => {
    if (!isSimulating || user?.role !== 'admin') return;

    const interval = setInterval(async () => {
      for (const unit of units) {
        const unitRef = doc(db, 'transport_units', unit.id);
        // Simulate movement
        const newLat = unit.lat + (Math.random() - 0.5) * 0.001;
        const newLng = unit.lng + (Math.random() - 0.5) * 0.001;
        const newHeading = (unit.heading + (Math.random() - 0.5) * 20 + 360) % 360;

        try {
          await updateDoc(unitRef, {
            lat: newLat,
            lng: newLng,
            heading: newHeading,
            lastUpdate: new Date().toISOString()
          });
        } catch (error) {
          console.error('Error updating unit:', error);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating, units, user]);

  const initializeUnits = async () => {
    if (user?.role !== 'admin') return;
    const initialUnits: TransportUnit[] = [
      { id: 'bus-1', type: 'bus', line: 'Ruta 57', lat: 19.358, lng: -99.192, heading: 90, status: 'En ruta', lastUpdate: new Date().toISOString() },
      { id: 'bus-2', type: 'bus', line: 'Ruta 43', lat: 19.345, lng: -99.210, heading: 180, status: 'En ruta', lastUpdate: new Date().toISOString() },
      { id: 'metro-1', type: 'metro', line: 'L7', lat: 19.360, lng: -99.185, heading: 0, status: 'En estación', lastUpdate: new Date().toISOString() },
    ];

    for (const unit of initialUnits) {
      await setDoc(doc(db, 'transport_units', unit.id), unit);
    }
  };

  return (
    <div className="relative bg-blue-50 dark:bg-blue-900/10 rounded-[2.5rem] h-[400px] overflow-hidden border-4 border-surface shadow-inner group">
      {/* Simulated Map Background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" className="text-primary">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Map Content */}
      <div className="absolute inset-0 p-8">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="relative w-full h-full">
            {units.map((unit) => (
              <motion.div
                key={unit.id}
                initial={false}
                animate={{ 
                  x: (unit.lng + 99.22) * 4000, // Simple projection for AO area
                  y: (19.37 - unit.lat) * 4000 
                }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                className="absolute"
              >
                <div className="relative group/unit">
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white transition-transform",
                    unit.type === 'bus' ? "bg-primary text-white" : "bg-orange-500 text-white"
                  )}>
                    {unit.type === 'bus' ? <Bus className="w-5 h-5" /> : <Train className="w-5 h-5" />}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-surface px-3 py-1.5 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 opacity-0 group-hover/unit:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                    <p className="text-xs font-black text-on-surface">{unit.line}</p>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">{unit.status}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Map Overlay Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="p-3 bg-surface/90 backdrop-blur-md rounded-2xl shadow-lg border border-surface text-primary active:scale-90 transition-transform">
          <Layers className="w-5 h-5" />
        </button>
        <button className="p-3 bg-surface/90 backdrop-blur-md rounded-2xl shadow-lg border border-surface text-primary active:scale-90 transition-transform">
          <Navigation className="w-5 h-5" />
        </button>
      </div>

      {/* Admin Controls */}
      {user?.role === 'admin' && (
        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
          <button 
            onClick={() => setIsSimulating(!isSimulating)}
            className={cn(
              "flex-1 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all",
              isSimulating ? "bg-rose-500 text-white" : "bg-teal-500 text-white"
            )}
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isSimulating ? "Pausar Simulación" : "Simular Tráfico Real"}
          </button>
          {units.length === 0 && (
            <button 
              onClick={initializeUnits}
              className="px-4 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg"
            >
              Inicializar
            </button>
          )}
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-surface/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-surface flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Bus</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Metro</span>
        </div>
      </div>
    </div>
  );
}

export default function Transport() {
  const { user } = useFirebase();
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  useEffect(() => {
    if (!user) {
      setSavedRoutes([]);
      setLoadingSaved(false);
      return;
    }

    const q = collection(db, 'users', user.uid, 'saved_routes');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const routes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedRoute));
      setSavedRoutes(routes);
      setLoadingSaved(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/saved_routes`);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleSaveRoute = async (route: Omit<SavedRoute, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    const existing = savedRoutes.find(r => r.line === route.line && r.type === route.type);

    if (existing) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'saved_routes', existing.id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/saved_routes/${existing.id}`);
      }
    } else {
      try {
        await addDoc(collection(db, 'users', user.uid, 'saved_routes'), {
          ...route,
          userId: user.uid,
          createdAt: new Date().toISOString()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/saved_routes`);
      }
    }
  };

  return (
    <Layout title="Movilidad ÁO">
      <div className="space-y-8">
        <section>
          <h2 className="text-4xl font-extrabold text-on-surface leading-tight mb-2 tracking-tight">Movilidad y Transporte</h2>
          <p className="text-on-surface-variant text-lg font-medium">Consulta rutas, paradas y sitios de taxi seguro en ÁO.</p>
        </section>

        {/* My Routes Section */}
        <AnimatePresence>
          {user && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-primary" />
                  <h3 className="text-2xl font-extrabold text-on-surface tracking-tight">Mis Rutas</h3>
                </div>
                <span className="text-xs font-bold text-on-surface-variant bg-surface px-3 py-1 rounded-full border border-gray-100 dark:border-gray-800">
                  {savedRoutes.length} guardadas
                </span>
              </div>

              {loadingSaved ? (
                <div className="bg-surface p-8 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : savedRoutes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedRoutes.map((route) => (
                    <motion.div
                      key={route.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-surface p-5 rounded-3xl border border-gray-50 dark:border-gray-800 shadow-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg",
                          route.type === 'bus' ? "bg-primary" : "bg-orange-500"
                        )}>
                          {route.line}
                        </div>
                        <div>
                          <h4 className="font-bold text-on-surface">{route.name}</h4>
                          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                            {route.type === 'bus' ? 'Ruta de Autobús' : 'Línea de Metro'}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleSaveRoute(route)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-surface p-10 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700 text-center space-y-3">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-on-surface-variant">
                    <Bookmark className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-on-surface-variant font-medium">No tienes rutas guardadas aún.</p>
                  <p className="text-xs text-on-surface-variant/60">Toca el corazón en cualquier estación o ruta para guardarla.</p>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Real-time Map Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-2xl font-extrabold text-on-surface tracking-tight">Mapa en Tiempo Real</h3>
              <p className="text-on-surface-variant text-sm font-medium">Ubicación en vivo de transporte público</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">En Vivo</span>
            </div>
          </div>
          
          <TransportMap />
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-4">
          <button className="p-6 bg-surface rounded-[2rem] shadow-sm border border-gray-50 dark:border-gray-800 flex flex-col items-center gap-3 active:scale-95 transition-all">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-primary rounded-2xl flex items-center justify-center">
              <Bus className="w-6 h-6" />
            </div>
            <span className="font-bold text-on-surface">Rutas de Bus</span>
          </button>
          <button className="p-6 bg-surface rounded-[2rem] shadow-sm border border-gray-50 dark:border-gray-800 flex flex-col items-center gap-3 active:scale-95 transition-all">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center">
              <Train className="w-6 h-6" />
            </div>
            <span className="font-bold text-on-surface">Metro / Tren</span>
          </button>
        </section>

        {/* Safety Banner */}
        <section className="bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-lg shadow-primary/20">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6" />
              <span className="font-black text-xs uppercase tracking-widest">Viaje Seguro</span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight leading-tight">
              Consejos para un viaje seguro en ÁO
            </h3>
            <p className="text-blue-100 text-sm font-medium leading-relaxed max-w-[80%]">
              Usa siempre transporte verificado y comparte tu ubicación en tiempo real con familiares.
            </p>
            <button className="bg-surface text-primary px-8 py-3 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-all">
              Ver Protocolos
            </button>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-10 pointer-events-none">
            <ShieldCheck className="w-full h-full" />
          </div>
        </section>

        {/* Stations List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold tracking-tight">Estaciones Cercanas</h3>
            <button className="text-primary text-sm font-bold flex items-center gap-1">
              Ver todas <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {STATIONS.map((station) => {
              const isSaved = savedRoutes.some(r => r.name === station.name);
              return (
                <div key={station.id} className="bg-surface p-5 rounded-3xl border border-gray-50 dark:border-gray-800 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                      {station.lines.map((line, idx) => (
                        <div key={line} className={cn("w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black", station.colors[idx])}>
                          {line}
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">{station.name}</h4>
                      <p className="text-xs font-medium text-on-surface-variant flex items-center gap-1">
                        <Info className="w-3 h-3" /> {station.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveRoute({
                          type: station.lines[0].startsWith('L') ? 'metro' : 'bus',
                          line: station.lines[0],
                          name: station.name
                        });
                      }}
                      className={cn(
                        "p-3 rounded-2xl transition-all active:scale-90",
                        isSaved 
                          ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30" 
                          : "bg-gray-50 text-on-surface-variant dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", isSaved && "fill-current")} />
                    </button>
                    <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Taxi Sites */}
        <section className="space-y-4 pb-10">
          <h3 className="text-xl font-bold tracking-tight px-2">Sitios de Taxi Seguro</h3>
          <div className="grid grid-cols-1 gap-4">
            {TAXI_SITES.map((site) => (
              <div key={site.id} className="bg-surface p-6 rounded-3xl border border-gray-50 dark:border-gray-800 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-bold text-on-surface">{site.name}</h4>
                  <p className="text-xs font-medium text-on-surface-variant flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {site.location}
                  </p>
                </div>
                <button className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center active:scale-90 transition-transform">
                  <Phone className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
