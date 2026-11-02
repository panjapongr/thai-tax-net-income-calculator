import React, { useState } from 'react';
import {
  SalaryScenario,
  TaxCalculationInput,
  TaxCalculationResult,
  formatTHB,
  formatNumber,
  CONSTANTS,
} from '../utils/taxCalculator';
import { TRANSLATIONS, Language } from '../utils/translations';
import { sanitizeTextInput, sanitizeNumber, SECURITY_BOUNDS } from '../utils/security';
import {
  ShieldCheck,
  Building2,
  Coins,
  Plus,
  Minus,
  Trash2,
  Edit2,
  Check,
  Briefcase,
  PiggyBank,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  ArrowUpDown,
  X,
} from 'lucide-react';

const extractCustomNote = (name?: string) => {
  if (!name) return '';
  const matchParentheses = name.match(/^Salary\s*\d*\s*\((.+?)\)$/i);
  if (matchParentheses && matchParentheses[1]) return matchParentheses[1].trim();
  const matchSeparator = name.match(/^Salary\s*\d*\s*[:\-–—]\s*(.+)$/i);
  if (matchSeparator && matchSeparator[1]) return matchSeparator[1].trim();
  if (/^Salary\s*\d*$/i.test(name.trim())) return '';
  return name.replace(/^Salary\s*\d+\s*/i, '').trim();
};

interface SalaryInputPanelProps {
  scenarios: SalaryScenario[];
  activeScenarioId: string;
  onSelectScenario: (id: string) => void;
  onAddScenario: () => void;
  onRemoveScenario: (scenarioId?: string) => void;
  onRenameScenario: (id: string, name: string) => void;
  onMoveScenario?: (id: string, direction: 'left' | 'right') => void;
  onReorderScenarios?: (scenarios: SalaryScenario[]) => void;
  input: TaxCalculationInput;
  onChange: (updated: Partial<TaxCalculationInput>) => void;
  onApplyPvdToAll?: (employeeRate: number, employerRate?: number) => void;
  result: TaxCalculationResult;
  lang: Language;
}

const PRESET_SALARIES = [
  { label: '25,000', monthly: 25000, desc: 'Junior' },
  { label: '45,000', monthly: 45000, desc: 'Mid-level' },
  { label: '70,000', monthly: 70000, desc: 'Senior' },
  { label: '120,000', monthly: 120000, desc: 'Manager / Lead' },
  { label: '200,000', monthly: 200000, desc: 'Director' },
];

