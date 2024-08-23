import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "../lib/supabase";
import { Task, TaskData } from "../contexts/TaskProvider.types";
import { createTask, getTasks, updateTask, deleteTask } from "../lib/tasks";
import { useAuth } from "./AuthProvider";
import { TaskProviderProps } from "./TaskProvider.types";

interface TaskContextType {
  tasks: Task[];
  groupings: { id: string; name: string; default_color: string }[];
  members: { id: string; name: string; role: string }[];
  selectedGrouping: string | null;
  createTask: (taskData: TaskData) => Promise<void>;
  updateTask: (taskId: string, taskData: TaskData) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  setSelectedGrouping: (groupingId: string | null) => void;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  groupings: [],
  members: [],
  selectedGrouping: null,
  createTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
  setSelectedGrouping: () => {},
});

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groupings, setGroupings] = useState<
    { id: string; name: string; default_color: string }[]
  >([]);
  const [members, setMembers] = useState<
    { id: string; name: string; role: string }[]
  >([]);
  const [selectedGrouping, setSelectedGrouping] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Fetch groupings that the user is part of
      supabase
        .from("grouping_members")
        .select("grouping_id")
        .eq("user_id", user.id)
        .then(({ data: userGroups, error }) => {
          if (userGroups) {
            const groupingIds = userGroups.map((item) => item.grouping_id);
            supabase
              .from("groupings")
              .select("id, name, default_color")
              .in("id", groupingIds)
              .then(({ data: groupingData, error }) => {
                if (groupingData) {
                  setGroupings(groupingData);
                }
              });
          }
        });

      getTasks(user.id).then((data) => {
        setTasks(data);
      });
    }
  }, [user]);

  useEffect(() => {
    if (selectedGrouping) {
      // Fetch members based on the selected grouping
      const fetchMembers = async () => {
        const memberData = await supabase
          .from("grouping_members")
          .select("user_id, role")
          .eq("grouping_id", selectedGrouping);

        const profilesData = await supabase
          .from("profiles")
          .select("id, full_name");

        const combinedData =
          memberData?.data?.map((member) => {
            const profile = profilesData?.data?.find(
              (profile) => profile.id === member.user_id
            );
            return {
              id: member.user_id,
              name: profile?.full_name,
              role: member.role,
            };
          }) || [];

        setMembers(combinedData);
      };

      fetchMembers();
    } else {
      setMembers([]);
    }
  }, [selectedGrouping]);

  const handleCreateTask = async (taskData: TaskData) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    const newTask = await createTask({
      ...taskData,
      created_by: user.id,
    });
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks, newTask];
      console.log(
        "All Task Titles:",
        updatedTasks.map((task) => task.title)
      );
      return updatedTasks;
    });
  };

  const handleUpdateTask = async (taskId: string, taskData: TaskData) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    await updateTask(taskId, taskData);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...taskData } : task
      )
    );
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    await deleteTask(taskId);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const value = useMemo(
    () => ({
      tasks,
      groupings,
      members,
      selectedGrouping,
      createTask: handleCreateTask,
      updateTask: handleUpdateTask,
      deleteTask: handleDeleteTask,
      setSelectedGrouping,
    }),
    [tasks, groupings, members, selectedGrouping]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
