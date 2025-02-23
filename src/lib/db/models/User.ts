
import { BaseModel } from './BaseModel';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  created_at: Date;
  updated_at: Date;
}

export class UserModel extends BaseModel {
  protected static tableName = 'profiles';

  static async findByEmail(email: string): Promise<User | null> {
    return this.findOne<User>({ email });
  }

  static async updateProfile(id: string, data: Partial<User>): Promise<User> {
    return this.update<User>(id, {
      ...data,
      updated_at: new Date()
    });
  }
}
