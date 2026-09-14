import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppIcon, type IconName } from '@/components/AppIcon';
import { ConnectionBadge } from '@/components/ConnectionBadge';
import { DeviceCard } from '@/components/DeviceCard';
import { GlassCard } from '@/components/GlassCard';
import { Radius, Spacing } from '@/constants/theme';
import { useSmartHome } from '@/context/SmartHomeContext';

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { rooms, getRoomDevices, getRoomStats, setDevice } = useSmartHome();

  const room = rooms.find((r) => r.id === id);

  if (!room) {
    return (
      <SafeAreaView style={styles.notFound}>
        <AppIcon name="alert-circle-outline" size={40} color="#FF5252" />
        <Text style={styles.notFoundText}>Room not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const devices = getRoomDevices(room.id);
  const stats = getRoomStats(room.id);
  const allOn = stats.on === stats.total && stats.total > 0;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(450)} style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
          <AppIcon name="chevron-left" size={26} color="#F5F6FA" />
        </Pressable>
        <View style={styles.headerBody}>
          <View style={styles.roomTitleRow}>
            <AppIcon name={room.icon as IconName} size={20} color={room.tint} />
            <Text style={styles.headerTitle}>{room.name}</Text>
          </View>
          <Text style={styles.headerMeta}>
            {stats.on} of {stats.total} devices on
          </Text>
        </View>
        <ConnectionBadge showLabel={false} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(160).duration(500)} style={styles.content}>
        <GlassCard
          style={[styles.roomBanner, { borderColor: room.tint + '55' }]}
          glowColor={room.tint}>
          <View style={styles.bannerTop}>
            <Text style={[styles.bannerTitle, { color: room.tint }]}>
              {allOn ? 'All devices running' : stats.on > 0 ? 'Partially active' : 'All devices off'}
            </Text>
            <Pressable
              onPress={() => devices.forEach((d) => setDevice(d.id, false))}
              style={({ pressed }) => [styles.offAllBtn, pressed && styles.pressed]}
              disabled={stats.on === 0}>
              <AppIcon name="power" size={14} color="#FF5252" />
              <Text style={styles.offAllText}>Off all</Text>
            </Pressable>
          </View>
          <View style={styles.bannerProgress}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${stats.total > 0 ? Math.round((stats.on / stats.total) * 100) : 0}%`,
                    backgroundColor: room.tint,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressLabel}>
              {stats.on}/{stats.total}
            </Text>
          </View>
        </GlassCard>
      </Animated.View>

      <View style={styles.deviceList}>
        {devices.map((device, index) => (
          <Animated.View
            key={device.id}
            entering={FadeInDown.delay(240 + index * 90).duration(500)}>
            <DeviceCard deviceId={device.id} tint={room.tint} />
          </Animated.View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#07070D',
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  headerBody: {
    flex: 1,
  },
  roomTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  headerTitle: {
    color: '#F5F6FA',
    fontSize: 22,
    fontWeight: '800',
  },
  headerMeta: {
    color: '#9AA0B4',
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    marginBottom: Spacing.three,
  },
  roomBanner: {
    padding: Spacing.three,
  },
  bannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  offAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255, 82, 82, 0.12)',
  },
  offAllText: {
    color: '#FF5252',
    fontSize: 12,
    fontWeight: '700',
  },
  bannerProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabel: {
    color: '#9AA0B4',
    fontSize: 12,
    fontWeight: '600',
  },
  deviceList: {
    gap: Spacing.two,
  },
  notFound: {
    flex: 1,
    backgroundColor: '#07070D',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  notFoundText: {
    color: '#F5F6FA',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(0, 212, 255, 0.12)',
  },
  backButtonText: {
    color: '#00D4FF',
    fontWeight: '700',
  },
});