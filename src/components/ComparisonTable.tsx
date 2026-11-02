import React from 'react';
import { TaxCalculationResult, formatTHB } from '../utils/taxCalculator';
import { TRANSLATIONS, Language } from '../utils/translations';
import { Table, Check, AlertCircle } from 'lucide-react';

interface ComparisonTableProps {
  result: TaxCalculationResult;
  lang: Language;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  result,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  const rows = [
    {
      label: lang === 'th' ? '1. เงินได้พึงประเมินรวม (Gross Income)' : '1. Gross Income (Salary + Bonus)',
      subtext: lang === 'th' ? 'ฐานเงินได้ทั้งหมดก่อนหัก' : 'Total income before any deductions',
      yearly: formatTHB(result.annualGrossIncome),
      monthly: formatTHB(result.monthlyAverageGross),
      highlight: false,
      color: 'text-slate-900',
    },
    {
      label: lang === 'th' ? '2. เงินสมทบประกันสังคม (SSF 5%)' : '2. Social Security Fund (SSF 5%)',
      subtext: lang === 'th' ? 'หักออกจากเงินเดือนจริง (สูงสุด 750 บ./ด.)' : 'Deducted from paycheck (Max 750 THB/mo)',
      yearly: `-${formatTHB(result.annualSocialSecurity)}`,
      monthly: `-${formatTHB(result.monthlySocialSecurity)}`,
      highlight: false,
      color: 'text-amber-700',
    },
    {
      label: lang === 'th' ? `3. กองทุนสำรองเลี้ยงชีพ (PVD ${result.pvdRatePercent}%)` : `3. Provident Fund (PVD ${result.pvdRatePercent}%)`,
      subtext: lang === 'th' ? 'หักสะสมเข้ากองทุนจริง (ลดหย่อนภาษีได้)' : 'Deducted into your fund (Tax deductible)',
      yearly: `-${formatTHB(result.annualPVD)}`,
      monthly: `-${formatTHB(result.monthlyPVD)}`,
      highlight: false,
      color: 'text-sky-700',
    },
    {
      label: lang === 'th' ? '4. ภาษีเงินได้บุคคลธรรมดา (PIT)' : '4. Personal Income Tax (PIT)',
      subtext: lang === 'th' ? 'ภาษีที่ต้องจ่ายตามอัตราก้าวหน้า' : 'Calculated tax liability / withholding',
      yearly: `-${formatTHB(result.annualTax)}`,
      monthly: `-${formatTHB(result.monthlyWithholdingTax)}`,
      highlight: true,
      color: 'text-rose-600',
    },
    {
      label: lang === 'th' ? '★ เงินได้สุทธิรับจริง (Net Take-Home Pay)' : '★ Net Take-Home Pay (Bank Deposit)',
      subtext: lang === 'th' ? 'ยอดเงินที่เข้าบัญชีธนาคารสุทธิ' : 'Actual cash deposited into employee bank account',
      yearly: formatTHB(result.annualNetTakeHome),
      monthly: formatTHB(result.monthlyNetTakeHome),
      highlight: true,
      isGrandTotal: true,
      color: 'text-emerald-700 font-extrabold',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Table className="w-4 h-4 text-slate-600" />
            <span>{t.comparisonTitle}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'th'
              ? 'สรุปยอดเงินเดือนสุทธิและภาษี ทั้งแบบรายปีและแบบเฉลี่ยรายเดือน'
              : 'Summary of take-home pay and tax payable in both annual and monthly view'}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-5 sm:mx-0">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/75">
              <th className="py-2.5 px-3 font-semibold">{t.itemCol}</th>
              <th className="py-2.5 px-3 font-semibold text-right font-mono">{t.yearlyCol}</th>
              <th className="py-2.5 px-3 font-semibold text-right font-mono">{t.monthlyCol}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={`transition-colors ${
                  row.isGrandTotal
                    ? 'bg-emerald-50/90 font-bold text-sm'
                    : row.highlight
                    ? 'bg-rose-50/40'
                    : 'hover:bg-slate-50/50'
                }`}
              >
                <td className="py-3 px-3">
                  <span className={`block ${row.color}`}>{row.label}</span>
                  <span className="text-[11px] text-slate-400 block font-normal">
                    {row.subtext}
                  </span>
                </td>
                <td className={`py-3 px-3 text-right font-mono tabular-nums whitespace-nowrap ${row.color}`}>
                  {row.yearly}
                </td>
                <td className={`py-3 px-3 text-right font-mono tabular-nums whitespace-nowrap ${row.color}`}>
                  {row.monthly}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-[11px] text-slate-500 leading-relaxed">
        <p className="flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>{t.diffExpenseNotice}</span>
        </p>
      </div>
    </div>
  );
};
