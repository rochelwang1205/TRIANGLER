import { z } from 'zod';

export const loginSchema = z.object({
  account: z.string().min(1, '請輸入帳號'),
  password: z.string().min(6, '密碼至少 6 個字元'),
});

export const registerSchema = z
  .object({
    account: z
      .string()
      .min(3, '帳號至少 3 個字元')
      .max(20, '帳號最多 20 個字元')
      .regex(/^[a-zA-Z0-9_]+$/, '帳號只能包含英文、數字、底線'),
    password: z.string().min(6, '密碼至少 6 個字元'),
    confirmPassword: z.string().min(1, '請再次輸入密碼'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '兩次密碼不一致',
    path: ['confirmPassword'],
  });

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, '密碼至少 6 個字元'),
    confirmPassword: z.string().min(1, '請再次輸入密碼'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '兩次密碼不一致',
    path: ['confirmPassword'],
  });

export const forgotAccountSchema = z.object({
  account: z.string().min(1, '請輸入帳號'),
});

export const checkoutSchema = z.object({
  number: z
    .string()
    .min(1, '請輸入信用卡號')
    .regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, '請輸入 16 位信用卡號'),
  expiry: z
    .string()
    .min(1, '請輸入有效年月')
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, '格式：MM/YY'),
  cvc: z.string().min(1, '請輸入末三碼').regex(/^\d{3}$/, '請輸入 3 位數字'),
  email: z.string().min(1, '請輸入信箱').email('請輸入有效 Email'),
});
