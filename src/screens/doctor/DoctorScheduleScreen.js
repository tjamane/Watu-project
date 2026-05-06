import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';
import { TIME_SLOTS } from '../../constants/data';
import { useAppContext } from '../../context/AppContext';

export default function DoctorScheduleScreen() {
  const { getDoctorAppointments } = useAppContext();
  const appointments = getDoctorAppointments().filter(apt => apt.status === 'confirmed');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Schedule</Text>
        <Text style={styles.subtitle}>April 19, 2026</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {TIME_SLOTS.map(time => {
          const appointment = appointments.find(apt => apt.timeSlot === time);
          
          return (
            <View key={time} style={styles.timeRow}>
              <View style={styles.timeLabel}>
                <Text style={styles.timeText}>{time.split(' ')[0]}</Text>
                <Text style={styles.ampmText}>{time.split(' ')[1]}</Text>
              </View>
              
              <View style={styles.slotContainer}>
                {appointment ? (
                  <View style={styles.bookedSlot}>
                    <Text style={styles.patientName}>{appointment.patientName}</Text>
                    <Text style={styles.statusText}>Confirmed</Text>
                  </View>
                ) : (
                  <View style={styles.emptySlot}>
                    <Text style={styles.emptyText}>Available</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    padding: SIZES.lg, 
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: SIZES.lg,
    borderBottomRightRadius: SIZES.lg,
    marginBottom: SIZES.md,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 
  },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  subtitle: { fontSize: 16, color: COLORS.primary, marginTop: 4 },
  scrollContent: { padding: SIZES.md },
  timeRow: {
    flexDirection: 'row',
    marginBottom: SIZES.md,
    minHeight: 80,
  },
  timeLabel: {
    width: 60,
    alignItems: 'center',
    paddingTop: SIZES.xs,
  },
  timeText: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  ampmText: { fontSize: 12, color: COLORS.textSecondary },
  slotContainer: {
    flex: 1,
    marginLeft: SIZES.sm,
  },
  bookedSlot: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.md,
    padding: SIZES.md,
    justifyContent: 'center',
  },
  patientName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  statusText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 },
  emptySlot: {
    flex: 1,
    backgroundColor: COLORS.border,
    borderRadius: SIZES.md,
    padding: SIZES.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  emptyText: { color: COLORS.textSecondary, fontSize: 14 }
});
