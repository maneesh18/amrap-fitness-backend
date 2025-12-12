import { CognitoAuthService } from '../services/CognitoAuthService';
import { User, FitnessGoal, UserRole } from '../../domain/entities/User';
import { SignUpDTO } from '../../application/dtos/SignUpDTO';
import { RequiredFieldError, UserAlreadyExistsError, OperationFailedError } from '../../domain/errors/DomainError';
import { UserRepository } from '../repositories/UserRepository';

export class SignUpUser {
  constructor(
    private authService: CognitoAuthService,
    private userRepository: UserRepository
  ) {}

  async execute(data: SignUpDTO): Promise<void> {
    const { username, password, email, isManager } = data;

    // 1. Basic Validation
    if (!email || !email.includes('@')) {
      throw new RequiredFieldError('valid email', 'signup');
    }
    if (!username || !password) {
      throw new RequiredFieldError('username and password', 'signup');
    }

    // 2. Check if user already exists in DB (Fail fast before calling AWS)
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new UserAlreadyExistsError(email);
    }

    try {
      // 3. Create Identity in Auth Provider (Cognito)
      const result = await this.authService.signUp(username, password, email);
      const cognitoUserId = result.UserSub;
      console.log('Cognito signup result:', result);
      
      if (!cognitoUserId) {
        throw new OperationFailedError(
          'Failed to get user ID from authentication provider',
          'USER_AUTH_ERROR'
        );
      }

      // 4. Create User Entity in Domain
      // Note: You might want to pass DateOfBirth/FitnessGoal in DTO eventually
      const newUser = User.create(
        cognitoUserId,
        username,
        email,
        new Date(),           // Default DOB (Consider adding to DTO)
        FitnessGoal.STRENGTH, // Default Goal (Consider adding to DTO)
        isManager ? UserRole.MANAGER : UserRole.USER
      );

      // 5. Persist to Database
      await this.userRepository.save(newUser);

    } catch (error) {
      // If DB save fails but Cognito succeeded, you have a "Zombie User".
      // Advanced: You might want to call authService.deleteUser(email) here to rollback.
      
      if (error instanceof UserAlreadyExistsError) throw error;
      throw new OperationFailedError('signup', 'user', error instanceof Error ? error.message : undefined);
    }
  }
}