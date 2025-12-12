import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { GymRepository } from '../infrastructure/repositories/GymRepository';
import { MembershipRepository } from '../infrastructure/repositories/MembershipRepository';
import { CreateUserUseCase } from '../application/use-cases/CreateUserUseCase';
import { GetUserUseCase } from '../application/use-cases/GetUserUseCase';
import { ListUsersUseCase } from '../application/use-cases/ListUsersUseCase';
import { UpdateUserUseCase } from '../application/use-cases/UpdateUserUseCase';
import { DeleteUserUseCase } from '../application/use-cases/DeleteUserUseCase';
import { CreateGymUseCase } from '../application/use-cases/CreateGymUseCase';
import { GetGymUseCase } from '../application/use-cases/GetGymUseCase';
import { GetGymsByUserIdUseCase } from '../application/use-cases/GetGymsByUserIdUseCase';
import { ListGymsUseCase } from '../application/use-cases/ListGymsUseCase';
import { UpdateGymUseCase } from '../application/use-cases/UpdateGymUseCase';
import { DeleteGymUseCase } from '../application/use-cases/DeleteGymUseCase';
import { AddUserToGymUseCase } from '../application/use-cases/AddUserToGymUseCase';
import { RemoveUserFromGymUseCase } from '../application/use-cases/RemoveUserFromGymUseCase';
import { ListGymUsersUseCase } from '../application/use-cases/ListGymUsersUseCase';
import { ListUserGymsUseCase } from '../application/use-cases/ListUserGymsUseCase';
import { ListGymsWithAvailableSpotsUseCase } from '../application/use-cases/ListGymsWithAvailableSpotsUseCase';
import { SignUpUser } from '../infrastructure/use-cases/SignUpUser';
import { SignInUser } from '../infrastructure/use-cases/SignInUser';
import { SignOutUser } from '../infrastructure/use-cases/SignOutUser';
import { VerifyUser } from '../infrastructure/use-cases/VerifyUser';
import { UserController } from '../interface/http/controllers/UserController';
import { GymController } from '../interface/http/controllers/GymController';
import { MembershipController } from '../interface/http/controllers/MembershipController';
import { AuthController } from '../interface/http/controllers/AuthController';
import { CognitoAuthService } from '../infrastructure/services/CognitoAuthService';

// Initialize repositories
const userRepository = new UserRepository();
const gymRepository = new GymRepository();
const membershipRepository = new MembershipRepository();

// Initialize use cases
const createUserUseCase = new CreateUserUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

const createGymUseCase = new CreateGymUseCase(gymRepository, userRepository);
const getGymUseCase = new GetGymUseCase(gymRepository);
const getGymsByUserIdUseCase = new GetGymsByUserIdUseCase(gymRepository);
const listGymsUseCase = new ListGymsUseCase(gymRepository);
const updateGymUseCase = new UpdateGymUseCase(gymRepository, userRepository);
const deleteGymUseCase = new DeleteGymUseCase(gymRepository);
const listGymsWithAvailableSpotsUseCase = new ListGymsWithAvailableSpotsUseCase(gymRepository);


const authService = new CognitoAuthService();

const addUserToGymUseCase = new AddUserToGymUseCase(
  membershipRepository,
  gymRepository,
  userRepository
);
const removeUserFromGymUseCase = new RemoveUserFromGymUseCase(membershipRepository);
const listGymUsersUseCase = new ListGymUsersUseCase(membershipRepository, gymRepository);
const listUserGymsUseCase = new ListUserGymsUseCase(membershipRepository, userRepository);

const signUpUser = new SignUpUser(authService, userRepository);
const signInUser = new SignInUser(authService);
const verifyUser = new VerifyUser(authService);
const signOutUser = new SignOutUser(authService);

export const userController = new UserController(
  createUserUseCase,
  getUserUseCase,
  listUsersUseCase,
  updateUserUseCase,
  deleteUserUseCase
);

export const gymController = new GymController(
  createGymUseCase,
  getGymUseCase,
  getGymsByUserIdUseCase,
  listGymsUseCase,
  updateGymUseCase,
  deleteGymUseCase,
  getUserUseCase,
  listGymsWithAvailableSpotsUseCase
);

export const membershipController = new MembershipController(
  addUserToGymUseCase,
  removeUserFromGymUseCase,
  listGymUsersUseCase,
  listUserGymsUseCase
);

export const authController = new AuthController(
  signUpUser,
  signInUser,
  signOutUser,
  verifyUser,
);