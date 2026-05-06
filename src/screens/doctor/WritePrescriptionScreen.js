import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { useAppContext } from '../../context/AppContext';

const EMPTY_MED = {
  name: '',
  dosage: '',
  frequency: '',
  duration: '',
  instructions: '',
};

export default function WritePrescriptionScreen({ navigation, route }) {
  const { appointment } = route.params || {};
  const { updateAppointmentStatus, addPrescription, user } = useAppContext();

  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState([{ ...EMPTY_MED }]);
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Mock patient info if no appointment is passed (for the "Write Prescription" quick action)
  const patient = appointment || {
    patientName: 'John Doe',
    patientAvatar: null,
    date: 'Today',
    timeSlot: '14:30',
    gender: 'Male',
    age: '29 yrs',
  };

  const addMedication = () => setMedications((prev) => [...prev, { ...EMPTY_MED }]);

  const removeMedication = (i) =>
    setMedications((prev) => prev.filter((_, idx) => idx !== i));

  const updateMed = (i, field, val) =>
    setMedications((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [field]: val } : m))
    );

  const handleSaveDraft = () => {
    Alert.alert('Draft Saved', 'Your prescription draft has been saved locally.');
  };

  const handleSubmit = () => {
    if (!diagnosis.trim()) {
      Alert.alert('Missing Diagnosis', 'Please enter a diagnosis or notes before submitting.');
      return;
    }
    const validMeds = medications.filter((m) => m.name.trim());
    if (validMeds.length === 0) {
      Alert.alert('No Medications', 'Please add at least one medication.');
      return;
    }

    addPrescription({
      patientId: patient.patientId || 'p123',
      doctorId: user?.id,
      doctorName: user?.name,
      doctorSpecialty: user?.specialty,
      diagnosis,
      medications: validMeds,
      notes: additionalInstructions,
      status: 'active',
    });

    if (appointment?.id) {
      updateAppointmentStatus(appointment.id, 'completed');
    }

    setSubmitted(true);

    Alert.alert(
      '✅ Prescription Submitted',
      'The prescription has been sent to the patient.',
      [{ text: 'Great', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Prescription</Text>
          <View style={{ width: 40 }} />
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
            {/* ── 1. Patient Info Section ── */}
            <View style={styles.patientSection}>
              <View style={styles.patientAvatar}>
                {patient.patientAvatar ? (
                  <Image source={patient.patientAvatar} style={styles.avatarImg} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarInitial}>{patient.patientName.charAt(0)}</Text>
                  </View>
                )}
              </View>
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>{patient.patientName}</Text>
                <Text style={styles.patientMeta}>
                  {patient.gender || 'Male'}, {patient.age || '29 yrs'}
                </Text>
                <View style={styles.dateTimeRow}>
                  <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
                  <Text style={styles.dateTimeText}>
                    {patient.date} • {patient.timeSlot}
                  </Text>
                </View>
              </View>
              <View style={styles.rxBadge}>
                <FontAwesome5 name="prescription" size={16} color={COLORS.primary} />
              </View>
            </View>

            {/* ── 2. Diagnosis / Notes ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Diagnosis / Notes</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder="Enter diagnosis or clinical notes..."
                  placeholderTextColor="#D1D5DB"
                  value={diagnosis}
                  onChangeText={setDiagnosis}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              <Text style={styles.inputHint}>Required for medical context</Text>
            </View>

            {/* ── 3. Medications Section ── */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Medications Section</Text>
                <TouchableOpacity style={styles.addMedBtn} onPress={addMedication}>
                  <Ionicons name="add" size={20} color="#FFF" />
                  <Text style={styles.addMedBtnText}>Add Medication</Text>
                </TouchableOpacity>
              </View>

              {medications.map((med, i) => (
                <View key={i} style={styles.medCard}>
                  <View style={styles.medCardHeader}>
                    <View style={styles.medIconBox}>
                      <MaterialCommunityIcons name="pill" size={20} color={COLORS.primary} />
                    </View>
                    <Text style={styles.medCardTitle}>Medication {i + 1}</Text>
                    {medications.length > 1 && (
                      <TouchableOpacity onPress={() => removeMedication(i)}>
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Medication Name</Text>
                    <TextInput
                      style={styles.fieldInput}
                      placeholder="e.g. Paracetamol"
                      value={med.name}
                      onChangeText={(v) => updateMed(i, 'name', v)}
                    />
                  </View>

                  <View style={styles.fieldRow}>
                    <View style={[styles.fieldGroup, { flex: 1 }]}>
                      <Text style={styles.fieldLabel}>Dosage</Text>
                      <TextInput
                        style={styles.fieldInput}
                        placeholder="500mg"
                        value={med.dosage}
                        onChangeText={(v) => updateMed(i, 'dosage', v)}
                      />
                    </View>
                    <View style={[styles.fieldGroup, { flex: 1 }]}>
                      <Text style={styles.fieldLabel}>Frequency</Text>
                      <TextInput
                        style={styles.fieldInput}
                        placeholder="2x per day"
                        value={med.frequency}
                        onChangeText={(v) => updateMed(i, 'frequency', v)}
                      />
                    </View>
                  </View>

                  <View style={styles.fieldRow}>
                    <View style={[styles.fieldGroup, { flex: 1 }]}>
                      <Text style={styles.fieldLabel}>Duration</Text>
                      <TextInput
                        style={styles.fieldInput}
                        placeholder="5 days"
                        value={med.duration}
                        onChangeText={(v) => updateMed(i, 'duration', v)}
                      />
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Instructions</Text>
                    <TextInput
                      style={styles.fieldInput}
                      placeholder="After meals"
                      value={med.instructions}
                      onChangeText={(v) => updateMed(i, 'instructions', v)}
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* ── 4. Additional Instructions ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Instructions</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  placeholder="e.g. Rest, drink plenty of water, return if fever persists..."
                  placeholderTextColor="#D1D5DB"
                  value={additionalInstructions}
                  onChangeText={setAdditionalInstructions}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* ── 5. Action Buttons ── */}
            <View style={styles.footerActions}>
              <TouchableOpacity style={styles.draftBtn} onPress={handleSaveDraft}>
                <Text style={styles.draftBtnText}>Save Draft</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, submitted && styles.submitDisabled]}
                onPress={handleSubmit}
                disabled={submitted}
              >
                <Text style={styles.submitBtnText}>Submit Prescription</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },

  scroll: { padding: 16 },

  // Patient Info
  patientSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  patientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    marginRight: 14,
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { color: '#FFF', fontSize: 24, fontWeight: '700' },
  avatarImg: { width: '100%', height: '100%' },
  patientInfo: { flex: 1 },
  patientName: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 2 },
  patientMeta: { fontSize: 14, color: '#374151', marginBottom: 4 },
  dateTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateTimeText: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  rxBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  // Sections
  section: { marginBottom: 24 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  inputWrapper: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  input: {
    padding: 16,
    fontSize: 15,
    color: '#111827',
    minHeight: 100,
  },
  multilineInput: { height: 120 },
  inputHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
    marginLeft: 4,
    fontStyle: 'italic',
  },

  // Medication Card
  addMedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  addMedBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },

  medCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  medCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 10,
  },
  medIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medCardTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: '#111827' },

  fieldGroup: { marginBottom: 14 },
  fieldRow: { flexDirection: 'row', gap: 12 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 6,
    marginLeft: 2,
  },
  fieldInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },

  // Footer
  footerActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  draftBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  draftBtnText: { fontSize: 15, fontWeight: '700', color: '#6B7280' },
  submitBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
  submitDisabled: { opacity: 0.5 },
});
