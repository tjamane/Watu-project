import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import { TIME_SLOTS } from '../../constants/data';
import Button from '../../components/Button';
import { useAppContext } from '../../context/AppContext';

export default function DoctorProfileScreen({ route, navigation }) {
  const { doctor } = route.params;
  const { bookAppointment } = useAppContext();
  
  const [selectedDate, setSelectedDate] = useState('2026-04-19'); // Dummy current date logic
  const [selectedTime, setSelectedTime] = useState(null);

  // Generate some dummy next dates
  const dates = ['2026-04-19', '2026-04-20', '2026-04-21', '2026-04-22', '2026-04-23'];

  const handleBook = () => {
    if (!selectedTime) {
      Alert.alert('Select Time', 'Please select a time slot to book an appointment.');
      return;
    }

    const result = bookAppointment(doctor.id, selectedDate, selectedTime);
    if (result.success) {
      Alert.alert('Success', result.message, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <Image source={doctor.avatar} style={styles.avatar} />
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty} • {doctor.town}</Text>
          
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={20} color={COLORS.warning} />
              <Text style={styles.statValue}>{doctor.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.primary} />
              <Text style={styles.statValue}>{doctor.reviews}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Doctor</Text>
          <Text style={styles.aboutText}>{doctor.about}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedules</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
            {dates.map(date => (
              <TouchableOpacity 
                key={date} 
                style={[styles.dateCard, selectedDate === date && styles.dateCardActive]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dateText, selectedDate === date && styles.dateTextActive]}>
                  {date.substring(8)}
                </Text>
                <Text style={[styles.dateSubtext, selectedDate === date && styles.dateTextActive]}>
                  Apr
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.sectionTitle, { marginTop: SIZES.md }]}>Available Time</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map(time => (
              <TouchableOpacity 
                key={time}
                style={[styles.timeSlot, selectedTime === time && styles.timeSlotActive]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[styles.timeText, selectedTime === time && styles.timeTextActive]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
      <View style={styles.footer}>
        <Button title="Book Appointment" onPress={handleBook} style={{ width: '100%' }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: SIZES.lg,
    backgroundColor: COLORS.card,
  },
  backBtn: { padding: SIZES.xs },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  scrollContent: { paddingBottom: 100 },
  profileSection: {
    backgroundColor: COLORS.card,
    alignItems: 'center',
    padding: SIZES.xl,
    borderBottomLeftRadius: SIZES.xl,
    borderBottomRightRadius: SIZES.xl,
    marginBottom: SIZES.md,
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: SIZES.md },
  name: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  specialty: { fontSize: 16, color: COLORS.textSecondary, marginBottom: SIZES.lg },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.xl,
    borderRadius: SIZES.md,
  },
  statItem: { alignItems: 'center', width: 80 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 4 },
  statLabel: { fontSize: 12, color: COLORS.textSecondary },
  statDivider: { width: 1, height: 40, backgroundColor: COLORS.border, marginHorizontal: SIZES.md },
  section: { padding: SIZES.lg, backgroundColor: COLORS.card, marginBottom: SIZES.md },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: SIZES.md },
  aboutText: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 22 },
  dateScroll: { flexDirection: 'row' },
  dateCard: {
    width: 60,
    height: 70,
    borderRadius: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.sm,
  },
  dateCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dateText: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  dateSubtext: { fontSize: 12, color: COLORS.textSecondary },
  dateTextActive: { color: '#FFF' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SIZES.sm },
  timeSlot: {
    width: '31%',
    paddingVertical: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.sm,
    alignItems: 'center',
  },
  timeSlotActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  timeText: { color: COLORS.text },
  timeTextActive: { color: '#FFF' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.lg,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  }
});
