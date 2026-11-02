import React from 'react';
import { TaxCalculationResult, formatTHB } from '../utils/taxCalculator';
import { TRANSLATIONS, Language } from '../utils/translations';
import { Minus, Equal, ArrowDown, ChevronRight, CheckCircle2 } from 'lucide-react';

interface TaxCalculationBridgeProps {
  result: TaxCalculationResult;
  lang: Language;
}

export const TaxCalculationBridge: React.FC<TaxCalculationBridgeProps> = ({
  result,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>{t.stepByStepTitle}</span>
        </h3>
        <span className="text-xs text-slate-500 font-mono">
          {lang === 'th' ? 'ภ.ง.ด. 91' : 'PND 91'}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        {/* Step 1: Gross Income */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[11px]">
              1
            </span>
            <div>
              <span className="font-semibold text-slate-900 block">
                {t.stepGross}
              </span>
              <span className="text-[11px] text-slate-500">
                {lang === 'th' ? 'เงินเดือนทั้งปี' : 'Base salary'}: {formatTHB(result.annualSalary)}
                {result.bonusAmount > 0 && ` + ${lang === 'th' ? 'โบนัส' : 'bonus'}: ${formatTHB(result.bonusAmount)}`}
              </span>
            </div>
          </div>
          <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
            {formatTHB(result.annualGrossIncome)}
          </span>
        </div>

        {/* Deductions group */}
        <div className="pl-4 sm:pl-6 border-l-2 border-slate-200 ml-3 space-y-2 py-1">
          {/* Deduct 1: Standard Expense */}
          <div className="flex items-center justify-between text-slate-600 pr-2">
            <div className="flex items-center gap-1.5">
              <Minus className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{t.stepMinusExpenses}</span>
            </div>
            <span className="font-mono font-semibold text-rose-600 tabular-nums">
              -{formatTHB(result.standardExpenseDeduction)}
            </span>
          </div>

          {/* Deduct 2: Personal Allowance */}
          <div className="flex items-center justify-between text-slate-600 pr-2">
            <div className="flex items-center gap-1.5">
              <Minus className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{t.stepMinusPersonal}</span>
            </div>
            <span className="font-mono font-semibold text-rose-600 tabular-nums">
              -{formatTHB(result.personalAllowance)}
            </span>
          </div>

          {/* Deduct 3: SSF */}
          <div className="flex items-center justify-between text-slate-600 pr-2">
            <div className="flex items-center gap-1.5">
              <Minus className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{t.stepMinusSSF}</span>
            </div>
            <span className="font-mono font-semibold text-rose-600 tabular-nums">
              -{formatTHB(result.annualSocialSecurity)}
            </span>
          </div>

          {/* Deduct 4: PVD */}
          <div className="flex items-center justify-between text-slate-600 pr-2">
            <div className="flex items-center gap-1.5">
              <Minus className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>
                {t.stepMinusPVD} ({result.pvdRatePercent}%)
              </span>
            </div>
            <span className="font-mono font-semibold text-rose-600 tabular-nums">
              -{formatTHB(result.annualPVD)}
            </span>
          </div>
        </div>

        {/* Step 2: Net Taxable Income */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/70 border border-emerald-200">
          <div className="flex items-center gap-2">
            <Equal className="w-4 h-4 text-emerald-700" />
            <div>
              <span className="font-bold text-emerald-900 block">
                {t.stepEqualsTaxable}
              </span>
              <span className="text-[11px] text-emerald-700">
                {lang === 'th' ? 'นำยอดนี้ไปคำนวณตามขั้นบันไดอัตราก้าวหน้า' : 'Used as base for progressive tax brackets'}
              </span>
            </div>
          </div>
          <span className="font-mono font-extrabold text-emerald-950 text-sm tabular-nums">
            {formatTHB(result.netTaxableIncome)}
          </span>
        </div>

        {/* Step 3: Tax Calculation */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-rose-50/50 border border-rose-200/80">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center font-bold text-[11px]">
              3
            </span>
            <div>
              <span className="font-bold text-rose-950 block">
                {t.stepTotalTax}
              </span>
              <span className="text-[11px] text-rose-700">
                {result.annualTax > 0
                  ? `${lang === 'th' ? 'อัตราภาษีที่แท้จริง' : 'Effective rate'}: ${result.effectiveTaxRate.toFixed(2)}%`
                  : t.exempt}
              </span>
            </div>
          </div>
          <span className="font-mono font-extrabold text-rose-900 text-sm tabular-nums">
            {formatTHB(result.annualTax)}
          </span>
        </div>
      </div>
    </div>
  );
};
