import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export function AppIcon({
  name,
  size = 24,
  color = '#FFFFFF',
  style,
}: {
  name: IconName;
  size?: number;
  color?: string;
  style?: ComponentProps<typeof MaterialCommunityIcons>['style'];
}) {
  return <MaterialCommunityIcons name={name} size={size} color={color} style={style} />;
}