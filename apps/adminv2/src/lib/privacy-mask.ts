export const MASKED_AMOUNT = '••••••';
export const MASKED_NUMBER = '••';

export function formatPrivateNumber(value: number, isMasked: boolean): string {
  return isMasked ? MASKED_NUMBER : String(value);
}

export function formatPrivateDate(
  iso: string,
  isMasked: boolean,
  formatter: (iso: string) => string,
): string {
  return isMasked ? '••• ••, ••••' : formatter(iso);
}

export function maskDigitsInText(text: string, isMasked: boolean): string {
  return isMasked ? text.replace(/\d/g, '•') : text;
}

export function formatAmount(
  amount: number,
  currency: string,
  maximumFractionDigits = 2,
): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(maximumFractionDigits)}`;
  }
}

export function formatPrivateAmount(
  amount: number,
  currency: string,
  isMasked: boolean,
  options?: { maximumFractionDigits?: number; prefix?: string },
): string {
  if (isMasked) {
    return MASKED_AMOUNT;
  }

  const formatted = formatAmount(amount, currency, options?.maximumFractionDigits ?? 2);
  return options?.prefix ? `${options.prefix}${formatted}` : formatted;
}
