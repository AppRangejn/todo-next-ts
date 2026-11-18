import { sequelize } from '@/lib/db';
import bcrypt from 'bcrypt';
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import type { Task } from './Task';

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare full_name: string;
  declare email: string;
  declare password: string;
  declare tasks?: NonAttribute<Task[]>;

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value: string) {
        if (value) {
          this.setDataValue('password', bcrypt.hashSync(value, 10));
        }
      },
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
  },
);
