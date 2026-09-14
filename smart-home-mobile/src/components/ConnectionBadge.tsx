import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { Radius, Spacing } from '@/constants/theme';
import { useSmartHome } from '@/context/SmartHomeContext';
import { AppIcon, type IconName } from '@/components/AppIcon';

interface ConnectionBadgeProps {
  showLabel?: boolean;
}

const STATUS_META: Record<
  string,
  { color: string; label: string; icon: IconName; pulse: boolean }
> = {
  connected: { color: '#00E676', label: 'Connected', icon: 'wifi', pulse: true },
  connecting: { color: '#FFB74D', label: 'Connecting…', icon: 'access-point-network', pulse: false },
  disconnected: { color: '#FF5252', label: 'Offline', icon: 'wifi-off', pulse: false },
};

export function ConnectionBadge({ showLabel = true }: ConnectionBadgeProps) {
  const { network } = useSmartHome();
  const meta = STATUS_META[network.status] ?? STATUS_META.disconnected;
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (meta.pulse) {
      pulse.value = withRepeat(
        withSequence(withTiming(1, { duration: 900 }), withTiming(0, { duration: 900 })),
        -1
      );
    } else {
      pulse.value = 0;
    }
  }, [meta.pulse, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + pulse.value * 0.65,
  }));

  return (
    <View style={styles.badge}>
      <View style={[styles.iconWrap, { backgroundColor: meta.color + '1F' }]}>
        <View style={styles.iconInner}>
          <AppIcon name={meta.icon} size={16} color={meta.color} />
        </View>
        {meta.pulse && <Animated.View style={[styles.ping, pulseStyle, { borderColor: meta.color }]} />}
      </View>
      {showLabel && <Text style={[styles.label, { color: meta.color }]}>{meta.label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ping: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
});