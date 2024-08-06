import { Model } from '@nozbe/watermelondb';
import { text, date } from '@nozbe/watermelondb/decorators';
import { children, lazy } from '@nozbe/watermelondb/decorators';
import { Q } from '@nozbe/watermelondb';

export default class Group extends Model {
  static table = 'groups';

  @text('group_title') groupTitle!: string;
  @text('color') color!: string;
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;

  static associations = {
    tasks: { type: 'has_many', foreignKey: 'group_id' }as const,
  };

  @children('tasks') tasks!: any;

  @lazy tasksCount = this.collections.get('tasks').query(Q.where('group_id', this.id)).observeCount();

  async fetchTasks() {
    return await this.tasks.fetch();
  }

  async addTask(taskData: any) {
    return await this.collections.get('tasks').create((task: any) => {
      task.group.set(this);
      Object.assign(task, taskData);
    });
  }
}

//Association as const must be used because:
// By using as const after the string literals 'has_many' and 'group_id', 
// you ensure that TypeScript treats these values 
//as specific string literal types rather than general strings. 
//This will resolve the type incompatibility error.