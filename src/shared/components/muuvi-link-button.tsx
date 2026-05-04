import { Link, type Href } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { StyleSheet, type TextStyle } from 'react-native';

import { muuviTheme } from '../theme';

type MuuviLinkButtonVariant = 'primary' | 'secondary';

type MuuviLinkButtonProps = PropsWithChildren<{
  href: Href;
  variant?: MuuviLinkButtonVariant;
}>;

export function MuuviLinkButton({
  children,
  href,
  variant = 'primary',
}: MuuviLinkButtonProps) {
  return (
    <Link href={href} style={[styles.base, styles[variant]]}>
      {children}
    </Link>
  );
}

const baseButton: TextStyle = {
  borderRadius: muuviTheme.radii.md,
  fontSize: muuviTheme.typography.size.body,
  fontWeight: muuviTheme.typography.weight.medium,
  lineHeight: muuviTheme.typography.lineHeight.body,
  overflow: 'hidden',
  paddingHorizontal: muuviTheme.spacing.lg,
  paddingVertical: muuviTheme.spacing.md,
  textAlign: 'center',
};

const styles = StyleSheet.create({
  base: baseButton,
  primary: {
    backgroundColor: muuviTheme.colors.charcoal,
    color: muuviTheme.colors.milk,
  },
  secondary: {
    backgroundColor: muuviTheme.colors.sage,
    color: muuviTheme.colors.pasture,
  },
});
