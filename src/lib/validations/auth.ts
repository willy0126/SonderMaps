import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("올바른 이메일을 입력하세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    email: z.string().email("올바른 이메일을 입력하세요"),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .regex(/[a-z]/, "소문자를 포함해야 합니다")
      .regex(/[0-9]/, "숫자를 포함해야 합니다")
      .regex(/[^a-zA-Z0-9]/, "특수문자를 포함해야 합니다"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  })

export type SignupFormData = z.infer<typeof signupSchema>
