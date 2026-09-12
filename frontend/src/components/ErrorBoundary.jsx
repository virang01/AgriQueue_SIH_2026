import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('⚠️ AgriQueue ErrorBoundary caught an exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-2xl mx-auto my-12 p-6 bg-white border-2 border-gov-red rounded-2xl shadow-lg font-body text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-100 text-gov-red flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold font-heading text-gov-text">
            Something went wrong loading this view
          </h2>

          <p className="text-xs text-gov-muted max-w-md mx-auto">
            An internal interface error occurred. Please click below to refresh the view or return to the main dashboard.
          </p>

          {this.state.error?.message && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-left text-xs font-mono text-gov-red overflow-x-auto">
              {this.state.error.message}
            </div>
          )}

          <div className="pt-2 flex justify-center space-x-3">
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 btn-primary-red font-bold font-heading text-xs rounded-xl inline-flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Reload Page
            </button>
            <a
              href="/dashboard"
              className="px-5 py-2.5 bg-gov-gray border border-gov-border text-gov-text font-bold font-heading text-xs rounded-xl inline-flex items-center hover:bg-slate-200"
            >
              Return to Dashboard
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
