//Navigation stack param list
export type RootStackParamList = {
  HomeTabs: undefined;
  TaskForm: { date: string | null; grouping: string };
  Auth: undefined; 
  ProfileSetup: undefined;
};

// CalendarStackParamList 
export type CalendarStackParamList = {
  CalendarScreen: undefined;
};


//Task Detail interface
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
  notificationDate: string | null;  // date for notification, can be null
  notificationTime: string | null;  // time for notification, can be null
  createdById: number;     // personal identifier for the person who put up the task
  completedById?: number; // personal identifier for the person who completed the task
  assignedToId: number;   // personal identifier for the person who is assigned the task
}


//Task Item component props
export interface TaskItemProps {
  task: Task;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onShare: (task: Task) => void;
}

//Task Group component props
export interface TaskGroupProps {
  groupTitle: string;
  tasks: Task[];
  color: string;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onShare: (task: Task) => void;
}

//Task group data types
export type TaskGroupData = {
  groupTitle: string;
  tasks: Task[];
  color: string;
};

//Grid calendar day component status interface
export interface Events {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    events: Event[];
    isToday?: boolean;
  };
}

//Grid calendar day component task detail interface
export interface Event {
  title: string;
}

