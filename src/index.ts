import { serve } from '@hono/node-server';
import { Hono } from 'hono';
console.log(process.env.PORT);
const app = new Hono();
app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.notFound((c) => {
  c.status(404);
  // return c.text('404 Page Not Found', 404);
  return c.json({
    message: `${c.req.path} not found`,
    code: 404,
  });
});

app.onError((err, c) => {
  console.error(`${err}`);
  c.status(500);
  return c.text('Error Message', 500);
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
