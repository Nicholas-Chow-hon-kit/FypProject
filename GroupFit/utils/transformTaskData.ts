// utils/transformTaskData.ts
import { Task as TaskProviderType } from "../contexts/TaskProvider.types";
import { Task as TaskCardType } from "../types";

export const transformTaskData = (task: TaskProviderType, groupingID: string, groupingColor: string): TaskCardType => {
  const startDateTime = new Date(task.start_date_time);
  const endDateTime = new Date(task.end_date_time);
  const notificationDateTime = task.notification ? new Date(task.notification) : null;

  return {
    id: task.id,
    title: task.title,
    startDate: startDateTime.toDateString(),
    startTime: startDateTime.toTimeString().split(" ")[0].slice(0, 5),
    endDate: endDateTime.toDateString(),
    endTime: endDateTime.toTimeString().split(" ")[0].slice(0, 5),
    location: task.location,
    grouping: groupingID,
    notes: task.notes,
    priority: task.priority,
    notificationDate: notificationDateTime ? notificationDateTime.toDateString() : null,
    notificationTime: notificationDateTime ? notificationDateTime.toTimeString().split(" ")[0].slice(0, 5) : null,
    createdById: task.created_by,
    completedById: task.completed_by,
  };
};