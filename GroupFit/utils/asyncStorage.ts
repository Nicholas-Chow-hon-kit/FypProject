// asyncStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const PERIOD_KEY = 'selectedPeriod';

export const saveSelectedPeriod = async (period: string) => {
  try {
    await AsyncStorage.setItem(PERIOD_KEY, period);
  } catch (error) {
    console.error('Error saving selected period:', error);
  }
};

export const getSelectedPeriod = async () => {
  try {
    const period = await AsyncStorage.getItem(PERIOD_KEY);
    return period;
  } catch (error) {
    console.error('Error getting selected period:', error);
    return null;
  }
};