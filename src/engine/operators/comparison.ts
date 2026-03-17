import { ComparisonOperator } from '../../types';

/**
 * Coerce values for comparison
 * Attempts to convert strings to numbers when comparing with numbers
 */
function coerceForComparison(actual: unknown, target: unknown): [unknown, unknown] {
  // If both are the same type, no coercion needed
  if (typeof actual === typeof target) {
    return [actual, target];
  }

  // Coerce string to number if comparing with a number
  if (typeof actual === 'string' && typeof target === 'number') {
    const parsed = parseFloat(actual);
    if (!isNaN(parsed)) {
      return [parsed, target];
    }
  }

  // Coerce number to string if comparing with a string (for equality)
  if (typeof actual === 'number' && typeof target === 'string') {
    const parsed = parseFloat(target);
    if (!isNaN(parsed)) {
      return [actual, parsed];
    }
  }

  return [actual, target];
}

/**
 * Check strict equality (with type coercion)
 */
function equals(actual: unknown, target: unknown): boolean {
  const [a, t] = coerceForComparison(actual, target);
  return a === t;
}

/**
 * Check not equal (with type coercion)
 */
function notEquals(actual: unknown, target: unknown): boolean {
  return !equals(actual, target);
}

/**
 * Check greater than (with type coercion)
 */
function greaterThan(actual: unknown, target: unknown): boolean {
  const [a, t] = coerceForComparison(actual, target);

  if (typeof a === 'number' && typeof t === 'number') {
    return a > t;
  }

  if (typeof a === 'string' && typeof t === 'string') {
    return a > t;
  }

  return false;
}

/**
 * Check greater than or equal (with type coercion)
 */
function greaterThanOrEqual(actual: unknown, target: unknown): boolean {
  const [a, t] = coerceForComparison(actual, target);

  if (typeof a === 'number' && typeof t === 'number') {
    return a >= t;
  }

  if (typeof a === 'string' && typeof t === 'string') {
    return a >= t;
  }

  return false;
}

/**
 * Check less than (with type coercion)
 */
function lessThan(actual: unknown, target: unknown): boolean {
  const [a, t] = coerceForComparison(actual, target);

  if (typeof a === 'number' && typeof t === 'number') {
    return a < t;
  }

  if (typeof a === 'string' && typeof t === 'string') {
    return a < t;
  }

  return false;
}

/**
 * Check less than or equal (with type coercion)
 */
function lessThanOrEqual(actual: unknown, target: unknown): boolean {
  const [a, t] = coerceForComparison(actual, target);

  if (typeof a === 'number' && typeof t === 'number') {
    return a <= t;
  }

  if (typeof a === 'string' && typeof t === 'string') {
    return a <= t;
  }

  return false;
}

/**
 * Map of comparison operators to their implementation
 */
export const comparisonOperators: Record<ComparisonOperator, (actual: unknown, target: unknown) => boolean> = {
  eq: equals,
  neq: notEquals,
  gt: greaterThan,
  gte: greaterThanOrEqual,
  lt: lessThan,
  lte: lessThanOrEqual,
};

/**
 * Execute a comparison operation
 */
export function executeComparison(
  operator: ComparisonOperator,
  actual: unknown,
  target: unknown
): boolean {
  const operatorFn = comparisonOperators[operator];
  if (!operatorFn) {
    throw new Error(`Unknown comparison operator: ${operator}`);
  }
  return operatorFn(actual, target);
}
