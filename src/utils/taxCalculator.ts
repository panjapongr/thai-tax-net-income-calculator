/**
 * Thailand Personal Income Tax (PIT / ภาษีเงินได้บุคคลธรรมดา) Calculator
 * Based on Thai Revenue Department (กรมสรรพากร) 2024-2026 regulations.
 */

export interface TaxBracket {
  min: number;
  max: number | null; // null for infinite
  rate: number; // e.g. 0.05 for 5%
  rateLabel: string;
  taxableInBracket: number;
  taxInBracket: number;
  cumulativeTax: number;
  isCurrentTier: boolean;
  isPassed: boolean;
}

export interface TaxCalculationInput {
  salaryMonthly: number;
  salaryYearly: number;
  inputMode: 'monthly' | 'yearly';
  pvdRatePercent: number; // 0 to 15% (Employee part / เงินสะสมพนักงาน)
  employerPvdPercent?: number; // 0 to 15% (Company/Employer part / เงินสมทบนายจ้าง)
  bonusMonths: number;
  customBonusAmount: number;
  includeBonus: boolean;
}

export interface TaxCalculationResult {
  // Gross Incomes
  monthlySalary: number;
  annualSalary: number;
  bonusAmount: number;
  annualGrossIncome: number;
  monthlyAverageGross: number;

  // Mandatory Deductions
  standardExpenseDeduction: number; // 50% max 100,000
  personalAllowance: number; // 60,000
  monthlySocialSecurity: number; // 5% max 750/mo
  annualSocialSecurity: number; // max 9,000/yr

  // Voluntary/Company Deductions (Employee Part)
  pvdRatePercent: number;
  monthlyPVD: number;
  annualPVD: number; // max 500,000/yr

  // Employer / Company Additional PVD Contribution (Split section - not deducted from cash take-home)
  employerPvdPercent: number; // Company match % (0 to 15%)
  monthlyEmployerPVD: number; // Company monthly contribution (THB)
  annualEmployerPVD: number; // Company annual contribution (THB)
  monthlyTotalPVD: number; // Employee + Company monthly (THB)
  annualTotalPVD: number; // Employee + Company annual (THB)

  // Summary Deductions
  totalTaxDeductions: number; // Standard expense + Personal allowance + SSF + PVD
  netTaxableIncome: number; // Gross - totalTaxDeductions

  // Tax Results
  annualTax: number;
  monthlyWithholdingTax: number;
  effectiveTaxRate: number; // (annualTax / annualGrossIncome) * 100
  marginalTaxRate: number; // top bracket rate %

  // Net Take-Home Pay (Actual cash received in bank account)
  // Cash Take-Home = Gross - SSF - PVD - Tax
  annualNetTakeHome: number;
  monthlyNetTakeHome: number;
  takeHomePercentage: number; // (annualNetTakeHome / annualGrossIncome) * 100

  // Bracket details
  brackets: TaxBracket[];
}

export const THAI_TAX_TIERS = [
  { min: 0, max: 150000, rate: 0.00, label: '0%' },
  { min: 150000, max: 300000, rate: 0.05, label: '5%' },
  { min: 300000, max: 500000, rate: 0.10, label: '10%' },
  { min: 500000, max: 750000, rate: 0.15, label: '15%' },
  { min: 750000, max: 1000000, rate: 0.20, label: '20%' },
  { min: 1000000, max: 2000000, rate: 0.25, label: '25%' },
  { min: 2000000, max: 5000000, rate: 0.30, label: '30%' },
  { min: 5000000, max: null, rate: 0.35, label: '35%' },
];

export const CONSTANTS = {
  // Standard expense deduction: 50% of income, max 100,000 THB
  STANDARD_EXPENSE_RATE: 0.50,
  STANDARD_EXPENSE_CAP: 100000,

  // Personal Allowance for taxpayer: 60,000 THB
  PERSONAL_ALLOWANCE: 60000,

  // Social Security: 5% of monthly wage, wage ceiling 15,000 THB -> max 750 THB/month (9,000 THB/year)
  SSF_RATE: 0.05,
  SSF_WAGE_MIN: 1650,
  SSF_WAGE_MAX: 15000,
  SSF_MONTHLY_CAP: 750,
  SSF_ANNUAL_CAP: 9000,

  // Provident Fund: max 15% of salary, max 500,000 THB per year
  PVD_MAX_PERCENT: 15,
  PVD_ANNUAL_CAP: 500000,
};

