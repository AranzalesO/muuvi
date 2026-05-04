export const muuviColors = {
  milk: '#fffdf7',
  cream: '#f7f1e4',
  foam: '#f8faf4',
  charcoal: '#171717',
  charcoalMuted: '#3f3f3f',
  ash: '#737373',
  line: '#e5ddcf',
  sage: '#dce8d2',
  sageStrong: '#8fae82',
  pasture: '#496f43',
  hay: '#e7bf72',
  butter: '#f5d28d',
  clay: '#a7613b',
  spot: '#23201d',
  white: '#ffffff',
} as const;

export const muuviSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const muuviRadii = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 20,
  round: 999,
} as const;

export const muuviTypography = {
  family: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  size: {
    caption: 12,
    body: 16,
    lead: 18,
    title: 28,
    display: 38,
  },
  lineHeight: {
    caption: 16,
    body: 23,
    lead: 26,
    title: 34,
    display: 44,
  },
  weight: {
    regular: '400',
    medium: '600',
    bold: '700',
  },
} as const;

export const muuviShadows = {
  card: {
    elevation: 2,
    shadowColor: muuviColors.charcoal,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
} as const;

export const muuviTheme = {
  colors: muuviColors,
  radii: muuviRadii,
  shadows: muuviShadows,
  spacing: muuviSpacing,
  typography: muuviTypography,
} as const;

export type MuuviTheme = typeof muuviTheme;
