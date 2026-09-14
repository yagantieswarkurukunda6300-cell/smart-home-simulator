import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useSmartHome } from '@/context/SmartHomeContext';
import { Radius, Spacing } from '@/constants/theme';
import { AppIcon, type IconName } from '@/components/AppIcon';
import { GlassCard } from '@/components/GlassCard';

interface RoomCardProps {
  roomId: string;
  compact?: boolean;
}

export function RoomCard({ roomId, compact = false }: RoomCardProps) {
  const { rooms, getRoomStats, getRoomDevices } = useSmartHome();
  const router = useRouter();

  const room = rooms.find((r) => r.id === roomId);
  if (!room) return null;

  const stats = getRoomStats(roomId);
  const devices = getRoomDevices(roomId);
  const onCount = devices.filter((d) => d.isOn).length;

  if (compact) {
    return (
      <Pressable
        onPress={() => router.push(`/room/${room.id}`)}
        style={({ pressed }) => [styles.compactPressable, pressed && styles.pressed]}>
        <GlassCard style={styles.compactCard} glowColor={onCount > 0 ? room.tint : null}>
          <View style={[styles.compactIcon, { backgroundColor: room.tint + '1F' }]}>
            <AppIcon name={room.icon as IconName} size={26} color={room.tint} />
          </View>
          <Text style={styles.compactName} numberOfLines={1}>
            {room.name}
          </Text>
          <View style={styles.compactFooter}>
            <Text style={styles.compactMeta}>
              {onCount}/{devices.length} on
            </Text>
            {onCount > 0 ? (
              <View style={[styles.compactDot, { backgroundColor: room.tint }]} />
            ) : (
              <View style={styles.compactDotOff} />
            )}
          </View>
        </GlassCard>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => router.push(`/room/${room.id}`)}
      style={({ pressed }) => [pressed && styles.pressed]}>
      <GlassCard style={styles.fullCard} glowColor={stats.on > 0 ? room.tint : null}>
        <View style={[styles.fullIcon, { backgroundColor: room.tint + '1F' }]}>
          <AppIcon name={room.icon as IconName} size={34} color={room.tint} />
        </View>
        <View style={styles.fullBody}>
          <Text style={styles.fullName}>{room.name}</Text>
          <Text style={styles.fullMeta}>
            {stats.on} of {stats.total} devices on
          </Text>
        </View>
        <View style={styles.chevron}>
          <AppIcon name="chevron-right" size={22} color="#5C627A" />
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  compactPressable: {
    flex: 1,
    minWidth: 0,
  },
  compactCard: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  compactIcon: {
    width: 46,
    height: 46,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactName: {
    color: '#F5F6FA',
    fontSize: 15,
    fontWeight: '600',
    marginTop: Spacing.one,
  },
  compactFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactMeta: {
    color: '#9AA0B4',
    fontSize: 12,
  },
  compactDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
  },
  compactDotOff: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
    backgroundColor: '#4A4F68',
  },
  fullCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  fullIcon: {
    width: 60,
    height: 60,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullBody: {
    flex: 1,
    gap: Spacing.one,
  },
  fullName: {
    color: '#F5F6FA',
    fontSize: 18,
    fontWeight: '700',
  },
  fullMeta: {
    color: '#9AA0B4',
    fontSize: 13,
  },
  chevron: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
});