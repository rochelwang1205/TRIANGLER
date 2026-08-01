import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  checkoutSchema,
} from '@/lib/validation/schemas';

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({
      account: 'demo_user',
      password: 'TriangleDemo2026',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty account', () => {
    const result = loginSchema.safeParse({ account: '', password: '123456' });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({ account: 'demo', password: '123' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse({
      account: 'new_user',
      password: 'secret12',
      confirmPassword: 'secret12',
    });
    expect(result.success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      account: 'new_user',
      password: 'secret12',
      confirmPassword: 'other12',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid account characters', () => {
    const result = registerSchema.safeParse({
      account: 'bad user!',
      password: 'secret12',
      confirmPassword: 'secret12',
    });
    expect(result.success).toBe(false);
  });
});

describe('checkoutSchema', () => {
  it('accepts valid card details', () => {
    const result = checkoutSchema.safeParse({
      number: '4111 1111 1111 1111',
      expiry: '12/28',
      cvc: '123',
      email: 'user@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid expiry format', () => {
    const result = checkoutSchema.safeParse({
      number: '4111 1111 1111 1111',
      expiry: '2028-12',
      cvc: '123',
      email: 'user@example.com',
    });
    expect(result.success).toBe(false);
  });
});
