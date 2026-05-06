import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { useAppContext } from '../../context/AppContext';

// ── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

const groupByDate = (prescriptions) => {
  const groups = {};
  prescriptions.forEach((rx) => {
    const key = rx.date;
    if (!groups[key]) groups[key] = [];
    groups[key].push(rx);
  });
  // Sort dates newest first
  return Object.keys(groups)
    .sort((a, b) => new Date(b) - new Date(a))
    .map((date) => ({ date, data: groups[date] }));
};

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const isActive = status === 'active';
  return (
    <View style={[styles.badge, isActive ? styles.badgeActive : styles.badgeCompleted]}>
      <View style={[styles.badgeDot, { backgroundColor: isActive ? COLORS.primary : '#9CA3AF' }]} />
      <Text style={[styles.badgeText, { color: isActive ? COLORS.primary : '#9CA3AF' }]}>
        {isActive ? 'Active' : 'Completed'}
      </Text>
    </View>
  );
}

// ── Prescription Card ─────────────────────────────────────────────────────────
function PrescriptionCard({ rx, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Card header */}
      <View style={styles.cardHeader}>
        <View style={styles.rxIconBox}>
          <FontAwesome5 name="prescription-bottle-alt" size={20} color={COLORS.primary} />
        </View>
        <View style={styles.cardHeaderInfo}>
          <Text style={styles.diagnosis} numberOfLines={1}>{rx.diagnosis}</Text>
          <Text style={styles.doctorName}>{rx.doctorName} · {rx.doctorSpecialty}</Text>
        </View>
        <StatusBadge status={rx.status} />
      </View>

      {/* Medications preview */}
      <View style={styles.medPreview}>
        {rx.medications.slice(0, 2).map((med, i) => (
          <View key={i} style={styles.medRow}>
            <Ionicons name="ellipse" size={6} color={COLORS.primary} style={{ marginTop: 5 }} />
            <Text style={styles.medText} numberOfLines={1}>
              {med.name} — <Text style={styles.medDosage}>{med.dosage}</Text>
            </Text>
          </View>
        ))}
        {rx.medications.length > 2 && (
          <Text style={styles.moreMeds}>+{rx.medications.length - 2} more medication(s)</Text>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Ionicons name="calendar-outline" size={13} color="#9CA3AF" />
        <Text style={styles.dateText}>{formatDate(rx.date)}</Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.viewDetails}>View details</Text>
        <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
      </View>
    </TouchableOpacity>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function PrescriptionModal({ rx, visible, onClose }) {
  if (!rx) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          {/* Handle */}
          <View style={styles.modalHandle} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalRxBadge}>
                <FontAwesome5 name="prescription-bottle-alt" size={28} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.modalDiagnosis}>{rx.diagnosis}</Text>
                <Text style={styles.modalDoctor}>{rx.doctorName}</Text>
                <Text style={styles.modalSpecialty}>{rx.doctorSpecialty}</Text>
              </View>
              <StatusBadge status={rx.status} />
            </View>

            <View style={styles.modalDivider} />

            {/* Date */}
            <View style={styles.modalRow}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
              <Text style={styles.modalRowLabel}>Date Issued</Text>
              <Text style={styles.modalRowValue}>{formatDate(rx.date)}</Text>
            </View>

            <View style={styles.modalDivider} />

            {/* Medications */}
            <Text style={styles.modalSectionTitle}>
              <FontAwesome5 name="pills" size={14} color={COLORS.primary} /> {'  '}Medications
            </Text>
            {rx.medications.map((med, i) => (
              <View key={i} style={styles.medCard}>
                <View style={styles.medCardLeft}>
                  <Text style={styles.medCardName}>{med.name}</Text>
                  <Text style={styles.medCardDosage}>{med.dosage}</Text>
                </View>
                <View style={styles.medCardRight}>
                  <View style={styles.medDetail}>
                    <Ionicons name="time-outline" size={12} color="#9CA3AF" />
                    <Text style={styles.medDetailText}>{med.frequency}</Text>
                  </View>
                  <View style={styles.medDetail}>
                    <Ionicons name="hourglass-outline" size={12} color="#9CA3AF" />
                    <Text style={styles.medDetailText}>{med.duration}</Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Notes */}
            {rx.notes ? (
              <>
                <Text style={[styles.modalSectionTitle, { marginTop: 20 }]}>
                  <Ionicons name="document-text-outline" size={14} color={COLORS.primary} /> {'  '}Doctor's Notes
                </Text>
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>{rx.notes}</Text>
                </View>
              </>
            ) : null}

            <View style={{ height: 40 }} />
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function PrescriptionScreen({ navigation }) {
  const { getPatientPrescriptions } = useAppContext();
  const [search, setSearch] = useState('');
  const [selectedRx, setSelectedRx] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'active' | 'completed'

  const allPrescriptions = getPatientPrescriptions();

  const filtered = useMemo(() => {
    return allPrescriptions.filter((rx) => {
      const matchesSearch =
        rx.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
        rx.doctorName.toLowerCase().includes(search.toLowerCase()) ||
        rx.medications.some((m) => m.name.toLowerCase().includes(search.toLowerCase()));
      const matchesFilter =
        activeFilter === 'all' ? true : rx.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [allPrescriptions, search, activeFilter]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  const openDetail = (rx) => {
    setSelectedRx(rx);
    setModalVisible(true);
  };

  const renderGroup = ({ item: group }) => (
    <View style={styles.group}>
      <View style={styles.groupHeader}>
        <View style={styles.groupDot} />
        <Text style={styles.groupDate}>{formatDate(group.date)}</Text>
      </View>
      {group.data.map((rx) => (
        <PrescriptionCard key={rx.id} rx={rx} onPress={() => openDetail(rx)} />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Prescriptions</Text>
        <View style={styles.rxCountBadge}>
          <Text style={styles.rxCountText}>{allPrescriptions.length}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={18} color="#D1D5DB" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by diagnosis, doctor or medicine..."
          placeholderTextColor="#D1D5DB"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {['all', 'active', 'completed'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterTabText, activeFilter === f && styles.filterTabTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grouped list */}
      <FlatList
        data={grouped}
        keyExtractor={(item) => item.date}
        renderItem={renderGroup}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <FontAwesome5 name="prescription-bottle" size={56} color="#E5E7EB" />
            <Text style={styles.emptyTitle}>No prescriptions found</Text>
            <Text style={styles.emptySubtitle}>
              {search ? 'Try a different search term' : 'Your prescriptions from doctors will appear here'}
            </Text>
          </View>
        )}
      />

      <PrescriptionModal
        rx={selectedRx}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  rxCountBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  rxCountText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1F2937' },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterTabText: { fontSize: 13, fontWeight: '600', color: '#9CA3AF' },
  filterTabTextActive: { color: '#FFFFFF' },

  listContent: { paddingHorizontal: 16, paddingBottom: 40 },

  group: { marginBottom: 8 },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 8,
  },
  groupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  groupDate: { fontSize: 13, fontWeight: '700', color: '#6B7280', letterSpacing: 0.3 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  rxIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardHeaderInfo: { flex: 1 },
  diagnosis: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 2 },
  doctorName: { fontSize: 12, color: '#9CA3AF' },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  badgeActive: { backgroundColor: '#E0F2F1' },
  badgeCompleted: { backgroundColor: '#F3F4F6' },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: '600' },

  medPreview: { marginBottom: 12 },
  medRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 4 },
  medText: { fontSize: 13, color: '#374151', flex: 1 },
  medDosage: { color: COLORS.primary, fontWeight: '600' },
  moreMeds: { fontSize: 12, color: '#9CA3AF', marginTop: 2, marginLeft: 12 },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  dateText: { fontSize: 12, color: '#9CA3AF', marginLeft: 2 },
  viewDetails: { fontSize: 13, fontWeight: '600', color: COLORS.primary },

  emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#9CA3AF', marginTop: 16 },
  emptySubtitle: { fontSize: 13, color: '#D1D5DB', marginTop: 6, textAlign: 'center' },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    maxHeight: '90%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  modalRxBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDiagnosis: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 2 },
  modalDoctor: { fontSize: 14, fontWeight: '600', color: '#374151' },
  modalSpecialty: { fontSize: 12, color: '#9CA3AF' },
  modalDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 14 },
  modalRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modalRowLabel: { fontSize: 14, color: '#6B7280', flex: 1 },
  modalRowValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  modalSectionTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 12 },

  medCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  medCardLeft: { flex: 1 },
  medCardName: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  medCardDosage: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    backgroundColor: '#E0F2F1',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  medCardRight: { gap: 4, alignItems: 'flex-end' },
  medDetail: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  medDetailText: { fontSize: 11, color: '#9CA3AF' },

  notesBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  notesText: { fontSize: 13, color: '#374151', lineHeight: 20 },

  closeBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 16,
  },
  closeBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
