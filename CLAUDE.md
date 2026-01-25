# CLAUDE.md

This file provides guidance for Claude Code when working on this project.

## Project Overview

**logic-engine** - A generic policy evaluation engine exposed as a REST API. Evaluates whether subject data matches a set of configurable, nested conditions.

### Purpose

- Provide a generic engine for evaluating various kinds of policies
- Evaluate input data (subjects) against configurable condition sets
- Support nested logical conditions for complex policy rules
- Expose functionality via a well-documented REST API

### Target Use Cases

- **Policy Evaluation** - Generic rule engine for business policies
- **Access Control** - Determine if a subject meets authorization criteria
- **Data Filtering** - Match records against complex filter conditions
- **Validation Rules** - Evaluate whether data meets defined criteria

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js (or Fastify - TBD)
- **API Documentation**: OpenAPI/Swagger with auto-generated docs from DTOs
- **Validation**: class-validator + class-transformer (for DTO validation)
- **Build Tool**: tsup or tsc
- **Testing**: Jest (or Vitest - TBD)

## Project Structure

```
logic-engine/
├── CLAUDE.md              # This file
├── README.md              # Project documentation
├── LICENSE                # MIT License
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── src/
│   ├── index.ts           # Application entry point
│   ├── app.ts             # Express app setup
│   ├── routes/            # API route definitions
│   │   └── evaluate.ts    # POST /evaluate endpoint
│   ├── controllers/       # Request handlers
│   │   └── evaluate.controller.ts
│   ├── services/          # Business logic
│   │   └── engine.service.ts
│   ├── engine/            # Core evaluation engine
│   │   ├── evaluator.ts   # Main evaluation logic
│   │   └── operators/     # Operator implementations
│   ├── dto/               # Data Transfer Objects (request/response schemas)
│   │   ├── evaluate-request.dto.ts
│   │   ├── evaluate-response.dto.ts
│   │   └── condition.dto.ts
│   └── types/             # TypeScript type definitions
│       └── index.ts
├── tests/                 # Test files
└── docs/                  # API documentation
```

## API Design

### Endpoints

#### `POST /evaluate`

Evaluates a list of subjects against a condition tree.

**Request DTO:**

```typescript
interface EvaluateRequestDTO {
  /** Array of subjects to evaluate (valid JSON objects) */
  subjects: Record<string, unknown>[];

  /** Condition tree to evaluate against */
  conditions: ConditionNode;
}

/** A condition can be either a leaf condition or a logical group */
type ConditionNode = LeafCondition | LogicalGroup;

interface LeafCondition {
  /** The field path to evaluate (supports dot notation, e.g., "user.age") */
  field: string;

  /** The comparison operator */
  operator: ComparisonOperator;

  /** The value to compare against */
  value: unknown;
}

interface LogicalGroup {
  /** Logical operator to combine child conditions */
  logic: 'AND' | 'OR' | 'NOT';

  /** Child conditions (nested) */
  conditions: ConditionNode[];
}

type ComparisonOperator =
  | 'eq'        // equals
  | 'neq'       // not equals
  | 'gt'        // greater than
  | 'gte'       // greater than or equal
  | 'lt'        // less than
  | 'lte';      // less than or equal
```

**Response DTO:**

```typescript
interface EvaluateResponseDTO {
  /** Results for each subject in the same order as input */
  results: SubjectResult[];
}

interface SubjectResult {
  /** Index of the subject in the input array */
  index: number;

  /** Whether the subject matched all conditions */
  match: boolean;

  /** Optional: detailed breakdown of condition evaluation */
  details?: ConditionResult[];
}

interface ConditionResult {
  /** The condition that was evaluated */
  condition: ConditionNode;

  /** Whether this specific condition matched */
  match: boolean;

  /** Actual value found in the subject */
  actualValue?: unknown;
}
```

**Example Request:**

```json
{
  "subjects": [
    { "age": 25, "status": "active", "role": "admin" },
    { "age": 17, "status": "active", "role": "user" },
    { "age": 30, "status": "inactive", "role": "admin" }
  ],
  "conditions": {
    "logic": "AND",
    "conditions": [
      { "field": "age", "operator": "gte", "value": 18 },
      { "field": "status", "operator": "eq", "value": "active" }
    ]
  }
}
```

**Example Response:**

```json
{
  "results": [
    { "index": 0, "match": true },
    { "index": 1, "match": false },
    { "index": 2, "match": false }
  ]
}
```

## Development Guidelines

### Code Style

- Use clear, descriptive names
- Keep functions small and focused
- Write comprehensive tests for all operators and edge cases
- DTOs must be fully documented with JSDoc comments for OpenAPI generation

### DTO Schema Requirements

- All DTOs must use class-validator decorators for validation
- Include clear JSDoc comments for Swagger documentation
- Validate nested structures properly
- Provide meaningful error messages for validation failures

### Commit Messages

- Use conventional commits format: `type(scope): description`
- Types: feat, fix, docs, refactor, test, chore

## Common Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint

# Generate API docs
npm run docs
```

## Project Scope & Requirements

### Phase 1: Core Features (MVP)

1. **Comparison Operators (Simple)**
   - [ ] `eq` - equals (strict equality)
   - [ ] `neq` - not equals
   - [ ] `gt` - greater than
   - [ ] `gte` - greater than or equal
   - [ ] `lt` - less than
   - [ ] `lte` - less than or equal

2. **Logical Operators**
   - [ ] `AND` - all conditions must match
   - [ ] `OR` - any condition must match
   - [ ] `NOT` - negate condition (single child)
   - [ ] Nested conditions (unlimited depth)

3. **API Features**
   - [ ] `POST /evaluate` endpoint
   - [ ] Batch subject evaluation
   - [ ] JSON request/response
   - [ ] OpenAPI documentation
   - [ ] Request validation with clear error messages

4. **Engine Features**
   - [ ] Dot notation field access (e.g., `user.profile.age`)
   - [ ] Handle missing fields gracefully
   - [ ] Type coercion rules (or strict typing - TBD)

### Phase 2: Extended Operators (Future)

- [ ] `contains` - string contains
- [ ] `startsWith` / `endsWith` - string prefix/suffix
- [ ] `regex` - regular expression match
- [ ] `in` / `notIn` - value in array
- [ ] `exists` / `notExists` - field existence
- [ ] `isNull` / `isNotNull` - null checks

### Non-Goals (Out of Scope)

- Async condition evaluation
- Database integration
- Condition persistence/storage
- Authentication/authorization (handled by consuming service)
- Custom operator plugins (for now)

### Open Questions

- [ ] Should we include detailed evaluation breakdown in response by default, or make it opt-in via query param?
- [ ] Type coercion: strict comparison only, or allow "25" == 25?
- [ ] Maximum nesting depth limit for conditions?
- [ ] Rate limiting / request size limits?

## Current Status

**Phase**: Initial Setup → Project Scaffolding

### Next Steps

1. [ ] Set up package.json with dependencies
2. [ ] Configure TypeScript (tsconfig.json)
3. [ ] Set up Express app with basic structure
4. [ ] Define DTO classes with validation decorators
5. [ ] Implement core evaluation engine
6. [ ] Implement comparison operators
7. [ ] Implement logical operators (AND/OR/NOT)
8. [ ] Add POST /evaluate endpoint
9. [ ] Set up OpenAPI/Swagger documentation
10. [ ] Write comprehensive tests
11. [ ] Add error handling middleware

---

*This document is a living guide. Update it as the project evolves.*
