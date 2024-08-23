import { supabase } from "./supabase";
import { Task, TaskData } from "../contexts/TaskProvider.types";


export const createTask = async (taskData: TaskData): Promise<Task> => {
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
      .select('*') // Select all fields of the newly created task
      .single(); // Return a single object instead of an array

    if (taskError) {
      console.error("Error creating task:", taskError);
      throw taskError;
    }

    if (!taskDataResponse) {
      throw new Error("Task data is undefined");
    }

    return taskDataResponse as Task;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

export const getTasks = async (userId: string): Promise<Task[]> => {
  try {
    // Fetch groupings that the user is part of
    const { data: userGroupings, error: userGroupingsError } = await supabase
      .from("grouping_members")
      .select("grouping_id")
      .eq("user_id", userId);

    if (userGroupingsError) throw userGroupingsError;

    if (!userGroupings || userGroupings.length === 0) {
      return [];
    }

    // Extract grouping IDs
    const groupingIds = userGroupings.map((grouping) => grouping.grouping_id);

    // Fetch tasks for those groupings
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("*")
      .in("grouping_id", groupingIds);

    if (tasksError) throw tasksError;

    // Transform the data to match the Task type
    const transformedTasks: Task[] = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      start_date_time: task.start_date_time,
      end_date_time: task.end_date_time,
      location: task.location,
      grouping_id: task.grouping_id,
      notes: task.notes,
      priority: task.priority,
      notification: task.notification,
      created_by: task.created_by,
    }));

    return transformedTasks;
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