import React from 'react';
import { TaxBracket, formatTHB } from '../utils/taxCalculator';
import { TRANSLATIONS, Language } from '../utils/translations';
import { HelpCircle } from 'lucide-react';

interface TaxBracketTableProps {
  brackets: TaxBracket[];
  netTaxableIncome: number;
  lang: Language;
}

export const TaxBracketTable: React.FC<TaxBracketTableProps> = ({
  brackets,
  netTaxableIncome,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            {t.taxBracketTitle}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'th'
              ? `เงินได้สุทธิของคุณ: ${formatTHB(netTaxableIncome)}`
              : `Your Net Taxable Income: ${formatTHB(netTaxableIncome)}`}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-5 sm:mx-0">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/75">
              <th className="py-2.5 px-3 font-semibold">{t.bracketColTier}</th>
              <th className="py-2.5 px-3 font-semibold text-center">{t.bracketColRate}</th>
              <th className="py-2.5 px-3 font-semibold text-right">{t.bracketColTaxable}</th>
              <th className="py-2.5 px-3 font-semibold text-right">{t.bracketColTax}</th>
              <th className="py-2.5 px-3 font-semibold text-right">{t.bracketColCumulative}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {brackets.map((tier, idx) => {
              const rangeLabel =
                tier.max === null
                  ? `${formatTHB(tier.min + 1)} ${lang === 'th' ? 'ขึ้นไป' : 'and above'}`
                  : `${formatTHB(tier.min === 0 ? 0 : tier.min + 1)} - ${formatTHB(tier.max)}`;

              const isZeroRate = tier.rate === 0;

              return (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    tier.isCurrentTier
                      ? 'bg-emerald-50/90 font-medium'
                      : tier.isPassed
                      ? 'bg-slate-50/40 text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {/* Range + Badge */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono tabular-nums text-slate-900">
                        {rangeLabel}
                      </span>
                      {tier.isCurrentTier && (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded-sm">
                          {t.currentTierBadge}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Rate */}
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span
                      className={`font-mono font-semibold ${
                        isZeroRate
                          ? 'text-emerald-700'
                          : tier.isCurrentTier
                          ? 'text-emerald-800 font-bold'
                          : 'text-slate-700'
                      }`}
                    >
                      {tier.rateLabel}
                    </span>
                  </td>

                  {/* Taxable in tier */}
                  <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono tabular-nums">
                    {tier.taxableInBracket > 0 ? (
                      <span className="text-slate-900 font-semibold">
                        {formatTHB(tier.taxableInBracket)}
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>

                  {/* Tax in tier */}
                  <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono tabular-nums">
                    {tier.taxInBracket > 0 ? (
                      <span className="text-rose-600 font-semibold">
                        {formatTHB(tier.taxInBracket)}
                      </span>
                    ) : isZeroRate && tier.taxableInBracket > 0 ? (
                      <span className="text-emerald-600 font-medium">฿0 ({lang === 'th' ? 'ยกเว้น' : 'exempt'})</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>

                  {/* Cumulative */}
                  <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono tabular-nums text-slate-700">
                    {tier.taxableInBracket > 0 ? formatTHB(tier.cumulativeTax) : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
