import { describe, it, expect } from 'vitest';
import { evaluateCondition, evaluateSubjects, getValueByPath } from '../../src/engine/evaluator';
import { ConditionNode, Subject } from '../../src/types';

describe('getValueByPath', () => {
  it('should get top-level values', () => {
    const obj = { name: 'John', age: 30 };
    expect(getValueByPath(obj, 'name')).toBe('John');
    expect(getValueByPath(obj, 'age')).toBe(30);
  });

  it('should get nested values using dot notation', () => {
    const obj = { user: { profile: { age: 25 } } };
    expect(getValueByPath(obj, 'user.profile.age')).toBe(25);
  });

  it('should return undefined for missing paths', () => {
    const obj = { name: 'John' };
    expect(getValueByPath(obj, 'age')).toBeUndefined();
    expect(getValueByPath(obj, 'user.profile.age')).toBeUndefined();
  });

  it('should handle null values in path', () => {
    const obj = { user: null };
    expect(getValueByPath(obj as Subject, 'user.name')).toBeUndefined();
  });
});

describe('evaluateCondition', () => {
  describe('Leaf conditions', () => {
    it('should evaluate a simple equality condition', () => {
      const subject = { status: 'active' };
      const condition: ConditionNode = { field: 'status', operator: 'eq', value: 'active' };

      const result = evaluateCondition(condition, subject);
      expect(result.match).toBe(true);
    });

    it('should evaluate a comparison condition', () => {
      const subject = { age: 25 };
      const condition: ConditionNode = { field: 'age', operator: 'gte', value: 18 };

      const result = evaluateCondition(condition, subject);
      expect(result.match).toBe(true);
    });

    it('should handle missing fields gracefully', () => {
      const subject = { name: 'John' };
      const condition: ConditionNode = { field: 'age', operator: 'gte', value: 18 };

      const result = evaluateCondition(condition, subject);
      expect(result.match).toBe(false);
    });

    it('should include actualValue when details requested', () => {
      const subject = { age: 25 };
      const condition: ConditionNode = { field: 'age', operator: 'gte', value: 18 };

      const result = evaluateCondition(condition, subject, true);
      expect(result.actualValue).toBe(25);
    });
  });

  describe('AND logical operator', () => {
    it('should return true when all conditions match', () => {
      const subject = { age: 25, status: 'active' };
      const condition: ConditionNode = {
        logic: 'AND',
        conditions: [
          { field: 'age', operator: 'gte', value: 18 },
          { field: 'status', operator: 'eq', value: 'active' },
        ],
      };

      const result = evaluateCondition(condition, subject);
      expect(result.match).toBe(true);
    });

    it('should return false when any condition fails', () => {
      const subject = { age: 17, status: 'active' };
      const condition: ConditionNode = {
        logic: 'AND',
        conditions: [
          { field: 'age', operator: 'gte', value: 18 },
          { field: 'status', operator: 'eq', value: 'active' },
        ],
      };

      const result = evaluateCondition(condition, subject);
      expect(result.match).toBe(false);
    });
  });

  describe('OR logical operator', () => {
    it('should return true when any condition matches', () => {
      const subject = { role: 'admin', department: 'sales' };
      const condition: ConditionNode = {
        logic: 'OR',
        conditions: [
          { field: 'role', operator: 'eq', value: 'admin' },
          { field: 'role', operator: 'eq', value: 'manager' },
        ],
      };

      const result = evaluateCondition(condition, subject);
      expect(result.match).toBe(true);
    });

    it('should return false when no conditions match', () => {
      const subject = { role: 'user' };
      const condition: ConditionNode = {
        logic: 'OR',
        conditions: [
          { field: 'role', operator: 'eq', value: 'admin' },
          { field: 'role', operator: 'eq', value: 'manager' },
        ],
      };

      const result = evaluateCondition(condition, subject);
      expect(result.match).toBe(false);
    });
  });

  describe('NOT logical operator', () => {
    it('should negate a true condition to false', () => {
      const subject = { status: 'inactive' };
      const condition: ConditionNode = {
        logic: 'NOT',
        conditions: [{ field: 'status', operator: 'eq', value: 'active' }],
      };

      const result = evaluateCondition(condition, subject);
      expect(result.match).toBe(true);
    });

    it('should negate a false condition to true', () => {
      const subject = { status: 'active' };
      const condition: ConditionNode = {
        logic: 'NOT',
        conditions: [{ field: 'status', operator: 'eq', value: 'active' }],
      };

      const result = evaluateCondition(condition, subject);
      expect(result.match).toBe(false);
    });
  });

  describe('Nested conditions', () => {
    it('should handle nested logical groups', () => {
      const subject = { age: 25, status: 'active', role: 'admin' };
      const condition: ConditionNode = {
        logic: 'AND',
        conditions: [
          { field: 'age', operator: 'gte', value: 18 },
          {
            logic: 'OR',
            conditions: [
              { field: 'role', operator: 'eq', value: 'admin' },
              { field: 'role', operator: 'eq', value: 'manager' },
            ],
          },
        ],
      };

      const result = evaluateCondition(condition, subject);
      expect(result.match).toBe(true);
    });
  });
});

describe('evaluateSubjects', () => {
  it('should evaluate multiple subjects', () => {
    const subjects = [
      { age: 25, status: 'active' },
      { age: 17, status: 'active' },
      { age: 30, status: 'inactive' },
    ];

    const conditions: ConditionNode = {
      logic: 'AND',
      conditions: [
        { field: 'age', operator: 'gte', value: 18 },
        { field: 'status', operator: 'eq', value: 'active' },
      ],
    };

    const results = evaluateSubjects(subjects, conditions);

    expect(results).toHaveLength(3);
    expect(results[0]).toEqual({ index: 0, match: true });
    expect(results[1]).toEqual({ index: 1, match: false });
    expect(results[2]).toEqual({ index: 2, match: false });
  });

  it('should include details when requested', () => {
    const subjects = [{ age: 25 }];
    const conditions: ConditionNode = { field: 'age', operator: 'gte', value: 18 };

    const results = evaluateSubjects(subjects, conditions, true);

    expect(results[0].details).toBeDefined();
    expect(results[0].details?.match).toBe(true);
    expect(results[0].details?.actualValue).toBe(25);
  });
});
