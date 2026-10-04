import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught an error]:', error, errorInfo);

    // If dynamic chunk import failed due to a new deployment, auto-reload cleanly
    const isChunkFailure =
      error?.message &&
      (error.message.includes('dynamically imported module') ||
        error.message.includes('Loading chunk') ||
        error.message.includes('Failed to fetch'));

    if (isChunkFailure) {
      const lastReload = sessionStorage.getItem('chunk_reload_ts');
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem('chunk_reload_ts', now.toString());
        window.location.reload();
      }
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf5eb] dark:bg-[#000000] p-6 text-black dark:text-[#faf5eb]">
          <div className="max-w-md w-full rounded-2xl border border-black/15 dark:border-[#222225] bg-white dark:bg-[#0c0c0e] p-8 shadow-sm text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-[#faf5eb] dark:bg-[#faf5eb] dark:text-black shadow-xs">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-display font-bold text-black dark:text-[#faf5eb]">
                Something interrupted this page
              </h2>
              <p className="text-xs text-[#756d61] dark:text-[#a39b8e] leading-relaxed">
                A fresh update was likely deployed. Reloading the page will immediately restore the latest version.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-black text-[#faf5eb] dark:bg-[#faf5eb] dark:text-black py-2.5 px-4 text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-black/20 dark:border-white/20 bg-transparent text-black dark:text-[#faf5eb] py-2.5 px-4 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
