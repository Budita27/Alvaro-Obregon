import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = 'Algo salió mal. Por favor, intenta de nuevo.';
      try {
        const parsedError = JSON.parse(this.state.error?.message || '');
        if (parsedError.error && parsedError.error.includes('Missing or insufficient permissions')) {
          errorMessage = 'No tienes permisos para realizar esta acción. Por favor, verifica tu cuenta.';
        }
      } catch (e) {
        // Not a JSON error, use default message
      }

      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-error-container/20 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-error" />
          </div>
          <h1 className="text-2xl font-extrabold text-on-surface mb-2 tracking-tight">¡Ups! Algo salió mal</h1>
          <p className="text-on-surface-variant mb-8 max-w-md font-medium">
            {errorMessage}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Recargar Aplicación
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
