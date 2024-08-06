import { Model, Relation } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class Assignment extends Model {
  static table = 'assignments';

  static associations = {
    tasks: { type: 'belongs_to' as const, key: 'task_id' as const },
    users: { type: 'belongs_to' as const, key: 'user_id' as const },
  };

  @field('task_id') taskId!: string;
  @field('user_id') userId!: string;

  @relation('tasks', 'task_id') task!: Relation<Model>;
  @relation('users', 'user_id') user!: Relation<Model>;
  


}