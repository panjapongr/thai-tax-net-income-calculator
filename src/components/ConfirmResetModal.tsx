import React, { useEffect } from 'react';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';
import { TRANSLATIONS, Language } from '../utils/translations';

interface ConfirmResetModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  lang: Language;
}

export const ConfirmResetModal: React.FC<ConfirmResetModalProps> = ({
  isOpen,
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-reset-title"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label={t.cancelBtn}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Warning Icon */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div className="space-y-1 pr-6">
            <h3
              id="confirm-reset-title"
              className="text-base font-bold text-slate-900 leading-snug"
            >
              {t.confirmResetTitle}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t.confirmResetMessage}
            </p>
          </div>
        </div>

        {/* What will be reset notice box */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
          <div className="font-semibold text-slate-700 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>{lang === 'th' ? 'การดำเนินการนี้จะทำการ:' : 'This action will:'}</span>
          </div>
          <ul className="space-y-1.5 text-slate-600 pl-3 list-disc marker:text-slate-400">
            <li>
              {lang === 'th'
                ? 'ลบแผนเงินเดือนเพิ่มเติมทั้งหมด และคืนค่าสู่แผนเริ่มต้น (50,000 บาท/เดือน)'
                : 'Remove all extra salary scenarios and restore default (50,000 THB/mo)'}
            </li>
            <li>
              {lang === 'th'
                ? 'รีเซ็ตอัตรากองทุนสำรองเลี้ยงชีพ (PVD) และโบนัสกลับสู่ค่าเริ่มต้น'
                : 'Reset Provident Fund (PVD) percentages and bonuses'}
            </li>
            <li>
              {lang === 'th'
                ? 'ล้างข้อมูลที่บันทึกไว้ในเบราว์เซอร์ของเครื่องนี้'
                : 'Clear all locally stored data from this browser'}
            </li>
          </ul>
        </div>

        {/* Warning details note */}
        <p className="text-xs text-amber-800 bg-amber-50/80 border border-amber-200 rounded-lg p-2.5 flex items-start gap-2 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{t.confirmResetDetails}</span>
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
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.confirmResetBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
