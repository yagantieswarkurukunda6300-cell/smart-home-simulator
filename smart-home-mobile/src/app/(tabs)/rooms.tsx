import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GlassCard } from '@/components/GlassCard';
import { RoomCard } from '@/components/RoomCard';
import { Screen } from '@/components/Screen';
import { AppIcon, type IconName } from '@/components/AppIcon';
import { Spacing } from '@/constants/theme';
import { useSmartHome } from '@/context/SmartHomeContext';

export default function RoomsScreen() {
  const { rooms, getStats, getRoomStats } = useSmartHome();
  const stats = getStats();

  return (
    <Screen>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <Text style={styles.eyebrow}>Smart Home</Text>
        <Text style={styles.title}>Rooms</Text>
        <Text style={styles.subtitle}>
          {rooms.length} rooms · {stats.on} of {stats.total} devices active
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(500)} style={styles.summaryRow}>
        <SummaryChip icon="sofa" label="Rooms" value={String(rooms.length)} color="#00D4FF" />
        <SummaryChip icon="power" label="Active" value={String(stats.on)} color="#00E676" />
        <SummaryChip icon="home-lightning-bolt" label="Total" value={String(stats.total)} color="#7B61FF" />
      </Animated.View>

      <View style={styles.list}>
        {rooms.map((room, index) => {
          const on = getRoomStats(room.id).on;
          return (
            <Animated.View
              key={room.id}
              entering={FadeInDown.delay(200 + index * 110).duration(500)}>
              <RoomCard roomId={room.id} />
              {on > 0 ? (
                <View style={styles.roomActiveRow}>
                  <View style={[styles.activeDot, { backgroundColor: room.tint }]} />
                  <Text style={styles.roomActiveText}>{on} device{on > 1 ? 's' : ''} on right now</Text>
                </View>
              ) : null}
            </Animated.View>
          );
        })}
      </View>
    </Screen>
  );
}

function SummaryChip({ icon, label, value, color }: { icon: IconName; label: string; value: string; color: string }) {
  return (
    <GlassCard style={styles.summaryChip}>
      <AppIcon name={icon} size={16} color={color} />
      <View style={styles.summaryText}>
        <Text style={styles.summaryValue}>{value}</Text>
        <Text style={styles.summaryLabel}>{label}</Text>
      </View>
    </GlassCard>
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
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  summaryChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
  },
  summaryText: {
    flex: 1,
  },
  summaryValue: {
    color: '#F5F6FA',
    fontSize: 17,
    fontWeight: '800',
  },
  summaryLabel: {
    color: '#9AA0B4',
    fontSize: 11,
  },
  list: {
    gap: Spacing.three,
  },
  roomActiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingTop: Spacing.two,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  roomActiveText: {
    color: '#9AA0B4',
    fontSize: 12,
  },
});