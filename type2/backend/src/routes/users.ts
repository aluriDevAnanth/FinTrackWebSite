import { publicProcedure, protectedProcedure } from '../trpc';
import { type UserCT, type UserT, UserCS, UserUS } from "../schema"
import * as yup from 'yup';
import crypto from 'crypto';

function hashing(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
}

export const router = {
    createUser: publicProcedure
        .input(UserCS)
        .mutation(async ({ input, ctx }) => {
            return (await ctx.db.User.create({ ...input, password: hashing(input.password) }))?.dataValues as UserT;
        }),
    getUserById: protectedProcedure
        .input(yup.number().required())
        .query(async ({ input: userId, ctx }) => {
            return (await ctx.db.User.findOne({ where: { userId: userId } }))?.dataValues as UserT
        }),
    updateUser: protectedProcedure.input(UserUS).mutation(async ({ input, ctx }) => {
        const [count] = await ctx.db.User.update(input, { where: { userId: input.userId } })

        if (count === 0) throw new Error('User not found or nothing changed');

        const updatedUser = (await ctx.db.User.findByPk(input.userId))?.dataValues as UserT;
        return updatedUser;
    }),
    deleteUser: protectedProcedure.input(yup.number().required()).mutation(async ({ input, ctx }) => {
        const deletedUser = (await ctx.db.User.findByPk(input))?.dataValues as UserT
        const count = await ctx.db.User.destroy({ where: { userId: input } });

        if (count === 0) throw new Error('User not found or nothing deleted');

        return deletedUser;
    })
}