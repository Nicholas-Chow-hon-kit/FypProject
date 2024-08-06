import { Model } from '@nozbe/watermelondb';
import { text, date, field } from '@nozbe/watermelondb/decorators';
import { relation, children, lazy } from '@nozbe/watermelondb/decorators';
import { Q } from '@nozbe/watermelondb';

export default class Task extends Model {
  static table = 'tasks';

  @text('title') title!: string;
  @text('start_date') startDate!: string;
  @text('start_time') startTime!: string;
  @text('end_date') endDate!: string;
  @text('end_time') endTime!: string;
  @text('location') location!: string;
  @text('grouping') grouping!: string;
  @text('notes') notes!: string;
  @text('priority') priority!: string;
  @text('notification') notification!: string;
  @text('personal_id') personalId!: string;
  @text('completed_by_id') completedById!: string;
  @text('assigned_to_id') assignedToId!: string;
  @text('group_id') groupId!: string;
  @text('status') status!: string;
  @text('due_date') dueDate!: string;
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  static associations = {
    groups: { type: 'belongs_to', key: 'group_id' } as const,
    assignments: { type: 'has_many', foreignKey: 'task_id' } as const,
    notifications: { type: 'has_many', foreignKey: 'task_id' } as const,
  };

  @relation('groups', 'group_id') group!: any;
  @children('assignments') assignments!: any;
  @children('notifications') notifications!: any;

  @lazy assignmentsCount = this.collections.get('assignments').query(Q.where('task_id', this.id)).observeCount();
  @lazy notificationsCount = this.collections.get('notifications').query(Q.where('task_id', this.id)).observeCount();

  async fetchGroup() {
    return await this.group.fetch();
  }

  async fetchAssignments() {
    return await this.assignments.fetch();
  }

  async fetchNotifications() {
    return await this.notifications.fetch();
  }

  async addAssignment(assignmentData: any) {
    return await this.collections.get('assignments').create((assignment: any) => {
      assignment.task.set(this);
      Object.assign(assignment, assignmentData);
    });
  }

  async addNotification(notificationData: any) {
    return await this.collections.get('notifications').create((notification: any) => {
      notification.task.set(this);
      Object.assign(notification, notificationData);
    });
  }
}