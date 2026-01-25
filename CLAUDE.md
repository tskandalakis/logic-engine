# CLAUDE.md

This file provides guidance for Claude Code when working on this project.

## Project Overview

**logic-engine** - An engine used to check if subject input matches a set of provided conditions.

### Purpose
<!-- TODO: Expand on the project's purpose and use cases -->
- Evaluate input data against configurable condition sets
- Provide a flexible rule-matching system

### Target Use Cases
<!-- TODO: Define specific use cases -->
- Form validation
- Business rule evaluation
- Access control decisions
- Data filtering/matching

## Tech Stack

<!-- TODO: Finalize technology choices -->
- **Language**: (To be determined - TypeScript/JavaScript recommended)
- **Runtime**: (Node.js / Browser / Both)
- **Build Tool**: (To be determined)
- **Testing**: (To be determined)

## Project Structure

```
logic-engine/
├── CLAUDE.md          # This file
├── README.md          # Project documentation
├── LICENSE            # MIT License
├── src/               # Source code (to be created)
│   ├── index.ts       # Main entry point
│   ├── engine/        # Core engine logic
│   ├── conditions/    # Condition types and evaluators
│   └── types/         # TypeScript type definitions
├── tests/             # Test files (to be created)
└── examples/          # Usage examples (to be created)
```

## Development Guidelines

### Code Style
<!-- TODO: Define code style preferences -->
- Use clear, descriptive names
- Keep functions small and focused
- Write comprehensive tests for condition logic

### Commit Messages
- Use conventional commits format: `type(scope): description`
- Types: feat, fix, docs, refactor, test, chore

## Common Commands

<!-- TODO: Add commands once package.json is set up -->
```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Lint
npm run lint
```

## Project Scope & Requirements

### Core Features (To Be Defined)
<!-- TODO: Refine these features based on project needs -->

1. **Condition Types**
   - [ ] Equality checks (equals, not equals)
   - [ ] Comparison operators (gt, lt, gte, lte)
   - [ ] String matching (contains, startsWith, endsWith, regex)
   - [ ] Array operations (includes, excludes, all, any)
   - [ ] Null/undefined checks
   - [ ] Type checks

2. **Logical Operators**
   - [ ] AND (all conditions must match)
   - [ ] OR (any condition must match)
   - [ ] NOT (negate condition)
   - [ ] Nested conditions

3. **Engine Features**
   - [ ] Define condition schema/DSL
   - [ ] Evaluate single subject against conditions
   - [ ] Batch evaluation
   - [ ] Detailed match results/explanations
   - [ ] Custom condition handlers

### API Design (Draft)
<!-- TODO: Refine API design -->
```typescript
// Example usage concept
const engine = new LogicEngine();

const conditions = {
  operator: 'AND',
  conditions: [
    { field: 'age', operator: 'gte', value: 18 },
    { field: 'status', operator: 'equals', value: 'active' }
  ]
};

const subject = { age: 25, status: 'active' };

const result = engine.evaluate(subject, conditions);
// => { match: true, details: [...] }
```

### Non-Goals
<!-- TODO: Define what's out of scope -->
-

### Open Questions
<!-- TODO: Add questions that need answers -->
- What serialization format for conditions? (JSON, custom DSL?)
- Should it support async condition evaluation?
- What level of error handling/validation is needed?
- Performance requirements?

## Current Status

**Phase**: Initial Setup

### Next Steps
1. [ ] Finalize tech stack decisions
2. [ ] Set up package.json and project configuration
3. [ ] Define core types and interfaces
4. [ ] Implement basic condition evaluators
5. [ ] Add comprehensive tests
6. [ ] Create documentation and examples

---

*This document is a living guide. Update it as the project evolves.*
