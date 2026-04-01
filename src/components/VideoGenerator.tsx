import React, { useState } from 'react';
import { Video, Loader2, Play, Download, X } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

export function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    setVideoUrl(null);
    try {
      const url = await geminiService.generateVideo(prompt);
      setVideoUrl(url);
    } catch (err) {
      console.error("Error generating video:", err);
      setError("No se pudo generar el video. Por favor, intenta con un prompt diferente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-surface p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
          <Video className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold tracking-tight text-on-surface">Generador de Video AI</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Powered by Veo 3.1</p>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe el video que quieres crear (ej: 'Un atardecer en el Parque la Bombilla con gente caminando')..."
          className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm text-on-surface focus:ring-2 focus:ring-purple-500 transition-all resize-none"
        />
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isLoading}
          className="w-full py-4 bg-purple-600 text-white rounded-full font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generando (puede tardar unos minutos)...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              Generar Video
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="text-error text-xs font-bold text-center">{error}</p>
      )}

      <AnimatePresence>
        {videoUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800"
          >
            <video src={videoUrl} controls className="w-full aspect-video bg-black" />
            <div className="absolute top-4 right-4 flex gap-2">
              <a
                href={videoUrl}
                download="ao-conecta-video.mp4"
                className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
              >
                <Download className="w-5 h-5" />
              </a>
              <button
                onClick={() => setVideoUrl(null)}
                className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
