
import { UserModel } from '../db/models/User';
import { query } from '../db/connection';

export async function getUserRoles(userId: string): Promise<string[]> {
  const roles = await query<{ role: string }>(
    'SELECT role FROM user_roles WHERE user_id = $1',
    [userId]
  );
  return roles.map(r => r.role);
}

export async function createUserProfile(
  userId: string,
  email: string,
  fullName?: string
): Promise<void> {
  await UserModel.create({
    id: userId,
    email,
    full_name: fullName || null,
    created_at: new Date(),
    updated_at: new Date()
  });
}
