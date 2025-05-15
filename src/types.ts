import { z } from "zod";

// Auth
export const signinFormSchema = z.object({
    studentId: z
        .string()
        .regex(/^\d{9}$/, "학번은 9자리 숫자로 입력해야 합니다."),
    password: z
        .string()
        .min(10, "비밀번호는 10자리 이상이어야 합니다.")
        .max(100, '비밀번호는 100자리 이하이어야 합니다')
        .regex(/[A-Z]/, "비밀번호에 대문자가 포함되어야 합니다.")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "비밀번호에 특수문자가 포함되어야 합니다.")
});

export const signupFormSchema = z.object({
    username: z
        .string()
        .regex(/^[가-힣]+$/, "한글만 입력 가능합니다."),
    email: z
        .string()
        .email("유효한 이메일 형식이 아닙니다."),
    phoneNumber: z
        .string()
        .regex(/^(010)-\d{4}-\d{4}$/),
    password: z
        .string()
        .regex(/(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,20}/, "비밀번호는 영문 대소문자와 숫자, 특수기호가 적어도 1개 이상씩 포함된 8자 ~ 20자의 비밀번호여야 합니다."),
    confirmPassword: z
        .string()
        .regex(/(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,20}/, "비밀번호는 영문 대소문자와 숫자, 특수기호가 적어도 1개 이상씩 포함된 8자 ~ 20자의 비밀번호여야 합니다."),
    studentId: z
        .string()
        .regex(/^\d{9}$/, "학번은 9자리 숫자로 입력해야 합니다."),
    role: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다.',
});

export interface serverActionMessage {
    status: number;
    message: string;
}

import { JwtPayload } from "jwt-decode";
export interface JwtData extends JwtPayload {
    role: userRoleEnum;
    studentId: string;
    username: string;
    exp: number;
    iat: number;
}

export interface ledgerDataSchema {
    currentBalance: number;
    lastUpdated: number;
    theme: string;
    totalDeposit: number;
    totalWithdraw: number;
}

export interface personnelDataSchema {
    sendBirdUserId: string;
    studentId: string;
    uuid: string;
    username: string;
    email: string;
    phoneNumber: string;
    role: string;
}

export interface ChatProps {
    channelUrl: string;
}

export interface themeSchema {
    year: number;
    semester: 1 | 2;
    name: string;
}

// Enum
export enum ledgerStatusEnum {
    COMPLETE = 'complete',
    PENDING = 'pending',
    FAILED = 'failed',
}

export enum userRoleEnum {
    ROLE_STUDENT = 'ROLE_STUDENT',
    ROLE_COMMITTEE = 'ROLE_COMMITTEE',
    ROLE_ADMIN = 'ROLE_ADMIN',
}
