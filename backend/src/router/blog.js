import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/jwt';
import { createBlogInput, updateBlogInput } from "@meraj_its_official/blog-common";
export const blogRouter = new Hono();
blogRouter.use('/*', async (c, next) => {
    const authHeader = c.req.header("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;
    try {
        const user = await verify(token, c.env.JWT_SECRET, "HS256");
        if (user) {
            c.set("userId", user.id);
            await next();
        }
        else {
            c.status(403);
            return c.json({
                message: "You are not logged in"
            });
        }
    }
    catch (e) {
        c.status(403);
        return c.json({
            message: "You are not logged in"
        });
    }
});
blogRouter.post('/', async (c) => {
    const userId = c.get('userId');
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    if (!success) {
        c.status(400);
        return c.json({ error: "invalid input" });
    }
    try {
        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                published: body.published,
                authorId: userId
            }
        });
        return c.json({
            id: post.id
        });
    }
    catch (e) {
        c.status(404);
        return c.json({ error: 'Page Not Found' });
    }
});
blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
    if (!success) {
        c.status(400);
        return c.json({ error: "invalid input" });
    }
    try {
        const post = await prisma.post.update({
            where: {
                id: body.id
            },
            data: {
                title: body.title,
                content: body.content,
                published: body.published
            }
        });
        return c.json({
            id: post.id
        });
    }
    catch (e) {
        c.status(404);
        return c.json({ error: 'Page Not Found' });
    }
});
// Add Pagination Later 
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
        const blog = await prisma.post.findMany({});
        return c.json({
            blog
        });
    }
    catch (e) {
        c.status(500);
        return c.json({
            message: "Error while fetching blogs"
        });
    }
});
blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const id = c.req.param("id");
    try {
        const blog = await prisma.post.findFirst({
            where: {
                id: id
            }
        });
        return c.json({
            blog
        });
    }
    catch (e) {
        c.status(404);
        return c.json({ error: 'Page Not Found' });
    }
});
