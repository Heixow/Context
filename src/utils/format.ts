const numberFormat = new Intl.NumberFormat('en-US')

export function formatNumber(value: number): string {
  return numberFormat.format(value)
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${(value * 100).toFixed(fractionDigits)}%`
}
