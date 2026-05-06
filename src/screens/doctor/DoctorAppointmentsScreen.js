import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { useAppContext } from '../../context/AppContext';

const FILTERS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

const STATUS_STYLE = {
  pending:   { bg: '#FEF3C7', text: '#92400E', label: 'Pending' },
  confirmed: { bg: '#D1FAE5', text: '#065F46', label: 'Confirmed' },
  completed: { bg: '#DBEAFE', text: '#1E40AF', label: 'Completed' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B', label: 'Cancelled' },
};

function AppointmentCard({ item, onPress, onAccept, onReject }) {
  const s = STATUS_STYLE[item.status] || STATUS_STYLE.pending;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      {/* Top row */}
      <View style={styles.cardTop}>
        <View style={styles.avatarCircle}>
          {item.patientAvatar
            ? <Image source={item.patientAvatar} style={styles.avatarImg} />
            : <Ionicons name="person" size={22} color={COLORS.primary} />
          }
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.patientName}>{item.patientName}</Text>
          <View style={styles.timeRow}>
            <Ionicons name="calendar-outline" size={13} color="#9CA3AF" />
            <Text style={styles.timeText}>{item.date}</Text>
            <Ionicons name="time-outline" size={13} color="#9CA3AF" style={{ marginLeft: 8 }} />
            <Text style={styles.timeText}>{item.timeSlot}</Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: s.bg }]}>
          <Text style={[styles.badgeText, { color: s.text }]}>{s.label}</Text>
        </View>
      </View>

      {/* Actions for pending */}
      {item.status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.rejectBtn} onPress={() => onReject(item.id)}>
            <Ionicons name="close" size={16} color="#EF4444" />
            <Text style={styles.rejectText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptBtn} onPress={() => onAccept(item.id)}>
            <Ionicons name="checkmark" size={16} color="#FFF" />
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.consultBtn} onPress={onPress}>
            <Ionicons name="medkit-outline" size={16} color="#FFF" />
            <Text style={styles.consultText}>Consult</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Consult button for confirmed */}
      {item.status === 'confirmed' && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.consultBtn, { flex: 1 }]} onPress={onPress}>
            <Ionicons name="medkit-outline" size={16} color="#FFF" />
            <Text style={styles.consultText}>Start Consultation</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function DoctorAppointmentsScreen({ navigation }) {
  const { getDoctorAppointments, updateAppointmentStatus } = useAppContext();
  const [activeFilter, setActiveFilter] = useState('All');

  const all = getDoctorAppointments();
  const filtered = activeFilter === 'All'
    ? all
    : all.filter(a => a.status === activeFilter.toLowerCase());

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Appointments</Text>
        <Text style={styles.headerSub}>{all.length} total</Text>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterWrap}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTERS}
          keyExtractor={f => f}
          contentContainerStyle={styles.filterList}
          renderItem={({ item: f }) => (
            <TouchableOpacity
              style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterTabText, activeFilter === f && styles.filterTabTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Appointments list */}
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AppointmentCard
            item={item}
            onPress={() => navigation.navigate('Home', { screen: 'WritePrescription', params: { appointment: item } })}
            onAccept={(id) => updateAppointmentStatus(id, 'confirmed')}
            onReject={(id) => updateAppointmentStatus(id, 'cancelled')}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={56} color="#E5E7EB" />
            <Text style={styles.emptyTitle}>No appointments</Text>
            <Text style={styles.emptySub}>
              {activeFilter === 'All'
                ? 'Patients will appear here once they book'
                : `No ${activeFilter.toLowerCase()} appointments`}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  header: {
    backgroundColor: '#FFF', paddingHorizontal: 20,
    paddingTop: 16, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#111827' },
  headerSub: { fontSize: 13, color: '#9CA3AF', marginTop: 2 },

  filterWrap: { backgroundColor: '#FFF', paddingBottom: 12 },
  filterList: { paddingHorizontal: 16, gap: 8 },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB',
  },
  filterTabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterTabText: { fontSize: 13, fontWeight: '600', color: '#9CA3AF' },
  filterTabTextActive: { color: '#FFF' },

  list: { padding: 16, gap: 12, paddingBottom: 40 },

  card: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: '#E0F2F1',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
    overflow: 'hidden',
  },
  avatarImg: { width: 52, height: 52, borderRadius: 16 },
  cardInfo: { flex: 1 },
  patientName: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  timeText: { fontSize: 12, color: '#9CA3AF' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '700' },

  actions: {
    flexDirection: 'row', gap: 8, marginTop: 12,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6',
  },
  rejectBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#FCA5A5', borderRadius: 10, paddingVertical: 8, gap: 4,
  },
  rejectText: { fontSize: 13, fontWeight: '700', color: '#EF4444' },
  acceptBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#10B981', borderRadius: 10, paddingVertical: 8, gap: 4,
  },
  acceptText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  consultBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 8, gap: 4,
  },
  consultText: { fontSize: 13, fontWeight: '700', color: '#FFF' },

  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#9CA3AF', marginTop: 16 },
  emptySub: { fontSize: 13, color: '#D1D5DB', marginTop: 6, textAlign: 'center' },
});
