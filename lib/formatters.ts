/**
 * Formats Nigerian Naira.
 */
export function formatPrice(price: number, currency = "NGN"): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formats compact numbers.
 * Example:
 * 1200 -> 1.2K
 * 5600000 -> 5.6M
 */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Formats percentages.
 */
export function formatPercentage(value: number): string {
  return `${value}%`;
}