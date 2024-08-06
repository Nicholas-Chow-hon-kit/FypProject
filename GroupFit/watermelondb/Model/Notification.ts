import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';
import { relation } from '@nozbe/watermelondb/decorators';

export default class Notification extends Model {
  static table = 'notifications';

  @field('task_id') taskId!: string;
  @field('user_id') userId!: string;
  @text('notification_time') notificationTime!: string;

  static associations = {
    tasks: { type: 'belongs_to', key: 'task_id' } as const,
    users: { type: 'belongs_to', key: 'user_id' } as const,
  };

  @relation('tasks', 'task_id') task!: any;
  @relation('users', 'user_id') user!: any;

  async fetchTask() {
    return await this.task.fetch();
  }

  async fetchUser() {
    return await this.user.fetch();
  }
}