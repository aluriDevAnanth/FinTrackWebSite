import { protectedProcedure } from '../trpc';
import { type IncomeT, IncomeUS, IncomeCS } from "../schema"
import * as yup from 'yup';

export const router = {
    create: protectedProcedure
        .input(IncomeCS)
        .mutation(async ({ input, ctx }) => {
            if (ctx.user.userId != input.userId) throw new Error("Wrong User ID.");
            return (await ctx.db.Income.create({ ...input }))?.dataValues as IncomeT;
        }),
    getById: protectedProcedure
        .input(yup.number().required())
        .query(async ({ input, ctx }) => {
            return (await ctx.db.Income.findOne({ where: { incomeId: input } }))?.dataValues as IncomeT
        }),
    getByUserId: protectedProcedure
        .input(yup.number().required())
        .query(async ({ input, ctx }) => {
            return (await ctx.db.Income.findAll({ where: { userId: input } })).map(income => income?.dataValues as IncomeT)
        }),
    update: protectedProcedure.input(IncomeUS).mutation(async ({ input, ctx }) => {
        const [count] = await ctx.db.Income.update(input, { where: { incomeId: input.incomeId } })

        if (count === 0 && !(await ctx.db.Income.findByPk(input.incomeId))) throw new Error('Income not found');

        const updatedUser = (await ctx.db.Income.findByPk(input.incomeId))?.dataValues as IncomeT;
        return updatedUser;
    }),
    delete: protectedProcedure.input(yup.number().required()).mutation(async ({ input, ctx }) => {
        const deletedIncome = (await ctx.db.Income.findByPk(input))?.dataValues as IncomeT
        const count = await ctx.db.Income.destroy({ where: { incomeId: input } });

        if (count === 0) throw new Error('Income not found or nothing deleted');

        return deletedIncome;
    })
}