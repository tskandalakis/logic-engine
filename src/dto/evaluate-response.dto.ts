import { ConditionNode, ConditionResult } from '../types';

/**
 * Result for a single subject evaluation
 */
export interface SubjectResultDTO {
  /** Index of the subject in the input array */
  index: number;
  /** Whether the subject matched all conditions */
  match: boolean;
  /** Detailed breakdown of condition evaluation (when requested) */
  details?: ConditionResultDTO;
}

/**
 * Detailed result for a single condition evaluation
 */
export interface ConditionResultDTO {
  /** The condition that was evaluated */
  condition: ConditionNode;
  /** Whether this condition matched */
  match: boolean;
  /** The actual value found in the subject (for leaf conditions) */
  actualValue?: unknown;
  /** Child results for logical groups */
  children?: ConditionResultDTO[];
}

/**
 * Response DTO for the evaluate endpoint
 */
export interface EvaluateResponseDTO {
  /** Results for each subject in the same order as input */
  results: SubjectResultDTO[];
}

/**
 * Convert internal ConditionResult to DTO format
 */
export function toConditionResultDTO(result: ConditionResult): ConditionResultDTO {
  const dto: ConditionResultDTO = {
    condition: result.condition,
    match: result.match,
  };

  if (result.actualValue !== undefined) {
    dto.actualValue = result.actualValue;
  }

  if (result.children && result.children.length > 0) {
    dto.children = result.children.map(toConditionResultDTO);
  }

  return dto;
}
