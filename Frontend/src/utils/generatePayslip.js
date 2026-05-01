import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BRAND_R = 148;
const BRAND_G = 25;
const BRAND_B = 54;
const BRAND = [BRAND_R, BRAND_G, BRAND_B];

const fmtMoney = (v) => `LKR ${Number(v ?? 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate  = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export function generatePayslip(payroll) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();

  const emp       = payroll.employee ?? {};
  const dept      = emp.department?.name ?? '—';
  const job       = emp.job?.title ?? emp.job_title ?? '—';
  const monthName = MONTH_NAMES[(payroll.month ?? 1) - 1];
  const year      = payroll.year ?? '';
  const period    = `${monthName} ${year}`;

  // ── Header bar ─────────────────────────────────────────────────────────────
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, pw, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYSLIP', 14, 13);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('HR Management System', 14, 20);
  doc.text(`Pay Period: ${period}`, 14, 26);

  // Status badge
  const statusColors = { paid: [46, 125, 50], approved: [21, 101, 192], draft: [80, 80, 80] };
  const sc = statusColors[payroll.status] ?? [80, 80, 80];
  doc.setFillColor(...sc);
  doc.roundedRect(pw - 46, 6, 32, 10, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text((payroll.status ?? 'draft').toUpperCase(), pw - 30, 12.5, { align: 'center' });

  // ── Employee info ───────────────────────────────────────────────────────────
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  const leftX = 14;
  const rightX = pw / 2 + 10;
  let y = 42;

  const row = (label, value, x) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text(label, x, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    doc.text(String(value ?? '—'), x + 28, y);
  };

  row('Employee',    `${emp.first_name ?? ''} ${emp.last_name ?? ''}`.trim(), leftX);
  row('Employee ID', `EMP-${String(emp.id ?? '').padStart(4, '0')}`,          rightX);
  y += 7;
  row('Department',  dept,   leftX);
  row('Job Title',   job,    rightX);
  y += 7;
  row('NIC',         emp.nic ?? '—',                        leftX);
  row('Paid Date',   payroll.paid_at ? fmtDate(payroll.paid_at) : '—', rightX);

  // Divider
  y += 6;
  doc.setDrawColor(...BRAND);
  doc.setLineWidth(0.5);
  doc.line(14, y, pw - 14, y);
  y += 8;

  // ── Earnings ────────────────────────────────────────────────────────────────
  const allowances = Array.isArray(payroll.allowances) ? payroll.allowances : [];
  const earningsRows = [
    ['Basic Salary', fmtMoney(payroll.basic_salary)],
    ...allowances.map((a) => [a.name ?? 'Allowance', fmtMoney(a.amount)]),
  ];

  autoTable(doc, {
    startY: y,
    head: [['Earnings', 'Amount']],
    body: earningsRows,
    theme: 'plain',
    headStyles: {
      fillColor: BRAND,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
    },
    bodyStyles: { fontSize: 9, cellPadding: { top: 2.5, bottom: 2.5, left: 4, right: 4 } },
    alternateRowStyles: { fillColor: [252, 248, 249] },
    columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
    margin: { left: 14, right: pw / 2 + 4 },
    tableWidth: pw / 2 - 18,
  });

  const afterEarnings = doc.lastAutoTable.finalY;

  // Gross total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setFillColor(240, 240, 240);
  doc.rect(14, afterEarnings, pw / 2 - 18, 8, 'F');
  doc.setTextColor(30, 30, 30);
  doc.text('Gross Salary', 18, afterEarnings + 5.5);
  doc.text(fmtMoney(payroll.gross_salary), pw / 2 - 4, afterEarnings + 5.5, { align: 'right' });

  // ── Deductions ──────────────────────────────────────────────────────────────
  const deductions = Array.isArray(payroll.deductions) ? payroll.deductions : [];
  const deductionRows = deductions.length
    ? deductions.map((d) => [d.name ?? 'Deduction', fmtMoney(d.amount)])
    : [['No deductions', '—']];

  autoTable(doc, {
    startY: y,
    head: [['Deductions', 'Amount']],
    body: deductionRows,
    theme: 'plain',
    headStyles: {
      fillColor: [50, 50, 50],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
    },
    bodyStyles: { fontSize: 9, cellPadding: { top: 2.5, bottom: 2.5, left: 4, right: 4 } },
    alternateRowStyles: { fillColor: [252, 252, 252] },
    columnStyles: { 1: { halign: 'right', fontStyle: 'bold', textColor: [180, 0, 0] } },
    margin: { left: pw / 2 + 4, right: 14 },
    tableWidth: pw / 2 - 18,
  });

  const afterDeductions = doc.lastAutoTable.finalY;
  const totalDeductions = deductions.reduce((s, d) => s + Number(d.amount || 0), 0);

  // Total deductions row
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setFillColor(240, 240, 240);
  doc.rect(pw / 2 + 4, afterDeductions, pw / 2 - 18, 8, 'F');
  doc.setTextColor(30, 30, 30);
  doc.text('Total Deductions', pw / 2 + 8, afterDeductions + 5.5);
  doc.setTextColor(180, 0, 0);
  doc.text(`- ${fmtMoney(totalDeductions)}`, pw - 14, afterDeductions + 5.5, { align: 'right' });

  // ── Net Pay banner ──────────────────────────────────────────────────────────
  const netY = Math.max(afterEarnings, afterDeductions) + 14;

  doc.setFillColor(...BRAND);
  doc.roundedRect(14, netY, pw - 28, 18, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('NET PAY', 22, netY + 11);

  doc.setFontSize(14);
  doc.text(fmtMoney(payroll.net_salary), pw - 22, netY + 11.5, { align: 'right' });

  // ── Attendance summary (if present) ────────────────────────────────────────
  if (payroll.working_days || payroll.days_worked) {
    const attY = netY + 26;
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('ATTENDANCE SUMMARY', 14, attY);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(14, attY + 2, pw - 14, attY + 2);

    const attData = [
      ['Working Days', payroll.working_days ?? '—', 'Days Worked', payroll.days_worked ?? '—'],
      ['Days Absent', payroll.days_absent ?? '—', 'Days Late', payroll.days_late ?? '—'],
    ];
    autoTable(doc, {
      startY: attY + 5,
      body: attData,
      theme: 'plain',
      bodyStyles: { fontSize: 8.5, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [100, 100, 100] },
        1: { fontStyle: 'bold', textColor: [30, 30, 30] },
        2: { fontStyle: 'bold', textColor: [100, 100, 100] },
        3: { fontStyle: 'bold', textColor: [30, 30, 30] },
      },
      margin: { left: 14, right: 14 },
    });
  }

  // ── Footer ──────────────────────────────────────────────────────────────────
  doc.setFillColor(245, 245, 245);
  doc.rect(0, ph - 18, pw, 18, 'F');
  doc.setTextColor(130, 130, 130);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('This is a system-generated payslip and does not require a signature.', pw / 2, ph - 10, { align: 'center' });
  doc.text(`Generated on ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`, pw / 2, ph - 5, { align: 'center' });

  // ── Save ────────────────────────────────────────────────────────────────────
  const name = `${emp.first_name ?? 'Employee'}_${emp.last_name ?? ''}`.trim().replace(/\s+/g, '_');
  doc.save(`Payslip_${name}_${period.replace(' ', '_')}.pdf`);
}
