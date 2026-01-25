/**
 * Valid comparison operators
 */
export const COMPARISON_OPERATORS = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'] as const;
export type ComparisonOperatorType = (typeof COMPARISON_OPERATORS)[number];

/**
 * Valid logical operators
 */
export const LOGICAL_OPERATORS = ['AND', 'OR', 'NOT'] as const;
export type LogicalOperatorType = (typeof LOGICAL_OPERATORS)[number];

/**
 * Maximum nesting depth for conditions
 */
export const MAX_NESTING_DEPTH = 2;

/**
 * DTO for a leaf condition that compares a field value
 */
export interface LeafConditionDTO {
  /** The field path to evaluate (supports dot notation, e.g., "user.age") */
  field: string;
  /** The comparison operator */
  operator: ComparisonOperatorType;
  /** The value to compare against */
  value: unknown;
}

/**
 * DTO for a logical group that combines multiple conditions
 */
export interface LogicalGroupDTO {
  /** Logical operator to combine child conditions */
  logic: LogicalOperatorType;
  /** Child conditions */
  conditions: ConditionNodeDTO[];
}

/**
 * Union type for condition nodes
 */
export type ConditionNodeDTO = LeafConditionDTO | LogicalGroupDTO;

/**
 * Type guard to check if a condition is a leaf condition
 */
export function isLeafConditionDTO(condition: unknown): condition is LeafConditionDTO {
  return (
    typeof condition === 'object' &&
    condition !== null &&
    'field' in condition &&
    'operator' in condition &&
    'value' in condition
  );
}

/**
 * Type guard to check if a condition is a logical group
 */
export function isLogicalGroupDTO(condition: unknown): condition is LogicalGroupDTO {
  return (
    typeof condition === 'object' &&
    condition !== null &&
    'logic' in condition &&
    'conditions' in condition
  );
}

/**
 * Validation error for conditions
 */
export interface ConditionValidationError {
  path: string;
  message: string;
}

/**
 * Validate a condition node recursively
 */
export function validateConditionNode(
  condition: unknown,
  path = 'conditions',
  depth = 0
): ConditionValidationError[] {
  const errors: ConditionValidationError[] = [];

  if (condition === null || condition === undefined) {
    errors.push({ path, message: 'condition is required' });
    return errors;
  }

  if (typeof condition !== 'object') {
    errors.push({ path, message: 'condition must be an object' });
    return errors;
  }

  // Check if it's a logical group
  if (isLogicalGroupDTO(condition)) {
    // Validate nesting depth (depth >= MAX means this logical group exceeds allowed nesting)
    if (depth >= MAX_NESTING_DEPTH) {
      errors.push({ path, message: `Maximum nesting depth of ${MAX_NESTING_DEPTH} exceeded` });
      return errors;
    }

    // Validate logic operator
    if (!LOGICAL_OPERATORS.includes(condition.logic as LogicalOperatorType)) {
      errors.push({
        path: `${path}.logic`,
        message: `logic must be one of: ${LOGICAL_OPERATORS.join(', ')}`,
      });
    }

    // Validate conditions array
    if (!Array.isArray(condition.conditions)) {
      errors.push({ path: `${path}.conditions`, message: 'conditions must be an array' });
    } else {
      // Validate NOT has exactly one child
      if (condition.logic === 'NOT' && condition.conditions.length !== 1) {
        errors.push({
          path: `${path}.conditions`,
          message: 'NOT operator must have exactly one child condition',
        });
      }

      // Validate each child condition
      condition.conditions.forEach((child, index) => {
        errors.push(...validateConditionNode(child, `${path}.conditions[${index}]`, depth + 1));
      });
    }

    return errors;
  }

  // Check if it's a leaf condition
  if (isLeafConditionDTO(condition)) {
    // Validate field
    if (typeof condition.field !== 'string' || condition.field.trim() === '') {
      errors.push({ path: `${path}.field`, message: 'field must be a non-empty string' });
    }

    // Validate operator
    if (!COMPARISON_OPERATORS.includes(condition.operator as ComparisonOperatorType)) {
      errors.push({
        path: `${path}.operator`,
        message: `operator must be one of: ${COMPARISON_OPERATORS.join(', ')}`,
      });
    }

    // value can be any type, so no validation needed beyond existence check
    if (condition.value === undefined) {
      errors.push({ path: `${path}.value`, message: 'value is required' });
    }

    return errors;
  }

  // Neither a valid leaf condition nor a logical group
  errors.push({
    path,
    message: 'condition must be either a leaf condition (field, operator, value) or a logical group (logic, conditions)',
  });

  return errors;
}
