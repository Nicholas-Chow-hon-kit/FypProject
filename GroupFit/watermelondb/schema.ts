import { appSchema, tableSchema } from '@nozbe/watermelondb';


export default appSchema({
  version: 1,// Every time you change the schema you need to increment this!
  tables: [
    tableSchema({
      name: 'groups',
      columns: [
        { name: 'group_title', type: 'string' }, // Title of the group
        { name: 'color', type: 'string' }, // Color associated with the group
        { name: 'description', type: 'string', isOptional: true }, // Optional description
        { name: 'created_at', type: 'number' }, // Timestamp for creation
        { name: 'updated_at', type: 'number' }, // Timestamp for last update
      ],
    }),
    tableSchema({
      name: 'users',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'tasks',
      columns: [
        { name: 'title', type: 'string' }, // Title of the task
        { name: 'start_date', type: 'string' }, // Start date of the task
        { name: 'start_time', type: 'string' }, // Start time of the task
        { name: 'end_date', type: 'string' }, // End date of the task
        { name: 'end_time', type: 'string' }, // End time of the task
        { name: 'location', type: 'string', isOptional: true }, // Optional location
        { name: 'grouping', type: 'string' }, // Group title associated with the task
        { name: 'notes', type: 'string', isOptional: true }, // Optional notes
        { name: 'priority', type: 'string', isOptional: true }, // Optional priority level
        { name: 'notification', type: 'string', isOptional: true }, // Optional notification time
        { name: 'personal_id', type: 'string' }, // ID of the person responsible
        { name: 'completed_by_id', type: 'string', isOptional: true }, // Optional ID of the person who completed
        { name: 'assigned_to_id', type: 'string' }, // ID of the person assigned
        { name: 'group_id', type: 'string', isIndexed: true }, // Foreign key to the groups table
        { name: 'status', type: 'string' }, // Status of the task
        { name: 'due_date', type: 'string' }, // Deadline for the task
        { name: 'created_at', type: 'number' }, // Timestamp for creation
        { name: 'updated_at', type: 'number' }, // Timestamp for last update
      ],
    }),
    tableSchema({
      name: 'assignments',
      columns: [
        { name: 'task_id', type: 'string', isIndexed: true }, // Foreign key to Tasks table
        { name: 'user_id', type: 'string', isIndexed: true }, // Foreign key to Users table
      ],
    }),
    tableSchema({
      name: 'notifications',
      columns: [
        { name: 'task_id', type: 'string', isIndexed: true }, // Foreign key to Tasks table
        { name: 'user_id', type: 'string', isIndexed: true }, // Foreign key to Users table
        { name: 'notification_time', type: 'string' }, // Time of notification
      ],
    }),
  ],
});