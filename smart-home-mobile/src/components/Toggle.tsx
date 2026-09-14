import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Radius } from '@/constants/theme';

const TRACK_WIDTH = 54;
const TRACK_HEIGHT = 32;
const KNOB_DIAMETER = 24;
const KNOB_INSET = (TRACK_HEIGHT - KNOB_DIAMETER) / 2;
const TRACK_OFF = '#232338';
const TRACK_ON = '#0A9CBE';
const TRACK_ON_GLOW = '#00D4FF';
const KNOB_OFF = '#8E94AC';
const KNOB_ON = '#FFFFFF';

interface ToggleProps {
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
  activeColor?: string;
  activeGlow?: string;
}

export function Toggle({ value, onValueChange, disabled = false, activeColor = TRACK_ON, activeGlow = TRACK_ON_GLOW }: ToggleProps) {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, { damping: 15, stiffness: 220 });
  }, [value, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [TRACK_OFF, activeColor]),
    transform: [{ scale: 1 + progress.value * 0.06 }],
  }));

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * (TRACK_WIDTH - KNOB_DIAMETER - KNOB_INSET * 2) }],
  }));

  const knobColor = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [KNOB_OFF, KNOB_ON]),
  }));

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      hitSlop={8}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
      <Animated.View style={[styles.track, trackStyle, value && { shadowColor: activeGlow, shadowOpacity: 0.65 }]}>
        <Animated.View style={[styles.knob, knobStyle, knobColor]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    padding: 2,
  },
  pressed: {
    opacity: 0.85,
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: Radius.pill,
    paddingHorizontal: KNOB_INSET,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  knob: {
    width: KNOB_DIAMETER,
    height: KNOB_DIAMETER,
    borderRadius: Radius.pill,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
});