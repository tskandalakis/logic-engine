import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';

describe('POST /evaluate', () => {
  describe('Basic evaluation', () => {
    it('should evaluate subjects against conditions', async () => {
      const response = await request(app)
        .post('/evaluate')
        .send({
          subjects: [
            { age: 25, status: 'active' },
            { age: 17, status: 'active' },
            { age: 30, status: 'inactive' },
          ],
          conditions: {
            logic: 'AND',
            conditions: [
              { field: 'age', operator: 'gte', value: 18 },
              { field: 'status', operator: 'eq', value: 'active' },
            ],
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.results).toHaveLength(3);
      expect(response.body.results[0]).toEqual({ index: 0, match: true });
      expect(response.body.results[1]).toEqual({ index: 1, match: false });
      expect(response.body.results[2]).toEqual({ index: 2, match: false });
    });

    it('should evaluate a simple leaf condition', async () => {
      const response = await request(app)
        .post('/evaluate')
        .send({
          subjects: [{ status: 'active' }, { status: 'inactive' }],
          conditions: { field: 'status', operator: 'eq', value: 'active' },
        });

      expect(response.status).toBe(200);
      expect(response.body.results[0].match).toBe(true);
      expect(response.body.results[1].match).toBe(false);
    });
  });

  describe('Details query parameter', () => {
    it('should not include details by default', async () => {
      const response = await request(app)
        .post('/evaluate')
        .send({
          subjects: [{ age: 25 }],
          conditions: { field: 'age', operator: 'gte', value: 18 },
        });

      expect(response.status).toBe(200);
      expect(response.body.results[0].details).toBeUndefined();
    });

    it('should include details when details=true', async () => {
      const response = await request(app)
        .post('/evaluate?details=true')
        .send({
          subjects: [{ age: 25 }],
          conditions: { field: 'age', operator: 'gte', value: 18 },
        });

      expect(response.status).toBe(200);
      expect(response.body.results[0].details).toBeDefined();
      expect(response.body.results[0].details.match).toBe(true);
      expect(response.body.results[0].details.actualValue).toBe(25);
    });
  });

  describe('Validation', () => {
    it('should return 400 for empty subjects array', async () => {
      const response = await request(app)
        .post('/evaluate')
        .send({
          subjects: [],
          conditions: { field: 'age', operator: 'gte', value: 18 },
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 for invalid operator', async () => {
      const response = await request(app)
        .post('/evaluate')
        .send({
          subjects: [{ age: 25 }],
          conditions: { field: 'age', operator: 'invalid', value: 18 },
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 for excessive nesting depth', async () => {
      const response = await request(app)
        .post('/evaluate')
        .send({
          subjects: [{ age: 25 }],
          conditions: {
            logic: 'AND',
            conditions: [
              {
                logic: 'AND',
                conditions: [
                  {
                    logic: 'AND',
                    conditions: [{ field: 'age', operator: 'gte', value: 18 }],
                  },
                ],
              },
            ],
          },
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: expect.stringContaining('nesting depth') }),
        ])
      );
    });
  });

  describe('Type coercion', () => {
    it('should support string to number coercion', async () => {
      const response = await request(app)
        .post('/evaluate')
        .send({
          subjects: [{ age: '25' }],
          conditions: { field: 'age', operator: 'gte', value: 18 },
        });

      expect(response.status).toBe(200);
      expect(response.body.results[0].match).toBe(true);
    });
  });

  describe('Dot notation', () => {
    it('should support dot notation for nested fields', async () => {
      const response = await request(app)
        .post('/evaluate')
        .send({
          subjects: [{ user: { profile: { age: 25 } } }],
          conditions: { field: 'user.profile.age', operator: 'gte', value: 18 },
        });

      expect(response.status).toBe(200);
      expect(response.body.results[0].match).toBe(true);
    });
  });
});

describe('GET /health', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
