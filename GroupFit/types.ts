export interface Task {
  id: number;
  title: string;
  startDate: string;      // e.g., "Tue, 18 Jun"
  startTime: string;      // 24-hour clock format, e.g., "08:00"
  endDate: string;        // e.g., "Tue, 18 Jun"
  endTime: string;        // 24-hour clock format, e.g., "08:10"
  location: string;       // string
  grouping: string;       // grouping should match the main title
  notes: string;          // notes taking over any "details"
  priority: string;       // e.g., "nil", "important", "very important"
  notification: string;   // date and time for notification
  personalId: number;     // personal identifier for the person who put up the task
  completedById?: number; // personal identifier for the person who completed the task
  assignedToId: number;   // personal identifier for the person who is assigned the task
}

export interface TaskItemProps {
  task: Task;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onShare: (task: Task) => void;
}

export interface TaskGroupProps {
  groupTitle: string;
  tasks: Task[];
  color: string;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onShare: (task: Task) => void;
}

export type TaskGroupData = {
  groupTitle: string;
  tasks: Task[];
  color: string;
};