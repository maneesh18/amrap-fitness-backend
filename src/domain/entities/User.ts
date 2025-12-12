export enum FitnessGoal {
  STRENGTH = 'strength',
  HYPERTROPHY = 'hypertrophy',
  ENDURANCE = 'endurance',
}

export enum UserRole {
  USER = 'USER',
  MANAGER = 'MANAGER'
}

export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public dateOfBirth: Date,
    public fitnessGoal: FitnessGoal,
    public role: UserRole,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(
    id: string,
    name: string,
    email: string,
    dateOfBirth: Date,
    fitnessGoal: FitnessGoal,
    role: UserRole = UserRole.USER
  ): User {
    const now = new Date();
    return new User(
      id,
      name,
      email,
      dateOfBirth,
      fitnessGoal,
      role,
      now,
      now
    );
  }

  update(
    name?: string,
    dateOfBirth?: Date,
    fitnessGoal?: FitnessGoal
  ): void {
    if (name !== undefined) {
      this.name = name;
    }
    if (dateOfBirth !== undefined) {
      this.dateOfBirth = dateOfBirth;
    }
    if (fitnessGoal !== undefined) {
      this.fitnessGoal = fitnessGoal;
    }
    this.updatedAt = new Date();
  }
}