export type Language = 'th' | 'en';

export const TRANSLATIONS = {
  th: {
    appTitle: 'โปรแกรมคำนวณภาษี & เงินได้สุทธิ',
    appSubtitle: 'คำนวณภาษีเงินได้บุคคลธรรมดา ค่าลดหย่อนภาคบังคับ กองทุนสำรองเลี้ยงชีพ และเงินได้สุทธิ (ประเทศไทย)',
    
    // Top Bar & Controls
    thaiTaxYear: 'ปีภาษี 2567-2569 (2024-2026)',
    reset: 'รีเซ็ตข้อมูล',
    savedToDevice: 'บันทึกในเครื่องอัตโนมัติ',
    copySummary: 'คัดลอกผลลัพธ์',
    copied: 'คัดลอกแล้ว!',
    print: 'พิมพ์เอกสาร',
    quickPresets: 'เงินเดือนตัวอย่าง',

    // Views
    yearlyView: 'มุมมองรายปี (Yearly)',
    monthlyView: 'มุมมองรายเดือน (Monthly)',
    compareView: 'เปรียบเทียบ รายปี vs รายเดือน',

    // Multiple Salary Scenarios & Comparisons
    scenariosTitle: 'แผนเงินเดือน (Salary Scenarios)',
    addSalaryBtn: 'เพิ่ม Salary (+)',
    removeSalaryBtn: 'ลบ Salary (-)',
    maxScenariosNotice: 'เพิ่มได้สูงสุด 5 แผน (Max 5 Salaries)',
    confirmDeleteSalaryTitle: 'ยืนยันการลบแผนเงินเดือน',
    confirmDeleteSalaryMessage: 'คุณแน่ใจหรือไม่ว่าต้องการลบแผนเงินเดือนนี้?',
    confirmDeleteSalaryDetails: 'ข้อมูลเงินเดือน ค่าลดหย่อน และผลการคำนวณทั้งหมดของแผนนี้จะถูกลบออก และไม่สามารถกู้คืนได้',
    confirmDeleteBtn: 'ยืนยันการลบ',
    cancelBtn: 'ยกเลิก',
    confirmResetTitle: 'ยืนยันการรีเซ็ตข้อมูลทั้งหมด',
    confirmResetMessage: 'คุณต้องการล้างข้อมูลและคืนค่าเริ่มต้นทั้งหมดหรือไม่?',
    confirmResetDetails: 'ข้อมูลแผนเงินเดือน การตั้งค่า และผลการคำนวณที่บันทึกไว้ในอุปกรณ์จะถูกลบทั้งหมด และกลับสู่ค่าเริ่มต้น',
    confirmResetBtn: 'ยืนยันการรีเซ็ต',
    compareScenariosTitle: 'เปรียบเทียบส่วนต่างทุกแผนเงินเดือน (Scenario Comparison & Differences)',
    baselineSalaryLabel: 'แผนหลักอ้างอิง (Salary 1)',
    diffTakeHomeYear: 'ส่วนต่างรับจริงต่อปี',
    diffTakeHomeMonth: 'ส่วนต่างรับจริงต่อเดือน',
    diffTaxYear: 'ส่วนต่างภาษีต่อปี',
    diffTaxRate: 'ส่วนต่างอัตราภาษีจริง',
    moreTakeHome: 'รับจริงเพิ่มขึ้น',
    lessTakeHome: 'รับจริงลดลง',
    moreTax: 'จ่ายภาษีเพิ่ม',
    lessTax: 'จ่ายภาษีลดลง',
    differenceVsBaseline: 'เปรียบเทียบผลต่างกับ Salary 1',
    reorderSalary: 'สลับลำดับแผนเงินเดือน',
    moveLeft: 'เลื่อนไปซ้าย (ก่อนหน้า)',
    moveRight: 'เลื่อนไปขวา (ถัดไป)',
    dragToReorder: 'ลากเพื่อสลับลำดับ หรือคลิกลูกศร',

    // Input Section
    inputTitle: '1. ข้อมูลรายได้และกองทุนสำรองเลี้ยงชีพ',
    salaryInputLabel: 'เงินเดือน (Salary)',
    perMonth: 'ต่อเดือน',
    perYear: 'ต่อปี',
    monthlySalary: 'เงินเดือนต่อเดือน',
    yearlySalary: 'เงินเดือนรวมทั้งปี',
    salaryPlaceholder: 'ระบุจำนวนเงิน เช่น 50,000',

    // PVD (Employee)
    pvdTitle: 'กองทุนสำรองเลี้ยงชีพ (Provident Fund - PVD)',
    pvdDescription: 'ระบุเปอร์เซ็นต์สะสมต่อเดือน (กฎหมายให้หักได้ตามจริง สูงสุดไม่เกิน 15% และไม่เกิน 500,000 บาท/ปี)',
    pvdRate: 'อัตราเงินสะสม PVD (ส่วนของพนักงาน)',
    pvdMonthlyAmount: 'หักเข้ากองทุนต่อเดือน',
    pvdAnnualAmount: 'หักเข้ากองทุนต่อปี',

    // PVD (Company / Employer Part - Split)
    employerPvdTitle: 'เงินสมทบจากบริษัท / นายจ้าง (Company Match)',
    employerPvdDescription: 'สิทธิประโยชน์เพิ่มเติมที่บริษัทจ่ายสมทบเข้ากองทุน PVD ให้คุณ (ไม่หักจากเงินเดือนรับจริง)',
    employerPvdRate: 'อัตราเงินสมทบจากบริษัท',
    employerPvdMonthlyAmount: 'บริษัทสมทบต่อเดือน',
    employerPvdAnnualAmount: 'บริษัทสมทบต่อปี',
    totalPvdMonthlyAmount: 'รวมสะสมเข้า PVD ต่อเดือน (พนักงาน + บริษัท)',
    totalPvdAnnualAmount: 'รวมสะสมเข้า PVD ต่อปี (พนักงาน + บริษัท)',
    companyPvdComparisonTitle: 'เปรียบเทียบเงินสมทบกองทุน PVD ส่วนของบริษัท (Company Contribution)',
    companyPvdComparisonSubtitle: 'สิทธิประโยชน์เพิ่มเติมที่บริษัทจ่ายเข้ากองทุนสำรองเลี้ยงชีพต่อเดือนและต่อปี (แยกส่วน ไม่นำไปรวมในเงินได้สุทธิเดิม)',
    matchEmployeeBtn: 'เท่ากับส่วนพนักงาน',

    // Bonus
    bonusToggle: 'เพิ่มโบนัส / เงินได้พิเศษ (Bonus)',
    bonusMonths: 'จำนวนเดือนโบนัส',
    bonusCustom: 'ระบุยอดโบนัสเอง',
    bonusTotal: 'โบนัสรวม',

    // Auto Deductions (Mandatory)
    autoDeductionsTitle: '2. ค่าลดหย่อนภาคบังคับ (ระบบคำนวณอัตโนมัติตามกฎหมาย)',
    autoDeductionsDesc: 'แอปจะหักค่าใช้จ่ายและค่าลดหย่อนตามที่กรมสรรพากรกำหนดโดยอัตโนมัติ',
    standardExpense: 'ค่าใช้จ่ายส่วนตัว (Living Cost / Standard Expense)',
    standardExpenseNote: 'หัก 50% ของเงินได้พึงประเมิน สูงสุด 100,000 บาท',
    personalAllowance: 'ค่าลดหย่อนส่วนตัว (Personal Allowance)',
    personalAllowanceNote: 'สิทธิลดหย่อนผู้มีเงินได้ทุกคน 60,000 บาท',
    socialSecurity: 'กองทุนประกันสังคม (Social Security Fund - SSF)',
    socialSecurityNote: 'หัก 5% ของเงินเดือน ฐานค่าจ้างสูงสุด 15,000 บ. (สูงสุด 750 บ./เดือน หรือ 9,000 บ./ปี)',

    // Results Summary
    summaryTitle: 'ผลลัพธ์การคำนวณภาษี & เงินได้สุทธิ',
    netTakeHome: 'เงินได้สุทธิรับจริง (Net Take-Home)',
    netTakeHomeMonthly: 'เงินได้สุทธิรับจริงต่อเดือน',
    netTakeHomeYearly: 'เงินได้สุทธิรับจริงต่อปี',
    netTakeHomeDesc: 'เงินเดือนที่เข้าบัญชีจริงหลังหักภาษี ประกันสังคม และ PVD',
    taxPayable: 'ภาษีที่ต้องชำระ (Tax to Pay)',
    taxPayableMonthly: 'ภาษีที่ต้องชำระต่อเดือน',
    taxPayableYearly: 'ภาษีที่ต้องชำระต่อปี',
    taxPayableDesc: 'ภาษีเงินได้บุคคลธรรมดาที่ต้องจ่ายทั้งปี',
    effectiveTaxRate: 'อัตราภาษีที่แท้จริง (Effective Tax Rate)',
    marginalRate: 'ฐานภาษีสูงสุด (Marginal Rate)',
    netTaxableIncome: 'เงินได้สุทธินำไปคำนวณภาษี (Net Taxable Income)',
    grossAnnualIncome: 'เงินได้พึงประเมินรวมทั้งปี (Gross Income)',
    totalDeductions: 'รวมค่าใช้จ่ายและค่าลดหย่อนทั้งหมด (Total Deductions)',

    // Stacked Breakdown
    paycheckBreakdown: 'สัดส่วนการจัดสรรเงินได้พึงประเมิน (Income Distribution)',
    takeHomeShare: 'เงินได้สุทธิรับจริง',
    taxShare: 'ภาษีที่จ่าย',
    pvdShare: 'กองทุนสำรองเลี้ยงชีพ (PVD)',
    ssfShare: 'ประกันสังคม (SSF)',

    // Step by step
    stepByStepTitle: 'ขั้นตอนการคำนวณภาษี (Step-by-Step Tax Calculation)',
    stepGross: 'เงินได้พึงประเมิน (เงินเดือน + โบนัส)',
    stepMinusExpenses: 'หัก ค่าใช้จ่ายส่วนตัว (50% ไม่เกิน 100,000 บาท)',
    stepMinusPersonal: 'หัก ค่าลดหย่อนส่วนตัวของผู้มีเงินได้',
    stepMinusSSF: 'หัก เงินสมทบประกันสังคมภาคบังคับ',
    stepMinusPVD: 'หัก เงินสะสมกองทุนสำรองเลี้ยงชีพ (PVD)',
    stepEqualsTaxable: 'คงเหลือ เงินได้สุทธินำไปคำนวณภาษี',
    stepTotalTax: 'ภาษีเงินได้บุคคลธรรมดาที่ต้องชำระ',

    // Brackets
    taxBracketTitle: 'ตารางขั้นบันไดภาษีเงินได้บุคคลธรรมดา (Tax Brackets)',
    bracketColTier: 'ขั้นเงินได้สุทธิ',
    bracketColRate: 'อัตราภาษี',
    bracketColTaxable: 'เงินได้ในขั้นนี้',
    bracketColTax: 'ภาษีในขั้นนี้',
    bracketColCumulative: 'ภาษีสะสม',
    exempt: 'ยกเว้นภาษี (Exempt)',
    currentTierBadge: 'ฐานปัจจุบันของคุณ',
    overTierBadge: 'ผ่านขั้นนี้',

    // Comparison Table
    comparisonTitle: 'ตารางสรุปเปรียบเทียบ รายปี vs รายเดือน',
    itemCol: 'รายการ',
    yearlyCol: 'ยอดรวมต่อปี (Yearly)',
    monthlyCol: 'เฉลี่ยต่อเดือน (Monthly)',
    diffExpenseNotice: '* หมายเหตุ: ค่าใช้จ่ายส่วนตัว 100,000 บาท และค่าลดหย่อนส่วนตัว 60,000 บาท เป็นสิทธิลดหย่อนทางภาษีตามกฎหมาย (ไม่ได้ถูกหักออกจากเงินเดือนในสลิป)',

    // Tips & Rules
    revenueDeptNote: 'อ้างอิงตามเกณฑ์กรมสรรพากรแห่งประเทศไทย มาตรา 40(1) พ.ร.บ.ประมวลรัษฎากร',
  },
  en: {
    appTitle: 'Thailand Tax & Net Income Calculator',
    appSubtitle: 'Calculate Personal Income Tax, mandatory deductions, Provident Fund, and net take-home salary.',

    // Top Bar & Controls
    thaiTaxYear: 'Tax Year 2024-2026 (Thailand)',
    reset: 'Reset',
    savedToDevice: 'Saved to device',
    copySummary: 'Copy Summary',
    copied: 'Copied!',
    print: 'Print',
    quickPresets: 'Quick Presets',

    // Views
    yearlyView: 'Yearly View',
    monthlyView: 'Monthly View',
    compareView: 'Yearly vs Monthly',

    // Multiple Salary Scenarios & Comparisons
    scenariosTitle: 'Salary Scenarios',
    addSalaryBtn: 'Add Salary (+)',
    removeSalaryBtn: 'Remove Salary (-)',
    maxScenariosNotice: 'Maximum 5 salaries (Up to 5)',
    confirmDeleteSalaryTitle: 'Confirm Delete Salary',
    confirmDeleteSalaryMessage: 'Are you sure you want to delete this salary scenario?',
    confirmDeleteSalaryDetails: 'All inputs, deductions, and calculation results for this scenario will be permanently removed.',
    confirmDeleteBtn: 'Delete Salary',
    cancelBtn: 'Cancel',
    confirmResetTitle: 'Confirm Reset All Data',
    confirmResetMessage: 'Are you sure you want to reset all data back to default?',
    confirmResetDetails: 'All saved salary scenarios, inputs, and custom configurations on this device will be cleared and restored to default settings.',
    confirmResetBtn: 'Reset All Data',
    compareScenariosTitle: 'Scenario Comparison & Difference Analysis',
    baselineSalaryLabel: 'Baseline (Salary 1)',
    diffTakeHomeYear: 'Net Take-Home Diff (Yearly)',
    diffTakeHomeMonth: 'Net Take-Home Diff (Monthly)',
    diffTaxYear: 'Tax Payable Diff (Yearly)',
    diffTaxRate: 'Effective Tax Rate Diff',
    moreTakeHome: 'More Take-Home',
    lessTakeHome: 'Less Take-Home',
    moreTax: 'Higher Tax',
    lessTax: 'Lower Tax',
    differenceVsBaseline: 'Difference vs Salary 1',
    reorderSalary: 'Reorder Salaries',
    moveLeft: 'Move Left (Previous)',
    moveRight: 'Move Right (Next)',
    dragToReorder: 'Drag to reorder or use arrows',

    // Input Section
    inputTitle: '1. Income & Provident Fund (PVD)',
    salaryInputLabel: 'Salary',
    perMonth: 'per Month',
    perYear: 'per Year',
    monthlySalary: 'Monthly Salary',
    yearlySalary: 'Annual Salary',
    salaryPlaceholder: 'e.g. 50,000',

    // PVD (Employee)
    pvdTitle: 'Provident Fund (PVD)',
    pvdDescription: 'Input monthly contribution percent (Deductible up to 15% of salary, capped at 500,000 THB/year).',
    pvdRate: 'Employee PVD Rate',
    pvdMonthlyAmount: 'Monthly Employee PVD',
    pvdAnnualAmount: 'Annual Employee PVD',

    // PVD (Company / Employer Part - Split)
    employerPvdTitle: 'Company PVD Contribution (Employer Match)',
    employerPvdDescription: 'Additional retirement match contributed directly by the employer (not deducted from take-home pay).',
    employerPvdRate: 'Company Match Rate',
    employerPvdMonthlyAmount: 'Company Match per Month',
    employerPvdAnnualAmount: 'Company Match per Year',
    totalPvdMonthlyAmount: 'Total PVD per Month (Employee + Company)',
    totalPvdAnnualAmount: 'Total PVD per Year (Employee + Company)',
    companyPvdComparisonTitle: 'Company PVD Contribution Comparison (Employer Part)',
    companyPvdComparisonSubtitle: 'Additional retirement benefit paid by the company per month and per year (separate split section, not mixed into previous net take-home summary)',
    matchEmployeeBtn: 'Match Employee %',

    // Bonus
    bonusToggle: 'Add Annual Bonus / Extra Income',
    bonusMonths: 'Bonus in Months',
    bonusCustom: 'Custom Bonus Amount',
    bonusTotal: 'Total Bonus',

    // Auto Deductions (Mandatory)
    autoDeductionsTitle: '2. Mandatory Deductions (Auto-Applied by Law)',
    autoDeductionsDesc: 'The app automatically applies all statutory standard deductions according to the Thai Revenue Department.',
    standardExpense: 'Standard Expense / Living Cost Deduction',
    standardExpenseNote: '50% of employment income, capped at 100,000 THB/year',
    personalAllowance: 'Personal Tax Allowance',
    personalAllowanceNote: 'Statutory individual taxpayer allowance of 60,000 THB',
    socialSecurity: 'Social Security Fund (SSF)',
    socialSecurityNote: '5% of monthly wage, capped at 15,000 THB salary (Max 750 THB/mo or 9,000 THB/yr)',

    // Results Summary
    summaryTitle: 'Tax & Net Income Summary',
    netTakeHome: 'Net Take-Home Pay',
    netTakeHomeMonthly: 'Monthly Net Take-Home',
    netTakeHomeYearly: 'Annual Net Take-Home',
    netTakeHomeDesc: 'Actual cash deposited into your bank account after Tax, SSF, and PVD',
    taxPayable: 'Tax to Pay (PIT)',
    taxPayableMonthly: 'Monthly Tax Payable',
    taxPayableYearly: 'Annual Tax Payable',
    taxPayableDesc: 'Annual Personal Income Tax due',
    effectiveTaxRate: 'Effective Tax Rate',
    marginalRate: 'Top Marginal Tax Rate',
    netTaxableIncome: 'Net Taxable Income',
    grossAnnualIncome: 'Gross Assessable Income',
    totalDeductions: 'Total Deductions & Allowances',

    // Stacked Breakdown
    paycheckBreakdown: 'Income Distribution Breakdown',
    takeHomeShare: 'Net Take-Home',
    taxShare: 'Personal Income Tax',
    pvdShare: 'Provident Fund (PVD)',
    ssfShare: 'Social Security (SSF)',

    // Step by step
    stepByStepTitle: 'Step-by-Step Tax Calculation Bridge',
    stepGross: 'Gross Assessable Income (Salary + Bonus)',
    stepMinusExpenses: 'Less: Standard Expense (50%, max 100,000 THB)',
    stepMinusPersonal: 'Less: Personal Allowance (60,000 THB)',
    stepMinusSSF: 'Less: Mandatory Social Security (SSF)',
    stepMinusPVD: 'Less: Provident Fund (PVD)',
    stepEqualsTaxable: 'Equals: Net Taxable Income',
    stepTotalTax: 'Total Personal Income Tax Payable',

    // Brackets
    taxBracketTitle: 'Progressive Tax Brackets (Thailand PIT)',
    bracketColTier: 'Net Taxable Bracket',
    bracketColRate: 'Tax Rate',
    bracketColTaxable: 'Taxable in Tier',
    bracketColTax: 'Tax in Tier',
    bracketColCumulative: 'Cumulative Tax',
    exempt: 'Tax Exempt (0%)',
    currentTierBadge: 'Your Top Bracket',
    overTierBadge: 'Fully Taxed',

    // Comparison Table
    comparisonTitle: 'Detailed Yearly vs Monthly Comparison',
    itemCol: 'Component',
    yearlyCol: 'Annual Total (THB)',
    monthlyCol: 'Monthly Average (THB)',
    diffExpenseNotice: '* Note: Standard Expense (100k THB) and Personal Allowance (60k THB) are statutory tax allowances used to compute taxable income; they are not deducted from your paycheck.',

    // Tips & Rules
    revenueDeptNote: 'Grounded in Thai Revenue Department (Revenue Code Section 40(1)) regulations.',
  },
};
