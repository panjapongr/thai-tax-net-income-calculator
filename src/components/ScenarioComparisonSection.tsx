import React from 'react';
import {
  SalaryScenario,
  TaxCalculationResult,
  calculateScenarioDelta,
  formatTHB,
  formatDeltaTHB,
} from '../utils/taxCalculator';
import { TRANSLATIONS, Language } from '../utils/translations';
import { TrendingUp, TrendingDown, Scale, Check, Wallet, Receipt, Layers, Briefcase, PiggyBank, ChevronLeft, ChevronRight } from 'lucide-react';
import { IncomeDistributionCard } from './IncomeDistributionCard';
import { ScenarioIncomeDistribution, ScenarioIncomeDistributionProps } from './ScenarioIncomeDistribution';
import { ScenarioComparisonTable, ScenarioComparisonTableProps } from './ScenarioComparisonTable';

export { ScenarioIncomeDistribution, ScenarioComparisonTable };
export type { ScenarioIncomeDistributionProps, ScenarioComparisonTableProps };

export interface ScenarioComparisonSectionProps {
  scenarios: SalaryScenario[];
  results: { scenario: SalaryScenario; result: TaxCalculationResult }[];
  activeScenarioId: string;
  onSelectScenario: (id: string) => void;
  onMoveScenario?: (id: string, direction: 'left' | 'right') => void;
  lang: Language;
  viewMode: 'yearly' | 'monthly';
  showDistributionAndMatrix?: boolean;
}


