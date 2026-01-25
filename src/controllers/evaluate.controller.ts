import { Request, Response, NextFunction } from 'express';
import { EvaluateRequestDTO, validateEvaluateRequest } from '../dto/evaluate-request.dto';
import { EvaluateResponseDTO } from '../dto/evaluate-response.dto';
import { engineService } from '../services/engine.service';
import { ConditionNode, Subject } from '../types';
import { ApiError } from '../middleware/error-handler';

/**
 * Controller for the evaluate endpoint
 */
export class EvaluateController {
  /**
   * Handle POST /evaluate
   */
  async evaluate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check if details should be included (query param)
      const includeDetails = req.query.details === 'true';

      // Validate request body
      const validationErrors = validateEvaluateRequest(req.body);

      if (validationErrors.length > 0) {
        throw new ApiError(400, 'Validation failed', validationErrors);
      }

      const dto = req.body as EvaluateRequestDTO;

      // Evaluate subjects
      const results = engineService.evaluate(
        dto.subjects as Subject[],
        dto.conditions as ConditionNode,
        includeDetails
      );

      const response: EvaluateResponseDTO = { results };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

// Singleton instance
export const evaluateController = new EvaluateController();
