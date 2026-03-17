import { describe, it, expect } from 'vitest';
import { executeComparison } from '../../../src/engine/operators/comparison';

describe('Comparison Operators', () => {
  describe('eq (equals)', () => {
    it('should return true for equal numbers', () => {
      expect(executeComparison('eq', 5, 5)).toBe(true);
    });

    it('should return false for different numbers', () => {
      expect(executeComparison('eq', 5, 10)).toBe(false);
    });

    it('should return true for equal strings', () => {
      expect(executeComparison('eq', 'hello', 'hello')).toBe(true);
    });

    it('should return false for different strings', () => {
      expect(executeComparison('eq', 'hello', 'world')).toBe(false);
    });

    it('should support type coercion for string to number', () => {
      expect(executeComparison('eq', '25', 25)).toBe(true);
    });

    it('should support type coercion for number to string', () => {
      expect(executeComparison('eq', 25, '25')).toBe(true);
    });

    it('should return true for equal booleans', () => {
      expect(executeComparison('eq', true, true)).toBe(true);
    });

    it('should return false for null vs undefined', () => {
      expect(executeComparison('eq', null, undefined)).toBe(false);
    });
  });

  describe('neq (not equals)', () => {
    it('should return false for equal values', () => {
      expect(executeComparison('neq', 5, 5)).toBe(false);
    });

    it('should return true for different values', () => {
      expect(executeComparison('neq', 5, 10)).toBe(true);
    });

    it('should support type coercion', () => {
      expect(executeComparison('neq', '25', 25)).toBe(false);
    });
  });

  describe('gt (greater than)', () => {
    it('should return true when actual > target', () => {
      expect(executeComparison('gt', 10, 5)).toBe(true);
    });

    it('should return false when actual < target', () => {
      expect(executeComparison('gt', 5, 10)).toBe(false);
    });

    it('should return false when actual === target', () => {
      expect(executeComparison('gt', 5, 5)).toBe(false);
    });

    it('should support type coercion', () => {
      expect(executeComparison('gt', '30', 25)).toBe(true);
    });

    it('should compare strings lexicographically', () => {
      expect(executeComparison('gt', 'b', 'a')).toBe(true);
    });
  });

  describe('gte (greater than or equal)', () => {
    it('should return true when actual > target', () => {
      expect(executeComparison('gte', 10, 5)).toBe(true);
    });

    it('should return true when actual === target', () => {
      expect(executeComparison('gte', 5, 5)).toBe(true);
    });

    it('should return false when actual < target', () => {
      expect(executeComparison('gte', 5, 10)).toBe(false);
    });

    it('should support type coercion', () => {
      expect(executeComparison('gte', '25', 25)).toBe(true);
    });
  });

  describe('lt (less than)', () => {
    it('should return true when actual < target', () => {
      expect(executeComparison('lt', 5, 10)).toBe(true);
    });

    it('should return false when actual > target', () => {
      expect(executeComparison('lt', 10, 5)).toBe(false);
    });

    it('should return false when actual === target', () => {
      expect(executeComparison('lt', 5, 5)).toBe(false);
    });

    it('should support type coercion', () => {
      expect(executeComparison('lt', '20', 25)).toBe(true);
    });
  });

  describe('lte (less than or equal)', () => {
    it('should return true when actual < target', () => {
      expect(executeComparison('lte', 5, 10)).toBe(true);
    });

    it('should return true when actual === target', () => {
      expect(executeComparison('lte', 5, 5)).toBe(true);
    });

    it('should return false when actual > target', () => {
      expect(executeComparison('lte', 10, 5)).toBe(false);
    });

    it('should support type coercion', () => {
      expect(executeComparison('lte', '25', 25)).toBe(true);
    });
  });
});
