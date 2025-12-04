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

