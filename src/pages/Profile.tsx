import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { User as UserIcon, Settings, Award, Heart, Stars, ChevronRight, LogOut, Bell, ShieldCheck, CreditCard, HelpCircle, Share2, LogIn, Camera, Save, X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from '../lib/FirebaseProvider';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export default function Profile() {
  const { user, loading, signIn, signOut, toggleTheme } = useFirebase();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ displayName: '', photoURL: '' });
  const [isSaving, setIsSaving] = useState(false);

  if (loading) {
    return (
      <Layout title="Mi Perfil">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="Mi Perfil">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-primary">
            <UserIcon className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-on-surface">Inicia Sesión</h2>
            <p className="text-on-surface-variant max-w-xs mx-auto">
              Inicia sesión para ver tu perfil, guardar tu progreso en la trivia y conectar con vecinos.
            </p>
          </div>
          <button
            onClick={signIn}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            <LogIn className="w-5 h-5" />
            Continuar con Google
          </button>
        </div>
      </Layout>
    );
  }

  const handleEditOpen = () => {
    setEditForm({ displayName: user.displayName, photoURL: user.photoURL });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: editForm.displayName,
        photoURL: editForm.photoURL
      });
      setIsEditing(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePrivacy = async (setting: 'showLevel' | 'showPoints' | 'publicProfile') => {
    const currentSettings = user.privacySettings || { showLevel: true, showPoints: true, publicProfile: true };
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        privacySettings: {
          ...currentSettings,
          [setting]: !currentSettings[setting]
        }
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const STATS = [
    { label: 'Nivel', value: user.level.toString(), icon: Award, color: 'bg-blue-100 text-primary', visible: user.privacySettings?.showLevel !== false },
    { label: 'Puntos', value: user.points.toLocaleString(), icon: Stars, color: 'bg-orange-100 text-secondary', visible: user.privacySettings?.showPoints !== false },
    { label: 'Vidas', value: user.lives.toString(), icon: Heart, color: 'bg-rose-100 text-rose-600', visible: true },
  ];

  const PRIVACY_ITEMS = [
    { id: 'showLevel', label: 'Mostrar Nivel', icon: Award, active: user.privacySettings?.showLevel !== false },
    { id: 'showPoints', label: 'Mostrar Puntos', icon: Stars, active: user.privacySettings?.showPoints !== false },
    { id: 'publicProfile', label: 'Perfil Público', icon: Eye, active: user.privacySettings?.publicProfile !== false },
  ];

  return (
    <Layout title="Mi Perfil">
      <div className="space-y-8">
        {/* User Header */}
        <section className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl">
              <img
                src={user.photoURL || `https://i.pravatar.cc/300?u=${user.uid}`}
                alt="User Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <button 
              onClick={handleEditOpen}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg cursor-pointer active:scale-90 transition-transform"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">{user.displayName}</h2>
            <p className="text-on-surface-variant font-bold text-sm uppercase tracking-widest mt-1">
              {user.isVerified ? 'Vecino Verificado' : 'Vecino ÁO'} • {user.role === 'admin' ? 'Administrador' : 'Usuario'}
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-3 gap-4">
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4 }}
              className={cn(
                "bg-surface p-4 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-800 flex flex-col items-center gap-2",
                !stat.visible && "opacity-50 grayscale"
              )}
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-on-surface">{stat.visible ? stat.value : '---'}</p>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* VIP Banner */}
        {!user.isVIP && (
          <section className="bg-gradient-to-r from-secondary to-orange-400 rounded-3xl p-8 relative overflow-hidden shadow-lg shadow-secondary/20">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Stars className="w-6 h-6 text-white fill-current" />
                <span className="text-white font-black text-xs uppercase tracking-widest">Membresía VIP</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
                Desbloquea Beneficios Exclusivos
              </h3>
              <p className="text-orange-50 text-sm font-medium leading-relaxed max-w-[70%]">
                Obtén descuentos especiales, vidas ilimitadas y soporte prioritario en ÁO Conecta.
              </p>
              <button className="bg-white text-secondary px-8 py-3 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-all">
                Ser VIP Ahora
              </button>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none">
               <Award className="w-full h-full text-white" />
            </div>
          </section>
        )}

        {/* Appearance Settings */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold tracking-tight px-2">Apariencia</h3>
          <div className="bg-surface rounded-3xl overflow-hidden border border-gray-50 dark:border-gray-800 shadow-sm">
            <div className="p-5 flex items-center justify-between transition-all">
              <div className="flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-on-surface-variant")}>
                  <Stars className="w-5 h-5" />
                </div>
                <span className="font-bold text-on-surface">Modo Oscuro</span>
              </div>
              <button 
                onClick={toggleTheme}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors duration-300",
                  user.theme === 'dark' ? "bg-primary" : "bg-gray-200"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                  user.theme === 'dark' ? "left-7" : "left-1"
                )} />
              </button>
            </div>
          </div>
        </section>

        {/* Privacy Settings */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold tracking-tight px-2">Privacidad</h3>
          <div className="bg-surface rounded-3xl overflow-hidden border border-gray-50 dark:border-gray-800 shadow-sm">
            {PRIVACY_ITEMS.map((item, idx) => (
              <div
                key={item.id}
                className={cn(
                  "p-5 flex items-center justify-between transition-all",
                  idx !== PRIVACY_ITEMS.length - 1 && "border-b border-gray-50 dark:border-gray-800"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-on-surface-variant")}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-on-surface">{item.label}</span>
                </div>
                <button 
                  onClick={() => togglePrivacy(item.id as any)}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    item.active ? "bg-primary" : "bg-gray-200"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                    item.active ? "left-7" : "left-1"
                  )} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Logout Button */}
        <section className="pb-10">
          <button 
            onClick={signOut}
            className="w-full py-5 bg-error-container/10 text-error rounded-3xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all border border-error-container/20"
          >
            <LogOut className="w-6 h-6" />
            Cerrar Sesión
          </button>
          <p className="text-center text-on-surface-variant text-[10px] font-black uppercase tracking-widest mt-6">
            ÁO Conecta v1.0.0 • Hecho con ❤️ en Álvaro Obregón
          </p>
        </section>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-surface w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative z-10 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-extrabold text-on-surface tracking-tight">Editar Perfil</h3>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                  <X className="w-6 h-6 text-on-surface-variant" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2">Nombre de vecino</label>
                  <input
                    type="text"
                    value={editForm.displayName}
                    onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-on-surface"
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2">URL de foto de perfil</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={editForm.photoURL}
                      onChange={(e) => setEditForm({ ...editForm, photoURL: e.target.value })}
                      className="w-full p-4 pl-12 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-on-surface"
                      placeholder="https://..."
                    />
                    <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
