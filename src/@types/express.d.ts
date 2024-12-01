import 'express';

declare module 'express' {
  export interface Request {
    user?: JwtUserPayload;
    headers: {
      authorization?: string;
    };
  }
}
