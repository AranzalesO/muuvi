import {
  DarkTheme,
  DefaultTheme,
  type Theme,
} from '@react-navigation/native';

import { muuviColors } from './tokens';

export const lightNavigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: muuviColors.milk,
    border: muuviColors.line,
    card: muuviColors.white,
    notification: muuviColors.clay,
    primary: muuviColors.pasture,
    text: muuviColors.charcoal,
  },
};

export const darkNavigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: muuviColors.charcoal,
    border: '#34302c',
    card: '#211f1c',
    notification: muuviColors.hay,
    primary: muuviColors.butter,
    text: muuviColors.milk,
  },
};