export function calculateThaiTax(input: TaxCalculationInput): TaxCalculationResult {
  const safeFinite = (v: unknown, fallback = 0): number =>
    typeof v === 'number' && Number.isFinite(v) && !Number.isNaN(v) ? Math.max(0, v) : fallback;

  // Determine baseline salary
  let monthlySalary = 0;
  let annualSalary = 0;

  if (input.inputMode === 'monthly') {
    monthlySalary = safeFinite(input.salaryMonthly);
    annualSalary = monthlySalary * 12;
  } else {
    annualSalary = safeFinite(input.salaryYearly);
    monthlySalary = annualSalary > 0 ? annualSalary / 12 : 0;
  }

  // Bonus calculation
  let bonusAmount = 0;
  if (input.includeBonus) {
    const customBonus = safeFinite(input.customBonusAmount);
    const bonusMonths = safeFinite(input.bonusMonths);
    if (customBonus > 0) {
      bonusAmount = customBonus;
    } else if (bonusMonths > 0) {
      bonusAmount = monthlySalary * bonusMonths;
    }
  }

  const annualGrossIncome = annualSalary + bonusAmount;
  const monthlyAverageGross = annualGrossIncome / 12;

  // 1. Mandatory Standard Expense (ค่าใช้จ่ายส่วนตัว 50% ไม่เกิน 100,000 บาท)
  const standardExpenseDeduction = Math.min(
    annualGrossIncome * CONSTANTS.STANDARD_EXPENSE_RATE,
    CONSTANTS.STANDARD_EXPENSE_CAP
  );

  // 2. Mandatory Personal Allowance (ค่าลดหย่อนส่วนตัว 60,000 บาท)
  const personalAllowance = CONSTANTS.PERSONAL_ALLOWANCE;

  // 3. Mandatory Social Security Fund (SSF / ประกันสังคม 5% สูงสุด 750/เดือน หรือ 9,000/ปี)
  let monthlySocialSecurity = 0;
  if (monthlySalary > 0) {
    const cappedWage = Math.min(Math.max(monthlySalary, CONSTANTS.SSF_WAGE_MIN), CONSTANTS.SSF_WAGE_MAX);
    monthlySocialSecurity = Math.min(cappedWage * CONSTANTS.SSF_RATE, CONSTANTS.SSF_MONTHLY_CAP);
  }
  const annualSocialSecurity = monthlySocialSecurity * 12;

  // 4. Provident Fund (PVD / กองทุนสำรองเลี้ยงชีพ)
  // Employee part (เงินสะสมพนักงาน - หักจากเงินเดือนและลดหย่อนภาษีได้)
  const safePvdPercent = Math.min(Math.max(0, input.pvdRatePercent || 0), CONSTANTS.PVD_MAX_PERCENT);
  const rawAnnualPVD = annualSalary * (safePvdPercent / 100);
  const annualPVD = Math.min(rawAnnualPVD, CONSTANTS.PVD_ANNUAL_CAP);
  const monthlyPVD = annualPVD / 12;

  // Employer part (เงินสมทบนายจ้าง - บริษัทจ่ายเพิ่มให้เป็นสิทธิประโยชน์ ไม่หักออกจากเงินเดือนรับจริง)
  const safeEmployerPvdPercent = Math.min(
    Math.max(0, input.employerPvdPercent !== undefined ? input.employerPvdPercent : 0),
    CONSTANTS.PVD_MAX_PERCENT
  );
  const monthlyEmployerPVD = monthlySalary * (safeEmployerPvdPercent / 100);
  const annualEmployerPVD = annualSalary * (safeEmployerPvdPercent / 100);
  const monthlyTotalPVD = monthlyPVD + monthlyEmployerPVD;
  const annualTotalPVD = annualPVD + annualEmployerPVD;

  // Total Deductions for Tax Calculation
  const totalTaxDeductions =
    standardExpenseDeduction +
    personalAllowance +
    annualSocialSecurity +
    annualPVD;

  // Net Taxable Income (เงินได้สุทธิ)
  const netTaxableIncome = Math.max(0, annualGrossIncome - totalTaxDeductions);

  // Calculate Progressive Tax
  let remainingTaxable = netTaxableIncome;
  let annualTax = 0;
  let marginalTaxRate = 0;
  let cumulative = 0;

  const brackets: TaxBracket[] = THAI_TAX_TIERS.map((tier) => {
    let taxableInBracket = 0;
    let taxInBracket = 0;
    const bracketSpan = tier.max !== null ? tier.max - tier.min : Infinity;

    if (netTaxableIncome > tier.min) {
      if (tier.max === null) {
        taxableInBracket = netTaxableIncome - tier.min;
      } else {
        taxableInBracket = Math.min(netTaxableIncome - tier.min, bracketSpan);
      }
      taxInBracket = taxableInBracket * tier.rate;
      annualTax += taxInBracket;
      cumulative += taxInBracket;

      if (taxableInBracket > 0 && tier.rate > 0) {
        marginalTaxRate = Math.max(marginalTaxRate, tier.rate * 100);
      }
    }

    const isCurrentTier =
      netTaxableIncome > tier.min &&
      (tier.max === null || netTaxableIncome <= tier.max);
    const isPassed = tier.max !== null && netTaxableIncome > tier.max;

    return {
      min: tier.min,
      max: tier.max,
      rate: tier.rate,
      rateLabel: tier.label,
      taxableInBracket,
      taxInBracket,
      cumulativeTax: cumulative,
      isCurrentTier,
      isPassed,
    };
  });

  // If taxable income <= 150k, marginal rate is 0
  if (netTaxableIncome <= 150000) {
    marginalTaxRate = 0;
  }

  const monthlyWithholdingTax = annualTax / 12;
  const effectiveTaxRate = annualGrossIncome > 0 ? (annualTax / annualGrossIncome) * 100 : 0;

  // Net Take-Home Pay:
  // Actual cash deductions from payroll: Social Security + Provident Fund (employee part) + Personal Income Tax
  // Company PVD is NOT deducted from cash take-home
  const annualNetTakeHome = Math.max(0, annualGrossIncome - annualSocialSecurity - annualPVD - annualTax);
  const monthlyNetTakeHome = annualNetTakeHome / 12;
  const takeHomePercentage = annualGrossIncome > 0 ? (annualNetTakeHome / annualGrossIncome) * 100 : 0;

  return {
    monthlySalary,
    annualSalary,
    bonusAmount,
    annualGrossIncome,
    monthlyAverageGross,

    standardExpenseDeduction,
    personalAllowance,
    monthlySocialSecurity,
    annualSocialSecurity,

    pvdRatePercent: safePvdPercent,
    monthlyPVD,
    annualPVD,

    employerPvdPercent: safeEmployerPvdPercent,
    monthlyEmployerPVD,
    annualEmployerPVD,
    monthlyTotalPVD,
    annualTotalPVD,

    totalTaxDeductions,
    netTaxableIncome,

    annualTax,
    monthlyWithholdingTax,
    effectiveTaxRate,
    marginalTaxRate,

    annualNetTakeHome,
    monthlyNetTakeHome,
    takeHomePercentage,

    brackets,
  };
}

