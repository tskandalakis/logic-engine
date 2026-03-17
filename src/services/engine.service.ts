import { evaluateSubjects } from '../engine';
import { ConditionNode, Subject, SubjectResult } from '../types';

/**
 * Engine service for evaluating conditions against subjects
 */
export class EngineService {
  /**
   * Evaluate a list of subjects against a condition tree
   * @param subjects Array of subjects to evaluate
   * @param conditions Condition tree to evaluate against
   * @param includeDetails Whether to include detailed evaluation breakdown
   * @returns Array of results for each subject
   */
  evaluate(
    subjects: Subject[],
    conditions: ConditionNode,
    includeDetails = false
  ): SubjectResult[] {
    return evaluateSubjects(subjects, conditions, includeDetails);
  }
}

// Singleton instance
export const engineService = new EngineService();
