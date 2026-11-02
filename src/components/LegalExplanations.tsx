import React, { useState } from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { BookOpen, ChevronDown, ChevronUp, Shield, ExternalLink } from 'lucide-react';

interface LegalExplanationsProps {
  lang: Language;
}

export const LegalExplanations: React.FC<LegalExplanationsProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-hidden"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">
            {lang === 'th'
              ? 'เกณฑ์กฎหมายภาษีและค่าลดหย่อนภาคบังคับของไทย (กรมสรรพากร)'
              : 'Thai Tax Regulations & Statutory Deductions Guide'}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
          <span>{isOpen ? (lang === 'th' ? 'ซ่อน' : 'Hide') : (lang === 'th' ? 'ดูรายละเอียด' : 'Details')}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-3 leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                {lang === 'th' ? '1. ค่าใช้จ่ายส่วนตัว (Living Cost)' : '1. Standard Expense Deduction'}
              </h4>
              <p>
                {lang === 'th'
                  ? 'ตามมาตรา 42 ทวิ ประมวลรัษฎากร เงินได้พึงประเมินประเภทที่ 1 (เงินเดือน ค่าจ้าง โบนัส) สามารถหักค่าใช้จ่ายได้ 50% ของเงินได้ แต่รวมกันต้องไม่เกิน 100,000 บาทต่อปี'
                  : 'Under Section 42 bis of the Revenue Code, salary income (Section 40(1)) allows a standard deduction of 50%, capped at a statutory maximum of 100,000 THB/year.'}
              </p>
            </div>

            <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                {lang === 'th' ? '2. ค่าลดหย่อนส่วนตัว (Personal Allowance)' : '2. Personal Allowance'}
              </h4>
              <p>
                {lang === 'th'
                  ? 'ตามมาตรา 47(1)(ก) ผู้มีเงินได้ทุกคนสามารถหักลดหย่อนส่วนตัวได้ทันที 60,000 บาท โดยไม่มีเงื่อนไขเพิ่มเติม'
                  : 'Under Section 47(1)(a), every individual taxpayer is entitled to a fixed personal allowance of 60,000 THB with no prerequisites.'}
              </p>
            </div>

            <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                {lang === 'th' ? '3. กองทุนประกันสังคม (SSF)' : '3. Social Security Fund (SSF)'}
              </h4>
              <p>
                {lang === 'th'
                  ? 'กฎหมายประกันสังคมกำหนดหักเงินสมทบฝ่ายลูกจ้าง 5% ของค่าจ้าง โดยคิดจากฐานค่าจ้างขั้นต่ำ 1,650 บาท และสูงสุดไม่เกิน 15,000 บาท ทำให้เงินสมทบสูงสุดอยู่ที่ 750 บาท/เดือน (9,000 บาท/ปี)'
                  : 'Employees contribute 5% of monthly salary capped at a wage ceiling of 15,000 THB. The maximum monthly deduction is 750 THB (9,000 THB/year), which is fully deductible from taxable income.'}
              </p>
            </div>

            <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                {lang === 'th' ? '4. กองทุนสำรองเลี้ยงชีพ (PVD)' : '4. Provident Fund (PVD)'}
              </h4>
              <p>
                {lang === 'th'
                  ? 'เงินสะสมที่ลูกจ้างจ่ายเข้ากองทุนสำรองเลี้ยงชีพตาม พ.ร.บ.กองทุนสำรองเลี้ยงชีพ หักลดหย่อนได้ตามจริงตามอัตราที่เลือก (ปกติ 2% - 15%) สูงสุดไม่เกิน 500,000 บาทต่อปี'
                  : 'Employee contributions to an authorized provident fund (PVD) can be deducted from income up to the employee election rate (2%-15%), capped at 500,000 THB per tax year.'}
              </p>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>
              {lang === 'th'
                ? 'แบบยื่นภาษีประจำปี: ภ.ง.ด. 91 (สำหรับผู้มีเงินเดือนประจำอย่างเดียว) ยื่นทางออนไลน์ได้ถึงวันที่ 8 เมษายนของทุกปี'
                : 'Annual PIT filing: Form P.N.D. 91 (Employment income only), online filing deadline is typically April 8th annually.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
