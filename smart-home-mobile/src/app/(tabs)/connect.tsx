import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppIcon, type IconName } from '@/components/AppIcon';
import { GlassCard } from '@/components/GlassCard';
import { Screen } from '@/components/Screen';
import { Radius, Spacing } from '@/constants/theme';
import { useSmartHome } from '@/context/SmartHomeContext';

const STATUS_META: Record<
  string,
  { color: string; label: string; icon: IconName }
> = {
  connected: { color: '#00E676', label: 'Connected', icon: 'router-wireless' },
  connecting: { color: '#FFB74D', label: 'Connecting…', icon: 'access-point-network' },
  disconnected: { color: '#FF5252', label: 'Disconnected', icon: 'wifi-off' },
};

export default function ConnectScreen() {
  const { network, networkConnect, networkDisconnect, setServerAddress } = useSmartHome();
  const [hostDraft, setHostDraft] = useState<string | null>(null);
  const [portDraft, setPortDraft] = useState<string | null>(null);

  const host = hostDraft ?? network.host;
  const port = portDraft ?? network.port;
  const hostValid = host.trim().length > 0;

  const connected = network.status === 'connected';
  const busy = network.status === 'connecting';

  const meta = STATUS_META[network.status] ?? STATUS_META.disconnected;

  const saveAddress = () => setServerAddress(host, port);

  const saveAndConnect = () => {
    setServerAddress(host, port);
    networkConnect(host, port);
  };

  return (
    <Screen>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <Text style={styles.eyebrow}>Connection</Text>
        <Text style={styles.title}>Wi-Fi Hub</Text>
        <Text style={styles.subtitle}>
          Sync this app with your laptop simulator over your Wi-Fi network
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(500)}>
        <GlassCard style={styles.statusCard}>
          <View style={[styles.statusIcon, { backgroundColor: meta.color + '1F' }]}>
            <AppIcon name={meta.icon} size={30} color={meta.color} />
          </View>
          <View style={styles.statusInfo}>
            <Text style={[styles.statusLabel, { color: meta.color }]}>{meta.label}</Text>
            {connected ? (
              <Text style={styles.statusDetail}>
                {network.host}:{network.port} · {network.deviceCount} of 11 devices synced
                {network.phones > 0 ? ` · ${network.phones} other phone${network.phones === 1 ? '' : 's'}` : ''}
              </Text>
            ) : (
              <Text style={styles.statusDetail}>
                {network.error ?? (busy ? 'Reaching the hub…' : 'Enter the laptop address below and connect')}
              </Text>
            )}
          </View>
        </GlassCard>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(240).duration(500)}>
        <GlassCard style={styles.formCard}>
          <Text style={styles.fieldLabel}>Laptop address (IP)</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={host}
              onChangeText={setHostDraft}
              placeholder="e.g. 192.168.1.42"
              placeholderTextColor="#5C627A"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType={Platform.select({ ios: 'numbers-and-punctuation', default: 'default' })}
              style={styles.hostInput}
            />
            <TextInput
              value={port}
              onChangeText={setPortDraft}
              placeholder="5173"
              placeholderTextColor="#5C627A"
              keyboardType="number-pad"
              style={styles.portInput}
            />
          </View>
          <Text style={styles.helpText}>
            The Vite server on your laptop prints its LAN address, e.g. `http://192.168.1.42:5173`.
            Enter the IP here; the app connects on port {port || '5173'}.
          </Text>

          <Pressable
            onPress={saveAddress}
            disabled={!hostValid}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}>
            <Text style={styles.secondaryButtonText}>Save address</Text>
          </Pressable>
        </GlassCard>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(360).duration(500)} style={styles.actions}>
        {connected ? (
          <Pressable
            onPress={networkDisconnect}
            style={({ pressed }) => [styles.dangerButton, pressed && styles.buttonPressed]}>
            <AppIcon name="wifi-off" size={18} color="#FF5252" />
            <Text style={styles.dangerButtonText}>Disconnect</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={saveAndConnect}
            disabled={busy || !hostValid}
            style={({ pressed }) => [
              styles.primaryButton,
              (busy || !hostValid) && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}>
            <AppIcon name="wifi" size={18} color="#06121A" />
            <Text style={styles.primaryButtonText}>{busy ? 'Connecting…' : 'Connect'}</Text>
          </Pressable>
        )}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(480).duration(600)}>
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteIcon}>
            <AppIcon name="information-outline" size={20} color="#00D4FF" />
          </View>
          <View style={styles.noteTextWrap}>
            <Text style={styles.noteTitle}>How it works</Text>
            <Text style={styles.noteText}>
              1. Keep your laptop simulator running (`npm run dev`). It hosts a WebSocket hub on the
              same address Vite is served from.{'\n'}
              2. Put your phone on the same Wi-Fi network as the laptop.{'\n'}
              3. Enter the laptop LAN IP and press Connect.{'\n'}
              4. Toggle devices here or on the laptop — both stay in sync live.
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
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  statusIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: Spacing.half,
  },
  statusDetail: {
    color: '#9AA0B4',
    fontSize: 12,
    lineHeight: 17,
  },
  formCard: {
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  fieldLabel: {
    color: '#9AA0B4',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: Spacing.two,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  hostInput: {
    flex: 1,
    color: '#F5F6FA',
    fontSize: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  portInput: {
    width: 92,
    color: '#F5F6FA',
    fontSize: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    textAlign: 'center',
  },
  helpText: {
    color: '#5C627A',
    fontSize: 12,
    lineHeight: 17,
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.4)',
    backgroundColor: 'rgba(0, 212, 255, 0.08)',
  },
  secondaryButtonText: {
    color: '#00D4FF',
    fontSize: 15,
    fontWeight: '700',
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