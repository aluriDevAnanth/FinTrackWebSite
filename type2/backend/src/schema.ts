import * as yup from "yup";

// User
export const UserBS = yup.object({
    username: yup.string(),
    email: yup.string().email()
})

export const UserS = yup.object({
    userId: yup.number().required(),
    userUlid: yup.string().required(),
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    createdAt: yup.date().required(),
    updatedAt: yup.date().required()
})

export const UserCS = yup.object({
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
})

export const UserUS = UserBS.concat(yup.object({
    userId: yup.number().required(),
    password: yup.string(),
}))

export type UserT = yup.InferType<typeof UserS>
export type UserCT = yup.InferType<typeof UserCS>
export type UserUT = yup.InferType<typeof UserUS>

export const SignupS = yup.object({
    usernameOrEmail: yup.string().required(),
    password: yup.string().required(),
})

// Auth
export type SignupT = yup.InferType<typeof SignupS>


// Income
export const IncomeBS = yup.object({
    userId: yup.number(),
    amount: yup.number(),
    description: yup.string(),
    incomeDate: yup.date(),
})

export const IncomeS = yup.object({
    incomeId: yup.number().required(),
    incomeUlid: yup.string().required(),
    userId: yup.number().required(),
    amount: yup.number().required(),
    description: yup.string().required(),
    incomeDate: yup.date().required(),
    createdAt: yup.date().required(),
    updatedAt: yup.date().required(),
})

export const IncomeCS = yup.object({
    userId: yup.number().required(),
    amount: yup.number().required(),
    description: yup.string().required(),
    incomeDate: yup.date().required(),
})

export const IncomeUS = yup.object({
    incomeId: yup.number(),
    amount: yup.number(),
    description: yup.string(),
    incomeDate: yup.date(),
})

export type IncomeT = yup.InferType<typeof IncomeS>
export type IncomeCT = yup.InferType<typeof IncomeCS>
export type IncomeUT = yup.InferType<typeof IncomeUS>

// Expense

