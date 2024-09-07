import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { Task, TaskData } from "../contexts/TaskProvider.types";
import { supabase } from "../lib/supabase";
import { createTask, getTasks, updateTask, deleteTask } from "../lib/tasks";

export const useTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groupings, setGroupings] = useState<{ id: string; name: string; default_color: string }[]>([]);
  const [filteredGroupings, setFilteredGroupings] = useState<{ id: string; name: string; default_color: string }[]>([]);
  const [members, setMembers] = useState<{ id: string; name: string; role: string }[]>([]);
  const [selectedGrouping, setSelectedGrouping] = useState<string | null>(null);
  const [friendRequestsCount, setFriendRequestsCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchGroupings();
      getTasks(user.id).then((data) => {
        setTasks(data);
      });
      fetchFriendRequestsCount();
    }
  }, [user]);

  const fetchGroupings = async () => {
    if (user) {
      const { data: userGroups, error } = await supabase
        .from("grouping_members")
        .select("grouping_id")
        .eq("user_id", user.id);

      if (userGroups) {
        const groupingIds = userGroups.map((item) => item.grouping_id);
        const { data: groupingData, error } = await supabase
          .from("groupings")
          .select("id, name, default_color")
          .in("id", groupingIds);

        if (groupingData) {
          setGroupings(groupingData);
          const filteredGroupings = groupingData.filter(grouping => grouping.name !== "Personal");
          setFilteredGroupings(filteredGroupings);
        }
      }
    }
  };

  useEffect(() => {
    if (selectedGrouping) {
      /**
       * Fetches the members of the selected grouping.
       */
      const fetchMembers = async (): Promise<void> => {
        /**
         * Fetches the grouping members from the database.
         */
        const memberData = await supabase
          .from("grouping_members")
          .select("user_id, role")
          .eq("grouping_id", selectedGrouping);

        /**
         * Fetches the profiles from the database.
         */
        const profilesData = await supabase
          .from("profiles")
          .select("id, full_name");

        /**
         * Combines the member and profile data into a single array.
         */
        const combinedData = memberData?.data?.map((member) => {
          const profile = profilesData?.data?.find((profile) => profile.id === member.user_id);
          return { id: member.user_id, name: profile?.full_name, role: member.role };
        }) || [];

        /**
         * Sets the state with the combined data.
         */
        setMembers(combinedData);
      };

      fetchMembers();
    } else {
      setMembers([]);
    }
  }, [selectedGrouping]);

  const fetchFriendRequestsCount = async () => {
    if (user) {
      const { data, error } = await supabase
        .from("friendships")
        .select("id")
        .eq("friend_id", user.id)
        .eq("status", "pending");

      if (error) {
        console.error("Error fetching friend requests count:", error);
      } else {
        setFriendRequestsCount(data.length);
      }
    }
  };

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
      return updatedTasks;
    });
  };

  const handleUpdateTask = async (taskId: string, taskData: TaskData) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    await updateTask(taskId, {
      ...taskData,
      is_complete: taskData.is_complete,
      completed_by: taskData.is_complete ? String(user.id) : ("" as string),
    });
    const updatedTasks = await getTasks(user.id);
    setTasks(updatedTasks);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    await deleteTask(taskId);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return {
    tasks,
    groupings,
    filteredGroupings,
    members,
    selectedGrouping,
    friendRequestsCount,
    fetchFriendRequestsCount,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    setSelectedGrouping,
    fetchGroupings, // Add fetchGroupings to the returned object
  };
};