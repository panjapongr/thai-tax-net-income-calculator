import React from 'react';
import { TaxCalculationResult, formatTHB } from '../utils/taxCalculator';
import { TRANSLATIONS, Language } from '../utils/translations';
import { Layers } from 'lucide-react';

export interface IncomeDistributionCardProps {
  result: TaxCalculationResult;
  lang: Language;
  title?: string;
  badgeNumber?: number;
  isYearly?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const IncomeDistributionCard: React.FC<IncomeDistributionCardProps> = ({
  result,
  lang,
  title,
  badgeNumber,
  isYearly = true,
  isSelected,
  onClick,
  className = '',
}) => {
  const t = TRANSLATIONS[lang];

  // Proportion of Gross Income
  const gross = isYearly
    ? result.annualGrossIncome || 1
    : result.monthlyAverageGross || 1;

  const takeHomeVal = isYearly
    ? result.annualNetTakeHome
    : result.monthlyNetTakeHome;
  const pvdVal = isYearly ? result.annualPVD : result.monthlyPVD;
  const ssfVal = isYearly
    ? result.annualSocialSecurity
    : result.monthlySocialSecurity;
  const taxVal = isYearly ? result.annualTax : result.monthlyWithholdingTax;

  const takeHomePct = Math.max(0, (takeHomeVal / gross) * 100);
  const taxPct = Math.max(0, (taxVal / gross) * 100);
  const pvdPct = Math.max(0, (pvdVal / gross) * 100);
  const ssfPct = Math.max(0, (ssfVal / gross) * 100);

  const displayTitle = title || t.paycheckBreakdown;

  return (
    <div
      onClick={onClick}
      className={`bg-white border rounded-xl p-4 sm:p-5 shadow-xs space-y-3 transition-all ${
        onClick ? 'cursor-pointer' : ''
      } ${
        isSelected
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
          : 'border-slate-200 hover:border-slate-300'
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {badgeNumber !== undefined ? (
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-xs ${
                isSelected
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {badgeNumber}
            </div>
          ) : (
            <Layers className="w-4 h-4 text-slate-600 shrink-0" />
          )}

          <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
            {displayTitle}
          </h4>
        </div>

        <span className="text-xs text-slate-500 font-mono tabular-nums whitespace-nowrap shrink-0">
          {lang === 'th' ? 'รวมทั้งสิ้น:' : 'Total:'}{' '}
          <strong className="text-slate-800 font-bold">{formatTHB(gross)}</strong>
        </span>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="w-full h-3.5 sm:h-4 bg-slate-100 rounded-md overflow-hidden flex shadow-inner">
        {takeHomePct > 0 && (
          <div
            style={{ width: `${takeHomePct}%` }}
            title={`Net Take-Home: ${takeHomePct.toFixed(1)}%`}
            className="bg-emerald-600 transition-all duration-300"
          />
        )}
        {pvdPct > 0 && (
          <div
            style={{ width: `${pvdPct}%` }}
            title={`Provident Fund: ${pvdPct.toFixed(1)}%`}
            className="bg-sky-500 transition-all duration-300"
          />
        )}
        {ssfPct > 0 && (
          <div
            style={{ width: `${ssfPct}%` }}
            title={`Social Security: ${ssfPct.toFixed(1)}%`}
            className="bg-amber-500 transition-all duration-300"
          />
        )}
        {taxPct > 0 && (
          <div
            style={{ width: `${taxPct}%` }}
            title={`Personal Income Tax: ${taxPct.toFixed(1)}%`}
            className="bg-rose-500 transition-all duration-300"
          />
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-0.5 text-xs">
        {/* Take-Home */}
        <div className="flex items-start gap-1.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-slate-600 block text-[11px] truncate">
              {t.takeHomeShare}
            </span>
            <span className="font-semibold text-slate-900 font-mono tabular-nums block text-xs">
              {takeHomePct.toFixed(1)}%{' '}
              <span className="text-slate-400 font-normal">({formatTHB(takeHomeVal)})</span>
            </span>
          </div>
        </div>

        {/* PVD */}
        <div className="flex items-start gap-1.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-xs bg-sky-500 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-600 block text-[11px] truncate">
                {t.pvdShare}
              </span>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                {result.pvdRatePercent}%
              </span>
            </div>
            <span className="font-semibold text-slate-900 font-mono tabular-nums block text-xs">
              {result.pvdRatePercent}%{' '}
              <span className="text-slate-400 font-normal">({formatTHB(pvdVal)})</span>
            </span>
            {result.bonusAmount > 0 && (
              <span className="text-[10px] text-slate-400 font-sans block leading-tight mt-0.5">
                {lang === 'th'
                  ? `(คิดเป็น ${pvdPct.toFixed(1)}% ของเงินได้รวม)`
                  : `(${pvdPct.toFixed(1)}% of gross income)`}
              </span>
            )}
          </div>
        </div>

        {/* SSF */}
        <div className="flex items-start gap-1.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-slate-600 block text-[11px] truncate">
              {t.ssfShare}
            </span>
            <span className="font-semibold text-slate-900 font-mono tabular-nums block text-xs">
              {ssfPct.toFixed(1)}%{' '}
              <span className="text-slate-400 font-normal">({formatTHB(ssfVal)})</span>
            </span>
          </div>
        </div>

        {/* Tax */}
        <div className="flex items-start gap-1.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-slate-600 block text-[11px] truncate">
              {t.taxShare}
            </span>
            <span className="font-semibold text-slate-900 font-mono tabular-nums block text-xs">
              {taxPct.toFixed(1)}%{' '}
              <span className="text-slate-400 font-normal">({formatTHB(taxVal)})</span>
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Real Net Take-Home & Monthly Tax Summary */}
      <div className="pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
          <span className="text-emerald-800 text-[11px] font-sans font-medium">
            {lang === 'th' ? 'รับจริงต่อเดือน' : 'Net Take-Home/mo'}
          </span>
          <span className="font-extrabold text-emerald-900 text-xs sm:text-sm tabular-nums">
            {formatTHB(result.monthlyNetTakeHome)}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-rose-50/80 border border-rose-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
          <span className="text-rose-800 text-[11px] font-sans font-medium">
            {lang === 'th' ? 'ภาษีต่อเดือน' : 'Tax/mo'}
          </span>
          <span className="font-extrabold text-rose-700 text-xs sm:text-sm tabular-nums">
            {formatTHB(result.monthlyWithholdingTax)}
          </span>
        </div>
      </div>
    </div>
  );
};
