// typeGuards.ts
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, CalendarStackParamList, CommunitiesStackParamList, HomeStackParamList } from './types'; // Adjust the import path as necessary

export const isRootStackRoute = (
  route: RouteProp<RootStackParamList, 'TaskForm'> | RouteProp<CalendarStackParamList, 'TaskFormScreen'> | RouteProp<CommunitiesStackParamList, 'TaskFormScreen'>
): route is RouteProp<RootStackParamList, 'TaskForm'> => {
  return (route as RouteProp<RootStackParamList, 'TaskForm'>).name === 'TaskForm';
};

export const isCalendarStackRoute = (
  route: RouteProp<RootStackParamList, 'TaskForm'> | RouteProp<CalendarStackParamList, 'TaskFormScreen'> | RouteProp<CommunitiesStackParamList, 'TaskFormScreen'>
): route is RouteProp<CalendarStackParamList, 'TaskFormScreen'> => {
  return (route as RouteProp<CalendarStackParamList, 'TaskFormScreen'>).name === 'TaskFormScreen';
};

export const isCommunitiesStackRoute = (
  route: RouteProp<RootStackParamList, 'TaskForm'> | RouteProp<CalendarStackParamList, 'TaskFormScreen'> | RouteProp<CommunitiesStackParamList, 'TaskFormScreen'>
): route is RouteProp<CommunitiesStackParamList, 'TaskFormScreen'> => {
  return (route as RouteProp<CommunitiesStackParamList, 'TaskFormScreen'>).name === 'TaskFormScreen';
};

export const isHomeStackRoute = (
  route: RouteProp<HomeStackParamList, 'TaskFormScreen'> | RouteProp<CalendarStackParamList, 'TaskFormScreen'> | RouteProp<CommunitiesStackParamList, 'TaskFormScreen'>
): route is RouteProp<HomeStackParamList, 'TaskFormScreen'> => {
  return (route as RouteProp<HomeStackParamList, 'TaskFormScreen'>).name === 'TaskFormScreen';
};