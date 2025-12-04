import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { GymRepository } from '../infrastructure/repositories/GymRepository';
import { MembershipRepository } from '../infrastructure/repositories/MembershipRepository';
import { CreateUserUseCase } from './use-cases/CreateUserUseCase';
import { GetUserUseCase } from './use-cases/GetUserUseCase';
import { ListUsersUseCase } from './use-cases/ListUsersUseCase';
import { UpdateUserUseCase } from './use-cases/UpdateUserUseCase';
import { DeleteUserUseCase } from './use-cases/DeleteUserUseCase';
import { CreateGymUseCase } from './use-cases/CreateGymUseCase';
import { GetGymUseCase } from './use-cases/GetGymUseCase';
import { ListGymsUseCase } from './use-cases/ListGymsUseCase';
import { UpdateGymUseCase } from './use-cases/UpdateGymUseCase';
import { DeleteGymUseCase } from './use-cases/DeleteGymUseCase';
import { AddUserToGymUseCase } from './use-cases/AddUserToGymUseCase';
import { RemoveUserFromGymUseCase } from './use-cases/RemoveUserFromGymUseCase';
import { ListGymUsersUseCase } from './use-cases/ListGymUsersUseCase';
import { ListUserGymsUseCase } from './use-cases/ListUserGymsUseCase';
import { ListGymsWithAvailableSpotsUseCase } from './use-cases/ListGymsWithAvailableSpotsUseCase';
import { UserController } from '../interface/http/controllers/UserController';
import { GymController } from '../interface/http/controllers/GymController';
import { MembershipController } from '../interface/http/controllers/MembershipController';

// Repositories
const userRepository = new UserRepository();
const gymRepository = new GymRepository();
const membershipRepository = new MembershipRepository();

// Use Cases
const createUserUseCase = new CreateUserUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

const createGymUseCase = new CreateGymUseCase(gymRepository);
const getGymUseCase = new GetGymUseCase(gymRepository);
const listGymsUseCase = new ListGymsUseCase(gymRepository);
const updateGymUseCase = new UpdateGymUseCase(gymRepository);
const deleteGymUseCase = new DeleteGymUseCase(gymRepository);
const listGymsWithAvailableSpotsUseCase = new ListGymsWithAvailableSpotsUseCase(gymRepository);

const addUserToGymUseCase = new AddUserToGymUseCase(
  membershipRepository,
  gymRepository,
  userRepository
);
const removeUserFromGymUseCase = new RemoveUserFromGymUseCase(membershipRepository);
const listGymUsersUseCase = new ListGymUsersUseCase(membershipRepository, gymRepository);
const listUserGymsUseCase = new ListUserGymsUseCase(membershipRepository, userRepository);

// Controllers
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
  listGymsUseCase,
  updateGymUseCase,
  deleteGymUseCase,
  listGymsWithAvailableSpotsUseCase
);

export const membershipController = new MembershipController(
  addUserToGymUseCase,
  removeUserFromGymUseCase,
  listGymUsersUseCase,
  listUserGymsUseCase
);

