import { Hono } from "hono";
export declare const userRouter: Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
}, import("hono/types").BlankSchema, "/">;
