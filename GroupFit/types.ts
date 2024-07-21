export interface Task {
    id: number;
    title: string;
    details: string;
  }

  export interface TaskItemProps {
    task: Task;
    onDelete: (id: number) => void;
    onEdit: (task: Task) => void;
    onShare: (task: Task) => void;
  }
  
  //will be using this type later for the whole grouping thing in home screen too
  export interface TaskGroupProps {
    title: string;
    tasks: Task[];
    color: string;
    onDelete: (id: number) => void;
    onEdit: (task: Task) => void;
    onShare: (task: Task) => void;
  }