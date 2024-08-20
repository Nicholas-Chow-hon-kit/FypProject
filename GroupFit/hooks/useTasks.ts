import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { Task, TaskData } from "../contexts/AuthProvider.types";
import { supabase } from "../lib/supabase";

export const useTasks = () => {
  const { user, tasks: taskActions } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groupings, setGroupings] = useState<{ id: string; name: string }[]>([]);
  const [members, setMembers] = useState<{ id: string; name: string; role: string }[]>([]);
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
              .select("id, name")
              .in("id", groupingIds)
              .then(({ data: groupingData, error }) => {
                if (groupingData) {
                  setGroupings(groupingData);
                }
              });
          }
        });

      taskActions.getTasks(user.id).then((data) => {
        setTasks(data);
      });
    }
  }, [user, taskActions]);

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
  
        const combinedData = memberData?.data?.map((member) => {
          const profile = profilesData?.data?.find((profile) => profile.id === member.user_id);
          return { id: member.user_id, name: profile?.full_name, role: member.role };
        }) || [];
  
        // Ensure combinedData is not undefined before calling setMembers
        setMembers(combinedData);
      };
  
      fetchMembers();
    } else {
      setMembers([]);
    }
  }, [selectedGrouping]);

  const createTask = async (taskData: TaskData) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    const result = await taskActions.createTask(taskData);
    const newTaskId = result[0].id;

    const fullTask = await taskActions.getTasks(user.id).then((tasks) =>
      tasks.find((task) => task.id === newTaskId)
    );

    if (fullTask) {
      setTasks((prevTasks) => [...prevTasks, fullTask]);
    } else {
      console.error("Failed to fetch the full task details after creation");
    }
  };

  const updateTask = async (taskId: string, taskData: TaskData) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    await taskActions.updateTask(taskId, taskData);
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, ...taskData } : task))
    );
  };

  const deleteTask = async (taskId: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    await taskActions.deleteTask(taskId);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return {
    tasks,
    groupings,
    members,
    createTask,
    updateTask,
    deleteTask,
    setSelectedGrouping,
  };
};