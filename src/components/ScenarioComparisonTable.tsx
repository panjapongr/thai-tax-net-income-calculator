import React from 'react';
import {
  SalaryScenario,
  TaxCalculationResult,
  calculateScenarioDelta,
  formatTHB,
  formatDeltaTHB,
} from '../utils/taxCalculator';
import { TRANSLATIONS, Language } from '../utils/translations';

export interface ScenarioComparisonTableProps {
  scenarios: SalaryScenario[];
  results: { scenario: SalaryScenario; result: TaxCalculationResult }[];
  lang: Language;
  viewMode: 'yearly' | 'monthly';
}

export const ScenarioComparisonTable: React.FC<ScenarioComparisonTableProps> = ({
  scenarios,
  results,
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
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 w-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>
            {lang === 'th'
              ? `ตารางเปรียบเทียบผลต่าง (${isYearly ? 'ยอดรวมรายปี' : 'เฉลี่ยรายเดือน'})`
              : `Key Results Difference Matrix (${isYearly ? 'Annual Total' : 'Monthly Average'})`}
          </span>
        </h4>
        <span className="text-xs text-slate-500 font-mono">
          {lang === 'th' ? 'เทียบกับ Salary 1' : 'vs Salary 1'}
        </span>
      </div>

      <div className="overflow-x-auto -mx-5 sm:mx-0">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/75">
              <th className="py-2.5 px-3 font-semibold min-w-[170px]">{t.itemCol}</th>
              {comparedList.map(({ scenario, isBaseline, index }) => (
                <th
                  key={scenario.id}
                  className={`py-2.5 px-3 text-right font-semibold whitespace-nowrap min-w-[140px] ${
                    isBaseline ? 'bg-slate-100/60 font-bold text-slate-900' : ''
                  }`}
                >
                  <div className="flex flex-col items-end">
                    <span>{scenario.name || `Salary ${index + 1}`}</span>
                    {isBaseline && (
                      <span className="text-[10px] text-slate-500 font-normal">
                        ({lang === 'th' ? 'ฐานอ้างอิง' : 'Baseline'})
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
            {/* Row: Salary / Gross Income */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-2.5 px-3 font-sans font-medium text-slate-700">
                {isYearly ? t.grossAnnualIncome : t.monthlySalary}
              </td>
              {comparedList.map(({ result, delta, isBaseline, scenario }) => {
                const val = isYearly ? result.annualGrossIncome : result.monthlySalary;
                const deltaVal = isYearly ? delta.grossDelta : delta.grossDelta / 12;

                return (
                  <td key={scenario.id} className="py-2.5 px-3 text-right">
                    <span className="font-semibold text-slate-900 block">
                      {formatTHB(val)}
                    </span>
                    {!isBaseline && deltaVal !== 0 && (
                      <span className="text-[10px] text-slate-500 block">
                        {formatDeltaTHB(deltaVal)}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Row: Provident Fund */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-2.5 px-3 font-sans font-medium text-slate-700">
                {t.pvdTitle}
              </td>
              {comparedList.map(({ result, scenario }) => (
                <td key={scenario.id} className="py-2.5 px-3 text-right text-sky-700">
                  <span>{result.pvdRatePercent}%</span>
                  <span className="text-[10px] text-slate-500 block">
                    -{formatTHB(isYearly ? result.annualPVD : result.monthlyPVD)}
                  </span>
                </td>
              ))}
            </tr>

            {/* Row: Social Security */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-2.5 px-3 font-sans font-medium text-slate-700">
                {t.socialSecurity}
              </td>
              {comparedList.map(({ result, scenario }) => (
                <td key={scenario.id} className="py-2.5 px-3 text-right text-amber-700">
                  <span>-{formatTHB(isYearly ? result.annualSocialSecurity : result.monthlySocialSecurity)}</span>
                </td>
              ))}
            </tr>

            {/* Row: Tax Payable Per Month (หัก ณ ที่จ่ายเฉลี่ยต่อเดือน) */}
            <tr className="bg-rose-50/20 hover:bg-rose-50/40">
              <td className="py-2.5 px-3 font-sans font-bold text-rose-950">
                {lang === 'th' ? 'ภาษีที่ต้องชำระต่อเดือน' : 'Tax Payable / Month'}
              </td>
              {comparedList.map(({ result, delta, isBaseline, scenario }) => {
                const val = result.monthlyWithholdingTax;
                const deltaVal = delta.taxMonthlyDelta;

                return (
                  <td key={scenario.id} className="py-2.5 px-3 text-right">
                    <span className="font-bold text-rose-600 block">
                      {formatTHB(val)}
                    </span>
                    {!isBaseline && deltaVal !== 0 && (
                      <span
                        className={`text-[10px] font-semibold block ${
                          deltaVal > 0 ? 'text-rose-700' : 'text-emerald-700'
                        }`}
                      >
                        {formatDeltaTHB(deltaVal)}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Row: Tax Payable Per Year (ภาษีทั้งปี) */}
            <tr className="bg-rose-50/40 hover:bg-rose-50/60">
              <td className="py-2.5 px-3 font-sans font-medium text-rose-900 text-xs">
                {lang === 'th' ? 'ภาษีที่ต้องชำระทั้งปี (PIT)' : 'Annual Tax Payable'}
              </td>
              {comparedList.map(({ result, delta, isBaseline, scenario }) => {
                const val = result.annualTax;
                const deltaVal = delta.taxYearlyDelta;

                return (
                  <td key={scenario.id} className="py-2.5 px-3 text-right text-xs">
                    <span className="font-semibold text-rose-700 block">
                      {formatTHB(val)}
                    </span>
                    {!isBaseline && deltaVal !== 0 && (
                      <span
                        className={`text-[10px] font-semibold block ${
                          deltaVal > 0 ? 'text-rose-700' : 'text-emerald-700'
                        }`}
                      >
                        {formatDeltaTHB(deltaVal)}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Row: Effective Tax Rate */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-2.5 px-3 font-sans font-medium text-slate-700">
                {t.effectiveTaxRate}
              </td>
              {comparedList.map(({ result, delta, isBaseline, scenario }) => (
                <td key={scenario.id} className="py-2.5 px-3 text-right">
                  <span className="text-slate-900 font-semibold">
                    {result.effectiveTaxRate.toFixed(2)}%
                  </span>
                  {!isBaseline && delta.effectiveRateDelta !== 0 && (
                    <span className="text-[10px] text-slate-500 block">
                      {delta.effectiveRateDelta > 0 ? '+' : ''}
                      {delta.effectiveRateDelta.toFixed(2)}%
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Grand Total Row 1: Net Take-Home Per Month */}
            <tr className="bg-emerald-50/90 font-bold border-t-2 border-emerald-400">
              <td className="py-2.5 px-3 font-sans font-extrabold text-emerald-950 text-sm">
                ★ {lang === 'th' ? 'เงินได้สุทธิรับจริงต่อเดือน' : 'Net Take-Home / Month'}
              </td>
              {comparedList.map(({ result, delta, isBaseline, scenario }) => {
                const val = result.monthlyNetTakeHome;
                const deltaVal = delta.takeHomeMonthlyDelta;
                const isMore = deltaVal > 0;
                const isLess = deltaVal < 0;

                return (
                  <td key={scenario.id} className="py-2.5 px-3 text-right">
                    <span className="font-extrabold text-emerald-950 text-sm block">
                      {formatTHB(val)}
                    </span>
                    {!isBaseline && (
                      <span
                        className={`text-xs font-bold block ${
                          isMore
                            ? 'text-emerald-700'
                            : isLess
                            ? 'text-rose-700'
                            : 'text-slate-600'
                        }`}
                      >
                        {formatDeltaTHB(deltaVal)}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Grand Total Row 2: Net Take-Home Per Year */}
            <tr className="bg-emerald-100/70 font-bold border-t border-emerald-200">
              <td className="py-2.5 px-3 font-sans font-bold text-emerald-900 text-xs">
                {lang === 'th' ? 'เงินได้สุทธิรับจริงทั้งปี' : 'Annual Net Take-Home'}
              </td>
              {comparedList.map(({ result, delta, isBaseline, scenario }) => {
                const val = result.annualNetTakeHome;
                const deltaVal = delta.takeHomeYearlyDelta;
                const isMore = deltaVal > 0;
                const isLess = deltaVal < 0;

                return (
                  <td key={scenario.id} className="py-2.5 px-3 text-right text-xs">
                    <span className="font-bold text-emerald-900 block">
                      {formatTHB(val)}
                    </span>
                    {!isBaseline && (
                      <span
                        className={`text-[11px] font-bold block ${
                          isMore
                            ? 'text-emerald-700'
                            : isLess
                            ? 'text-rose-700'
                            : 'text-slate-600'
                        }`}
                      >
                        {formatDeltaTHB(deltaVal)}
                        <span className="text-[10px] opacity-80 ml-1">
                          ({delta.takeHomeYearlyDeltaPercent > 0 ? '+' : ''}
                          {delta.takeHomeYearlyDeltaPercent.toFixed(1)}%)
                        </span>
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Section Divider: Separate Section for Company PVD Benefit */}
            <tr className="bg-sky-50/70 border-t-2 border-sky-200">
              <td
                colSpan={comparedList.length + 1}
                className="py-2 px-3 font-sans font-bold text-sky-950 text-[11px] tracking-wide"
              >
                ★ {lang === 'th' ? 'แยกส่วนพิเศษ: เงินสมทบกองทุน PVD จากบริษัท (สิทธิประโยชน์เพิ่มเติม)' : 'Split Section: Company PVD Match (Additional Benefit)'}
              </td>
            </tr>

            {/* Row: Company PVD Rate % */}
            <tr className="bg-sky-50/20 hover:bg-sky-50/40">
              <td className="py-2.5 px-3 font-sans font-medium text-slate-700">
                {lang === 'th' ? 'อัตราเงินสมทบจากบริษัท' : 'Company Match Rate'}
              </td>
              {comparedList.map(({ result, scenario }) => (
                <td key={scenario.id} className="py-2.5 px-3 text-right text-sky-800 font-semibold">
                  <span>{result.employerPvdPercent}%</span>
                </td>
              ))}
            </tr>

            {/* Row: Company PVD Monthly Amount */}
            <tr className="bg-sky-50/30 hover:bg-sky-50/50">
              <td className="py-2.5 px-3 font-sans font-bold text-sky-950">
                {lang === 'th' ? 'บริษัทสมทบต่อเดือน' : 'Company Match / Month'}
              </td>
              {comparedList.map(({ result, delta, isBaseline, scenario }) => (
                <td key={scenario.id} className="py-2.5 px-3 text-right">
                  <span className="font-bold text-sky-800 block">
                    {formatTHB(result.monthlyEmployerPVD)}
                  </span>
                  {!isBaseline && delta.employerPvdMonthlyDelta !== 0 && (
                    <span
                      className={`text-[10px] font-semibold block ${
                        delta.employerPvdMonthlyDelta > 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {formatDeltaTHB(delta.employerPvdMonthlyDelta)}
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Row: Company PVD Yearly Amount */}
            <tr className="bg-sky-50/40 hover:bg-sky-50/60">
              <td className="py-2.5 px-3 font-sans font-bold text-sky-950">
                {lang === 'th' ? 'บริษัทสมทบทั้งปี' : 'Company Match / Year'}
              </td>
              {comparedList.map(({ result, delta, isBaseline, scenario }) => (
                <td key={scenario.id} className="py-2.5 px-3 text-right">
                  <span className="font-bold text-sky-800 block">
                    {formatTHB(result.annualEmployerPVD)}
                  </span>
                  {!isBaseline && delta.employerPvdYearlyDelta !== 0 && (
                    <span
                      className={`text-[10px] font-semibold block ${
                        delta.employerPvdYearlyDelta > 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {formatDeltaTHB(delta.employerPvdYearlyDelta)}
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Row: Total PVD Accumulation (Employee + Company) */}
            <tr className="bg-sky-100/40 hover:bg-sky-100/60 font-semibold">
              <td className="py-2.5 px-3 font-sans text-slate-900">
                {lang === 'th' ? 'รวมสะสม PVD ทั้งหมด (พนักงาน + บริษัท)' : 'Total PVD Fund (Employee + Company)'}
              </td>
              {comparedList.map(({ result, delta, isBaseline, scenario }) => {
                const totalVal = isYearly ? result.annualTotalPVD : result.monthlyTotalPVD;
                const totalDelta = isYearly ? delta.totalPvdYearlyDelta : delta.totalPvdMonthlyDelta;
                return (
                  <td key={scenario.id} className="py-2.5 px-3 text-right">
                    <span className="font-bold text-emerald-800 block">
                      {formatTHB(totalVal)}
                    </span>
                    {!isBaseline && totalDelta !== 0 && (
                      <span
                        className={`text-[10px] font-semibold block ${
                          totalDelta > 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {formatDeltaTHB(totalDelta)}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
