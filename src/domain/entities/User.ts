export enum FitnessGoal {
  STRENGTH = 'strength',
  HYPERTROPHY = 'hypertrophy',
  ENDURANCE = 'endurance',
}

export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public dateOfBirth: Date,
    public fitnessGoal: FitnessGoal,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(
    name: string,
    email: string,
    dateOfBirth: Date,
    fitnessGoal: FitnessGoal
  ): User {
    const now = new Date();
    return new User(
      '',
      name,
      email,
      dateOfBirth,
      fitnessGoal,
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

