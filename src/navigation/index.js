import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAppContext } from '../context/AppContext';
import { COLORS } from '../constants/theme';

// Screens placeholder imports
import SplashScreen from '../screens/auth/SplashScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import LoginScreen from '../screens/auth/LoginScreen';

import FindDoctorsScreen from '../screens/patient/FindDoctorsScreen';
import DoctorProfileScreen from '../screens/patient/DoctorProfileScreen';
import AllDoctorsScreen from '../screens/patient/AllDoctorsScreen';
import PrescriptionScreen from '../screens/patient/PrescriptionScreen';
import PatientAppointmentsScreen from '../screens/patient/PatientAppointmentsScreen';
import PatientProfileScreen from '../screens/patient/PatientProfileScreen';

import DoctorHomeScreen from '../screens/doctor/DoctorHomeScreen';
import DoctorAppointmentsScreen from '../screens/doctor/DoctorAppointmentsScreen';
import WritePrescriptionScreen from '../screens/doctor/WritePrescriptionScreen';
import DoctorProfileManagementScreen from '../screens/doctor/DoctorProfileManagementScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

const PatientHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FindDoctors" component={FindDoctorsScreen} />
    <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
    <Stack.Screen name="AllDoctors" component={AllDoctorsScreen} />
    <Stack.Screen name="Prescriptions" component={PrescriptionScreen} />
  </Stack.Navigator>
);

const PatientTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Doctors') {
          iconName = 'home-outline';
        } else if (route.name === 'Appointments') {
          iconName = 'calendar-outline';
        } else if (route.name === 'Profile') {
          iconName = 'person-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
    })}
  >
    <Tab.Screen name="Doctors" component={PatientHomeStack} />
    <Tab.Screen name="Appointments" component={PatientAppointmentsScreen} />
    <Tab.Screen name="Profile" component={PatientProfileScreen} />
  </Tab.Navigator>
);

const DoctorHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DoctorHome" component={DoctorHomeScreen} />
    <Stack.Screen name="WritePrescription" component={WritePrescriptionScreen} />
    <Stack.Screen name="DoctorApts" component={DoctorAppointmentsScreen} />
  </Stack.Navigator>
);

const DoctorTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = 'home-outline';
        } else if (route.name === 'Appointments') {
          iconName = 'calendar-outline';
        } else if (route.name === 'Profile') {
          iconName = 'person-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
    })}
  >
    <Tab.Screen name="Home" component={DoctorHomeStack} />
    <Tab.Screen name="Appointments" component={DoctorAppointmentsScreen} />
    <Tab.Screen name="Profile" component={DoctorProfileManagementScreen} />
  </Tab.Navigator>
);

export default function RootNavigator() {
  const { user } = useAppContext();

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : user.role === 'doctor' ? (
        <DoctorTabs />
      ) : (
        <PatientTabs />
      )}
    </NavigationContainer>
  );
}
