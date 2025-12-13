import { Request, Response, NextFunction } from 'express';
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { TokenExpiredError, UnauthorizedError } from '../../../domain/errors/DomainError';

// Extend the Express Request type to include our custom properties
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
        groups: string[];
      };
      accessToken?: string;
    }
  }
}

// Get environment variables with validation
const cognitoUserPoolId = process.env.COGNITO_USER_POOL_ID;
const cognitoClientId = process.env.COGNITO_CLIENT_ID;

if (!cognitoUserPoolId || !cognitoClientId) {
  throw new Error('Missing required Cognito configuration. Please set COGNITO_USER_POOL_ID and COGNITO_CLIENT_ID environment variables.');
}

const verifier = CognitoJwtVerifier.create({
  userPoolId: cognitoUserPoolId,
  tokenUse: "access",
  clientId: cognitoClientId,
});

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError('No authentication token provided');
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      throw new UnauthorizedError('Invalid authorization token format');
    }

    const payload = await verifier.verify(token);
    
    if (!payload.sub) {
      throw new UnauthorizedError('Invalid token payload: missing user ID');
    }

    // Safely extract values with proper type checking
    const cognitoUsername = (payload as any)['cognito:username'];
    const cognitoGroups = (payload as any)['cognito:groups'];
    
    const email = typeof payload.email === 'string' ? payload.email : '';
    const username = typeof payload.username === 'string' 
      ? payload.username 
      : typeof cognitoUsername === 'string' 
        ? cognitoUsername 
        : '';
    
    const groups = Array.isArray(cognitoGroups) 
      ? cognitoGroups.filter((g): g is string => typeof g === 'string')
      : [];

    req.user = {
      id: payload.sub,
      username,
      email,
      groups
    };
    
    req.accessToken = token;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError || (err as Error).name === 'TokenExpiredError' || 
        (err as Error).message?.includes('expired')) {
      return next(new TokenExpiredError('Authentication token has expired. Please log in again.'));
    }
    
    if (err instanceof UnauthorizedError) {
      return next(err);
    }
    
    console.error('Authentication error:', err);
    return next(new UnauthorizedError('Invalid authentication token'));
  }
};