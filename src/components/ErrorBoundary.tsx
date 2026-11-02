import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // In production, avoid logging sensitive user salary data
    console.error('App runtime exception safely contained by ErrorBoundary:', error.message, errorInfo.componentStack);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('thai_tax_calculator_saved_data_v1');
    } catch {
      // Ignore
    }
    this.setState({ hasError: false });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-lg p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">
                เกิดข้อผิดพลาดในการแสดงผล / An error occurred
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                ระบบได้จำกัดข้อผิดพลาดเพื่อความปลอดภัยของข้อมูล คุณสามารถกดรีเซ็ตเพื่อเริ่มใช้งานใหม่ได้ทันที
              </p>
            </div>

            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>รีเซ็ตและโหลดใหม่ (Reset & Recover)</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
