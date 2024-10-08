import { ReactNode } from "react";

export type TaskProviderProps = {
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
  is_complete: boolean;
  completed_by?: string;
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
  created_by: string;
  completed_by?: string | null;
  is_complete: boolean;
}
