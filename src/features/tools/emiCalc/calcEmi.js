// Loan EMI (monthly payment) and a year-by-year table of what is paid and what is left.
// Inputs are numbers: principal (rupees), annualRate (percent), months. Returns { ok, emi, total, interest, years: [...] }.
export function calcEmi(principal, annualRate, months) {
  if (!(principal > 0) || !(months >= 1) || annualRate < 0 || !Number.isFinite(annualRate)) return { ok: false, errorKey: 'emi.bad' };
  if (principal > 1e12 || months > 1200 || annualRate > 100) return { ok: false, errorKey: 'emi.range' };
  const n = Math.round(months);
  const r = annualRate / 12 / 100;
  const emi = r === 0 ? principal / n : (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1);
  let balance = principal;
  const years = [];
  let paidP = 0;
  let paidI = 0;
  for (let month = 1; month <= n; month += 1) {
    const interest = balance * r;
    const part = Math.min(balance, emi - interest);
    balance -= part;
    paidP += part;
    paidI += interest;
    if (month % 12 === 0 || month === n) {
      years.push({ year: Math.ceil(month / 12), principal: paidP, interest: paidI, balance: Math.max(0, balance) });
      paidP = 0;
      paidI = 0;
    }
  }
  const total = emi * n;
  return { ok: true, emi, total, interest: total - principal, years };
}
