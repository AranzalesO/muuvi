import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { muuviTheme } from '../theme';

type MuuviTextVariant = 'caption' | 'body' | 'lead' | 'title' | 'display';

type MuuviTextProps = PropsWithChildren<TextProps & {
  color?: keyof typeof muuviTheme.colors;
  style?: StyleProp<TextStyle>;
  variant?: MuuviTextVariant;
}>;

export function MuuviText({
  children,
  color = 'charcoal',
  style,
  variant = 'body',
  ...textProps
}: MuuviTextProps) {
  return (
    <Text
      style={[styles.base, styles[variant], { color: muuviTheme.colors[color] }, style]}
      {...textProps}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    letterSpacing: 0,
  },
  body: {
    fontSize: muuviTheme.typography.size.body,
    fontWeight: muuviTheme.typography.weight.regular,
    lineHeight: muuviTheme.typography.lineHeight.body,
  },
  caption: {
    fontSize: muuviTheme.typography.size.caption,
    fontWeight: muuviTheme.typography.weight.medium,
    lineHeight: muuviTheme.typography.lineHeight.caption,
    textTransform: 'uppercase',
  },
  display: {
    fontSize: muuviTheme.typography.size.display,
    fontWeight: muuviTheme.typography.weight.bold,
    lineHeight: muuviTheme.typography.lineHeight.display,
  },
  lead: {
    fontSize: muuviTheme.typography.size.lead,
    fontWeight: muuviTheme.typography.weight.regular,
    lineHeight: muuviTheme.typography.lineHeight.lead,
  },
  title: {
    fontSize: muuviTheme.typography.size.title,
    fontWeight: muuviTheme.typography.weight.bold,
    lineHeight: muuviTheme.typography.lineHeight.title,
  },
});
