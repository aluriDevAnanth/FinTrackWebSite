import { protectedProcedure, publicProcedure } from '../trpc';
import * as types from "../schema"
import * as yup from 'yup';
import { Op } from 'sequelize';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "supersecretkey123supersecretkey123"

function hashing(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
}


export const router = {
    signup: publicProcedure
        .input(types.UserCS)
        .mutation(async ({ input, ctx }) => {
            const user = (await ctx.db.User.create({ ...input, password: hashing(input.password) }))?.dataValues as types.UserT
            const auth = jwt.sign(user, JWT_SECRET_KEY, { expiresIn: "3d" })
            return { user, auth };
        }),
    login: publicProcedure
        .input(types.SignupS)
        .query(async ({ input, ctx }) => {
            const user: types.UserT = (await ctx.db.User.findOne({
                where: {
                    [Op.or]: {
                        username: input.usernameOrEmail,
                        email: input.usernameOrEmail
                    }
                }
            }))?.dataValues

            if (!user) throw new Error('User not found with give email or username');

            if (user?.password != hashing(input.password)) throw new Error('Wrong password for given username or email');

            const auth = jwt.sign(user, JWT_SECRET_KEY, { expiresIn: "3d" })

            return { auth, user }
        }),
    auth: protectedProcedure
        .query(({ ctx }) => ctx.user),
}