import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { SalaryScenario, formatTHB } from '../utils/taxCalculator';
import { TRANSLATIONS, Language } from '../utils/translations';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  scenario: SalaryScenario | null;
  onConfirm: () => void;
  onCancel: () => void;
  lang: Language;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  scenario,
  onConfirm,
  onCancel,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !scenario) return null;

  const monthlyAmt = scenario.input.inputMode === 'monthly'
    ? scenario.input.salaryMonthly
    : scenario.input.salaryYearly / 12;
  const yearlyAmt = scenario.input.inputMode === 'yearly'
    ? scenario.input.salaryYearly
    : scenario.input.salaryMonthly * 12;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label={t.cancelBtn}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Danger Warning Icon */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div className="space-y-1 pr-6">
            <h3
              id="confirm-delete-title"
              className="text-base font-bold text-slate-900 leading-snug"
            >
              {t.confirmDeleteSalaryTitle}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t.confirmDeleteSalaryMessage}
            </p>
          </div>
        </div>

        {/* Target Scenario Card Summary */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              {lang === 'th' ? 'แผนที่จะลบ:' : 'Scenario to delete:'}
            </span>
            <span className="font-bold text-slate-900 px-2 py-0.5 bg-white border border-slate-200 rounded-md shadow-2xs">
              {scenario.name}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block">
                {lang === 'th' ? 'เงินเดือน/เดือน' : 'Monthly Salary'}
              </span>
              <span className="font-semibold text-slate-800">
                {formatTHB(monthlyAmt)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">
                {lang === 'th' ? 'เงินเดือนรวม/ปี' : 'Yearly Salary'}
              </span>
              <span className="font-semibold text-slate-800">
                {formatTHB(yearlyAmt)}
              </span>
            </div>
          </div>
        </div>

        {/* Warning details note */}
        <p className="text-xs text-rose-600/90 bg-rose-50/60 border border-rose-100 rounded-lg p-2.5 flex items-start gap-2 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span>{t.confirmDeleteSalaryDetails}</span>
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            autoFocus
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
          >
            {t.cancelBtn}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.confirmDeleteBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
