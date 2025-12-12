import { Request, Response, NextFunction } from 'express';
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { TokenExpiredError, UnauthorizedError } from '../../../domain/errors/DomainError';

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID || "",
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID || "",
});

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError('No authentication token provided'));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await verifier.verify(token);
    req.user = {
      id: payload.sub,
      username: payload.username,
      email: payload.email as string,
      groups: (payload['cognito:groups'] as string[]) || []
    };
    req.accessToken = token;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError' || err.message?.includes('expired')) {
      return next(new TokenExpiredError('Authentication token has expired. Please log in again.'));
    }
    return next(new UnauthorizedError('Invalid authentication token'));
  }
};