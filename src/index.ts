import { serve } from '@hono/node-server';
import { Hono, type Context } from 'hono';
import authMiddleware from './middlewares/auth.middleware.js';
import { sign } from 'hono/jwt';
import connectDB from './configs/db.js';
// Using dev
import 'dotenv/config';
const port = +(process.env.PORT as string);
const app = new Hono();

app.get('/', (c: Context) => {
  return c.text('Hello Hono!');
});

app.post('/login', async (c: Context) => {
  const { email, password } = await c.req.json();
  if (email && password) {
    // Dùng setSignedCookie để đặt time expired
    const token = await sign({ email }, process.env.ACCESS_TOKEN_SECRET as string);
    return c.json({ email, password, token });
  } else {
    return c.json({ message: 'Failed' });
  }
});

app.get('/profile', authMiddleware, async (c: Context) => {
  const profile = c.get('user');
  return c.json({ profile });
});

app.post('/register', async (c: Context) => {
  const { email, password } = await c.req.json();
  return c.json({ email, password });
});

app.notFound((c: Context) => {
  c.status(404);
  // return c.text('404 Page Not Found', 404);
  return c.json({
    message: `${c.req.path} not found`,
    code: 404,
  });
});

app.onError((err, c: Context) => {
  console.error(`${err}`);
  c.status(500);
  return c.text('Error Message', 500);
});

connectDB()
  .then(() => {
    serve(
      {
        fetch: app.fetch,
        port,
      },
      (info) => {
        // console.log(info);
        console.log(`Server is running on http://localhost:${info.port}`);
      },
    );
  })
  .catch((err) => {
    console.log(err);
  });
