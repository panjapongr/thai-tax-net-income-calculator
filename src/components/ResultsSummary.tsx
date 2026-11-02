import React from 'react';
import { TaxCalculationResult, formatTHB, formatNumber } from '../utils/taxCalculator';
import { TRANSLATIONS, Language } from '../utils/translations';
import { Wallet, Receipt, TrendingUp, Percent, ArrowDownRight } from 'lucide-react';
import { IncomeDistributionCard } from './IncomeDistributionCard';

interface ResultsSummaryProps {
  result: TaxCalculationResult;
  lang: Language;
  activeView: 'yearly' | 'monthly' | 'compare';
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  result,
  lang,
  activeView,
}) => {
  const t = TRANSLATIONS[lang];

  // Proportion of Gross Income
  const gross = result.annualGrossIncome || 1;
  const takeHomePct = Math.max(0, (result.annualNetTakeHome / gross) * 100);
  const taxPct = Math.max(0, (result.annualTax / gross) * 100);
  const pvdPct = Math.max(0, (result.annualPVD / gross) * 100);
  const ssfPct = Math.max(0, (result.annualSocialSecurity / gross) * 100);

  const isMonthly = activeView === 'monthly';

  return (
    <div className="space-y-6">
      {/* 2 Key Result Cards: Net Take-Home & Tax Pay (Highlighting requested yearly view) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Net Income (Take-Home Pay) */}
        <div className="bg-emerald-950 text-white rounded-xl p-5 sm:p-6 shadow-sm border border-emerald-900 relative overflow-hidden">
          <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-200">
                  <Wallet className="w-4 h-4" />
                </div>
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300">
                  {t.netTakeHome}
                </span>
              </div>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-sm bg-emerald-900 text-emerald-200 border border-emerald-700/60 tabular-nums">
                {takeHomePct.toFixed(1)}% {lang === 'th' ? 'ของรายได้' : 'of gross'}
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Row 1: ต่อปี (Annual Net Take-Home) */}
              <div
                className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                  !isMonthly
                    ? 'bg-emerald-900/90 border-emerald-400/80 shadow-xs ring-1 ring-emerald-400/30'
                    : 'bg-emerald-900/50 border-emerald-800/60'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-emerald-200 font-sans">
                      {lang === 'th' ? 'สุทธิรับจริง' : 'Net Take-Home'}
                    </span>
                    <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-emerald-800 text-emerald-200 border border-emerald-700/60 shrink-0">
                      {lang === 'th' ? 'ต่อปี' : 'Yearly'}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-300/70 block mt-0.5">
                    {lang === 'th' ? 'รายได้หลังหักภาษีและเงินสมทบ' : 'After tax & deductions'}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                    {formatTHB(result.annualNetTakeHome)}
                  </div>
                </div>
              </div>

              {/* Row 2: ต่อเดือน (Monthly Net Take-Home) */}
              <div
                className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                  isMonthly
                    ? 'bg-emerald-900/90 border-emerald-400/80 shadow-xs ring-1 ring-emerald-400/30'
                    : 'bg-emerald-900/60 border-emerald-700/60'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-emerald-100 font-sans">
                      {lang === 'th' ? 'สุทธิรับจริง' : 'Net Take-Home'}
                    </span>
                    <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-emerald-800/90 text-emerald-300 border border-emerald-600/60 shrink-0">
                      {lang === 'th' ? 'ต่อเดือน' : 'Monthly'}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-300/70 block mt-0.5">
                    {lang === 'th' ? 'เงินเข้าบัญชีเฉลี่ยต่อเดือน' : 'Avg. monthly take-home'}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg sm:text-xl font-extrabold font-mono tracking-tight text-emerald-200 tabular-nums">
                    {formatTHB(result.monthlyNetTakeHome)}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-emerald-300/70 border-t border-emerald-800/80 pt-2 leading-relaxed">
              {t.netTakeHomeDesc}
            </p>
          </div>
        </div>

        {/* Card 2: Tax Pay (Personal Income Tax) */}
        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-xs border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                <Receipt className="w-4 h-4" />
              </div>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-700">
                {t.taxPayable}
              </span>
            </div>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200 tabular-nums">
              {result.effectiveTaxRate.toFixed(2)}% {lang === 'th' ? 'อัตราจริง' : 'effective'}
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Row 1: ต่อปี (Annual Tax Due) */}
            <div
              className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                !isMonthly
                  ? 'bg-rose-50/90 border-rose-300/90 shadow-xs ring-1 ring-rose-400/30'
                  : 'bg-slate-50/80 border-slate-200/80'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-slate-800 font-sans">
                    {lang === 'th' ? 'ภาษีที่ต้องชำระ' : 'Tax to Pay'}
                  </span>
                  <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 font-medium shrink-0">
                    {lang === 'th' ? 'ต่อปี' : 'Yearly'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {lang === 'th' ? 'ภาษีเงินได้บุคคลธรรมดาทั้งปี (PIT)' : 'Full-year Personal Income Tax'}
                </span>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-slate-900 tabular-nums">
                  {formatTHB(result.annualTax)}
                </div>
              </div>
            </div>

            {/* Row 2: ต่อเดือน (Monthly Tax / Withholding) */}
            <div
              className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                isMonthly
                  ? 'bg-rose-50/90 border-rose-300/90 shadow-xs ring-1 ring-rose-400/30'
                  : 'bg-white border-slate-200/90 shadow-xs'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-slate-700 font-sans">
                    {lang === 'th' ? 'ภาษีที่ต้องชำระ' : 'Tax to Pay'}
                  </span>
                  <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                    {lang === 'th' ? 'ต่อเดือน' : 'Monthly'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {lang === 'th' ? 'ภาษีหัก ณ ที่จ่ายเฉลี่ยรายเดือน' : 'Avg. monthly withholding tax'}
                </span>
              </div>
              <div className="text-lg sm:text-xl font-extrabold font-mono tracking-tight text-rose-600 tabular-nums">
                {formatTHB(result.monthlyWithholdingTax)}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-2 leading-relaxed">
            {result.annualTax === 0
              ? (lang === 'th' ? 'ได้รับการยกเว้นภาษี (เงินได้สุทธิไม่เกิน 150,000 บาท)' : 'Tax exempt: Net taxable income is within 150,000 THB bracket.')
              : `${lang === 'th' ? 'ฐานภาษีสูงสุดของคุณอยู่ที่' : 'Your highest marginal bracket is'} ${result.marginalTaxRate}%`}
          </p>
        </div>
      </div>

      {/* Secondary Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Gross Income */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] text-slate-500 block">
            {t.grossAnnualIncome}
          </span>
          <span className="text-sm sm:text-base font-bold text-slate-900 font-mono tabular-nums mt-0.5 block">
            {formatTHB(result.annualGrossIncome)}
          </span>
          <span className="text-[10px] text-slate-400 font-mono tabular-nums">
            {formatTHB(result.monthlyAverageGross)}/{lang === 'th' ? 'เดือน' : 'mo'}
          </span>
        </div>

        {/* Total Deductions */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] text-slate-500 block">
            {t.totalDeductions}
          </span>
          <span className="text-sm sm:text-base font-bold text-emerald-700 font-mono tabular-nums mt-0.5 block">
            -{formatTHB(result.totalTaxDeductions)}
          </span>
          <span className="text-[10px] text-slate-400">
            {lang === 'th' ? 'ลดหย่อน & ค่าใช้จ่าย' : 'Statutory & PVD'}
          </span>
        </div>

        {/* Net Taxable Income */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] text-slate-500 block">
            {t.netTaxableIncome}
          </span>
          <span className="text-sm sm:text-base font-bold text-slate-900 font-mono tabular-nums mt-0.5 block">
            {formatTHB(result.netTaxableIncome)}
          </span>
          <span className="text-[10px] text-slate-400">
            {lang === 'th' ? 'ฐานคิดภาษี' : 'Tax Base'}
          </span>
        </div>

        {/* Marginal Tax Bracket */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] text-slate-500 block">
            {t.marginalRate}
          </span>
          <span className="text-sm sm:text-base font-bold text-slate-900 font-mono tabular-nums mt-0.5 block">
            {result.marginalTaxRate}%
          </span>
          <span className="text-[10px] text-slate-400 font-mono tabular-nums">
            {lang === 'th' ? 'อัตราภาษีจริง' : 'Effective'}: {result.effectiveTaxRate.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Visual Paycheck Distribution Bar */}
      <IncomeDistributionCard
        result={result}
        lang={lang}
        isYearly={!isMonthly}
      />
    </div>
  );
};
