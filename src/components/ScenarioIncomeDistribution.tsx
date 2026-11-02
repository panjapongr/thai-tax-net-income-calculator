import React from 'react';
import { SalaryScenario, TaxCalculationResult } from '../utils/taxCalculator';
import { TRANSLATIONS, Language } from '../utils/translations';
import { Layers } from 'lucide-react';
import { IncomeDistributionCard } from './IncomeDistributionCard';

export interface ScenarioIncomeDistributionProps {
  scenarios: SalaryScenario[];
  results: { scenario: SalaryScenario; result: TaxCalculationResult }[];
  activeScenarioId: string;
  onSelectScenario: (id: string) => void;
  lang: Language;
  viewMode: 'yearly' | 'monthly';
}

export const ScenarioIncomeDistribution: React.FC<ScenarioIncomeDistributionProps> = ({
  scenarios,
  results,
  activeScenarioId,
  onSelectScenario,
  lang,
  viewMode,
}) => {
  const t = TRANSLATIONS[lang];
  const isYearly = viewMode === 'yearly';

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
          <h4 className="text-sm font-bold text-slate-900 tracking-tight">
            {lang === 'th'
              ? `สัดส่วนการจัดสรรเงินได้พึงประเมินของแต่ละ Salary (${t.paycheckBreakdown})`
              : `Income Distribution across all ${scenarios.length} Salaries`}
          </h4>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {isYearly
            ? (lang === 'th' ? 'มุมมองรายปี' : 'Yearly View')
            : (lang === 'th' ? 'มุมมองรายเดือน' : 'Monthly View')}
        </span>
      </div>

      {/* Responsive Grid across both sides: expands across both columns */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          scenarios.length === 3
            ? 'lg:grid-cols-3'
            : scenarios.length >= 4
            ? 'lg:grid-cols-4'
            : 'lg:grid-cols-2'
        } gap-4`}
      >
        {results.map(({ scenario, result }, index) => (
          <IncomeDistributionCard
            key={scenario.id}
            result={result}
            lang={lang}
            badgeNumber={index + 1}
            title={scenario.name || `Salary ${index + 1}`}
            isYearly={isYearly}
            isSelected={scenario.id === activeScenarioId}
            onClick={() => onSelectScenario(scenario.id)}
          />
        ))}
      </div>
    </div>
  );
};
