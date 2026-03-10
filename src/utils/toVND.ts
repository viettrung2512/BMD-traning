function formatCurrency(value: number, suffix = 'đ'): string {
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + suffix;
}
function toVND(value: number | string): string {
  if (typeof value === 'string') {
    value = parseFloat(value.replace(/[^0-9.-]+/g, ''));
  }
  return formatCurrency(value);
}

export { toVND, formatCurrency };