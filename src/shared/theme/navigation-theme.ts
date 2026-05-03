import {
  DarkTheme,
  DefaultTheme,
  type Theme,
} from '@react-navigation/native';

const colors = {
  background: '#f8fafc',
  border: '#e2e8f0',
  card: '#ffffff',
  primary: '#2563eb',
  text: '#0f172a',
};

export const lightNavigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
};

export const darkNavigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#93c5fd',
  },
};
