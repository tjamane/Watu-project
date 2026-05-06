import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { useAppContext } from '../../context/AppContext';

const TODAY = new Date().toISOString().split('T')[0];

export default function DoctorHomeScreen({ navigation }) {
  const { user, getDoctorAppointments, getPatientPrescriptions } = useAppContext();
  const appointments = getDoctorAppointments();

  const todayApts = useMemo(
    () => appointments.filter(a => a.date === TODAY),
    [appointments]
  );
  const pendingApts = appointments.filter(a => a.status === 'pending');
  const confirmedApts = appointments.filter(a => a.status === 'confirmed');

  // Prescriptions that were written today (no notes yet = "incomplete")
  const allRx = getPatientPrescriptions ? getPatientPrescriptions() : [];
  const pendingRx = allRx.filter(r => r.status === 'active' && r.doctorId === user?.id);

  const quickStats = [
    { label: 'Today', value: todayApts.length || 0, icon: 'calendar', color: COLORS.primary },
    { label: 'Pending', value: pendingApts.length, icon: 'time', color: '#F59E0B' },
    { label: 'Confirmed', value: confirmedApts.length, icon: 'checkmark-circle', color: '#10B981' },
    { label: 'Prescriptions', value: allRx.length, icon: 'document-text', color: '#8B5CF6' },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Teal header */}
      <SafeAreaView style={styles.topSection}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good Morning 👋</Text>
            <Text style={styles.doctorName}>{user?.name || 'Dr. Marcus Horizon'}</Text>
            <Text style={styles.specialty}>{user?.specialty || 'Cardiologist'}</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={24} color="#FFF" />
            {pendingApts.length > 0 && <View style={styles.notifDot} />}
          </TouchableOpacity>
        </View>

        {/* Quick stats row */}
        <View style={styles.statsRow}>
          {quickStats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Ionicons name={s.icon} size={20} color={s.color} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </SafeAreaView>

      {/* White scrollable body */}
      <View style={styles.body}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* ── Pending Actions ── */}
          {(pendingApts.length > 0 || pendingRx.length > 0) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚡ Pending Actions</Text>
              {pendingApts.length > 0 && (
                <TouchableOpacity
                  style={styles.alertCard}
                  onPress={() => navigation.navigate('DoctorApts')}
                >
                  <View style={[styles.alertIcon, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="people" size={20} color="#F59E0B" />
                  </View>
                  <View style={styles.alertBody}>
                    <Text style={styles.alertTitle}>
                      {pendingApts.length} patient{pendingApts.length > 1 ? 's' : ''} waiting
                    </Text>
                    <Text style={styles.alertSub}>Tap to review & accept</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
              {pendingRx.length > 0 && (
                <TouchableOpacity style={[styles.alertCard, { marginTop: 8 }]}>
                  <View style={[styles.alertIcon, { backgroundColor: '#EDE9FE' }]}>
                    <FontAwesome5 name="prescription-bottle-alt" size={18} color="#8B5CF6" />
                  </View>
                  <View style={styles.alertBody}>
                    <Text style={styles.alertTitle}>
                      {pendingRx.length} prescription{pendingRx.length > 1 ? 's' : ''} pending
                    </Text>
                    <Text style={styles.alertSub}>Complete patient prescriptions</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* ── Quick Actions ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
            <View style={styles.quickRow}>
              <TouchableOpacity
                style={[styles.quickAction, { backgroundColor: COLORS.primary }]}
                onPress={() => navigation.navigate('DoctorApts')}
              >
                <Ionicons name="medkit" size={26} color="#FFF" />
                <Text style={styles.quickActionText}>Start{'\n'}Consultation</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickAction, { backgroundColor: '#8B5CF6' }]}
                onPress={() => navigation.navigate('WritePrescription')}
              >
                <FontAwesome5 name="prescription-bottle-alt" size={24} color="#FFF" />
                <Text style={styles.quickActionText}>Write{'\n'}Prescription</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickAction, { backgroundColor: '#10B981' }]}
              >
                <Ionicons name="calendar" size={26} color="#FFF" />
                <Text style={styles.quickActionText}>View{'\n'}Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Today's Appointments ── */}
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>📅 Today's Appointments</Text>
              <TouchableOpacity onPress={() => navigation.navigate('DoctorApts')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>

            {todayApts.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="calendar-outline" size={40} color="#E5E7EB" />
                <Text style={styles.emptyText}>No appointments today</Text>
                <Text style={styles.emptySub}>Enjoy your free time 🎉</Text>
              </View>
            ) : (
              todayApts.slice(0, 3).map(apt => (
                <TouchableOpacity
                  key={apt.id}
                  style={styles.aptCard}
                  onPress={() => navigation.navigate('WritePrescription', { appointment: apt })}
                >
                  <View style={styles.timeBox}>
                    <Text style={styles.timeText}>{apt.timeSlot?.split(' ')[0]}</Text>
                    <Text style={styles.ampm}>{apt.timeSlot?.split(' ')[1]}</Text>
                  </View>
                  <View style={styles.aptInfo}>
                    <Text style={styles.aptPatient}>{apt.patientName}</Text>
                    <Text style={styles.aptDate}>{apt.date}</Text>
                  </View>
                  <View style={[styles.aptBadge,
                    apt.status === 'confirmed' ? styles.confirmed :
                    apt.status === 'pending' ? styles.pending : styles.cancelled
                  ]}>
                    <Text style={styles.aptBadgeText}>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* ── All upcoming appointments (non-today) ── */}
          {appointments.filter(a => a.date !== TODAY && a.status !== 'cancelled').length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🗓️ Upcoming</Text>
              {appointments
                .filter(a => a.date !== TODAY && a.status !== 'cancelled')
                .slice(0, 3)
                .map(apt => (
                  <TouchableOpacity
                    key={apt.id}
                    style={styles.aptCard}
                    onPress={() => navigation.navigate('WritePrescription', { appointment: apt })}
                  >
                    <View style={[styles.timeBox, { backgroundColor: '#F3F4F6' }]}>
                      <Text style={[styles.timeText, { color: '#6B7280' }]}>{apt.timeSlot?.split(' ')[0]}</Text>
                      <Text style={[styles.ampm, { color: '#9CA3AF' }]}>{apt.timeSlot?.split(' ')[1]}</Text>
                    </View>
                    <View style={styles.aptInfo}>
                      <Text style={styles.aptPatient}>{apt.patientName}</Text>
                      <Text style={styles.aptDate}>{apt.date}</Text>
                    </View>
                    <View style={[styles.aptBadge, apt.status === 'confirmed' ? styles.confirmed : styles.pending]}>
                      <Text style={styles.aptBadgeText}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F9FAFB' },

  topSection: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 20,
  },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  doctorName: { fontSize: 22, fontWeight: '700', color: '#FFF', marginBottom: 2 },
  specialty: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  notifBtn: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#FCD34D',
  },

  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14, padding: 10, alignItems: 'center', gap: 4,
  },
  statValue: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  body: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },

  section: { marginBottom: 24 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 },
  seeAll: { fontSize: 13, fontWeight: '600', color: COLORS.primary },

  alertCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  alertIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  alertBody: { flex: 1 },
  alertTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  alertSub: { fontSize: 12, color: '#9CA3AF' },

  quickRow: { flexDirection: 'row', gap: 10 },
  quickAction: {
    flex: 1, borderRadius: 16, padding: 14,
    alignItems: 'center', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },
  quickActionText: { fontSize: 12, fontWeight: '700', color: '#FFF', textAlign: 'center' },

  aptCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: 14,
    padding: 14, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  timeBox: {
    width: 52, height: 52, borderRadius: 12,
    backgroundColor: '#E0F2F1',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  timeText: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  ampm: { fontSize: 10, color: COLORS.primary, fontWeight: '600' },
  aptInfo: { flex: 1 },
  aptPatient: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 2 },
  aptDate: { fontSize: 12, color: '#9CA3AF' },
  aptBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  aptBadgeText: { fontSize: 11, fontWeight: '700', color: '#374151' },
  confirmed: { backgroundColor: '#D1FAE5' },
  pending: { backgroundColor: '#FEF3C7' },
  cancelled: { backgroundColor: '#FEE2E2' },

  emptyCard: {
    backgroundColor: '#FFF', borderRadius: 16,
    padding: 32, alignItems: 'center',
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#9CA3AF', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#D1D5DB', marginTop: 4 },
});
