import React from 'react';
import {
  SalaryScenario,
  TaxCalculationResult,
  calculateScenarioDelta,
  formatTHB,
  formatDeltaTHB,
} from '../utils/taxCalculator';
import { TRANSLATIONS, Language } from '../utils/translations';
import { Briefcase, TrendingUp, TrendingDown, PiggyBank, Sparkles, Check, ArrowRight } from 'lucide-react';

export interface EmployerPvdComparisonSectionProps {
  scenarios: SalaryScenario[];
  results: { scenario: SalaryScenario; result: TaxCalculationResult }[];
  activeScenarioId: string;
  onSelectScenario: (id: string) => void;
  lang: Language;
  viewMode: 'yearly' | 'monthly';
}

export const EmployerPvdComparisonSection: React.FC<EmployerPvdComparisonSectionProps> = ({
  scenarios,
  results,
  activeScenarioId,
  onSelectScenario,
  lang,
  viewMode,
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
    <div className="bg-white border border-sky-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sky-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 shadow-xs">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                {t.companyPvdComparisonTitle}
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                <Sparkles className="w-3 h-3 text-sky-600" />
                {lang === 'th' ? 'แยกส่วนพิเศษ · ไม่รวมในสรุปภาษีเดิม' : 'Split Section · Additional Benefit'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {t.companyPvdComparisonSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Scenarios Comparison Cards */}
      <div
        className={`grid gap-4 items-stretch ${
          scenarios.length === 1
            ? 'grid-cols-1 max-w-xl'
            : scenarios.length === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {comparedList.map(({ scenario, result, isBaseline, delta, index }) => {
          const isSelected = scenario.id === activeScenarioId;
          const monthlyCompanyAmt = result.monthlyEmployerPVD;
          const annualCompanyAmt = result.annualEmployerPVD;
          const companyRate = result.employerPvdPercent;

          const monthlyCompanyDelta = delta.employerPvdMonthlyDelta;
          const annualCompanyDelta = delta.employerPvdYearlyDelta;

          return (
            <div
              key={scenario.id}
              onClick={() => onSelectScenario(scenario.id)}
              className={`rounded-xl p-4 sm:p-5 transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 text-white border-2 border-sky-400 ring-4 ring-sky-400/20 shadow-md'
                  : 'bg-slate-900 text-white border border-slate-800 hover:border-sky-500/80 shadow-xs'
              }`}
            >
              {/* Card Top / Title */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                    <span className="font-bold text-sm text-white truncate">
                      {scenario.name || `Salary ${index + 1}`}
                    </span>
                    {isBaseline && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-800 text-sky-300 rounded border border-slate-700">
                        {lang === 'th' ? 'ฐานอ้างอิง' : 'Baseline'}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                      <Check className="w-3 h-3" />
                      <span>{lang === 'th' ? 'เลือกอยู่' : 'Active'}</span>
                    </span>
                  )}
                </div>

                {/* Company PVD Contribution % Badge */}
                <div className="mt-3.5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {t.employerPvdRate}
                  </span>
                  <span className="px-2.5 py-1 text-xs sm:text-sm font-extrabold text-sky-300 bg-sky-950 border border-sky-800/80 rounded-md font-mono">
                    {companyRate}%
                  </span>
                </div>

                {/* Total amount per month & per year (Primary Focus) */}
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {/* Monthly Company Amount */}
                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80">
                    <span className="text-[11px] text-slate-400 block font-medium">
                      {t.employerPvdMonthlyAmount}
                    </span>
                    <span className="text-base sm:text-lg font-black text-sky-400 font-mono tabular-nums block mt-0.5">
                      {formatTHB(monthlyCompanyAmt)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans block">
                      {lang === 'th' ? 'ต่อเดือน' : '/ month'}
                    </span>

                    {/* Delta vs baseline if not baseline */}
                    {!isBaseline && monthlyCompanyDelta !== 0 && (
                      <div className="mt-1.5 pt-1.5 border-t border-slate-700/60 flex items-center gap-1">
                        {monthlyCompanyDelta > 0 ? (
                          <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-rose-400 shrink-0" />
                        )}
                        <span
                          className={`text-[11px] font-bold font-mono ${
                            monthlyCompanyDelta > 0
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {formatDeltaTHB(monthlyCompanyDelta)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Annual Company Amount */}
                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80">
                    <span className="text-[11px] text-slate-400 block font-medium">
                      {t.employerPvdAnnualAmount}
                    </span>
                    <span className="text-base sm:text-lg font-black text-sky-300 font-mono tabular-nums block mt-0.5">
                      {formatTHB(annualCompanyAmt)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans block">
                      {lang === 'th' ? 'รวมทั้งปี' : '/ year'}
                    </span>

                    {/* Delta vs baseline if not baseline */}
                    {!isBaseline && annualCompanyDelta !== 0 && (
                      <div className="mt-1.5 pt-1.5 border-t border-slate-700/60 flex items-center gap-1">
                        {annualCompanyDelta > 0 ? (
                          <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-rose-400 shrink-0" />
                        )}
                        <span
                          className={`text-[11px] font-bold font-mono ${
                            annualCompanyDelta > 0
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {formatDeltaTHB(annualCompanyDelta)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Combined Total Retirement Accumulation (Employee + Company) */}
              <div className="mt-4 pt-3 border-t border-slate-800/90">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
                    <PiggyBank className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'th' ? 'รวมเข้ากองทุนทั้งหมด' : 'Total PVD Fund'}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ({lang === 'th'
                      ? `พนักงาน ${result.pvdRatePercent}% + บริษัท ${result.employerPvdPercent}%`
                      : `Emp ${result.pvdRatePercent}% + Co ${result.employerPvdPercent}%`})
                  </span>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">
                      {lang === 'th' ? 'สะสมรวมต่อเดือน' : 'Total / Month'}
                    </span>
                    <span className="font-extrabold text-emerald-400 font-mono tabular-nums">
                      {formatTHB(result.monthlyTotalPVD)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">
                      {lang === 'th' ? 'สะสมรวมต่อปี' : 'Total / Year'}
                    </span>
                    <span className="font-extrabold text-emerald-400 font-mono tabular-nums">
                      {formatTHB(result.annualTotalPVD)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Note & Transparency Disclaimer */}
      <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
          <span>
            {lang === 'th'
              ? 'หมายเหตุ: เงินสมทบจากบริษัทเข้าบัญชีกองทุนสำรองเลี้ยงชีพโดยตรง เป็นเงินออมระยะยาว ไม่ถูกหักออกจากเงินเดือนในสลิปของคุณ'
              : 'Note: Company contributions are deposited directly into your provident fund account as long-term savings and are not deducted from your monthly paycheck.'}
          </span>
        </div>
      </div>
    </div>
  );
};
