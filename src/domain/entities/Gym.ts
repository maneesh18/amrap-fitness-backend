export enum GymType {
  COMMERCIAL = 'commercial',
  HOME = 'home',
  APARTMENT = 'apartment',
}

export class Gym {
  constructor(
    public id: string,
    public name: string,
    public type: GymType,
    public location: string | null,
    public capacity: number | null,
    public userId: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(
    name: string,
    type: GymType,
    userId: string,
    location?: string,
    capacity?: number
  ): Gym {
    const now = new Date();
    return new Gym(
      '',
      name,
      type,
      location || null,
      capacity || null,
      userId,
      now,
      now
    );
  }

  update(
    name?: string,
    type?: GymType,
    location?: string | null,
    capacity?: number | null
  ): void {
    if (name !== undefined) {
      this.name = name;
    }
    if (type !== undefined) {
      this.type = type;
    }
    if (location !== undefined) {
      this.location = location;
    }
    if (capacity !== undefined) {
      this.capacity = capacity;
    }
    this.updatedAt = new Date();
  }

  hasCapacity(currentMemberCount: number): boolean {
    if (this.capacity === null) {
      return true; // No capacity limit
    }
    return currentMemberCount < this.capacity;
  }

  getAvailableSpots(currentMemberCount: number): number | null {
    if (this.capacity === null) {
      return null; // Unlimited
    }
    return Math.max(0, this.capacity - currentMemberCount);
  }
}

