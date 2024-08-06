import { Model } from '@nozbe/watermelondb';
import { text } from '@nozbe/watermelondb/decorators';
import { children, lazy } from '@nozbe/watermelondb/decorators';
import { Q } from '@nozbe/watermelondb';

export default class User extends Model {
  static table = 'users';

  @text('name') name!: string;
  @text('email') email!: string;

  static associations = {
    tasks: { type: 'has_many', foreignKey: 'assigned_to_id' } as const,
    assignments: { type: 'has_many', foreignKey: 'user_id' } as const,
    notifications: { type: 'has_many', foreignKey: 'user_id' } as const,
  };

  @children('tasks') tasks!: any;
  @children('assignments') assignments!: any;
  @children('notifications') notifications!: any;

  @lazy tasksCount = this.collections.get('tasks').query(Q.where('assigned_to_id', this.id)).observeCount();
  @lazy assignmentsCount = this.collections.get('assignments').query(Q.where('user_id', this.id)).observeCount();
  @lazy notificationsCount = this.collections.get('notifications').query(Q.where('user_id', this.id)).observeCount();

  async fetchTasks() {
    return await this.tasks.fetch();
  }

  async fetchAssignments() {
    return await this.assignments.fetch();
  }

  async fetchNotifications() {
    return await this.notifications.fetch();
  }

  async addTask(taskData: any) {
    return await this.collections.get('tasks').create((task: any) => {
      task.assignedTo.set(this);
      Object.assign(task, taskData);
    });
  }

  async addAssignment(assignmentData: any) {
    return await this.collections.get('assignments').create((assignment: any) => {
      assignment.user.set(this);
      Object.assign(assignment, assignmentData);
    });
  }

  async addNotification(notificationData: any) {
    return await this.collections.get('notifications').create((notification: any) => {
      notification.user.set(this);
      Object.assign(notification, notificationData);
    });
  }
}