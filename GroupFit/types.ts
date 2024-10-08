//Navigation stack param list
export type RootStackParamList = {
  HomeTabs: undefined;
  TaskForm: { date: string | null; groupParams?: string };
  Auth: undefined; 
  ProfileSetup: undefined;
  UpdateForm: { task: Task }; 
};

// CalendarStackParamList 
// types.ts
export type CalendarStackParamList = {
  CalendarScreen: undefined;
  DayViewCalendar: { date: string; calendarName: string }; 
};
export type CommunitiesStackParamList = {
  CommunitiesScreen: undefined;
  FriendRequests: undefined;
  FriendSelection: undefined;
  AddFriends: undefined;
  GroupCalendarScreen: { groupId: string; routeName?: string };
  GroupDayViewCalendar: {
    date: string;
    calendarName: string;
    groupId: string;
    routeName?: string;
  };
  GroupDetails: { groupId: string; routeName?: string };
  GroupNameChange: { groupId: string; groupName: string; routeName?: string };
  AddMembers: { groupId: string };
};

//Task Detail interface
export interface Task {
  id: string;
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
  createdById: string;     // personal identifier for the person who put up the task
  completedById?: string | null; // personal identifier for the person who completed the task
  is_complete: boolean;
  
}


//Task Item component props
export interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onShare: (task: Task) => void;
}

//Task Group component props
export interface TaskGroupProps {
  groupTitle: string;
  tasks: Task[];
  color: string;
  onDelete: (id: string) => void;
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

