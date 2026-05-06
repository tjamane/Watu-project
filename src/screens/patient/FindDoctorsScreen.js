import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  FlatList,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

import { COLORS } from '../../constants/theme';
import { CATEGORIES } from '../../constants/data';
import { useAppContext } from '../../context/AppContext';
import TopDoctorCard from '../../components/TopDoctorCard';

export default function FindDoctorsScreen({ navigation }) {
  const { user, doctors, getPatientPrescriptions, getPatientAppointments, appointments } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const inputRef = useRef(null);

  // Latest prescription & next appointment for the dashboard cards
  const prescriptions = getPatientPrescriptions ? getPatientPrescriptions() : [];
  const latestRx = prescriptions[0] || null;
  const patientApts = getPatientAppointments ? getPatientAppointments() : [];
  const nextApt = patientApts.find((a) => a.status === 'pending' || a.status === 'confirmed') || null;

  const handleFocus = () => {
    setIsSearchFocused(true);
    Animated.timing(fadeAnim, {
      toValue: 0.15,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    if (searchQuery.length === 0) {
      exitSearch();
    }
  };

  const exitSearch = () => {
    setIsSearchFocused(false);
    setSearchQuery('');
    Keyboard.dismiss();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderIcon = (category) => {
    const size = 24;
    const color = COLORS.primary;
    return <FontAwesome5 name={category.icon} size={size} color={color} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Dimmed background content ── */}
      <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]} pointerEvents={isSearchFocused ? 'none' : 'auto'}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Hello, {user?.name || 'Guest'} 👋</Text>
            <Text style={styles.headerTitle}>
              Find your desire{'\n'}health solution
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Search placeholder (tappable area that triggers focus) */}
          <TouchableOpacity
            style={styles.searchContainer}
            activeOpacity={1}
            onPress={() => inputRef.current?.focus()}
          >
            <Ionicons name="search-outline" size={20} color="#D1D5DB" style={styles.searchIcon} />
            <Text style={styles.searchPlaceholder}>Search doctor, drugs, articles...</Text>
          </TouchableOpacity>

          {/* Categories */}
          <View style={styles.categoriesRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() => navigation.navigate('AllDoctors', {
                  specialty: cat.specialty,
                  title: cat.name.replace('\n', ' '),
                })}
              >
                <View style={styles.categoryIconContainer}>
                  {renderIcon(cat)}
                </View>
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Banner */}
          <View style={styles.bannerContainer}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>
                Early protection for{'\n'}your family health
              </Text>
              <TouchableOpacity style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Learn more</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={require('../../../assets/Image.png')}
              style={styles.bannerImage}
            />
          </View>

          {/* Top Doctor */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Doctor</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllDoctors')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalContent}
            style={styles.horizontalScroll}
          >
            {doctors.map((doc) => (
              <TopDoctorCard
                key={doc.id}
                doctor={doc}
                onPress={() => navigation.navigate('DoctorProfile', { doctor: doc })}
              />
            ))}
          </ScrollView>

          {/* ── New Prescription Alert ── */}
          <View style={styles.sectionHeader2}>
            <Text style={styles.sectionTitle}>Recent Updates</Text>
          </View>

          {/* Prescription card */}
          <TouchableOpacity
            style={styles.rxAlertCard}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('Prescriptions')}
          >
            <View style={styles.rxAlertIconBox}>
              <FontAwesome5 name="prescription-bottle-alt" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.rxAlertBody}>
              {latestRx ? (
                <>
                  <View style={styles.rxAlertTopRow}>
                    <Text style={styles.rxAlertLabel}>New Prescription</Text>
                    <View style={styles.rxNewDot} />
                  </View>
                  <Text style={styles.rxAlertDiagnosis} numberOfLines={1}>{latestRx.diagnosis}</Text>
                  <Text style={styles.rxAlertDoctor}>{latestRx.doctorName} · {latestRx.date}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.rxAlertLabel}>No Prescriptions Yet</Text>
                  <Text style={styles.rxAlertDoctor}>Your doctor's prescriptions appear here</Text>
                </>
              )}
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

          {/* Next Appointment card */}
          <TouchableOpacity
            style={styles.aptCard}
            activeOpacity={0.88}
            onPress={() => {}}
          >
            <View style={styles.aptLeft}>
              <View style={styles.aptIconBox}>
                <Ionicons name="calendar" size={22} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.aptLabel}>Next Appointment</Text>
                {nextApt ? (
                  <>
                    <Text style={styles.aptValue}>{nextApt.date}</Text>
                    <Text style={styles.aptSub}>{nextApt.timeSlot}</Text>
                  </>
                ) : (
                  <Text style={styles.aptEmpty}>No upcoming appointments</Text>
                )}
              </View>
            </View>
            {nextApt && (
              <View style={[styles.aptStatusBadge,
                nextApt.status === 'confirmed' ? styles.aptConfirmed : styles.aptPending
              ]}>
                <Text style={styles.aptStatusText}>
                  {nextApt.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                </Text>
              </View>
            )}
          </TouchableOpacity>

        </ScrollView>
      </Animated.View>

      {/* ── Search overlay ── */}
      {isSearchFocused && (
        <View style={styles.searchOverlay}>
          {/* Active search bar */}
          <View style={styles.searchOverlayBar}>
            <View style={styles.searchActiveContainer}>
              <Ionicons name="search-outline" size={20} color={COLORS.primary} style={styles.searchIcon} />
              <TextInput
                ref={inputRef}
                style={styles.searchInput}
                placeholder="Search doctor, drugs, articles..."
                placeholderTextColor="#D1D5DB"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onBlur={handleBlur}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#D1D5DB" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={exitSearch} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Results */}
          {searchQuery.length > 0 ? (
            <FlatList
              data={filteredDoctors}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.resultsList}
              ItemSeparatorComponent={() => <View style={styles.resultSeparator} />}
              ListEmptyComponent={() => (
                <View style={styles.emptyState}>
                  <Ionicons name="search" size={48} color="#E5E7EB" />
                  <Text style={styles.emptyText}>No doctors found</Text>
                  <Text style={styles.emptySubText}>Try a different name or specialty</Text>
                </View>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultCard}
                  onPress={() => {
                    exitSearch();
                    navigation.navigate('DoctorProfile', { doctor: item });
                  }}
                >
                  <Image source={item.avatar} style={styles.resultAvatar} />
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultName}>{item.name}</Text>
                    <Text style={styles.resultSpecialty}>{item.specialty}</Text>
                    <View style={styles.resultMeta}>
                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={11} color={COLORS.primary} />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                      </View>
                      <View style={styles.distanceRow}>
                        <Ionicons name="location-outline" size={12} color="#9CA3AF" />
                        <Text style={styles.distanceText}>{item.distance || '800m away'}</Text>
                      </View>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
                </TouchableOpacity>
              )}
            />
          ) : (
            /* Hint when focused but nothing typed yet */
            <View style={styles.searchHint}>
              <Ionicons name="search-outline" size={56} color="#E5E7EB" />
              <Text style={styles.hintTitle}>Search for doctors</Text>
              <Text style={styles.hintSub}>Type a name or specialty to get started</Text>
            </View>
          )}
        </View>
      )}

      {/* Hidden real TextInput used to open keyboard when tapping the fake bar */}
      {!isSearchFocused && (
        <TextInput
          ref={inputRef}
          style={styles.hiddenInput}
          onFocus={handleFocus}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greetingText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 34,
  },
  notificationBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 28,
    backgroundColor: '#FAFAFA',
  },
  searchPlaceholder: {
    fontSize: 15,
    color: '#D1D5DB',
    flex: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  hiddenInput: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  categoryItem: {
    alignItems: 'center',
    flex: 1,
  },
  categoryIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 15,
  },
  bannerContainer: {
    backgroundColor: '#E6F4F1',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 32,
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
    paddingRight: 10,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 26,
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  bannerImage: {
    position: 'absolute',
    right: -20,
    bottom: -10,
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  horizontalScroll: {
    marginHorizontal: -20,
  },
  horizontalContent: {
    paddingHorizontal: 20,
  },
  articleCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
  },
  articleImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#D1E8E2',
    borderRadius: 8,
    marginRight: 12,
  },
  articleInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  articleTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 12,
  },

  // ── Search overlay ──
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  searchOverlayBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    gap: 10,
  },
  searchActiveContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: '#FFFFFF',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  resultSeparator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  resultAvatar: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    resizeMode: 'cover',
  },
  resultInfo: {
    flex: 1,
    marginLeft: 14,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  resultSpecialty: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  distanceText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  searchHint: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  hintTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#9CA3AF',
    marginTop: 16,
  },
  hintSub: {
    fontSize: 13,
    color: '#D1D5DB',
    marginTop: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#9CA3AF',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 13,
    color: '#D1D5DB',
    marginTop: 6,
  },

  // ── Section header variant ──
  sectionHeader2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 24,
  },

  // ── Prescription alert card ──
  rxAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  rxAlertIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rxAlertBody: { flex: 1 },
  rxAlertTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  rxAlertLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rxNewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FCD34D',
  },
  rxAlertDiagnosis: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  rxAlertDoctor: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },

  // ── Next appointment card ──
  aptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  aptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  aptIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aptLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  aptValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  aptSub: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 1,
  },
  aptEmpty: {
    fontSize: 13,
    color: '#D1D5DB',
    fontStyle: 'italic',
  },
  aptStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  aptConfirmed: { backgroundColor: '#E0F2F1' },
  aptPending: { backgroundColor: '#FEF3C7' },
  aptStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
});