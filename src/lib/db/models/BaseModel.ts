
import { query, queryOne, transaction } from '../connection';

export class BaseModel {
  protected static tableName: string;

  static async findAll<T>(conditions: Partial<T> = {}): Promise<T[]> {
    const entries = Object.entries(conditions);
    const whereClause = entries.length
      ? `WHERE ${entries
          .map(([key], index) => `${key} = $${index + 1}`)
          .join(' AND ')}`
      : '';
    const values = entries.map(([_, value]) => value);

    return query<T>(
      `SELECT * FROM ${this.tableName} ${whereClause}`,
      values
    );
  }

  static async findOne<T>(conditions: Partial<T>): Promise<T | null> {
    const entries = Object.entries(conditions);
    const whereClause = entries
      .map(([key], index) => `${key} = $${index + 1}`)
      .join(' AND ');
    const values = entries.map(([_, value]) => value);

    return queryOne<T>(
      `SELECT * FROM ${this.tableName} WHERE ${whereClause}`,
      values
    );
  }

  static async create<T>(data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const columns = keys.join(', ');

    const result = await queryOne<T>(
      `INSERT INTO ${this.tableName} (${columns}) 
       VALUES (${placeholders}) 
       RETURNING *`,
      values
    );

    if (!result) {
      throw new Error('Failed to create record');
    }

    return result;
  }

  static async update<T>(id: string | number, data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys
      .map((key, i) => `${key} = $${i + 1}`)
      .join(', ');

    const result = await queryOne<T>(
      `UPDATE ${this.tableName} 
       SET ${setClause} 
       WHERE id = $${values.length + 1} 
       RETURNING *`,
      [...values, id]
    );

    if (!result) {
      throw new Error('Record not found');
    }

    return result;
  }

  static async delete(id: string | number): Promise<void> {
    await query(
      `DELETE FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
  }
}
