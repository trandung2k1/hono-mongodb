import type { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization') as string;
    if (authHeader) {
      const authHeaderLength = authHeader.split(' ').length;
      if (authHeaderLength == 2) {
        const token = authHeader.split(' ')[1] as string;
        const decoded = await verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        c.set('user', decoded);
        return await next();
      } else {
        c.status(401);
        return c.json({
          message: 'Authorization header invalid',
          code: 401,
        });
      }
    } else {
      c.status(401);
      return c.json({
        message: 'Authorization header missing',
        code: 401,
      });
    }
  } catch (error: any) {
    if (error.name === 'JwtAlgorithmNotImplemented') {
      console.log(error.name);
    } else if (error.name === 'JwtTokenInvalid') {
      return c.json({
        message: 'JWT token is invalid',
        code: 401,
      });
    } else if (error.name === 'JwtTokenNotBefore') {
      return c.json({
        message: 'That the token is being used before its valid date',
        code: 401,
      });
    } else if (error.name === 'JwtTokenExpired') {
      return c.json({
        message: 'That the token has expired.',
        code: 401,
      });
    } else if (error.name === 'JwtTokenIssuedAt') {
      return c.json({
        message: "The 'iat' claim in the token is incorrect.",
        code: 401,
      });
    } else {
      return c.json({
        message: 'Signature mismatch in the token',
        code: 401,
      });
    }
  }
};

export default authMiddleware;