export interface SalaryScenario {
  id: string;
  name: string;
  input: TaxCalculationInput;
}

export interface ScenarioDelta {
  grossDelta: number;
  grossDeltaPercent: number;
  takeHomeYearlyDelta: number;
  takeHomeYearlyDeltaPercent: number;
  takeHomeMonthlyDelta: number;
  taxYearlyDelta: number;
  taxMonthlyDelta: number;
  effectiveRateDelta: number;
  ssfDelta: number;
  pvdDelta: number;
  employerPvdMonthlyDelta: number;
  employerPvdYearlyDelta: number;
  totalPvdMonthlyDelta: number;
  totalPvdYearlyDelta: number;
}

export function calculateScenarioDelta(
  target: TaxCalculationResult,
  baseline: TaxCalculationResult
): ScenarioDelta {
  const grossDelta = target.annualGrossIncome - baseline.annualGrossIncome;
  const grossDeltaPercent =
    baseline.annualGrossIncome > 0
      ? (grossDelta / baseline.annualGrossIncome) * 100
      : 0;

  const takeHomeYearlyDelta =
    target.annualNetTakeHome - baseline.annualNetTakeHome;
  const takeHomeYearlyDeltaPercent =
    baseline.annualNetTakeHome > 0
      ? (takeHomeYearlyDelta / baseline.annualNetTakeHome) * 100
      : 0;

  const takeHomeMonthlyDelta =
    target.monthlyNetTakeHome - baseline.monthlyNetTakeHome;

  const taxYearlyDelta = target.annualTax - baseline.annualTax;
  const taxMonthlyDelta =
    target.monthlyWithholdingTax - baseline.monthlyWithholdingTax;

  const effectiveRateDelta = target.effectiveTaxRate - baseline.effectiveTaxRate;
  const ssfDelta = target.annualSocialSecurity - baseline.annualSocialSecurity;
  const pvdDelta = target.annualPVD - baseline.annualPVD;

  const employerPvdMonthlyDelta =
    target.monthlyEmployerPVD - baseline.monthlyEmployerPVD;
  const employerPvdYearlyDelta =
    target.annualEmployerPVD - baseline.annualEmployerPVD;
  const totalPvdMonthlyDelta =
    target.monthlyTotalPVD - baseline.monthlyTotalPVD;
  const totalPvdYearlyDelta =
    target.annualTotalPVD - baseline.annualTotalPVD;

  return {
    grossDelta,
    grossDeltaPercent,
    takeHomeYearlyDelta,
    takeHomeYearlyDeltaPercent,
    takeHomeMonthlyDelta,
    taxYearlyDelta,
    taxMonthlyDelta,
    effectiveRateDelta,
    ssfDelta,
    pvdDelta,
    employerPvdMonthlyDelta,
    employerPvdYearlyDelta,
    totalPvdMonthlyDelta,
    totalPvdYearlyDelta,
  };
}

export function formatTHB(amount: number, decimals: number = 0): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '฿0';
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatDeltaTHB(amount: number, decimals: number = 0): string {
  if (isNaN(amount) || amount === 0) return '฿0';
  const prefix = amount > 0 ? '+฿' : '-฿';
  const formattedAbs = new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(amount));
  return `${prefix}${formattedAbs}`;
}

export function formatNumber(amount: number, decimals: number = 0): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

