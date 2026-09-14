import { StyleSheet, Text, View } from 'react-native';

import { useSmartHome } from '@/context/SmartHomeContext';
import { Radius, Spacing } from '@/constants/theme';
import { AppIcon, type IconName } from '@/components/AppIcon';
import { GlassCard } from '@/components/GlassCard';
import { Toggle } from '@/components/Toggle';

interface DeviceCardProps {
  deviceId: string;
  tint?: string;
}

export function DeviceCard({ deviceId, tint = '#00D4FF' }: DeviceCardProps) {
  const { devices, toggleDevice } = useSmartHome();
  const device = devices.find((d) => d.id === deviceId);

  if (!device) return null;

  const isOn = device.isOn;

  return (
    <GlassCard
      style={[styles.card, isOn && { borderColor: tint }]}
      glowColor={isOn ? tint : null}
      intense={isOn}>
      <View style={[styles.iconWrap, isOn && { backgroundColor: tint + '26' }]}>
        <AppIcon
          name={device.icon as IconName}
          size={26}
          color={isOn ? tint : '#7C8299'}
        />
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, !isOn && styles.nameOff]} numberOfLines={1}>
          {device.name}
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, isOn ? { backgroundColor: tint } : styles.statusDotOff]} />
          <Text style={[styles.statusText, !isOn && styles.statusTextOff]}>
            {isOn ? 'ON' : 'OFF'}
          </Text>
        </View>
      </View>

      <Toggle
        value={isOn}
        onValueChange={() => toggleDevice(device.id)}
        activeColor={tint}
        activeGlow={tint}
      />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    gap: Spacing.three,
  },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  info: {
    flex: 1,
    gap: Spacing.one,
  },
  name: {
    color: '#F5F6FA',
    fontSize: 16,
    fontWeight: '600',
  },
  nameOff: {
    color: '#B8BED0',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: Radius.pill,
  },
  statusDotOff: {
    backgroundColor: '#4A4F68',
  },
  statusText: {
    color: '#9AA0B4',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  statusTextOff: {
    color: '#6A7088',
  },
});