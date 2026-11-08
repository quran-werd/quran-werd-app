import type {StatusBarStyle} from 'expo-status-bar';

/**
 * Single seam for the status bar's icon color. Currently the app only has
 * one (dark) theme, so this always returns light icons. Once theming ships,
 * this is the only place that needs to start reading the active theme.
 */
export function useStatusBarStyle(): StatusBarStyle {
  return 'light';
}
