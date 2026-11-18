import { sequelize } from '@/lib/db';
import { Task } from './Task';
import { User } from './User';

User.hasMany(Task, {
  foreignKey: 'userId',
  as: 'tasks',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Task.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export { sequelize, Task, User };
