import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Image,
  Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { useAppContext } from '../../context/AppContext';

const EMPTY_MED = { name: '', dosage: '', frequency: '', duration: '' };

export default function ConsultationScreen({ navigation, route }) {
  const { appointment } = route.params;
  const { updateAppointmentStatus, addPrescription, user } = useAppContext();

  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState([{ ...EMPTY_MED }]);
  const [submitted, setSubmitted] = useState(false);

  const addMedication = () => setMedications(prev => [...prev, { ...EMPTY_MED }]);

  const removeMedication = (i) =>
    setMedications(prev => prev.filter((_, idx) => idx !== i));

  const updateMed = (i, field, val) =>
    setMedications(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m));

  const handleSubmit = () => {
    if (!diagnosis.trim()) {
      Alert.alert('Missing Diagnosis', 'Please enter a diagnosis before submitting.');
      return;
    }
    const validMeds = medications.filter(m => m.name.trim());
    if (validMeds.length === 0) {
      Alert.alert('No Medications', 'Please add at least one medication.');
      return;
    }

    addPrescription({
      patientId: appointment.patientId,
      doctorId: user?.id,
      doctorName: user?.name,
      doctorSpecialty: user?.specialty,
      diagnosis,
      medications: validMeds,
      notes,
      status: 'active',
    });

    updateAppointmentStatus(appointment.id, 'completed');
    setSubmitted(true);

    Alert.alert(
      '✅ Prescription Sent',
      'The prescription has been sent to the patient and the appointment is marked as completed.',
      [{ text: 'Done', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consultation</Text>
        <View style={{ width: 38 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Patient Info Card */}
          <View style={styles.patientCard}>
            <View style={styles.patientAvatar}>
              {appointment.patientAvatar
                ? <Image source={appointment.patientAvatar} style={styles.avatarImg} />
                : <Ionicons name="person" size={28} color={COLORS.primary} />
              }
            </View>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{appointment.patientName}</Text>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={13} color="#9CA3AF" />
                <Text style={styles.infoText}>{appointment.date}</Text>
                <Ionicons name="time-outline" size={13} color="#9CA3AF" style={{ marginLeft: 8 }} />
                <Text style={styles.infoText}>{appointment.timeSlot}</Text>
              </View>
            </View>
            <View style={[styles.statusChip,
              appointment.status === 'confirmed' ? styles.chipConfirmed : styles.chipPending
            ]}>
              <Text style={styles.chipText}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </Text>
            </View>
          </View>

          {/* ── Diagnosis ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="medical" size={15} color={COLORS.primary} /> {'  '}Diagnosis
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Hypertension Stage 1, Upper respiratory infection…"
              placeholderTextColor="#D1D5DB"
              value={diagnosis}
              onChangeText={setDiagnosis}
            />
          </View>

          {/* ── Medications ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <FontAwesome5 name="pills" size={13} color={COLORS.primary} /> {'  '}Medications
            </Text>

            {medications.map((med, i) => (
              <View key={i} style={styles.medBlock}>
                <View style={styles.medHeader}>
                  <View style={styles.medNum}>
                    <Text style={styles.medNumText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.medTitle}>Medication {i + 1}</Text>
                  {medications.length > 1 && (
                    <TouchableOpacity onPress={() => removeMedication(i)}>
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Medicine name (e.g. Amoxicillin)"
                  placeholderTextColor="#D1D5DB"
                  value={med.name}
                  onChangeText={v => updateMed(i, 'name', v)}
                />
                <View style={styles.medRow}>
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Dosage (e.g. 500mg)"
                    placeholderTextColor="#D1D5DB"
                    value={med.dosage}
                    onChangeText={v => updateMed(i, 'dosage', v)}
                  />
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Duration (e.g. 7 days)"
                    placeholderTextColor="#D1D5DB"
                    value={med.duration}
                    onChangeText={v => updateMed(i, 'duration', v)}
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Frequency (e.g. Twice daily)"
                  placeholderTextColor="#D1D5DB"
                  value={med.frequency}
                  onChangeText={v => updateMed(i, 'frequency', v)}
                />
              </View>
            ))}

            <TouchableOpacity style={styles.addMedBtn} onPress={addMedication}>
              <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.addMedText}>Add another medication</Text>
            </TouchableOpacity>
          </View>

          {/* ── Doctor's Notes ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="document-text-outline" size={15} color={COLORS.primary} /> {'  '}Doctor's Notes
            </Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Add instructions, lifestyle advice, follow-up notes…"
              placeholderTextColor="#D1D5DB"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          {/* ── Submit ── */}
          <TouchableOpacity
            style={[styles.submitBtn, submitted && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={submitted}
          >
            <FontAwesome5 name="prescription-bottle-alt" size={18} color="#FFF" />
            <Text style={styles.submitText}>Submit Prescription</Text>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },

  scroll: { padding: 16 },

  patientCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: 16,
    padding: 16, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  patientAvatar: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: '#E0F2F1',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12, overflow: 'hidden',
  },
  avatarImg: { width: 56, height: 56, borderRadius: 16 },
  patientInfo: { flex: 1 },
  patientName: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  infoText: { fontSize: 12, color: '#9CA3AF' },
  statusChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  chipConfirmed: { backgroundColor: '#D1FAE5' },
  chipPending: { backgroundColor: '#FEF3C7' },
  chipText: { fontSize: 11, fontWeight: '700', color: '#374151' },

  section: {
    backgroundColor: '#FFF', borderRadius: 16,
    padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 12 },

  input: {
    borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#1F2937',
    backgroundColor: '#FAFAFA', marginBottom: 10,
  },
  halfInput: { flex: 1 },
  medRow: { flexDirection: 'row', gap: 10 },
  notesInput: { height: 100, paddingTop: 12 },

  medBlock: {
    borderWidth: 1, borderColor: '#F3F4F6',
    borderRadius: 14, padding: 12, marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  medHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  medNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  medNumText: { fontSize: 12, fontWeight: '700', color: '#FFF' },
  medTitle: { flex: 1, fontSize: 13, fontWeight: '700', color: '#374151' },

  addMedBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12,
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: COLORS.primary,
    borderRadius: 12, marginTop: 4,
  },
  addMedText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },

  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: 16,
    paddingVertical: 16, gap: 10, marginTop: 8,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 6,
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});
