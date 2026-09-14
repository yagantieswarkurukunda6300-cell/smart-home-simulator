import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppIcon } from '@/components/AppIcon';
import { GlassCard } from '@/components/GlassCard';
import { Screen } from '@/components/Screen';
import { Radius, Spacing } from '@/constants/theme';
import { useSmartHome } from '@/context/SmartHomeContext';

const STATUS_TEXT: Record<string, string> = {
  disconnected: 'Disconnected',
  scanning: 'Searching for devices…',
  connecting: 'Pairing with hub…',
  connected: 'Connected to Smart Home Hub',
};

export default function BluetoothScreen() {
  const { bluetooth, connect, disconnect } = useSmartHome();

  const active = bluetooth.status === 'connected';
  const busy = bluetooth.status === 'scanning' || bluetooth.status === 'connecting';

  const ringA = useSharedValue(0.7);
  const ringB = useSharedValue(0.7);
  const breathe = useSharedValue(0);

  useEffect(() => {
    if (busy) {
      ringA.value = withRepeat(
        withSequence(
          withTiming(1.9, { duration: 1600, easing: Easing.out(Easing.quad) }),
          withTiming(0.7, { duration: 0 })
        ),
        -1,
        false
      );
      ringB.value = withRepeat(
        withSequence(
          withDelay(700, withTiming(1.9, { duration: 1600, easing: Easing.out(Easing.quad) })),
          withTiming(0.7, { duration: 0 })
        ),
        -1,
        false
      );
    } else {
      ringA.value = withSpring(0.7);
      ringB.value = withSpring(0.7);
    }
    if (active) {
      breathe.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.2, { duration: 1400, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    } else {
      breathe.value = withTiming(0);
    }
  }, [busy, active, breathe, ringA, ringB]);

  const bleedOuter = useAnimatedStyle(() => ({
    opacity: 1 - (ringA.value - 0.7) / 1.2,
    transform: [{ scale: ringA.value }],
  }));
  const bleedInner = useAnimatedStyle(() => ({
    opacity: 1 - (ringB.value - 0.7) / 1.2,
    transform: [{ scale: ringB.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.3 + breathe.value * 0.55,
    transform: [{ scale: 1 + breathe.value * 0.14 }],
  }));

  const statusColor = active ? '#00E676' : busy ? '#FFB74D' : '#FF5252';
  const iconName = active ? 'bluetooth-connect' : busy ? 'bluetooth' : 'bluetooth-off';

  return (
    <Screen>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <Text style={styles.eyebrow}>Connection</Text>
        <Text style={styles.title}>Bluetooth Hub</Text>
        <Text style={styles.subtitle}>Pair your phone with the smart home controller</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(500)} style={styles.body}>
        <View style={styles.hub}>
          <Animated.View style={[styles.bleed, bleedOuter]} />
          <Animated.View style={[styles.bleed, styles.bleedInner, bleedInner]} />
          <Animated.View style={[styles.glow, active && { backgroundColor: 'rgba(0,230,118,0.30)' }, glowStyle]} />
          <View
            style={[
              styles.hubIcon,
              active
                ? styles.hubIconOn
                : busy
                  ? styles.hubIconBusy
                  : styles.hubIconOff,
            ]}>
            <AppIcon name={iconName} size={64} color={statusColor} />
          </View>
        </View>

        <Animated.Text
          entering={FadeIn.delay(200).duration(500)}
          style={[styles.statusText, { color: statusColor }]}>
          {STATUS_TEXT[bluetooth.status]}
        </Animated.Text>

        {active && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.signalRow}>
            <View style={[styles.signalBar, { backgroundColor: statusColor }]} />
            <View style={[styles.signalBar, styles.signalBarSmall, { backgroundColor: statusColor }]} />
            <View style={[styles.signalBar, styles.signalBarTiny, { backgroundColor: statusColor }]} />
            <Text style={styles.signalText}>Signal {bluetooth.signal}%</Text>
          </Animated.View>
        )}

        {active && bluetooth.deviceName && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.deviceRow}>
            <AppIcon name="access-point" size={16} color="#00D4FF" />
            <Text style={styles.deviceName}>{bluetooth.deviceName}</Text>
          </Animated.View>
        )}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(240).duration(500)} style={styles.actions}>
        {!active ? (
          <Pressable
            onPress={busy ? undefined : connect}
            disabled={busy}
            style={({ pressed }) => [
              styles.primaryButton,
              busy && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}>
            <AppIcon name="bluetooth" size={18} color="#06121A" />
            <Text style={styles.primaryButtonText}>{busy ? 'Pairing…' : 'Connect'}</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={disconnect}
            style={({ pressed }) => [styles.dangerButton, pressed && styles.buttonPressed]}>
            <AppIcon name="bluetooth-off" size={18} color="#FF5252" />
            <Text style={styles.dangerButtonText}>Disconnect</Text>
          </Pressable>
        )}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(380).duration(600)}>
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteIcon}>
            <AppIcon name="information-outline" size={20} color="#00D4FF" />
          </View>
          <View style={styles.noteTextWrap}>
            <Text style={styles.noteTitle}>Simulation mode</Text>
            <Text style={styles.noteText}>
              Hub pairing here is still simulated. For real, live control use the Connect tab — it
              links this app to your laptop simulator over Wi-Fi via WebSocket.
            </Text>
          </View>
        </GlassCard>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.four,
  },
  eyebrow: {
    color: '#00D4FF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.one,
  },
  title: {
    color: '#F5F6FA',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#9AA0B4',
    fontSize: 13,
    marginTop: Spacing.one,
  },
  body: {
    alignItems: 'center',
    marginTop: Spacing.six,
    marginBottom: Spacing.five,
  },
  hub: {
    width: 190,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.four,
  },
  bleed: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 212, 255, 0.45)',
  },
  bleedInner: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderColor: 'rgba(123, 97, 255, 0.4)',
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 212, 255, 0.28)',
  },
  hubIcon: {
    width: 116,
    height: 116,
    borderRadius: Radius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubIconOn: {
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
    borderColor: 'rgba(0, 230, 118, 0.4)',
    elevation: 6,
    shadowColor: '#00E676',
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
  },
  hubIconBusy: {
    backgroundColor: 'rgba(255, 183, 77, 0.08)',
    borderColor: 'rgba(255, 183, 77, 0.4)',
  },
  hubIconOff: {
    backgroundColor: 'rgba(18, 18, 30, 0.9)',
    borderColor: 'rgba(255, 82, 82, 0.45)',
  },
  statusText: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  signalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.three,
  },
  signalBar: {
    width: 24,
    height: 3,
    borderRadius: 2,
    opacity: 0.8,
  },
  signalBarSmall: {
    height: 2,
    opacity: 0.5,
  },
  signalBarTiny: {
    height: 1,
    opacity: 0.3,
  },
  signalText: {
    color: '#9AA0B4',
    fontSize: 12,
    marginLeft: Spacing.two,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(0, 212, 255, 0.08)',
  },
  deviceName: {
    color: '#00D4FF',
    fontSize: 13,
    fontWeight: '600',
  },
  actions: {
    marginBottom: Spacing.four,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    backgroundColor: '#00D4FF',
    paddingVertical: Spacing.three + Spacing.one,
    borderRadius: Radius.lg,
  },
  primaryButtonText: {
    color: '#06121A',
    fontSize: 16,
    fontWeight: '800',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    backgroundColor: 'rgba(255, 82, 82, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.45)',
    paddingVertical: Spacing.three + Spacing.one,
    borderRadius: Radius.lg,
  },
  dangerButtonText: {
    color: '#FF5252',
    fontSize: 16,
    fontWeight: '800',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  noteCard: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  noteIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },
  noteTextWrap: {
    flex: 1,
  },
  noteTitle: {
    color: '#F5F6FA',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.one,
  },
  noteText: {
    color: '#9AA0B4',
    fontSize: 12,
    lineHeight: 18,
  },
});