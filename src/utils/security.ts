/**
 * Production-Grade Security & Sanitization Utilities
 * Protects against XSS, Prototype Pollution, Malformed localStorage payloads,
 * Numeric Overflow / NaN corruption, and Clipboard API exceptions.
 */

import { SalaryScenario, TaxCalculationInput } from './taxCalculator';
import { Language } from './translations';
import { AppViewMode } from '../components/Header';

// Security Boundaries
export const SECURITY_BOUNDS = {
  MAX_SCENARIOS: 5,
  MAX_SALARY: 1_000_000_000, // 1 Billion THB ceiling prevents numeric overflow
  MAX_BONUS_MONTHS: 120, // 10 years max
  MAX_BONUS_AMOUNT: 1_000_000_000,
  MAX_PVD_RATE: 15,
  MAX_NAME_LENGTH: 40,
  MAX_ID_LENGTH: 64,
  STORAGE_QUOTA_MAX_CHARS: 50_000, // Prevents storage bomb attacks
};

/**
 * Sanitizes user-entered text strings to prevent HTML injection, script execution,
 * control character abuse, and oversized payloads.
 */
export function sanitizeTextInput(input: unknown, maxLength = SECURITY_BOUNDS.MAX_NAME_LENGTH): string {
  if (typeof input !== 'string') return '';

  // 1. Strip null bytes and non-printable control characters (except standard whitespace)
  let clean = input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '');

  // 2. Strip HTML tags and entities to neutralize XSS vectors
  clean = clean.replace(/<[^>]*>/g, '');

  // 3. Remove dangerous protocols if present
  clean = clean.replace(/(?:javascript|data|vbscript):/gi, '');

  // 4. Normalize spacing and clamp length
  clean = clean.trim().replace(/\s+/g, ' ');

  if (clean.length > maxLength) {
    clean = clean.slice(0, maxLength).trim();
  }

  return clean;
}

/**
 * Validates and safely bounds numeric inputs, preventing NaN, Infinity, -Infinity,
 * negative numbers, and memory-exhaustion magnitude numbers.
 */
export function sanitizeNumber(
  val: unknown,
  min = 0,
  max = SECURITY_BOUNDS.MAX_SALARY,
  fallback = 0
): number {
  if (typeof val !== 'number' && typeof val !== 'string') return fallback;

  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/,/g, '').trim());

  if (!Number.isFinite(num) || Number.isNaN(num)) {
    return fallback;
  }

  if (num < min) return min;
  if (num > max) return max;

  return Math.round(num * 100) / 100; // Round to 2 decimal places to avoid floating point drift
}

/**
 * Defensive schema validator for stored TaxCalculationInput.
 * Completely immune to prototype pollution (__proto__, constructor tampering).
 */
export function sanitizeTaxInput(raw: unknown): TaxCalculationInput {
  const fallback: TaxCalculationInput = {
    salaryMonthly: 50000,
    salaryYearly: 600000,
    inputMode: 'monthly',
    pvdRatePercent: 5,
    employerPvdPercent: 5,
    bonusMonths: 0,
    customBonusAmount: 0,
    includeBonus: false,
  };

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return fallback;
  }

  const obj = raw as Record<string, unknown>;

  const inputMode: 'monthly' | 'yearly' =
    obj.inputMode === 'yearly' ? 'yearly' : 'monthly';

  const salaryMonthly = sanitizeNumber(obj.salaryMonthly, 0, SECURITY_BOUNDS.MAX_SALARY, 50000);
  const salaryYearly = sanitizeNumber(
    obj.salaryYearly,
    0,
    SECURITY_BOUNDS.MAX_SALARY * 12,
    salaryMonthly * 12
  );

  const pvdRatePercent = sanitizeNumber(obj.pvdRatePercent, 0, SECURITY_BOUNDS.MAX_PVD_RATE, 5);
  const employerPvdPercent = sanitizeNumber(
    obj.employerPvdPercent !== undefined ? obj.employerPvdPercent : 5,
    0,
    SECURITY_BOUNDS.MAX_PVD_RATE,
    5
  );

  const bonusMonths = sanitizeNumber(obj.bonusMonths, 0, SECURITY_BOUNDS.MAX_BONUS_MONTHS, 0);
  const customBonusAmount = sanitizeNumber(
    obj.customBonusAmount,
    0,
    SECURITY_BOUNDS.MAX_BONUS_AMOUNT,
    0
  );
  const includeBonus = Boolean(obj.includeBonus);

  return {
    salaryMonthly,
    salaryYearly,
    inputMode,
    pvdRatePercent,
    employerPvdPercent,
    bonusMonths,
    customBonusAmount,
    includeBonus,
  };
}

