export class Membership {
  constructor(
    public id: string,
    public userId: string,
    public gymId: string,
    public joinDate: Date,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(userId: string, gymId: string): Membership {
    const now = new Date();
    return new Membership('', userId, gymId, now, now, now);
  }
}

