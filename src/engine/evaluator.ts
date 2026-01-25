import {
  ConditionNode,
  ConditionResult,
  Subject,
  SubjectResult,
  isLeafCondition,
  isLogicalGroup,
  LeafCondition,
  LogicalGroup,
} from '../types';
import { executeComparison } from './operators';

/**
 * Get a value from an object using dot notation path
 * @param obj The object to get the value from
 * @param path The dot notation path (e.g., "user.profile.age")
 * @returns The value at the path, or undefined if not found
 */
export function getValueByPath(obj: Subject, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }

    if (typeof current !== 'object') {
      return undefined;
    }

    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

/**
 * Evaluate a leaf condition against a subject
 */
function evaluateLeafCondition(
  condition: LeafCondition,
  subject: Subject,
  includeDetails: boolean
): ConditionResult {
  const actualValue = getValueByPath(subject, condition.field);
  const match = executeComparison(condition.operator, actualValue, condition.value);

  const result: ConditionResult = {
    condition,
    match,
  };

  if (includeDetails) {
    result.actualValue = actualValue;
  }

  return result;
}

/**
 * Evaluate an AND logical group
 */
function evaluateAnd(
  conditions: ConditionNode[],
  subject: Subject,
  includeDetails: boolean
): { match: boolean; children: ConditionResult[] } {
  const children: ConditionResult[] = [];
  let match = true;

  for (const child of conditions) {
    const result = evaluateCondition(child, subject, includeDetails);
    children.push(result);

    if (!result.match) {
      match = false;
      // Continue evaluating for detailed results if needed
      if (!includeDetails) {
        break;
      }
    }
  }

  return { match, children };
}

/**
 * Evaluate an OR logical group
 */
function evaluateOr(
  conditions: ConditionNode[],
  subject: Subject,
  includeDetails: boolean
): { match: boolean; children: ConditionResult[] } {
  const children: ConditionResult[] = [];
  let match = false;

  for (const child of conditions) {
    const result = evaluateCondition(child, subject, includeDetails);
    children.push(result);

    if (result.match) {
      match = true;
      // Continue evaluating for detailed results if needed
      if (!includeDetails) {
        break;
      }
    }
  }

  return { match, children };
}

/**
 * Evaluate a NOT logical group
 */
function evaluateNot(
  conditions: ConditionNode[],
  subject: Subject,
  includeDetails: boolean
): { match: boolean; children: ConditionResult[] } {
  // NOT should have exactly one child
  if (conditions.length !== 1) {
    throw new Error('NOT operator must have exactly one child condition');
  }

  const childResult = evaluateCondition(conditions[0], subject, includeDetails);
  return {
    match: !childResult.match,
    children: [childResult],
  };
}

/**
 * Evaluate a logical group against a subject
 */
function evaluateLogicalGroup(
  group: LogicalGroup,
  subject: Subject,
  includeDetails: boolean
): ConditionResult {
  let evaluation: { match: boolean; children: ConditionResult[] };

  switch (group.logic) {
    case 'AND':
      evaluation = evaluateAnd(group.conditions, subject, includeDetails);
      break;
    case 'OR':
      evaluation = evaluateOr(group.conditions, subject, includeDetails);
      break;
    case 'NOT':
      evaluation = evaluateNot(group.conditions, subject, includeDetails);
      break;
    default:
      throw new Error(`Unknown logical operator: ${group.logic}`);
  }

  const result: ConditionResult = {
    condition: group,
    match: evaluation.match,
  };

  if (includeDetails) {
    result.children = evaluation.children;
  }

  return result;
}

/**
 * Evaluate a condition node against a subject
 */
export function evaluateCondition(
  condition: ConditionNode,
  subject: Subject,
  includeDetails = false
): ConditionResult {
  if (isLeafCondition(condition)) {
    return evaluateLeafCondition(condition, subject, includeDetails);
  }

  if (isLogicalGroup(condition)) {
    return evaluateLogicalGroup(condition, subject, includeDetails);
  }

  throw new Error('Invalid condition node');
}

/**
 * Evaluate multiple subjects against a condition tree
 */
export function evaluateSubjects(
  subjects: Subject[],
  conditions: ConditionNode,
  includeDetails = false
): SubjectResult[] {
  return subjects.map((subject, index) => {
    const result = evaluateCondition(conditions, subject, includeDetails);

    const subjectResult: SubjectResult = {
      index,
      match: result.match,
    };

    if (includeDetails) {
      subjectResult.details = result;
    }

    return subjectResult;
  });
}
