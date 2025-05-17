import { db } from './db/models';
import { initTRPC, TRPCError } from '@trpc/server';
import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import jwt from 'jsonwebtoken';
import { UserT } from './schema';

const t = initTRPC.context<Context>().create();

export const router = t.router;

export const createContext = async ({ req }: CreateHTTPContextOptions) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "") as jwt.JwtPayload;

            const userData = (await db.User.findOne({ where: { userId: decoded.userId } }))?.dataValues as UserT;

            if (userData) return { db, user: userData };
            else return { db };
        }
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            console.warn('Token has expired');
        } else {
            console.error('Invalid token', err);
        }
    }

    return { db };
};

const protectRoute = t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Authentication required or token expired',
        });
    }

    return next({
        ctx: {
            user: ctx.user,
        },
    });
});



export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(protectRoute);

export type Context = Awaited<ReturnType<typeof createContext>>;
