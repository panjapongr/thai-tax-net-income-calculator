/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  calculateThaiTax,
  SalaryScenario,
  TaxCalculationInput,
  formatTHB,
} from './utils/taxCalculator';
import { TRANSLATIONS, Language } from './utils/translations';
import { Header, AppViewMode } from './components/Header';
import { SalaryInputPanel } from './components/SalaryInputPanel';
import { ResultsSummary } from './components/ResultsSummary';
import {
  ScenarioComparisonSection,
  ScenarioIncomeDistribution,
  ScenarioComparisonTable,
} from './components/ScenarioComparisonSection';
import { EmployerPvdComparisonSection } from './components/EmployerPvdComparisonSection';
import { TaxCalculationBridge } from './components/TaxCalculationBridge';
import { TaxBracketTable } from './components/TaxBracketTable';
import { ComparisonTable } from './components/ComparisonTable';
import { LegalExplanations } from './components/LegalExplanations';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { ConfirmResetModal } from './components/ConfirmResetModal';
import { RotateCcw, Save } from 'lucide-react';
import {
  sanitizeStoredData,
  sanitizeTextInput,
  safeCopyToClipboard,
  SECURITY_BOUNDS,
} from './utils/security';

const STORAGE_KEY = 'thai_tax_calculator_saved_data_v1';

interface StoredTaxData {
  scenarios: SalaryScenario[];
  activeScenarioId: string;
  lang?: Language;
  activeView?: AppViewMode;
  lastUpdated?: number;
}

export function syncScenarioNamesWithOrder(list: SalaryScenario[]): SalaryScenario[] {
  return list.map((sc, idx) => {
    const orderNum = idx + 1;
    const defaultPrefix = `Salary ${orderNum}`;

    if (!sc.name) {
      return { ...sc, name: defaultPrefix };
    }

    const trimmed = sc.name.trim();

    // Pure default like "Salary 1", "Salary 2", "salary 3", "Salary"
    if (/^Salary\s*\d*$/i.test(trimmed)) {
      return { ...sc, name: defaultPrefix };
    }

    // Has custom note in parentheses like "Salary 2 (Offer B)" or "Salary 1 (Company A)"
    const matchParentheses = trimmed.match(/^Salary\s*\d*\s*\((.+?)\)$/i);
    if (matchParentheses && matchParentheses[1]) {
      return { ...sc, name: `${defaultPrefix} (${matchParentheses[1].trim()})` };
    }

    // Has custom note with separator like "Salary 2: Offer B" or "Salary 2 - Offer B"
    const matchSeparator = trimmed.match(/^Salary\s*\d*\s*[:\-–—]\s*(.+)$/i);
    if (matchSeparator && matchSeparator[1]) {
      return { ...sc, name: `${defaultPrefix} (${matchSeparator[1].trim()})` };
    }

    // Starts with "Salary <number> <anything else>"
    const matchSpace = trimmed.match(/^Salary\s*\d+\s+(.+)$/i);
    if (matchSpace && matchSpace[1]) {
      return { ...sc, name: `${defaultPrefix} (${matchSpace[1].trim()})` };
    }

    // Custom label like "Offer B" or "Tech Lead"
    return { ...sc, name: `${defaultPrefix} (${trimmed})` };
  });
}

const INITIAL_SCENARIO: SalaryScenario = {
  id: 'scenario-1',
  name: 'Salary 1',
  input: {
    salaryMonthly: 50000,
    salaryYearly: 600000,
    inputMode: 'monthly',
    pvdRatePercent: 5,
    employerPvdPercent: 5,
    bonusMonths: 0,
    customBonusAmount: 0,
    includeBonus: false,
  },
};

function loadSavedData(): StoredTaxData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const sanitized = sanitizeStoredData(parsed, INITIAL_SCENARIO);
    if (sanitized) {
      return {
        ...sanitized,
        scenarios: syncScenarioNamesWithOrder(sanitized.scenarios),
      };
    }
  } catch (err) {
    console.warn('Malformed or tampered data in localStorage safely discarded', err);
  }
  return null;
}

