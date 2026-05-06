import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { useAppContext } from '../../context/AppContext';

export default function PatientProfileScreen({ navigation }) {
  const { user, logout } = useAppContext();

  const handleLogout = () => {
    // Call the logout function if it exists, or navigate to login
    if (logout) {
      logout();
    } else {
      // Fallback if logout isn't implemented in context yet
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }], // Assuming there is an Auth stack, or navigate to Login
      });
    }
  };

  const menuOptions = [
    {
      id: '1',
      title: 'My Prescriptions',
      icon: 'document-text-outline',
      type: 'Ionicons',
      onPress: () => navigation.navigate('Doctors', { screen: 'Prescriptions' }),
    },
    {
      id: '2',
      title: 'Appointment',
      icon: 'calendar-outline',
      type: 'Ionicons',
      onPress: null,
    },
    {
      id: '3',
      title: 'Payment Method',
      icon: 'wallet-outline',
      type: 'Ionicons',
      onPress: null,
    },
    {
      id: '4',
      title: 'FAQs',
      icon: 'chatbubble-ellipses-outline',
      type: 'Ionicons',
      onPress: null,
    },
  ];

  const renderIcon = (item) => {
    return <Ionicons name={item.icon} size={22} color={COLORS.primary} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2EB2A2" />
      
      {/* Top Teal Section */}
      <SafeAreaView style={styles.topSection}>
        <View style={styles.header}>
          <View style={{ width: 24 }} /> {/* Spacer */}
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Image 
              source={user?.avatar || require('../../../assets/Avatar.png')} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name || 'Amelia Renata'}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="heart-pulse" size={32} color="#FFFFFF" />
            <Text style={styles.statSubtitle}>Heart rate</Text>
            <Text style={styles.statValue}>215bpm</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Ionicons name="water" size={32} color="#FFFFFF" />
            <Text style={styles.statSubtitle}>Calories</Text>
            <Text style={styles.statValue}>756cal</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="dumbbell" size={32} color="#FFFFFF" />
            <Text style={styles.statSubtitle}>Weight</Text>
            <Text style={styles.statValue}>103lbs</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Bottom White Section */}
      <View style={styles.bottomSection}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {menuOptions.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
                <View style={styles.menuIconContainer}>
                  {renderIcon(item)}
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {index < menuOptions.length - 1 && <View style={styles.menuDivider} />}
            </View>
          ))}
          
          <View style={styles.menuDivider} />

          {/* Logout Button */}
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="alert-circle-outline" size={22} color="#EF4444" />
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
  container: {
    flex: 1,
    backgroundColor: '#2EB2A2', // Teal background matching the image
  },
  topSection: {
    backgroundColor: '#2EB2A2',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  menuButton: {
    padding: 4,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2EB2A2',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#E6FBFA',
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0FBFA', // Very light teal background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
    marginLeft: 66, // Align divider with text
  },
});
