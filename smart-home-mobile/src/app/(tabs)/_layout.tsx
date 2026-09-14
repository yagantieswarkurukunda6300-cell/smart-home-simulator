import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs
      backgroundColor="#0C0C16"
      iconColor={{ default: '#4A4F68', selected: '#00D4FF' }}
      tintColor="#00D4FF"
      indicatorColor="#00D4FF"
      labelStyle={{
        default: { color: '#9AA0B4', fontSize: 12, fontWeight: '600' },
        selected: { color: '#F5F6FA', fontSize: 12, fontWeight: '700' },
      }}>
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="rooms">
        <NativeTabs.Trigger.Label>Rooms</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="sofa" md="chair" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="connect">
        <NativeTabs.Trigger.Label>Connect</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="wifi" md="wifi" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="bluetooth">
        <NativeTabs.Trigger.Label>Hub</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="bluetooth" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="voice">
        <NativeTabs.Trigger.Label>Voice</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="mic" md="mic_none" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}