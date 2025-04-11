import { z } from "zod";

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const signinSchema = z.object({
  id: z.string().email({ message: "이메일 형식이 올바르지 않습니다." }),
  password: z
    .string()
    .min(1, { message: "비밀번호를 입력해주세요." })
    .regex(PASSWORD_REGEX, { message: "비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다." }),
});
