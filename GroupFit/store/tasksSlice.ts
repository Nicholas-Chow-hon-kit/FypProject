import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
  id: number;
  title: string;
  showDetails: boolean;
  details: string;
}

interface TaskGroup {
  id: number;
  title: string;
  tasks: Task[];
}

interface TasksState {
  taskGroups: TaskGroup[];
}

const initialState: TasksState = {
  taskGroups: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTaskGroup: (state, action: PayloadAction<TaskGroup>) => {
      state.taskGroups.push(action.payload);
    },
    addTask: (state, action: PayloadAction<{ groupId: number; task: Task }>) => {
      const { groupId, task } = action.payload;
      const group = state.taskGroups.find(group => group.id === groupId);
      if (group) {
        group.tasks.push(task);
      }
    },
    toggleTaskDetails: (state, action: PayloadAction<{ groupId: number; taskId: number }>) => {
      const { groupId, taskId } = action.payload;
      const group = state.taskGroups.find(group => group.id === groupId);
      if (group) {
        const task = group.tasks.find(task => task.id === taskId);
        if (task) {
          task.showDetails = !task.showDetails;
        }
      }
    },
  },
});

export const { addTaskGroup, addTask, toggleTaskDetails } = tasksSlice.actions;
export default tasksSlice.reducer;
