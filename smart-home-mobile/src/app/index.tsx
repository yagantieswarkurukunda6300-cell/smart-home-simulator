import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/AppIcon';
import { Radius, Spacing } from '@/constants/theme';

const SPLASH_DURATION = 3000;

export default function SplashScreen() {
  const router = useRouter();

  const glow = useSharedValue(0);
  const ringOuter = useSharedValue(0.65);
  const ringInner = useSharedValue(0.65);
  const orbShift = useSharedValue(0);

  useEffect(() => {
    ringOuter.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 2200, easing: Easing.out(Easing.quad) }),
        withTiming(0.65, { duration: 0 })
      ),
      -1,
      false
    );
    ringInner.value = withRepeat(
      withSequence(
        withDelay(700, withTiming(1.5, { duration: 2200, easing: Easing.out(Easing.quad) })),
        withTiming(0.65, { duration: 0 })
      ),
      -1,
      false
    );
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.15, { duration: 1400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    orbShift.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
      -1,
      false
    );

    const timer = setTimeout(() => {
      router.replace('/home');
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [glow, orbShift, ringInner, ringOuter, router]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.25 + glow.value * 0.6,
    transform: [{ scale: 1 + glow.value * 0.18 }],
  }));

  const ringOuterStyle = useAnimatedStyle(() => ({
    opacity: 1 - (ringOuter.value - 0.65) / 0.85,
    transform: [{ scale: ringOuter.value }],
  }));

  const ringInnerStyle = useAnimatedStyle(() => ({
    opacity: 1 - (ringInner.value - 0.65) / 0.85,
    transform: [{ scale: ringInner.value }],
  }));

  const orbAStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: orbShift.value * 40 + 0 }, { translateY: orbShift.value * -30 }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.orbContainer}>
        <Animated.View style={[styles.orbA, orbAStyle]} />
        <Animated.View style={[styles.orbB, orbAStyle]} />
      </View>

      <Animated.View
        entering={FadeIn.duration(700)}
        style={[styles.hero]}>
        <View style={styles.logoContainer}>
          <Animated.View style={[styles.ring, ringOuterStyle]} />
          <Animated.View style={[styles.ring, styles.ringInner, ringInnerStyle]} />
          <Animated.View style={[styles.logoGlow, glowStyle]} />
          <View style={styles.logo}>
            <AppIcon name="home-variant" size={58} color="#00D4FF" />
          </View>
        </View>

        <Animated.Text
          entering={FadeInDown.delay(250).duration(700)}
          style={styles.title}>
          Bluetooth Home
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(380).duration(700)}
          style={styles.titleAccent}>
          Automation
        </Animated.Text>

        <Animated.View entering={FadeIn.delay(650).duration(800)} style={styles.divider} />

        <Animated.Text
          entering={FadeInUp.delay(780).duration(700)}
          style={styles.subtitle}>
          Control every room, device & voice command from one premium hub.
        </Animated.Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.delay(1100).duration(700)}
        style={styles.footer}>
        <View style={styles.loadingRow}>
          <View style={[styles.loadingDot, styles.loadingDotOn]} />
          <View style={[styles.loadingDot, styles.loadingDotDim]} />
          <View style={[styles.loadingDot, styles.loadingDotDim]} />
        </View>
        <Pressable onPress={() => router.replace('/home')}>
          <Text style={styles.tapHint}>Tap to continue</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07070D',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: Spacing.five,
  },
  orbContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  orbA: {
    position: 'absolute',
    top: 80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(0, 212, 255, 0.10)',
  },
  orbB: {
    position: 'absolute',
    bottom: 120,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(123, 97, 255, 0.10)',
  },
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.six,
  },
  logoContainer: {
    width: 190,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.five,
  },
  ring: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 212, 255, 0.5)',
  },
  ringInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderColor: 'rgba(123, 97, 255, 0.45)',
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 212, 255, 0.35)',
  },
  logo: {
    width: 116,
    height: 116,
    borderRadius: Radius.xl,
    backgroundColor: 'rgba(18, 18, 30, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#00D4FF',
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 6 },
  },
  title: {
    color: '#F5F6FA',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  titleAccent: {
    color: '#00D4FF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  divider: {
    width: 64,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    marginVertical: Spacing.four,
  },
  subtitle: {
    color: '#9AA0B4',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 300,
  },
  footer: {
    position: 'absolute',
    bottom: Spacing.six + Spacing.three,
    alignItems: 'center',
    gap: Spacing.three,
  },
  loadingRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  loadingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 212, 255, 0.25)',
  },
  loadingDotOn: {
    backgroundColor: '#00D4FF',
  },
  loadingDotDim: {
    opacity: 0.5,
  },
  tapHint: {
    color: '#5C627A',
    fontSize: 13,
    marginTop: Spacing.one,
  },
});