import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { Radius } from '@/constants/theme';

interface GlassCardProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  glowColor?: string | null;
  intense?: boolean;
}

export function GlassCard({ style, glowColor = null, intense = false, children, ...rest }: GlassCardProps) {
  const glow = glowColor ? { borderColor: glowColor } : null;

  return (
    <View
      {...rest}
      style={[
        styles.base,
        intense && styles.intense,
        glow,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: 'rgba(22, 22, 38, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Radius.lg,
  },
  intense: {
    backgroundColor: 'rgba(32, 32, 58, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
});