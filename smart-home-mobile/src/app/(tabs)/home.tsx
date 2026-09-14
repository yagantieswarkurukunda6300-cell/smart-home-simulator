import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { AppIcon, type IconName } from '@/components/AppIcon';
import { ConnectionBadge } from '@/components/ConnectionBadge';
import { GlassCard } from '@/components/GlassCard';
import { RoomCard } from '@/components/RoomCard';
import { Screen } from '@/components/Screen';
import { Radius, Spacing } from '@/constants/theme';
import { useSmartHome } from '@/context/SmartHomeContext';

export default function HomeScreen() {
  const { rooms, getStats, getRoomStats, turnAllLightsOn, turnAllLightsOff, turnOffAllDevices, network } =
    useSmartHome();

  const stats = getStats();

  const currentRoom = useMemo(() => {
    const active = rooms.find((r) => getRoomStats(r.id).on > 0);
    return active ?? rooms[0];
  }, [rooms, getRoomStats]);

  return (
    <Screen>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Smart Home</Text>
          <Text style={styles.title}>Good {greeting()}</Text>
        </View>
        <View style={styles.headerStatus}>
          <ConnectionBadge />
        </View>
      </Animated.View>

      {/* Current room strip */}
      <Animated.View entering={FadeInDown.delay(120).duration(500)}>
        <GlassCard style={styles.currentRoomCard} glowColor={currentRoom.tint}>
          <View style={[styles.currentRoomIcon, { backgroundColor: currentRoom.tint + '1F' }]}>
            <AppIcon name={currentRoom.icon as IconName} size={22} color={currentRoom.tint} />
          </View>
          <View style={styles.currentRoomInfo}>
            <Text style={styles.currentRoomLabel}>CURRENT ROOM</Text>
            <Text style={styles.currentRoomName}>{currentRoom.name}</Text>
          </View>
          {network.status === 'connected' ? (
            <View style={styles.liveChip}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          ) : (
            <View style={[styles.liveChip, styles.offlineChip]}>
              <Text style={styles.offlineText}>Offline</Text>
            </View>
          )}
        </GlassCard>
      </Animated.View>

      {/* Stats row */}
      <Animated.View entering={FadeInDown.delay(220).duration(500)}>
        <View style={styles.statsRow}>
          <StatCard label="Devices" value={String(stats.on)} suffix={`/ ${stats.total}`} color="#00D4FF" icon="power" />
          <StatCard label="Lights" value={String(stats.lightsOn)} suffix="" color="#FFB74D" icon="lightbulb-on" />
          <StatCard label="Rooms" value={String(rooms.length)} suffix="" color="#7B61FF" icon="sofa" />
        </View>
      </Animated.View>

      {/* Quick controls */}
      <Animated.View entering={FadeInUp.delay(320).duration(500)}>
        <SectionHeader title="Quick Controls" />
        <View style={styles.quickGrid}>
          <QuickAction
            icon="lightbulb-on"
            label="All Lights ON"
            tint="#00E676"
            onPress={turnAllLightsOn}
          />
          <QuickAction
            icon="lightbulb-off"
            label="All Lights OFF"
            tint="#FFB74D"
            onPress={turnAllLightsOff}
          />
          <QuickAction
            icon="power"
            label="All Devices OFF"
            tint="#FF5252"
            wide
            onPress={turnOffAllDevices}
          />
        </View>
      </Animated.View>

      {/* Rooms */}
      <Animated.View entering={FadeInUp.delay(420).duration(500)}>
        <SectionHeader title="Your Rooms" actionLabel="View all" />
        <View style={styles.roomGrid}>
          {rooms.map((room) => (
            <RoomCard key={room.id} roomId={room.id} compact />
          ))}
        </View>
      </Animated.View>
    </Screen>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 18) return 'Afternoon';
  return 'Evening';
}

function SectionHeader({ title, actionLabel }: { title: string; actionLabel?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && <Text style={styles.sectionAction}>{actionLabel}</Text>}
    </View>
  );
}

function StatCard({
  label,
  value,
  suffix,
  color,
  icon,
}: {
  label: string;
  value: string;
  suffix: string;
  color: string;
  icon: IconName;
}) {
  return (
    <GlassCard style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '1F' }]}>
        <AppIcon name={icon} size={18} color={color} />
      </View>
      <Text style={styles.statValue}>
        {value}
        <Text style={styles.statSuffix}>{suffix}</Text>
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </GlassCard>
  );
}

function QuickAction({
  icon,
  label,
  tint,
  onPress,
  wide = false,
}: {
  icon: IconName;
  label: string;
  tint: string;
  onPress: () => void;
  wide?: boolean;
}) {
  return (
    <Pressable
      style={[styles.quickButton, wide && styles.quickButtonWide]}
      onPress={onPress}>
      {({ pressed }) => (
        <GlassCard
          style={[
            styles.quickCard,
            { borderColor: tint + '55' },
            pressed && styles.quickCardPressed,
          ]}
          intense>
          <AppIcon name={icon} size={20} color={tint} />
          <Text style={styles.quickLabel}>{label}</Text>
        </GlassCard>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerStatus: {
    alignItems: 'flex-end',
  },
  currentRoomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  currentRoomIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentRoomInfo: {
    flex: 1,
  },
  currentRoomLabel: {
    color: '#5C627A',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  currentRoomName: {
    color: '#F5F6FA',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 2,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + Spacing.half,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E676',
  },
  liveText: {
    color: '#00E676',
    fontSize: 11,
    fontWeight: '700',
  },
  offlineChip: {
    backgroundColor: 'rgba(255, 82, 82, 0.12)',
  },
  offlineText: {
    color: '#FF5252',
    fontSize: 11,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  statCard: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  statValue: {
    color: '#F5F6FA',
    fontSize: 22,
    fontWeight: '800',
  },
  statSuffix: {
    color: '#5C627A',
    fontSize: 14,
    fontWeight: '600',
  },
  statLabel: {
    color: '#9AA0B4',
    fontSize: 12,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.five,
  },
  quickButton: {
    flexBasis: '48%',
    flexGrow: 1,
  },
  quickButtonWide: {
    flexBasis: '100%',
  },
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  quickCardPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.97 }],
  },
  quickLabel: {
    color: '#F5F6FA',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    color: '#F5F6FA',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionAction: {
    color: '#00D4FF',
    fontSize: 13,
    fontWeight: '600',
  },
  roomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});