import { Hono } from "hono";
export declare const blogRouter: Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
    Variables: {
        userId: string;
    };
}, import("hono/types").BlankSchema, "/">;
