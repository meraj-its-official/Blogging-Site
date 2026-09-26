import { Hono } from 'hono';
import { userRouter } from './router/user';
import { blogRouter } from './router/blog';
const app = new Hono();
app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);
export default app;
