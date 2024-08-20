import { supabase } from "./supabase";
import { Task, TaskData } from "../contexts/AuthProvider.types";

export const createTask = async (taskData: {
  title: string;
  start_date_time: string;
  end_date_time: string;
  location: string;
  grouping_id: string;
  notes: string;
  priority: string;
  notification?: string;
  // assigned_to: string[]; 
  created_by: string; 
}) => {
  try {
    const { data: taskDataResponse, error: taskError } = await supabase
      .from("tasks")
      .insert([
        {
          title: taskData.title,
          start_date_time: taskData.start_date_time,
          end_date_time: taskData.end_date_time,
          location: taskData.location,
          grouping_id: taskData.grouping_id,
          notes: taskData.notes,
          priority: taskData.priority,
          notification: taskData.notification,
          created_by: taskData.created_by,
        },
      ])
      .select('uuid');

    if (taskError) throw taskError;

    const taskId = taskDataResponse?.[0].uuid;

    if (!taskId) {
      throw new Error("Task ID is undefined");
    }

    // Comment out assignment related code
    // const assignmentPromises = taskData.assigned_to.map((userId) => {
    //   return supabase
    //     .from("task_assignments")
    //     .insert([
    //       {
    //         task_id: taskId,
    //         user_id: userId,
    //       },
    //     ]);
    // });

    // await Promise.all(assignmentPromises);

    return taskDataResponse;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const getTasks = async (userId: string): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        task_assignments (
          user_id
        )
      `)
      .eq("created_by", userId);

    if (error) throw error;

    // Transform the data to match the Task type
    const tasks: Task[] = data.map((task) => ({
      id: task.id,
      title: task.title,
      start_date_time: task.start_date_time,
      end_date_time: task.end_date_time,
      location: task.location,
      grouping_id: task.grouping_id,
      notes: task.notes,
      priority: task.priority,
      notification: task.notification,
      // assigned_to: task.task_assignments.map((assignment: { user_id: string }) => assignment.user_id),
    }));

    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const updateTask = async (taskId: string, taskData: TaskData): Promise<void> => {
  try {
    const { error } = await supabase
      .from("tasks")
      .update(taskData)
      .eq("uuid", taskId);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (taskId: string) => {
  // Implementation
};