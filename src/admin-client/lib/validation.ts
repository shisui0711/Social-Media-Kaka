import { z } from 'zod';

export const signInSchema = z.object({
  username: z.string().trim().min(1, "Tên đăng nhập không được để trống"),
  password: z.string().trim().min(1, "Mật khẩu không được để trống"),
});

export type SignInValues = z.infer<typeof signInSchema>;