/**
 * Validates and cleans a SalaryScenario object.
 */
export function sanitizeScenario(raw: unknown, index: number): SalaryScenario {
  const defaultName = `Salary ${index + 1}`;
  const defaultId = `scenario-${index + 1}`;

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      id: defaultId,
      name: defaultName,
      input: sanitizeTaxInput(null),
    };
  }

  const obj = raw as Record<string, unknown>;

  // Safe ID validation: alphanumeric + dashes only
  let id = typeof obj.id === 'string' ? obj.id.replace(/[^a-zA-Z0-9_-]/g, '') : defaultId;
  if (!id || id.length > SECURITY_BOUNDS.MAX_ID_LENGTH) {
    id = defaultId;
  }

  // Safe Name validation
  let name = sanitizeTextInput(obj.name, SECURITY_BOUNDS.MAX_NAME_LENGTH);
  if (!name) {
    name = defaultName;
  }

  const input = sanitizeTaxInput(obj.input);

  return {
    id,
    name,
    input,
  };
}

/**
 * Validates whole StoredTaxData payload loaded from localStorage.
 * Ensures protection against prototype pollution, oversized array bombs, and corrupted structures.
 */
export function sanitizeStoredData(
  parsed: unknown,
  fallbackScenario: SalaryScenario
): {
  scenarios: SalaryScenario[];
  activeScenarioId: string;
  lang: Language;
  activeView: AppViewMode;
} | null {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return null;
  }

  const obj = parsed as Record<string, unknown>;

  // Validate Scenarios Array
  if (!Array.isArray(obj.scenarios) || obj.scenarios.length === 0) {
    return null;
  }

  // Bound scenarios to MAX_SCENARIOS
  const boundedScenarios = obj.scenarios.slice(0, SECURITY_BOUNDS.MAX_SCENARIOS);
  const cleanScenarios: SalaryScenario[] = boundedScenarios.map((item, idx) =>
    sanitizeScenario(item, idx)
  );

  if (cleanScenarios.length === 0) {
    cleanScenarios.push(fallbackScenario);
  }

  // Ensure unique scenario IDs
  const seenIds = new Set<string>();
  cleanScenarios.forEach((sc, idx) => {
    if (seenIds.has(sc.id)) {
      sc.id = `scenario-${Date.now()}-${idx}`;
    }
    seenIds.add(sc.id);
  });

  // Validate activeScenarioId
  let activeScenarioId =
    typeof obj.activeScenarioId === 'string'
      ? obj.activeScenarioId.replace(/[^a-zA-Z0-9_-]/g, '')
      : cleanScenarios[0].id;

  if (!cleanScenarios.some((s) => s.id === activeScenarioId)) {
    activeScenarioId = cleanScenarios[0].id;
  }

  // Validate lang
  const lang: Language = obj.lang === 'en' ? 'en' : 'th';

  // Validate activeView
  const activeView: AppViewMode = obj.activeView === 'monthly' ? 'monthly' : 'yearly';

  return {
    scenarios: cleanScenarios,
    activeScenarioId,
    lang,
    activeView,
  };
}

/**
 * Safe copy to clipboard with fallback for non-HTTPS or restricted iframe permissions.
 */
export async function safeCopyToClipboard(text: string): Promise<boolean> {
  // 1. Try modern async Clipboard API if available and document is focused
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback to legacy execCommand
    }
  }

  // 2. Fallback via temporary invisible textarea
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    textArea.setAttribute('readonly', '');
    textArea.setAttribute('aria-hidden', 'true');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
