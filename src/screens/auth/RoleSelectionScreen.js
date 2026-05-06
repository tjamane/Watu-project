import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';
import Button from '../../components/Button';
import Logo from '../../../assets/logo2.png';

export default function RoleSelectionScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} />
        </View>
        <Text style={styles.title}>Welcome to Watu</Text>
        <Text style={styles.subtitle}>Please select your role to continue</Text>

        <View style={styles.buttonContainer}>
          <Button 
            title="I am a Patient" 
            onPress={() => navigation.navigate('Login', { role: 'patient' })}
            style={styles.button}
          />
          <Button 
            title="I am a Doctor" 
            outlined
            onPress={() => navigation.navigate('Login', { role: 'doctor' })}
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SIZES.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  buttonContainer: {
    gap: SIZES.md,
  },
  button: {
    width: '100%',
  }
});
