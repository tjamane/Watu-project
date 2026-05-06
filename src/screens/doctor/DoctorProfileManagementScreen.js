import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ScrollView, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { useAppContext } from '../../context/AppContext';

export default function DoctorProfileManagementScreen({ navigation }) {
  const { user, logout, getDoctorAppointments } = useAppContext();
  const appointments = getDoctorAppointments();
  const completed = appointments.filter(a => a.status === 'completed').length;
  const pending   = appointments.filter(a => a.status === 'pending').length;

  const menuOptions = [
    {
      id: '1',
      title: 'My Appointments',
      icon: 'calendar-outline',
      onPress: () => navigation.navigate('DoctorApts'),
    },
    {
      id: '2',
      title: 'Prescriptions Written',
      icon: 'document-text-outline',
      onPress: null,
    },
    {
      id: '3',
      title: 'My Schedule',
      icon: 'time-outline',
      onPress: null,
    },
    {
      id: '4',
      title: 'Settings',
      icon: 'settings-outline',
      onPress: null,
    },
    {
      id: '5',
      title: 'Help & Support',
      icon: 'chatbubble-ellipses-outline',
      onPress: null,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Teal header — same pattern as patient */}
      <SafeAreaView style={styles.topSection}>
        <View style={styles.header}>
          <View style={{ width: 24 }} />
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={user?.avatar || require('../../../assets/Avatar.png')}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name || 'Dr. Marcus Horizon'}</Text>
          <View style={styles.specialtyRow}>
            <FontAwesome5 name="stethoscope" size={12} color="rgba(255,255,255,0.85)" />
            <Text style={styles.specialtyText}>
              {user?.specialty || 'Cardiologist'} · {user?.town || 'Windhoek'}
            </Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="account-group" size={28} color="#FFF" />
            <Text style={styles.statSubtitle}>Patients</Text>
            <Text style={styles.statValue}>{appointments.length}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={28} color="#FFF" />
            <Text style={styles.statSubtitle}>Completed</Text>
            <Text style={styles.statValue}>{completed}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="time" size={28} color="#FFF" />
            <Text style={styles.statSubtitle}>Pending</Text>
            <Text style={styles.statValue}>{pending}</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* White bottom section */}
      <View style={styles.bottomSection}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {menuOptions.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon} size={22} color={COLORS.primary} />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {index < menuOptions.length - 1 && <View style={styles.menuDivider} />}
            </View>
          ))}

          <View style={styles.menuDivider} />

          {/* Logout */}
          <TouchableOpacity style={styles.menuItem} onPress={logout}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            </View>
            <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Logout</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },

  topSection: {
    backgroundColor: COLORS.primary,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 10,
  },
  menuButton: { padding: 4 },

  profileInfo: { alignItems: 'center', marginTop: 10 },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 2, borderColor: '#FFF',
  },
  cameraIconContainer: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: COLORS.primary,
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFF',
  },
  userName: {
    fontSize: 22, fontWeight: '700', color: '#FFF', marginBottom: 6,
  },
  specialtyRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24,
  },
  specialtyText: { fontSize: 13, color: 'rgba(255,255,255,0.85)' },

  statsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 30,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statSubtitle: {
    fontSize: 12, color: '#E6FBFA', marginTop: 6, marginBottom: 2, fontWeight: '500',
  },
  statValue: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.4)' },

  bottomSection: {
    flex: 1, backgroundColor: '#FFF',
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    paddingTop: 30,
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  menuIconContainer: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#F0FBFA',
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  menuItemText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#111827' },
  menuDivider: {
    height: 1, backgroundColor: '#F3F4F6',
    marginVertical: 4, marginLeft: 66,
  },
});
