import { Request, Response } from 'express';
import { SignUpUser } from '../../../infrastructure/use-cases/SignUpUser';
import { SignInUser } from '../../../infrastructure/use-cases/SignInUser';
import { SignOutUser } from '../../../infrastructure/use-cases/SignOutUser';
import { VerifyUser } from '../../../infrastructure/use-cases/VerifyUser';
import { SignInDTO } from '../../../application/dtos/SignInDTO';
import { SignUpDTO } from '../../../application/dtos/SignUpDTO';

import { 
  RequiredFieldError, 
  OperationFailedError, 
  // Assuming you have/add these errors to your DomainError file:
  InvalidCredentialsError, 
  UserAlreadyExistsError 
} from '../../../domain/errors/DomainError';

export class AuthController {
  // Inject the Use Cases (functions) via constructor
  constructor(
    private signUpUser: SignUpUser,
    private signInUser: SignInUser,
    private signOutUser: SignOutUser,
    private verifyUser: VerifyUser
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    const dto = req.body as SignUpDTO;
    
    if (!dto.username || !dto.email || !dto.password) {
      throw new RequiredFieldError('Username, Email, and Password', 'registration');
    }

    try {
      // 2. Call Use Case
      await this.signUpUser.execute(dto);
      res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
      // 3. Error Handling Pattern
      if (error instanceof UserAlreadyExistsError) {
        throw error;
      }
      // Wrap unknown errors
      throw new OperationFailedError('register user', 'auth', error instanceof Error ? error.message : undefined);
    }
  }

  async verify(req: Request, res: Response): Promise<void> {
    const { email, code } = req.body;
    try {
      await this.verifyUser.execute({ email, code });
      res.status(200).json({ message: "Account verified successfully. You can now log in." });
    } catch (error) {
      throw new OperationFailedError('verify user', 'auth', error instanceof Error ? error.message : undefined);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const dto = req.body as SignInDTO;

    if (!dto.username || !dto.password) {
      throw new RequiredFieldError('Username and Password', 'login');
    }

    try {
      const tokens = await this.signInUser.execute(dto);
      res.json(tokens);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw error;
      }
      throw new OperationFailedError('login user', 'auth', error instanceof Error ? error.message : undefined);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    // req.accessToken is populated by AuthMiddleware
    if (!req.accessToken) {
       // You might want a specific UnauthorizedError here
       throw new RequiredFieldError('Access Token', 'logout');
    }

    try {
      await this.signOutUser.execute(req.accessToken);
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      throw new OperationFailedError('logout user', 'auth', error instanceof Error ? error.message : undefined);
    }
  }
}