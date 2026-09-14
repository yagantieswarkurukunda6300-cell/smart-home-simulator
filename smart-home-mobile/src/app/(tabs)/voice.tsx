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
  withTiming,
} from 'react-native-reanimated';

import { AppIcon, type IconName } from '@/components/AppIcon';
import { GlassCard } from '@/components/GlassCard';
import { Screen } from '@/components/Screen';
import { Radius, Spacing } from '@/constants/theme';
import { useSmartHome } from '@/context/SmartHomeContext';

const EXAMPLE_COMMANDS: { label: string; command: string }[] = [
  { label: 'Turn on all lights', command: 'Turn on all lights' },
  { label: 'Lights off', command: 'Lights off' },
  { label: 'Turn off bedroom fan', command: 'Turn off bedroom fan' },
  { label: 'Turn on the television', command: 'Turn on the television' },
];

export default function VoiceScreen() {
  const { voice, startListening, stopListening, executeCommand } = useSmartHome();
  const listening = voice.isListening;

  const rippleA = useSharedValue(0.6);
  const rippleB = useSharedValue(0.6);
  const breathe = useSharedValue(0);

  useEffect(() => {
    if (listening || voice.status === 'processing') {
      rippleA.value = withRepeat(
        withSequence(
          withTiming(1.7, { duration: 1500, easing: Easing.out(Easing.quad) }),
          withTiming(0.6, { duration: 0 })
        ),
        -1,
        false
      );
      rippleB.value = withRepeat(
        withSequence(
          withDelay(650, withTiming(1.7, { duration: 1500, easing: Easing.out(Easing.quad) })),
          withTiming(0.6, { duration: 0 })
        ),
        -1,
        false
      );
      breathe.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.35, { duration: 800, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    } else {
      rippleA.value = withTiming(0.6);
      rippleB.value = withTiming(0.6);
      breathe.value = withTiming(0);
    }
  }, [listening, voice.status, breathe, rippleA, rippleB]);

  const rippleAStyle = useAnimatedStyle(() => ({
    opacity: 1 - (rippleA.value - 0.6) / 1.1,
    transform: [{ scale: rippleA.value }],
  }));
  const rippleBStyle = useAnimatedStyle(() => ({
    opacity: 1 - (rippleB.value - 0.6) / 1.1,
    transform: [{ scale: rippleB.value }],
  }));
  const micStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + breathe.value * 0.08 }],
  }));

  const statusColor = listening
    ? '#00D4FF'
    : voice.status === 'success'
      ? '#00E676'
      : voice.status === 'error'
        ? '#FF5252'
        : '#9AA0B4';

  const statusText =
    voice.status === 'success'
      ? voice.statusMessage
      : voice.statusMessage;

  return (
    <Screen>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <Text style={styles.eyebrow}>Assistant</Text>
        <Text style={styles.title}>Voice Control</Text>
        <Text style={styles.subtitle}>Speak to control your connected devices</Text>
      </Animated.View>

      <View style={styles.body}>
        <View style={styles.micZone}>
          <Animated.View style={[styles.ripple, rippleAStyle]} />
          <Animated.View style={[styles.ripple, rippleBStyle]} />
          <Pressable
            onPress={listening ? stopListening : startListening}
            style={({ pressed }) => [styles.micPressable, pressed && styles.micPressed]}>
            <Animated.View
              style={[
                styles.micButton,
                { borderColor: statusColor + '66' },
                statusColor === '#00E676' && { backgroundColor: 'rgba(0, 230, 118, 0.08)' },
                micStyle,
              ]}>
              <AppIcon
                name={listening ? ('microphone' as IconName) : ('microphone-outline' as IconName)}
                size={52}
                color={statusColor}
              />
            </Animated.View>
          </Pressable>
          <Animated.Text entering={FadeIn.delay(150).duration(500)} style={[styles.statusText, { color: statusColor }]}>
            {listening ? 'Listening…' : statusText}
          </Animated.Text>
          {listening && (
            <Animated.Text entering={FadeIn.duration(400)} style={styles.recHint}>
              Tap the mic again to stop
            </Animated.Text>
          )}
        </View>

        {voice.lastCommand && (
          <Animated.View entering={FadeInDown.duration(500)} style={styles.recognizedWrap}>
            <Text style={styles.recognizedLabel}>RECOGNIZED COMMAND</Text>
            <GlassCard style={styles.recognizedCard} glowColor="#00D4FF">
              <AppIcon name="microphone" size={18} color="#00D4FF" />
              <Text style={styles.recognizedText} numberOfLines={2}>
                “{voice.lastCommand}”
              </Text>
            </GlassCard>
          </Animated.View>
        )}
      </View>

      <Animated.View entering={FadeInDown.delay(250).duration(600)}>
        <Text style={styles.sectionLabel}>TRY A COMMAND</Text>
        <View style={styles.commandChips}>
          {EXAMPLE_COMMANDS.map((c) => (
            <Pressable
              key={c.command}
              onPress={() => executeCommand(c.command)}
              style={({ pressed }) => [styles.commandChip, pressed && styles.chipPressed]}>
              <Text style={styles.commandChipText}>{c.label}</Text>
            </Pressable>
          ))}
        </View>
        <GlassCard style={styles.hintCard}>
          <View style={styles.hintIcon}>
            <AppIcon name="lightbulb-outline" size={18} color="#FFB74D" />
          </View>
          <Text style={styles.hintText}>
            Voice commands already control the same device state as your toggles. Real speech
            recognition will be wired in with the simulator bridge.
          </Text>
        </GlassCard>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.six,
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
  },
  micZone: {
    alignItems: 'center',
    marginBottom: Spacing.five,
  },
  ripple: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 212, 255, 0.4)',
  },
  micPressable: {
    padding: Spacing.four,
  },
  micPressed: {
    opacity: 0.85,
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    backgroundColor: 'rgba(0, 212, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#00D4FF',
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 6 },
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: Spacing.three,
    minHeight: 22,
  },
  recHint: {
    color: '#5C627A',
    fontSize: 12,
    marginTop: Spacing.one,
  },
  recognizedWrap: {
    width: '100%',
    marginBottom: Spacing.five,
  },
  recognizedLabel: {
    color: '#5C627A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: Spacing.two,
    alignSelf: 'center',
  },
  recognizedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
  },
  recognizedText: {
    color: '#F5F6FA',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    flexShrink: 1,
  },
  sectionLabel: {
    color: '#5C627A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: Spacing.two,
  },
  commandChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  commandChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(0, 212, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  chipPressed: {
    opacity: 0.75,
  },
  commandChipText: {
    color: '#00D4FF',
    fontSize: 13,
    fontWeight: '600',
  },
  hintCard: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  hintIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 183, 77, 0.12)',
  },
  hintText: {
    flex: 1,
    color: '#9AA0B4',
    fontSize: 12,
    lineHeight: 18,
  },
});