export default function App() {
  const [scenarios, setScenarios] = useState<SalaryScenario[]>(() => {
    const saved = loadSavedData();
    return saved?.scenarios && saved.scenarios.length > 0
      ? saved.scenarios
      : [INITIAL_SCENARIO];
  });
  const [activeScenarioId, setActiveScenarioId] = useState<string>(() => {
    const saved = loadSavedData();
    if (
      saved?.activeScenarioId &&
      saved.scenarios.some((s) => s.id === saved.activeScenarioId)
    ) {
      return saved.activeScenarioId;
    }
    return saved?.scenarios?.[0]?.id || 'scenario-1';
  });
  const [lang, setLang] = useState<Language>(() => {
    const saved = loadSavedData();
    return saved?.lang === 'en' || saved?.lang === 'th' ? saved.lang : 'th';
  });
  const [activeView, setActiveView] = useState<AppViewMode>(() => {
    const saved = loadSavedData();
    return saved?.activeView === 'monthly' ? 'monthly' : 'yearly';
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [hasSavedData, setHasSavedData] = useState<boolean>(() => {
    return loadSavedData() !== null;
  });
  const [scenarioToDelete, setScenarioToDelete] = useState<SalaryScenario | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  const t = TRANSLATIONS[lang];

  // Save inputs and state to localStorage on every change with quota & size protection
  useEffect(() => {
    try {
      const dataToSave: StoredTaxData = {
        scenarios,
        activeScenarioId,
        lang,
        activeView,
        lastUpdated: Date.now(),
      };
      const serialized = JSON.stringify(dataToSave);
      if (serialized.length <= SECURITY_BOUNDS.STORAGE_QUOTA_MAX_CHARS) {
        localStorage.setItem(STORAGE_KEY, serialized);
        setHasSavedData(true);
      }
    } catch (err) {
      console.warn('LocalStorage save failed or storage quota exceeded safely handled', err);
    }
  }, [scenarios, activeScenarioId, lang, activeView]);

  // Calculate tax results for all scenarios
  const scenarioResults = useMemo(() => {
    return scenarios.map((scenario) => ({
      scenario,
      result: calculateThaiTax(scenario.input),
    }));
  }, [scenarios]);

  // Active scenario and result
  const activeItem = useMemo(() => {
    return (
      scenarioResults.find((item) => item.scenario.id === activeScenarioId) ||
      scenarioResults[0]
    );
  }, [scenarioResults, activeScenarioId]);

  const activeScenario = activeItem.scenario;
  const activeResult = activeItem.result;

  // Actions
  const handleAddScenario = () => {
    if (scenarios.length >= 5) return;

    const nextNumber = scenarios.length + 1;
    const baseInput = activeScenario.input;
    const newMonthly = Math.round((baseInput.salaryMonthly * 1.25) / 1000) * 1000 || 65000;

    const newScenario: SalaryScenario = {
      id: `scenario-${Date.now()}`,
      name: `Salary ${nextNumber}`,
      input: {
        ...baseInput,
        salaryMonthly: newMonthly,
        salaryYearly: newMonthly * 12,
      },
    };

    setScenarios((prev) => syncScenarioNamesWithOrder([...prev, newScenario]));
    setActiveScenarioId(newScenario.id);
  };

  const handleRequestRemoveScenario = (scenarioId?: string) => {
    if (scenarios.length <= 1) return;

    let target: SalaryScenario | undefined;
    if (scenarioId) {
      target = scenarios.find((s) => s.id === scenarioId);
    } else {
      // If triggered from general "-" button:
      // If user is currently viewing a non-baseline scenario, target it; otherwise the last scenario
      if (activeScenarioId !== scenarios[0].id) {
        target = scenarios.find((s) => s.id === activeScenarioId);
      } else {
        target = scenarios[scenarios.length - 1];
      }
    }

    if (target) {
      setScenarioToDelete(target);
    }
  };

  const handleConfirmDeleteScenario = () => {
    if (!scenarioToDelete || scenarios.length <= 1) {
      setScenarioToDelete(null);
      return;
    }

    const idToRemove = scenarioToDelete.id;
    const remaining = scenarios.filter((s) => s.id !== idToRemove);

    if (remaining.length > 0) {
      const synced = syncScenarioNamesWithOrder(remaining);
      setScenarios(synced);

      // If the active scenario was deleted, switch to the last remaining scenario
      if (activeScenarioId === idToRemove) {
        setActiveScenarioId(synced[synced.length - 1].id);
      }
    }

    setScenarioToDelete(null);
  };

  const handleRenameScenario = (idToRename: string, rawName: string) => {
    setScenarios((prev) => {
      const targetIndex = prev.findIndex((s) => s.id === idToRename);
      if (targetIndex === -1) return prev;
      const orderNum = targetIndex + 1;

      let cleanNote = rawName.trim();
      cleanNote = cleanNote.replace(/^Salary\s*\d*[\s:\-–—]*\(?/i, '').replace(/\)$/, '').trim();

      const newName = cleanNote ? `Salary ${orderNum} (${cleanNote})` : `Salary ${orderNum}`;

      return prev.map((s, idx) => (idx === targetIndex ? { ...s, name: newName } : s));
    });
  };

  const handleActiveInputChange = (updated: Partial<TaxCalculationInput>) => {
    setScenarios((prev) =>
      prev.map((s) =>
        s.id === activeScenarioId
          ? { ...s, input: { ...s.input, ...updated } }
          : s
      )
    );
  };

  const handleMoveScenario = (id: string, direction: 'left' | 'right') => {
    setScenarios((prev) => {
      const index = prev.findIndex((s) => s.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const next = [...prev];
      const item = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = item;
      return syncScenarioNamesWithOrder(next);
    });
  };

  const handleReorderScenarios = (newScenarios: SalaryScenario[]) => {
    setScenarios(syncScenarioNamesWithOrder(newScenarios));
  };

  const handleApplyPvdToAll = (employeeRate: number, employerRate?: number) => {
    setScenarios((prev) =>
      prev.map((s) => ({
        ...s,
        input: {
          ...s.input,
          pvdRatePercent: employeeRate,
          ...(employerRate !== undefined ? { employerPvdPercent: employerRate } : {}),
        },
      }))
    );
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      // ignore
    }
    setScenarios([INITIAL_SCENARIO]);
    setActiveScenarioId('scenario-1');
    setHasSavedData(false);
    setIsResetConfirmOpen(false);
  };

  const handleCopySummary = async () => {
    let textToCopy = '';
    if (scenarios.length === 1) {
      textToCopy = `[${t.appTitle} - Thailand PIT]
-------------------------------------------
${t.grossAnnualIncome}: ${formatTHB(activeResult.annualGrossIncome)} (${formatTHB(activeResult.monthlyAverageGross)} / month)
${t.standardExpense}: -${formatTHB(activeResult.standardExpenseDeduction)}
${t.personalAllowance}: -${formatTHB(activeResult.personalAllowance)}
${t.socialSecurity}: -${formatTHB(activeResult.annualSocialSecurity)} (-${formatTHB(activeResult.monthlySocialSecurity)} / month)
${t.pvdTitle} (${activeResult.pvdRatePercent}%): -${formatTHB(activeResult.annualPVD)} (-${formatTHB(activeResult.monthlyPVD)} / month)
-------------------------------------------
${t.netTaxableIncome}: ${formatTHB(activeResult.netTaxableIncome)}
${t.taxPayable} (Yearly): ${formatTHB(activeResult.annualTax)} (${formatTHB(activeResult.monthlyWithholdingTax)} / month)
${t.effectiveTaxRate}: ${activeResult.effectiveTaxRate.toFixed(2)}% | ${t.marginalRate}: ${activeResult.marginalTaxRate}%
-------------------------------------------
★ ${t.netTakeHome} (Yearly): ${formatTHB(activeResult.annualNetTakeHome)}
★ ${t.netTakeHome} (Monthly): ${formatTHB(activeResult.monthlyNetTakeHome)}
-------------------------------------------
[★ ${t.companyPvdComparisonTitle}]
- ${t.employerPvdRate}: ${activeResult.employerPvdPercent}%
- ${t.employerPvdMonthlyAmount}: ${formatTHB(activeResult.monthlyEmployerPVD)}
- ${t.employerPvdAnnualAmount}: ${formatTHB(activeResult.annualEmployerPVD)}
- ${t.totalPvdMonthlyAmount}: ${formatTHB(activeResult.monthlyTotalPVD)}
- ${t.totalPvdAnnualAmount}: ${formatTHB(activeResult.annualTotalPVD)}
-------------------------------------------
${t.revenueDeptNote}`;
    } else {
      let multiSummary = `[${t.appTitle} - Comparison of ${scenarios.length} Salaries (${activeView.toUpperCase()} VIEW)]\n`;
      multiSummary += `===========================================\n`;
      scenarioResults.forEach(({ scenario, result }, idx) => {
        multiSummary += `\n#${idx + 1} ${scenario.name}:\n`;
        multiSummary += `  - Monthly Salary: ${formatTHB(result.monthlySalary)}\n`;
        multiSummary += `  - Annual Gross: ${formatTHB(result.annualGrossIncome)}\n`;
        multiSummary += `  - Net Take-Home (Yearly): ${formatTHB(result.annualNetTakeHome)}\n`;
        multiSummary += `  - Net Take-Home (Monthly): ${formatTHB(result.monthlyNetTakeHome)}\n`;
        multiSummary += `  - Annual Tax (PIT): ${formatTHB(result.annualTax)} (${formatTHB(result.monthlyWithholdingTax)} / month)\n`;
        multiSummary += `  - Effective Tax Rate: ${result.effectiveTaxRate.toFixed(2)}%\n`;
        multiSummary += `  - [Split Benefit] Company PVD (${result.employerPvdPercent}%): ${formatTHB(result.monthlyEmployerPVD)} / mo (${formatTHB(result.annualEmployerPVD)} / yr)\n`;
      });
      multiSummary += `\n===========================================\n${t.revenueDeptNote}`;
      textToCopy = multiSummary;
    }

    const success = await safeCopyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header with Yearly and Monthly views only */}
      <Header
        lang={lang}
        setLang={setLang}
        onCopySummary={handleCopySummary}
        copied={copied}
        onPrint={handlePrint}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Intro banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.appTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t.appSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {hasSavedData && (
              <span
                title={
                  lang === 'th'
                    ? 'ข้อมูลการคำนวณถูกบันทึกลงในบราวเซอร์ของเครื่องนี้โดยอัตโนมัติ'
                    : 'Your inputs are automatically saved in this browser'
                }
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-md"
              >
                <Save className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.savedToDevice}</span>
              </span>
            )}

            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.reset}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Inputs & Scenario Management (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            <SalaryInputPanel
              scenarios={scenarios}
              activeScenarioId={activeScenarioId}
              onSelectScenario={setActiveScenarioId}
              onAddScenario={handleAddScenario}
              onRemoveScenario={handleRequestRemoveScenario}
              onRenameScenario={handleRenameScenario}
              onMoveScenario={handleMoveScenario}
              onReorderScenarios={handleReorderScenarios}
              input={activeScenario.input}
              onChange={handleActiveInputChange}
              onApplyPvdToAll={handleApplyPvdToAll}
              result={activeResult}
              lang={lang}
            />
          </div>

          {/* Right Column: Results & Comparisons (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            {/* If multiple salaries exist: render the side-by-side comparison section INLINE */}
            {scenarios.length > 1 ? (
              <ScenarioComparisonSection
                scenarios={scenarios}
                results={scenarioResults}
                activeScenarioId={activeScenarioId}
                onSelectScenario={setActiveScenarioId}
                onMoveScenario={handleMoveScenario}
                lang={lang}
                viewMode={activeView}
              />
            ) : (
              /* Single scenario: show standard summary cards */
              <ResultsSummary
                result={activeResult}
                lang={lang}
                activeView={activeView}
              />
            )}
          </div>
        </div>

        {/* Full-width Multi-Salary Analytical Sections (Spanning across both sides) */}
        {scenarios.length > 1 && (
          <div className="space-y-6 pt-4 border-t border-slate-200">
            {/* 1. Income Distribution Cards across both sides */}
            <ScenarioIncomeDistribution
              scenarios={scenarios}
              results={scenarioResults}
              activeScenarioId={activeScenarioId}
              onSelectScenario={setActiveScenarioId}
              lang={lang}
              viewMode={activeView}
            />

            {/* 2. Key Results Difference Matrix Table across both sides */}
            <ScenarioComparisonTable
              scenarios={scenarios}
              results={scenarioResults}
              lang={lang}
              viewMode={activeView}
            />

            {/* 3. Dedicated Split Section: Company PVD Match Comparison (Month & Year) */}
            <EmployerPvdComparisonSection
              scenarios={scenarios}
              results={scenarioResults}
              activeScenarioId={activeScenarioId}
              onSelectScenario={setActiveScenarioId}
              lang={lang}
              viewMode={activeView}
            />
          </div>
        )}

        {/* If single scenario: render the split Company PVD section */}
        {scenarios.length === 1 && (
          <div className="pt-4 border-t border-slate-200">
            <EmployerPvdComparisonSection
              scenarios={scenarios}
              results={scenarioResults}
              activeScenarioId={activeScenarioId}
              onSelectScenario={setActiveScenarioId}
              lang={lang}
              viewMode={activeView}
            />
          </div>
        )}

        {/* Section: รายละเอียดภาษีและขั้นบันไดของ: Salary X (2 columns on large screens) */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                {lang === 'th'
                  ? `รายละเอียดภาษีและขั้นบันไดของ: ${activeScenario.name}`
                  : `Tax Bridge & Brackets for: ${activeScenario.name}`}
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                ({formatTHB(activeResult.monthlySalary)}/{lang === 'th' ? 'เดือน' : 'mo'})
              </span>
            </div>

            {scenarios.length > 1 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">
                  {lang === 'th' ? 'เลือกดูแผน:' : 'Select Salary:'}
                </span>
                <select
                  value={activeScenarioId}
                  onChange={(e) => setActiveScenarioId(e.target.value)}
                  aria-label={lang === 'th' ? 'เลือกแผนที่ต้องการดูรายละเอียด' : 'Select salary for details'}
                  className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-900 focus:ring-1 focus:ring-emerald-500"
                >
                  {scenarios.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 2 Columns on Large Screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Column 1: Step-by-Step Waterfall Bridge & Comparison Table */}
            <div className="space-y-6">
              <TaxCalculationBridge result={activeResult} lang={lang} />
              <ComparisonTable result={activeResult} lang={lang} />
            </div>

            {/* Column 2: Progressive Tax Brackets Table */}
            <div className="space-y-6">
              <TaxBracketTable
                brackets={activeResult.brackets}
                netTaxableIncome={activeResult.netTaxableIncome}
                lang={lang}
              />
            </div>
          </div>
        </div>

        {/* Legal Explanations Accordion */}
        <LegalExplanations lang={lang} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1">
          <p>
            {lang === 'th'
              ? 'โปรแกรมคำนวณภาษีเงินได้บุคคลธรรมดาและเงินเดือนสุทธิ (ประเทศไทย) · อ้างอิงตามเกณฑ์กรมสรรพากร'
              : 'Thailand Personal Income Tax & Net Salary Calculator · Grounded in Thai Revenue Code'}
          </p>
          <p className="text-[11px] text-slate-400">
            {lang === 'th'
              ? 'คำนวณเงินสมทบประกันสังคมสูงสุด 750 บ./เดือน, หักค่าใช้จ่าย 50% สูงสุด 100,000 บ., ลดหย่อนส่วนตัว 60,000 บ., กองทุนสำรองเลี้ยงชีพสูงสุด 500,000 บ.'
              : 'Auto-calculates Social Security (max 750 THB/mo), standard expense (50% max 100,000 THB), personal allowance (60,000 THB), and PVD (max 500,000 THB).'}
          </p>
        </div>
      </footer>

      {/* Confirm Delete Salary Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(scenarioToDelete)}
        scenario={scenarioToDelete}
        onConfirm={handleConfirmDeleteScenario}
        onCancel={() => setScenarioToDelete(null)}
        lang={lang}
      />

      {/* Confirm Reset All Data Modal */}
      <ConfirmResetModal
        isOpen={isResetConfirmOpen}
        onConfirm={handleReset}
        onCancel={() => setIsResetConfirmOpen(false)}
        lang={lang}
      />
    </div>
  );
}
