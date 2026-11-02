import React from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { Printer, Copy, Check, Calculator, Globe } from 'lucide-react';

export type AppViewMode = 'yearly' | 'monthly';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onCopySummary: () => void;
  copied: boolean;
  onPrint: () => void;
  activeView: AppViewMode;
  setActiveView: (view: AppViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  onCopySummary,
  copied,
  onPrint,
  activeView,
  setActiveView,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block">
                {t.appTitle}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation / View Tabs (Yearly / Monthly only) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveView('yearly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'yearly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.yearlyView}
            </button>
            <button
              onClick={() => setActiveView('monthly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'monthly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.monthlyView}
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
              title="Switch Language / เปลี่ยนภาษา"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === 'th' ? 'EN' : 'ไทย'}</span>
            </button>

            {/* Copy Button */}
            <button
              onClick={onCopySummary}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors whitespace-nowrap shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">{t.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.copySummary}</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.print}</span>
            </button>
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="md:hidden flex items-center justify-between pb-3 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1 w-full bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveView('yearly')}
              className={`flex-1 py-1.5 text-xs font-medium text-center rounded-md transition-colors whitespace-nowrap ${
                activeView === 'yearly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              {lang === 'th' ? 'รายปี (Yearly)' : 'Yearly View'}
            </button>
            <button
              onClick={() => setActiveView('monthly')}
              className={`flex-1 py-1.5 text-xs font-medium text-center rounded-md transition-colors whitespace-nowrap ${
                activeView === 'monthly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              {lang === 'th' ? 'รายเดือน (Monthly)' : 'Monthly View'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
