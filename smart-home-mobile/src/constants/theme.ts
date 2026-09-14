/**
 * Premium dark Smart Home theme.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  dark: {
    background: '#07070D',
    backgroundInner: '#0B0B14',
    surface: '#12121E',
    surfaceLight: '#1A1A2A',
    surfaceElevated: '#20203A',

    primary: '#00D4FF',
    primaryDim: '#0A9CBE',
    secondary: '#7B61FF',
    success: '#00E676',
    successDim: '#0A9E58',
    danger: '#FF5252',
    warning: '#FFB74D',

    text: '#F5F6FA',
    textSecondary: '#9AA0B4',
    textTertiary: '#5C627A',

    border: 'rgba(255, 255, 255, 0.08)',
    borderStrong: 'rgba(255, 255, 255, 0.16)',
    glassBg: 'rgba(22, 22, 38, 0.84)',
    glassHigh: 'rgba(34, 34, 58, 0.9)',

    tabBarBg: 'rgba(12, 12, 22, 0.92)',
    tabBarBorder: 'rgba(255, 255, 255, 0.07)',
    tabIconInactive: '#4A4F68',

    glowPrimary: 'rgba(0, 212, 255, 0.35)',
    glowSuccess: 'rgba(0, 230, 118, 0.35)',
    glowSecondary: 'rgba(123, 97, 255, 0.35)',

    shadow: '#000000',
    shadowGlow: 'rgba(0, 212, 255, 0.18)',

    overlay: 'rgba(0, 0, 0, 0.55)',
  },
  light: {
    background: '#EDEFF4',
    backgroundInner: '#F4F6FA',
    surface: '#FFFFFF',
    surfaceLight: '#F8F9FC',
    surfaceElevated: '#FDFDFF',

    primary: '#0099CC',
    primaryDim: '#00739C',
    secondary: '#6B51E0',
    success: '#00BE6B',
    successDim: '#008C4F',
    danger: '#FF3B3B',
    warning: '#FF9000',

    text: '#10101F',
    textSecondary: '#5A6276',
    textTertiary: '#96A0BA',

    border: 'rgba(16, 16, 31, 0.1)',
    borderStrong: 'rgba(16, 16, 31, 0.18)',
    glassBg: 'rgba(255, 255, 255, 0.85)',
    glassHigh: 'rgba(255, 255, 255, 0.95)',

    tabBarBg: 'rgba(255, 255, 255, 0.94)',
    tabBarBorder: 'rgba(16, 16, 31, 0.08)',
    tabIconInactive: '#9AA0B4',

    glowPrimary: 'rgba(0, 153, 204, 0.25)',
    glowSuccess: 'rgba(0, 190, 107, 0.25)',
    glowSecondary: 'rgba(107, 81, 224, 0.25)',

    shadow: '#B6C0D4',
    shadowGlow: 'rgba(0, 153, 204, 0.16)',

    overlay: 'rgba(0, 0, 0, 0.3)',
  },
} as const;

export type ThemeColors = (typeof Colors)['dark'];

export type ColorScheme = 'light' | 'dark';

export function resolveColors(scheme: ColorScheme): ThemeColors {
  return Colors[scheme] as ThemeColors;
}

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Times New Roman',
    mono: 'Menlo',
  },
  android: {
    sans: 'sans-serif',
    serif: 'serif',
    mono: 'monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    mono: 'monospace',
  },
  web: {
    sans: 'system-ui, sans-serif',
    serif: 'Georgia, serif',
    mono: 'ui-monospace, monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
  eight: 64,
} as const;

export const Radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 60, android: 88 }) ?? 60;
export const MaxContentWidth = 720;