export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entityName: string, id: string) {
    super(`${entityName} with id ${id} not found`);
  }
}

export class DuplicateEntityError extends DomainError {
  constructor(entityName: string, field: string, value: string) {
    super(`${entityName} with ${field} '${value}' already exists`);
  }
}

export class GymCapacityExceededError extends DomainError {
  constructor(gymName: string, capacity: number) {
    super(`Gym '${gymName}' has reached its maximum capacity of ${capacity} members`);
  }
}

export class MembershipAlreadyExistsError extends DomainError {
  constructor(userId: string, gymId: string) {
    super(`User ${userId} is already a member of gym ${gymId}`);
  }
}

export class CreationFailedError extends DomainError {
  constructor(entityName: string, details?: string) {
    const message = details 
      ? `Failed to create ${entityName}: ${details}`
      : `Failed to create ${entityName}`;
    super(message);
  }
}

export class RequiredFieldError extends DomainError {
  constructor(fieldName: string, entityName: string = 'entity') {
    super(`${fieldName} is required for ${entityName}`);
  }
}

export class InvalidIdError extends DomainError {
  constructor(id: string, entityName: string = 'entity') {
    super(`Invalid ID format for ${entityName}: ${id}`);
  }
}

export class OperationFailedError extends DomainError {
  constructor(operation: string, entityName: string, details?: string) {
    const message = details
      ? `Failed to ${operation} ${entityName}: ${details}`
      : `Failed to ${operation} ${entityName}`;
    super(message);
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Invalid credentials provided');
  }
}

export class UserAlreadyExistsError extends DomainError {
  constructor(message: string = 'User already exists') {
    super(message);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized access') {
    super(message);
  }
}

export class TokenExpiredError extends DomainError {
  constructor(message: string = 'Authentication token has expired') {
    super(message);
  }
}

