import { formatNumber } from '../../../shared/utils/FormatNumber';

describe('FormatNumber Utility', () => {
  describe('formatNumber function', () => {
    test('should format positive numbers correctly', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56');
      expect(formatNumber(1000000)).toBe('1,000,000.00');
      expect(formatNumber(0.99)).toBe('0.99');
    });

    test('should format negative numbers correctly', () => {
      expect(formatNumber(-1234.56)).toBe('-1,234.56');
      expect(formatNumber(-1000000)).toBe('-1,000,000.00');
      expect(formatNumber(-0.99)).toBe('-0.99');
    });

    test('should handle zero values', () => {
      expect(formatNumber(0)).toBe('0.00');
      expect(formatNumber(-0)).toBe('0.00');
    });

    test('should handle decimal places correctly', () => {
      expect(formatNumber(1234.5)).toBe('1,234.50');
      expect(formatNumber(1234.567)).toBe('1,234.57'); // Rounds to 2 decimal places
      expect(formatNumber(1234.564)).toBe('1,234.56'); // Rounds down
      expect(formatNumber(1234.565)).toBe('1,234.57'); // Rounds up
    });

    test('should handle custom decimal places', () => {
      expect(formatNumber(1234.567, 3)).toBe('1,234.567');
      expect(formatNumber(1234.5, 1)).toBe('1,234.5');
      expect(formatNumber(1234, 0)).toBe('1,234');
    });

    test('should handle large numbers with proper comma separation', () => {
      expect(formatNumber(1234567.89)).toBe('1,234,567.89');
      expect(formatNumber(999999999.99)).toBe('999,999,999.99');
    });

    test('should handle small decimal numbers', () => {
      expect(formatNumber(0.1)).toBe('0.10');
      expect(formatNumber(0.01)).toBe('0.01');
      expect(formatNumber(0.001)).toBe('0.00'); // Rounds to 2 decimal places
    });

    test('should handle edge cases', () => {
      expect(formatNumber(Number.MAX_SAFE_INTEGER)).toBe('9,007,199,254,740,991.00');
      expect(formatNumber(Number.MIN_SAFE_INTEGER)).toBe('-9,007,199,254,740,991.00');
    });

    test('should handle NaN and Infinity', () => {
      expect(formatNumber(NaN)).toBe('NaN');
      expect(formatNumber(Infinity)).toBe('∞');
      expect(formatNumber(-Infinity)).toBe('-∞');
    });

    test('should handle very small numbers', () => {
      expect(formatNumber(0.0000001)).toBe('0.00'); // Rounds to 2 decimal places
      expect(formatNumber(0.0000009)).toBe('0.00'); // Rounds to 2 decimal places
    });

    test('should handle very large numbers', () => {
      expect(formatNumber(999999999999.99)).toBe('999,999,999,999.99');
    });
  });

  describe('Number formatting consistency', () => {
    test('should maintain consistent decimal places', () => {
      const numbers = [1, 1.1, 1.11, 1.111, 1.1111];
      const expected = ['1.00', '1.10', '1.11', '1.11', '1.11'];
      
      numbers.forEach((num, index) => {
        expect(formatNumber(num)).toBe(expected[index]);
      });
    });

    test('should handle financial amounts correctly', () => {
      expect(formatNumber(1000.50)).toBe('1,000.50');
      expect(formatNumber(2500.75)).toBe('2,500.75');
      expect(formatNumber(1000000.00)).toBe('1,000,000.00');
    });

    test('should handle currency-like values', () => {
      expect(formatNumber(123.45)).toBe('123.45');
      expect(formatNumber(1234.56)).toBe('1,234.56');
      expect(formatNumber(12345.67)).toBe('12,345.67');
    });
  });

  describe('Edge cases and error handling', () => {
    test('should handle null and undefined gracefully', () => {
      // Intl.NumberFormat converts null to 0, but undefined becomes NaN
      expect(formatNumber(null as any)).toBe('0.00');
      expect(formatNumber(undefined as any)).toBe('NaN');
    });

    test('should handle string numbers', () => {
      // Intl.NumberFormat converts strings to numbers, so no error is thrown
      expect(formatNumber('123.45' as any)).toBe('123.45');
    });

    test('should handle boolean values', () => {
      // Intl.NumberFormat converts booleans to numbers (true=1, false=0), so no error is thrown
      expect(formatNumber(true as any)).toBe('1.00');
      expect(formatNumber(false as any)).toBe('0.00');
    });
  });
}); 