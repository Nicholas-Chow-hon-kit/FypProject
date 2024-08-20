import { Session, User } from '@supabase/supabase-js';
import { ReactNode } from 'react';

export interface UserContextType {
  user: User | null;
  session: Session | null;
  setSession: (session: Session | null) => void;
  isLoading: boolean;
  tasks: {
    createTask: (taskData: TaskData) => Promise<{ id: string }[]>;
    getTasks: (userId: string) => Promise<Task[]>;
    updateTask: (taskId: string, taskData: TaskData) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
  };
}
export type UserProviderProps = {
  children: ReactNode;
};

export interface TaskData {
  title: string;
  start_date_time: string;
  end_date_time: string;
  location: string;
  grouping_id: string;
  notes: string;
  priority: string;
  notification?: string;
  // assigned_to: string[]; // Ensure this is an array of strings
  created_by: string; 
}

export interface Task {
  id: string;
  title: string;
  start_date_time: string;
  end_date_time: string;
  location: string;
  grouping_id: string;
  notes: string;
  priority: string;
  notification: string;
  // assigned_to: string[]; // Ensure this is an array of strings
}