export const ScenarioComparisonSection: React.FC<ScenarioComparisonSectionProps> = ({
  scenarios,
  results,
  activeScenarioId,
  onSelectScenario,
  onMoveScenario,
  lang,
  viewMode,
  showDistributionAndMatrix = false,
}) => {
  const t = TRANSLATIONS[lang];
  const isYearly = viewMode === 'yearly';

  // Baseline is always Salary 1 (index 0)
  const baseline = results[0];
  const comparedList = results.map((item, idx) => ({
    ...item,
    index: idx,
    isBaseline: idx === 0,
    delta: calculateScenarioDelta(item.result, baseline.result),
  }));

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {lang === 'th'
                ? `เปรียบเทียบส่วนต่าง ${scenarios.length} แผนเงินเดือน (${isYearly ? 'มุมมองรายปี' : 'มุมมองรายเดือน'})`
                : `Comparison & Differences across ${scenarios.length} Salaries (${isYearly ? 'Yearly View' : 'Monthly View'})`}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'th'
                ? 'เปรียบเทียบผลลัพธ์สุทธิและภาษีของทุกแผนเทียบกับ Salary 1 (คลิกเพื่อเลือกดูรายละเอียด)'
                : 'Comparing net take-home and tax pay against Salary 1 baseline (click any card to view deep-dive)'}
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Key Result Comparison Cards (Maximum 2 Single Cards Per Row, No Merged 2-Col Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
        {comparedList.map(({ scenario, result, isBaseline, delta, index }) => {
          const isSelected = scenario.id === activeScenarioId;

          // Delta values based on active view mode (Yearly vs Monthly)
          const takeHomeDeltaVal = isYearly
            ? delta.takeHomeYearlyDelta
            : delta.takeHomeMonthlyDelta;
          const taxDeltaVal = isYearly
            ? delta.taxYearlyDelta
            : delta.taxMonthlyDelta;

          const isMoreTakeHome = takeHomeDeltaVal > 0;
          const isLessTakeHome = takeHomeDeltaVal < 0;

          return (
            <div
              key={scenario.id}
              onClick={() => onSelectScenario(scenario.id)}
              className={`rounded-xl p-4 sm:p-5 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-full ${
                isSelected
                  ? 'bg-emerald-950 text-white border-2 border-emerald-400 ring-4 ring-emerald-400/25 shadow-lg'
                  : 'bg-emerald-950 text-white border border-emerald-800/80 hover:border-emerald-500/80 hover:shadow-md shadow-xs'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-emerald-900/80 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-xs ${
                      isSelected
                        ? 'bg-emerald-400 text-slate-950 font-extrabold'
                        : 'bg-emerald-900 text-emerald-200 border border-emerald-700/70'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="font-bold text-base text-white tracking-tight truncate">
                    {scenario.name || `Salary ${index + 1}`}
                  </span>
                  <span
                    title={lang === 'th' ? 'อัตราเงินสะสม PVD ส่วนของพนักงาน' : 'Employee PVD Rate'}
                    className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-900/90 text-emerald-200 rounded border border-emerald-700/70 shrink-0"
                  >
                    PVD {result.pvdRatePercent}%
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {scenarios.length > 1 && onMoveScenario && (
                    <div
                      className="flex items-center bg-emerald-900/80 rounded p-0.5 border border-emerald-700/60"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => onMoveScenario(scenario.id, 'left')}
                        className="p-0.5 text-emerald-300 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed rounded transition-colors"
                        title={t.moveLeft}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === scenarios.length - 1}
                        onClick={() => onMoveScenario(scenario.id, 'right')}
                        className="p-0.5 text-emerald-300 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed rounded transition-colors"
                        title={t.moveRight}
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {isBaseline ? (
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-sm bg-emerald-900 text-emerald-200 border border-emerald-700/60 tabular-nums whitespace-nowrap shrink-0">
                      {lang === 'th' ? 'ฐานอ้างอิง' : 'Baseline'}
                    </span>
                  ) : (
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-sm border tabular-nums whitespace-nowrap shrink-0 ${
                        isMoreTakeHome
                          ? 'bg-emerald-900 text-emerald-200 border-emerald-500/80'
                          : isLessTakeHome
                          ? 'bg-rose-950 text-rose-200 border-rose-700/80'
                          : 'bg-emerald-900 text-emerald-200 border-emerald-700/60'
                      }`}
                    >
                      {delta.takeHomeYearlyDeltaPercent >= 0 ? '+' : ''}
                      {delta.takeHomeYearlyDeltaPercent.toFixed(1)}% {lang === 'th' ? 'รับจริง' : 'Take-Home'}
                    </span>
                  )}
                </div>
              </div>

              {/* Net Take-Home Metric */}
              <div className="pt-3.5 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-900/80 border border-emerald-700/60 flex items-center justify-center text-emerald-300 shrink-0">
                    <Wallet className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs uppercase tracking-wider font-bold text-emerald-300">
                    {lang === 'th' ? 'เงินได้สุทธิรับจริง (NET TAKE-HOME)' : t.netTakeHome}
                  </span>
                </div>

                {/* Dual prominent display: ต่อปี and ต่อเดือน */}
                <div className="space-y-2 pt-0.5">
                  {/* ต่อปี */}
                  <div className="p-3 rounded-lg border border-emerald-800/80 bg-emerald-950/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="text-xs font-semibold text-emerald-200 font-sans">
                        {lang === 'th' ? 'สุทธิรับจริง' : 'Net Take-Home'}
                      </span>
                      <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-semibold shrink-0">
                        {lang === 'th' ? 'ต่อปี' : 'Yearly'}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                        {formatTHB(result.annualNetTakeHome)}
                      </div>
                    </div>
                  </div>

                  {/* ต่อเดือน */}
                  <div className="p-3 rounded-lg border border-emerald-800/80 bg-emerald-950/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="text-xs font-semibold text-emerald-200 font-sans">
                        {lang === 'th' ? 'สุทธิรับจริง' : 'Net Take-Home'}
                      </span>
                      <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-semibold shrink-0">
                        {lang === 'th' ? 'ต่อเดือน' : 'Monthly'}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                        {formatTHB(result.monthlyNetTakeHome)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2-Column Increase/Decrease: ต่อปี (Yearly) & ต่อเดือน (Monthly) - Lean text without box frame */}
                {!isBaseline ? (
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono font-bold tabular-nums">
                    {/* Column 1: ต่อปี */}
                    <div
                      className={`flex items-center justify-center gap-1.5 whitespace-nowrap py-0.5 ${
                        delta.takeHomeYearlyDelta > 0
                          ? 'text-emerald-400'
                          : delta.takeHomeYearlyDelta < 0
                          ? 'text-rose-400'
                          : 'text-emerald-300/80'
                      }`}
                    >
                      {delta.takeHomeYearlyDelta > 0 && <TrendingUp className="w-3.5 h-3.5 shrink-0" />}
                      {delta.takeHomeYearlyDelta < 0 && <TrendingDown className="w-3.5 h-3.5 shrink-0" />}
                      <span>{formatDeltaTHB(delta.takeHomeYearlyDelta)}/{lang === 'th' ? 'ปี' : 'yr'}</span>
                    </div>

                    {/* Column 2: ต่อเดือน */}
                    <div
                      className={`flex items-center justify-center gap-1.5 whitespace-nowrap py-0.5 ${
                        delta.takeHomeMonthlyDelta > 0
                          ? 'text-emerald-400'
                          : delta.takeHomeMonthlyDelta < 0
                          ? 'text-rose-400'
                          : 'text-emerald-300/80'
                      }`}
                    >
                      {delta.takeHomeMonthlyDelta > 0 && <TrendingUp className="w-3.5 h-3.5 shrink-0" />}
                      {delta.takeHomeMonthlyDelta < 0 && <TrendingDown className="w-3.5 h-3.5 shrink-0" />}
                      <span>{formatDeltaTHB(delta.takeHomeMonthlyDelta)}/{lang === 'th' ? 'ด.' : 'mo'}</span>
                    </div>
                  </div>
                ) : (
                  /* Baseline slot - Lean text without box frame */
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono text-emerald-300/90 tabular-nums">
                    {/* Column 1: Salary */}
                    <div className="flex items-center justify-center gap-1.5 whitespace-nowrap py-0.5">
                      <Briefcase className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      <span className="font-semibold">{lang === 'th' ? 'เงินเดือน' : 'Salary'} {formatTHB(result.monthlySalary)}/{lang === 'th' ? 'ด.' : 'mo'}</span>
                    </div>

                    {/* Column 2: PVD */}
                    <div className="flex items-center justify-center gap-1.5 whitespace-nowrap py-0.5">
                      <PiggyBank className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      <span className="font-semibold">
                        {result.pvdRatePercent > 0
                          ? `${lang === 'th' ? 'PVD พนักงาน' : 'Emp PVD'} ${result.pvdRatePercent}% (-${formatTHB(result.monthlyPVD)})`
                          : (lang === 'th' ? 'ไม่มี PVD' : 'No PVD')}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tax to Pay Metric */}
              <div className="mt-3.5 pt-3 border-t border-emerald-900/70 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-950/80 border border-rose-800/70 flex items-center justify-center text-rose-300 shrink-0">
                      <Receipt className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-wider font-bold text-emerald-200 leading-tight">
                        {lang === 'th' ? 'ภาษีที่ต้องชำระ' : 'TAX TO PAY'}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-300/80 leading-tight">
                        {lang === 'th' ? '(TAX TO PAY)' : ''}
                      </span>
                    </div>
                  </div>

                  {!isBaseline ? (
                    <div className="text-right font-mono shrink-0">
                      <span
                        className={`font-semibold tabular-nums text-xs px-2.5 py-1 rounded-md border inline-flex items-center gap-1 ${
                          taxDeltaVal > 0
                            ? 'bg-rose-950/90 text-rose-300 border-rose-700/80 font-bold'
                            : taxDeltaVal < 0
                            ? 'bg-emerald-900/90 text-emerald-300 border-emerald-600/70 font-bold'
                            : 'bg-emerald-900/60 text-emerald-200 border-emerald-700/50'
                        }`}
                      >
                        {formatDeltaTHB(taxDeltaVal)} ({lang === 'th' ? 'ภาษีต่าง' : 'Tax Diff'})
                      </span>
                    </div>
                  ) : (
                    <div className="text-right font-mono shrink-0">
                      <span className="text-emerald-300 font-semibold text-xs tabular-nums">
                        {result.effectiveTaxRate.toFixed(2)}% {lang === 'th' ? 'อัตราจริง' : 'effective'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Dual prominent display: ต่อปี and ต่อเดือน */}
                <div className="space-y-2 pt-0.5">
                  {/* ต่อปี */}
                  <div className="p-3 rounded-lg border border-emerald-800/80 bg-emerald-950/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="text-xs font-semibold text-emerald-200 font-sans">
                        {lang === 'th' ? 'ภาษีที่ต้องชำระ' : 'Tax to Pay'}
                      </span>
                      <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-semibold shrink-0">
                        {lang === 'th' ? 'ต่อปี' : 'Yearly'}
                      </span>
                    </div>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-white tabular-nums shrink-0">
                      {formatTHB(result.annualTax)}
                    </div>
                  </div>

                  {/* ต่อเดือน */}
                  <div className="p-3 rounded-lg border border-rose-900/80 bg-rose-950/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="text-xs font-semibold text-rose-200 font-sans">
                        {lang === 'th' ? 'ภาษีที่ต้องชำระ' : 'Tax to Pay'}
                      </span>
                      <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-rose-900/80 text-rose-300 border border-rose-800/60 font-semibold shrink-0">
                        {lang === 'th' ? 'ต่อเดือน' : 'Monthly'}
                      </span>
                    </div>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-rose-300 tabular-nums shrink-0">
                      {formatTHB(result.monthlyWithholdingTax)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Active selection banner */}
              {isSelected ? (
                <div className="mt-3 pt-2.5 border-t border-emerald-900/80 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{lang === 'th' ? 'กำลังแสดงรายละเอียดด้านล่าง' : 'Active for Details Below'}</span>
                </div>
              ) : (
                <div className="mt-3 pt-2.5 border-t border-emerald-900/60 flex items-center justify-center text-[11px] text-emerald-300/60 hover:text-emerald-200">
                  <span>{lang === 'th' ? 'คลิกเพื่อดูรายละเอียดภาษี' : 'Click to view tax details'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Optional inlined sections if explicitly requested */}
      {showDistributionAndMatrix && (
        <>
          <ScenarioIncomeDistribution
            scenarios={scenarios}
            results={results}
            activeScenarioId={activeScenarioId}
            onSelectScenario={onSelectScenario}
            lang={lang}
            viewMode={viewMode}
          />
          <ScenarioComparisonTable
            scenarios={scenarios}
            results={results}
            lang={lang}
            viewMode={viewMode}
          />
        </>
      )}
    </div>
  );
};
