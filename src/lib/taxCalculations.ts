export function calculateTaxDue(income: number): number {
  let tax: number;
  if (income <= 15600) {
    tax = income * 0.105;
  } else if (income <= 53500) {
    tax = 1638 + (income - 15600) * 0.175;
  } else if (income <= 78100) {
    tax = 8270.5 + (income - 53500) * 0.30;
  } else if (income <= 180000) {
    tax = 15650.5 + (income - 78100) * 0.33;
  } else {
    tax = 49277.5 + (income - 180000) * 0.39;
  }
  return Math.round(tax * 100) / 100;
}

export function calculateIETCBase(income: number): number {
  if (income < 24000) return 0;
  if (income <= 66000) return 520;
  if (income <= 70000) return Math.max(520 - 0.13 * (income - 66000), 0);
  return 0;
}

export function calculateIETC(income: number, monthsEligible: number): number {
  const base = calculateIETCBase(income);
  return Math.round(base * (monthsEligible / 12) * 100) / 100;
}

export function getIETCMessage(income: number, monthsEligible: number, includeIETC: boolean): string | null {
  if (!includeIETC) return null;
  if (income < 24000) {
    return "IETC does not apply — your income is below $24,000.";
  }
  if (income > 70000) {
    return "IETC does not apply — your income exceeds $70,000.";
  }
  const ietc = calculateIETC(income, monthsEligible);
  if (income > 66000) {
    return `Partial IETC of $${ietc.toFixed(2)} applied (reduced for income over $66,000, pro-rated for ${monthsEligible} month${monthsEligible !== 1 ? "s" : ""}).`;
  }
  if (monthsEligible < 12) {
    return `IETC of $${ietc.toFixed(2)} applied (pro-rated for ${monthsEligible} month${monthsEligible !== 1 ? "s" : ""}).`;
  }
  return `Full IETC of $${ietc.toFixed(2)} applied.`;
}