export const SalaryInputPanel: React.FC<SalaryInputPanelProps> = ({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  onAddScenario,
  onRemoveScenario,
  onRenameScenario,
  onMoveScenario,
  onReorderScenarios,
  input,
  onChange,
  onApplyPvdToAll,
  result,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [isEditingName, setIsEditingName] = useState(false);
  const activeScenario =
    scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];
  const activeIndex = scenarios.findIndex((s) => s.id === activeScenario?.id);
  const [tempName, setTempName] = useState(activeScenario?.name || 'Salary 1');

  // Drag and drop state for reordering
  const [draggedScenarioId, setDraggedScenarioId] = useState<string | null>(null);
  const [dragOverScenarioId, setDragOverScenarioId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedScenarioId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverScenarioId !== id) {
      setDragOverScenarioId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverScenarioId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverScenarioId(null);
    if (!draggedScenarioId || draggedScenarioId === targetId) {
      setDraggedScenarioId(null);
      return;
    }

    const fromIndex = scenarios.findIndex((s) => s.id === draggedScenarioId);
    const toIndex = scenarios.findIndex((s) => s.id === targetId);

    if (fromIndex === -1 || toIndex === -1) {
      setDraggedScenarioId(null);
      return;
    }

    const reordered = [...scenarios];
    const [movedItem] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, movedItem);

    if (onReorderScenarios) {
      onReorderScenarios(reordered);
    }
    setDraggedScenarioId(null);
  };

  const handleDragEnd = () => {
    setDraggedScenarioId(null);
    setDragOverScenarioId(null);
  };

  const handleSalaryChange = (valueStr: string) => {
    const rawVal = valueStr.replace(/[^0-9.]/g, '');
    const rawNum = parseFloat(rawVal) || 0;
    const num = sanitizeNumber(rawNum, 0, SECURITY_BOUNDS.MAX_SALARY, 0);

    if (input.inputMode === 'monthly') {
      onChange({
        salaryMonthly: num,
        salaryYearly: num * 12,
      });
    } else {
      onChange({
        salaryYearly: num,
        salaryMonthly: num > 0 ? Math.round((num / 12) * 100) / 100 : 0,
      });
    }
  };

  const handleModeSwitch = (mode: 'monthly' | 'yearly') => {
    if (mode === input.inputMode) return;
    onChange({ inputMode: mode });
  };

  const handlePvdSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = parseFloat(e.target.value) || 0;
    const percent = sanitizeNumber(rawVal, 0, SECURITY_BOUNDS.MAX_PVD_RATE, 0);
    onChange({ pvdRatePercent: percent });
  };

  const handleEmployerPvdSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = parseFloat(e.target.value) || 0;
    const percent = sanitizeNumber(rawVal, 0, SECURITY_BOUNDS.MAX_PVD_RATE, 0);
    onChange({ employerPvdPercent: percent });
  };

  const handlePresetClick = (monthlyAmt: number) => {
    const safeAmt = sanitizeNumber(monthlyAmt, 0, SECURITY_BOUNDS.MAX_SALARY, 0);
    onChange({
      salaryMonthly: safeAmt,
      salaryYearly: safeAmt * 12,
    });
  };

  const handleSaveName = () => {
    const note = sanitizeTextInput(tempName, 24);
    const finalName = note
      ? `Salary ${activeIndex + 1} (${note})`
      : `Salary ${activeIndex + 1}`;
    onRenameScenario(activeScenario.id, finalName);
    setIsEditingName(false);
  };

  const displaySalaryValue =
    input.inputMode === 'monthly'
      ? input.salaryMonthly > 0 ? input.salaryMonthly : ''
      : input.salaryYearly > 0 ? input.salaryYearly : '';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-6">
      {/* Multiple Salary Switcher & Add/Remove Header */}
      <div className="space-y-3 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">
              {t.scenariosTitle}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              ({scenarios.length}/5)
            </span>
          </div>

          {/* Plus / Minus Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Minus button (removes the last scenario in order: 5 > 4 > 3 > 2) */}
            <button
              type="button"
              onClick={() => onRemoveScenario()}
              disabled={scenarios.length <= 1}
              title={lang === 'th' ? 'ลบแผนเงินเดือน (-)' : 'Remove salary (-) '}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                scenarios.length > 1
                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
              }`}
            >
              <Minus className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? 'ลบ (-)' : 'Remove (-)'}</span>
            </button>

            {/* Plus button (add up to 5) */}
            <button
              type="button"
              onClick={onAddScenario}
              disabled={scenarios.length >= 5}
              title={lang === 'th' ? 'เพิ่มแผนเงินเดือนใหม่ (+)' : 'Add new salary scenario (+)'}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                scenarios.length < 5
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? 'เพิ่ม (+)' : 'Add'}</span>
            </button>
          </div>
        </div>

        {/* Scenario Selection Tabs with Drag-and-Drop Reordering */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          {scenarios.map((sc, idx) => {
            const isSelected = sc.id === activeScenarioId;
            const isDragging = sc.id === draggedScenarioId;
            const isDragOver = sc.id === dragOverScenarioId;

            return (
              <div
                key={sc.id}
                draggable={scenarios.length > 1}
                onDragStart={(e) => handleDragStart(e, sc.id)}
                onDragOver={(e) => handleDragOver(e, sc.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, sc.id)}
                onDragEnd={handleDragEnd}
                className={`flex-1 min-w-[75px] rounded-md transition-all ${
                  isDragging ? 'opacity-35 scale-95' : 'opacity-100'
                } ${isDragOver ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectScenario(sc.id);
                    setTempName(extractCustomNote(sc.name));
                    setIsEditingName(false);
                  }}
                  title={
                    scenarios.length > 1
                      ? `${sc.name || `Salary ${idx + 1}`} - ${t.dragToReorder}`
                      : sc.name || `Salary ${idx + 1}`
                  }
                  className={`w-full py-1.5 px-2 text-xs font-medium rounded-md transition-all text-center whitespace-nowrap truncate flex items-center justify-center gap-1 ${
                    scenarios.length > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                  } ${
                    isSelected
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {scenarios.length > 1 && (
                    <GripVertical className="w-2.5 h-2.5 text-slate-400 shrink-0 opacity-70" />
                  )}
                  <span className="truncate">{sc.name || `Salary ${idx + 1}`}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Editable Scenario Name & Reorder Buttons */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
          {isEditingName ? (
            <div className="flex items-center gap-1.5 w-full">
              <span className="font-bold text-slate-800 text-xs px-2 py-1 bg-slate-100 rounded-md shrink-0 border border-slate-200">
                Salary {activeIndex + 1}
              </span>
              <input
                type="text"
                maxLength={20}
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') setIsEditingName(false);
                }}
                className="w-full px-2 py-1 text-xs font-medium bg-white border border-emerald-500 rounded-md focus:outline-hidden"
                placeholder={lang === 'th' ? 'ระบุหมายเหตุ เช่น Offer B (เว้นว่างได้)' : 'e.g. Offer B (optional)'}
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveName}
                className="p-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                title={lang === 'th' ? 'บันทึก' : 'Save'}
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className="p-1 bg-slate-100 text-slate-500 rounded-md hover:bg-slate-200"
                title={lang === 'th' ? 'ยกเลิก' : 'Cancel'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-700 flex-wrap">
              <span className="font-semibold">{activeScenario?.name || `Salary ${activeIndex + 1}`}</span>
              <button
                type="button"
                onClick={() => {
                  setTempName(extractCustomNote(activeScenario?.name));
                  setIsEditingName(true);
                }}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
                title={lang === 'th' ? 'เพิ่ม/เปลี่ยนชื่อหมายเหตุแผน' : 'Add/Edit note'}
              >
                <Edit2 className="w-3 h-3" />
              </button>

              {scenarios.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveScenario(activeScenario.id)}
                  className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors ml-0.5"
                  title={
                    lang === 'th'
                      ? `ลบแผน ${activeScenario?.name || 'นี้'}`
                      : `Delete ${activeScenario?.name || 'this scenario'}`
                  }
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}

              {/* Move Left / Right Reorder Controls */}
              {scenarios.length > 1 && onMoveScenario && (
                <div className="flex items-center gap-0.5 ml-1 pl-1.5 border-l border-slate-200">
                  <span className="text-[10px] text-slate-400 font-medium mr-1">
                    {lang === 'th' ? 'ลำดับ:' : 'Order:'}
                  </span>
                  <button
                    type="button"
                    disabled={activeIndex <= 0}
                    onClick={() => onMoveScenario(activeScenario.id, 'left')}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    title={t.moveLeft}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-600 px-0.5 tabular-nums">
                    #{activeIndex + 1}
                  </span>
                  <button
                    type="button"
                    disabled={activeIndex >= scenarios.length - 1}
                    onClick={() => onMoveScenario(activeScenario.id, 'right')}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    title={t.moveRight}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            {scenarios.length > 1 && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-400">
                <ArrowUpDown className="w-2.5 h-2.5" />
                {t.dragToReorder}
              </span>
            )}
            {scenarios.length === 5 && (
              <span>{lang === 'th' ? 'ครบ 5 แผนแล้ว' : 'Max 5 reached'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Salary Input Block */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-800">
            {t.salaryInputLabel}
          </label>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => handleModeSwitch('monthly')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                input.inputMode === 'monthly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.perMonth}
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('yearly')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                input.inputMode === 'yearly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.perYear}
            </button>
          </div>
        </div>

        {/* Input input box */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
            ฿
          </span>
          <input
            type="number"
            min="0"
            step="1000"
            placeholder={t.salaryPlaceholder}
            value={displaySalaryValue}
            onChange={(e) => handleSalaryChange(e.target.value)}
            className="w-full pl-8 pr-28 py-3 text-lg font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent tabular-nums"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 bg-slate-200/70 px-2 py-1 rounded-sm">
            {input.inputMode === 'monthly' ? t.perMonth : t.perYear}
          </span>
        </div>

        {/* Converted Equivalent Display */}
        <div className="flex items-center justify-between text-xs text-slate-600 px-1 pt-0.5">
          <span>
            {input.inputMode === 'monthly' ? (
              <>
                {lang === 'th' ? 'คิดเป็นรายปี: ' : 'Annual equivalent: '}
                <strong className="text-slate-900 font-mono tabular-nums">
                  {formatTHB(result.annualSalary)}
                </strong>
              </>
            ) : (
              <>
                {lang === 'th' ? 'คิดเป็นต่อเดือน: ' : 'Monthly equivalent: '}
                <strong className="text-slate-900 font-mono tabular-nums">
                  {formatTHB(result.monthlySalary)}
                </strong>
              </>
            )}
          </span>

          <span className="text-slate-400">
            {lang === 'th' ? 'ฐานภาษี ภ.ง.ด. 91' : 'PND 91 Employment'}
          </span>
        </div>

        {/* Quick Presets */}
        <div className="pt-1">
          <div className="text-xs text-slate-500 mb-1.5 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.quickPresets}:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_SALARIES.map((p) => {
              const isSelected =
                Math.round(result.monthlySalary) === p.monthly;
              return (
                <button
                  key={p.monthly}
                  type="button"
                  onClick={() => handlePresetClick(p.monthly)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  ฿{p.label} <span className="opacity-75 text-[10px]">({p.desc})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Provident Fund (PVD) Section */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
        {/* 1. Employee Part */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <label className="text-sm font-semibold text-slate-900">
                  {t.pvdTitle}
                </label>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {activeScenario?.name || 'Salary 1'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                {t.pvdDescription}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold text-sm rounded-md border border-emerald-200 tabular-nums">
                {input.pvdRatePercent}%
              </span>
            </div>
          </div>

          {/* Employee PVD Slider & Quick Buttons */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={input.pvdRatePercent}
                onChange={handlePvdSlider}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>0% ({lang === 'th' ? 'ไม่หัก' : 'None'})</span>
              <span>3%</span>
              <span>5% (ทั่วไป)</span>
              <span>10%</span>
              <span>15% ({lang === 'th' ? 'สูงสุด' : 'Max'})</span>
            </div>

            {/* Quick PVD select pills */}
            <div className="flex items-center gap-1.5 pt-1">
              {[0, 2, 3, 5, 7, 10, 15].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => onChange({ pvdRatePercent: rate })}
                  className={`flex-1 py-1 text-xs rounded-md font-medium transition-colors ${
                    input.pvdRatePercent === rate
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>


            {/* Computed Employee PVD THB display */}
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">
                  {t.pvdMonthlyAmount}
                </span>
                <span className="font-semibold text-slate-900 font-mono tabular-nums">
                  {formatTHB(result.monthlyPVD)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">
                  {t.pvdAnnualAmount}
                </span>
                <span className="font-semibold text-emerald-700 font-mono tabular-nums">
                  {formatTHB(result.annualPVD)}
                </span>
                {result.annualPVD >= CONSTANTS.PVD_ANNUAL_CAP && (
                  <span className="text-[10px] text-amber-700 block font-medium">
                    {lang === 'th' ? '(ชนเพดาน 500,000 บ.)' : '(Capped at 500k THB)'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Employer / Company Match Part (Additional benefit from company) */}
        <div className="pt-3 border-t border-slate-200/80 space-y-2.5 bg-sky-50/40 p-3 rounded-lg border border-sky-100">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-sky-700 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-sky-950">
                  {t.employerPvdTitle}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                {t.employerPvdDescription}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-block px-2.5 py-0.5 bg-sky-100 text-sky-900 font-bold text-xs sm:text-sm rounded-md border border-sky-300 tabular-nums">
                {input.employerPvdPercent ?? 0}%
              </span>
            </div>
          </div>

          {/* Employer PVD Slider */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={input.employerPvdPercent ?? 0}
                onChange={handleEmployerPvdSlider}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>

            {/* Quick employer PVD pills + Match employee button */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[0, 2, 3, 5, 7, 10, 15].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => onChange({ employerPvdPercent: rate })}
                  className={`px-2 py-1 text-xs rounded-md font-medium transition-colors ${
                    (input.employerPvdPercent ?? 0) === rate
                      ? 'bg-sky-700 text-white font-semibold'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {rate}%
                </button>
              ))}

              <button
                type="button"
                onClick={() => onChange({ employerPvdPercent: input.pvdRatePercent })}
                className="ml-auto px-2 py-1 text-[11px] font-semibold text-sky-800 bg-sky-100 hover:bg-sky-200 rounded-md transition-colors"
                title={lang === 'th' ? 'ปรับเปอร์เซ็นต์ให้เท่ากับส่วนของพนักงาน' : 'Match employee contribution %'}
              >
                {t.matchEmployeeBtn}
              </button>
            </div>

            {/* Computed Employer PVD amounts */}
            <div className="grid grid-cols-2 gap-2 p-2 bg-white rounded-md border border-sky-200/80 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">
                  {t.employerPvdMonthlyAmount}
                </span>
                <span className="font-bold text-sky-900 font-mono tabular-nums">
                  {formatTHB(result.monthlyEmployerPVD)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">
                  {t.employerPvdAnnualAmount}
                </span>
                <span className="font-bold text-sky-900 font-mono tabular-nums">
                  {formatTHB(result.annualEmployerPVD)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bonus / Extra Income Toggle (Optional) */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={input.includeBonus}
              onChange={(e) => onChange({ includeBonus: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
            />
            <span className="text-sm font-semibold text-slate-800">
              {t.bonusToggle}
            </span>
          </label>
          {input.includeBonus && (
            <div className="text-right">
              <span className="text-xs text-emerald-700 font-bold font-mono tabular-nums block">
                +{formatTHB(result.bonusAmount)}
              </span>
              {result.annualSalary > 0 && result.bonusAmount > 0 && (
                <span className="text-[10px] text-slate-500 font-mono tabular-nums block">
                  ({((result.bonusAmount / result.annualSalary) * 100).toFixed(1)}% {lang === 'th' ? 'ของเงินเดือนทั้งปี' : 'of annual salary'})
                </span>
              )}
            </div>
          )}
        </div>

        {input.includeBonus && (
          <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-slate-600 block">
                {t.bonusMonths}:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6].map((months) => (
                  <button
                    key={months}
                    type="button"
                    onClick={() =>
                      onChange({ bonusMonths: months, customBonusAmount: 0 })
                    }
                    className={`px-2 py-1 text-xs rounded-md font-medium transition-colors whitespace-nowrap ${
                      input.bonusMonths === months && input.customBonusAmount === 0
                        ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {months} {lang === 'th' ? 'เดือน' : 'mo'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
                {lang === 'th' ? 'หรือระบุยอดเงิน (บาท):' : 'Or Custom (THB):'}
              </span>
              <input
                type="number"
                min="0"
                step="5000"
                placeholder="0"
                value={input.customBonusAmount > 0 ? input.customBonusAmount : ''}
                onChange={(e) =>
                  onChange({
                    customBonusAmount: sanitizeNumber(
                      parseFloat(e.target.value) || 0,
                      0,
                      SECURITY_BOUNDS.MAX_BONUS_AMOUNT,
                      0
                    ),
                    bonusMonths: 0,
                  })
                }
                className="w-full px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-md tabular-nums focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Calculated % of Annual Salary */}
            {result.annualSalary > 0 && result.bonusAmount > 0 && (
              <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-md text-xs">
                <span className="text-slate-600 font-medium">
                  {lang === 'th'
                    ? 'คิดเป็นสัดส่วนของเงินเดือนทั้งปี:'
                    : 'Bonus as % of Annual Salary:'}
                </span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-emerald-700 font-extrabold text-sm tabular-nums">
                    {((result.bonusAmount / result.annualSalary) * 100).toFixed(2)}%
                  </span>
                  <span className="text-slate-400 text-[10px] font-sans">
                    ({lang === 'th' ? 'เทียบกับ' : 'vs'} {formatTHB(result.annualSalary)})
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mandatory Deductions Block (Auto applied by app) */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <h3 className="text-sm font-bold text-slate-900">
              {t.autoDeductionsTitle}
            </h3>
          </div>
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
            {lang === 'th' ? 'คำนวณอัตโนมัติ' : 'Auto Deducted'}
          </span>
        </div>

        <p className="text-xs text-slate-500">
          {t.autoDeductionsDesc}
        </p>

        {/* 3 Mandatory Items Listed */}
        <div className="space-y-2">
          {/* 1. Living Cost / Standard Expense */}
          <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">
                1. {t.standardExpense}
              </span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                -{formatTHB(result.standardExpenseDeduction)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span>{t.standardExpenseNote}</span>
              <span className="text-emerald-700 font-medium">
                {result.standardExpenseDeduction >= CONSTANTS.STANDARD_EXPENSE_CAP
                  ? (lang === 'th' ? 'สูงสุด 100,000 บ.' : 'Max 100,000 THB')
                  : `${formatNumber(CONSTANTS.STANDARD_EXPENSE_RATE * 100)}%`}
              </span>
            </div>
          </div>

          {/* 2. Personal Allowance */}
          <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">
                2. {t.personalAllowance}
              </span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                -{formatTHB(result.personalAllowance)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span>{t.personalAllowanceNote}</span>
              <span className="text-emerald-700 font-medium">
                {lang === 'th' ? 'คงที่ทุกปี' : 'Fixed by law'}
              </span>
            </div>
          </div>

          {/* 3. Social Security Fund */}
          <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">
                3. {t.socialSecurity}
              </span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                -{formatTHB(result.annualSocialSecurity)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span>{t.socialSecurityNote}</span>
              <span className="text-slate-600 font-mono tabular-nums">
                ({formatTHB(result.monthlySocialSecurity)}/{lang === 'th' ? 'ด.' : 'mo'})
              </span>
            </div>
          </div>
        </div>

        {/* Deductions Subtotal */}
        <div className="flex items-center justify-between p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-lg text-xs">
          <span className="font-semibold text-emerald-900">
            {t.totalDeductions}
          </span>
          <span className="font-mono font-bold text-emerald-900 text-sm tabular-nums">
            -{formatTHB(result.totalTaxDeductions)}
          </span>
        </div>
      </div>
    </div>
  );
};
