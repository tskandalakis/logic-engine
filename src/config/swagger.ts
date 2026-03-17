import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Logic Engine API',
      version: '1.0.0',
      description: 'A generic policy evaluation engine that evaluates whether subject data matches a set of configurable, nested conditions.',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        LeafCondition: {
          type: 'object',
          required: ['field', 'operator', 'value'],
          properties: {
            field: {
              type: 'string',
              description: 'The field path to evaluate (supports dot notation)',
              example: 'user.age',
            },
            operator: {
              type: 'string',
              enum: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'],
              description: 'The comparison operator',
            },
            value: {
              description: 'The value to compare against',
            },
          },
        },
        LogicalGroup: {
          type: 'object',
          required: ['logic', 'conditions'],
          properties: {
            logic: {
              type: 'string',
              enum: ['AND', 'OR', 'NOT'],
              description: 'Logical operator to combine child conditions',
            },
            conditions: {
              type: 'array',
              items: {
                oneOf: [
                  { $ref: '#/components/schemas/LeafCondition' },
                  { $ref: '#/components/schemas/LogicalGroup' },
                ],
              },
              description: 'Child conditions',
            },
          },
        },
        ConditionNode: {
          oneOf: [
            { $ref: '#/components/schemas/LeafCondition' },
            { $ref: '#/components/schemas/LogicalGroup' },
          ],
        },
        EvaluateRequest: {
          type: 'object',
          required: ['subjects', 'conditions'],
          properties: {
            subjects: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: true,
              },
              description: 'Array of subjects to evaluate',
            },
            conditions: {
              $ref: '#/components/schemas/ConditionNode',
            },
          },
        },
        SubjectResult: {
          type: 'object',
          properties: {
            index: {
              type: 'integer',
              description: 'Index of the subject in the input array',
            },
            match: {
              type: 'boolean',
              description: 'Whether the subject matched all conditions',
            },
            details: {
              type: 'object',
              description: 'Detailed breakdown of condition evaluation (when requested)',
            },
          },
        },
        EvaluateResponse: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/SubjectResult',
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            details: {
              type: 'object',
              description: 'Additional error details',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
