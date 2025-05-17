import { config } from 'dotenv';
config();

import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { router, createContext } from './trpc';
import cors from 'cors';

import { router as usersRouter } from './routes/users'
import { router as authRouter } from './routes/auth'
import { router as incomesRouter } from './routes/incomes'

const appRouter = router({
    users: usersRouter,
    auth: authRouter,
    incomes: incomesRouter,
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
    middleware: cors(),
    router: appRouter,
    createContext: createContext
});

server.listen(3000);