/**
 * Comparison operators for leaf conditions
 */
export type ComparisonOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte';

/**
 * Logical operators for combining conditions
 */
export type LogicalOperator = 'AND' | 'OR' | 'NOT';

/**
 * A leaf condition that compares a field value against a target value
 */
export interface LeafCondition {
  /** The field path to evaluate (supports dot notation) */
  field: string;
  /** The comparison operator */
  operator: ComparisonOperator;
  /** The value to compare against */
  value: unknown;
}

/**
 * A logical group that combines multiple conditions
 */
export interface LogicalGroup {
  /** Logical operator to combine child conditions */
  logic: LogicalOperator;
  /** Child conditions */
  conditions: ConditionNode[];
}

/**
 * A condition node can be either a leaf condition or a logical group
 */
export type ConditionNode = LeafCondition | LogicalGroup;

/**
 * Subject data to evaluate (any valid JSON object)
 */
export type Subject = Record<string, unknown>;

/**
 * Result of evaluating a single condition
 */
export interface ConditionResult {
  /** The condition that was evaluated */
  condition: ConditionNode;
  /** Whether this condition matched */
  match: boolean;
  /** The actual value found in the subject (for leaf conditions) */
  actualValue?: unknown;
  /** Child results for logical groups */
  children?: ConditionResult[];
}

/**
 * Result of evaluating a subject
 */
export interface SubjectResult {
  /** Index of the subject in the input array */
  index: number;
  /** Whether the subject matched all conditions */
  match: boolean;
  /** Detailed breakdown of condition evaluation */
  details?: ConditionResult;
}

/**
 * Type guard to check if a condition is a leaf condition
 */
export function isLeafCondition(condition: ConditionNode): condition is LeafCondition {
  return 'field' in condition && 'operator' in condition;
}

/**
 * Type guard to check if a condition is a logical group
 */
export function isLogicalGroup(condition: ConditionNode): condition is LogicalGroup {
  return 'logic' in condition && 'conditions' in condition;
}
