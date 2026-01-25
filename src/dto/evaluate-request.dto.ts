import { ConditionNodeDTO, validateConditionNode, ConditionValidationError } from './condition.dto';

/**
 * Request DTO for the evaluate endpoint
 */
export interface EvaluateRequestDTO {
  /** Array of subjects to evaluate (valid JSON objects) */
  subjects: Record<string, unknown>[];
  /** Condition tree to evaluate against */
  conditions: ConditionNodeDTO;
}

/**
 * Validation error structure
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate the evaluate request
 */
export function validateEvaluateRequest(body: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== 'object') {
    errors.push({ field: 'body', message: 'Request body is required' });
    return errors;
  }

  const request = body as Record<string, unknown>;

  // Validate subjects
  if (!request.subjects) {
    errors.push({ field: 'subjects', message: 'subjects is required' });
  } else if (!Array.isArray(request.subjects)) {
    errors.push({ field: 'subjects', message: 'subjects must be an array' });
  } else if (request.subjects.length === 0) {
    errors.push({ field: 'subjects', message: 'subjects must contain at least one item' });
  } else {
    // Validate each subject is an object
    request.subjects.forEach((subject, index) => {
      if (subject === null || typeof subject !== 'object' || Array.isArray(subject)) {
        errors.push({
          field: `subjects[${index}]`,
          message: 'each subject must be a valid JSON object',
        });
      }
    });
  }

  // Validate conditions
  if (!request.conditions) {
    errors.push({ field: 'conditions', message: 'conditions is required' });
  } else {
    const conditionErrors = validateConditionNode(request.conditions);
    errors.push(
      ...conditionErrors.map((e: ConditionValidationError) => ({
        field: e.path,
        message: e.message,
      }))
    );
  }

  return errors;
}
