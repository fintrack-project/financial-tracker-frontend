export const formatNumber = (value: number, decimals: number = 2 ): string => {
  // Normalize negative zero to positive zero
  const normalizedValue = value === 0 ? 0 : value;
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(normalizedValue);
};