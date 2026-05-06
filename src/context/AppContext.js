import React, { createContext, useState, useContext } from 'react';
import { DOCTORS } from '../constants/data';

// Sample prescriptions for demo
const SAMPLE_PRESCRIPTIONS = [
  {
    id: 'rx1',
    patientId: null, // will be assigned on login
    doctorId: 'd1',
    doctorName: 'Dr. Marcus Horizon',
    doctorSpecialty: 'Cardiologist',
    date: '2026-04-15',
    diagnosis: 'Hypertension Stage 1',
    medications: [
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' },
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
    ],
    notes: 'Avoid salty foods. Monitor blood pressure daily. Return for review in 4 weeks.',
    status: 'active',
  },
  {
    id: 'rx2',
    patientId: null,
    doctorId: 'd3',
    doctorName: 'Dr. Stevi',
    doctorSpecialty: 'General Physician',
    date: '2026-04-10',
    diagnosis: 'Upper Respiratory Infection',
    medications: [
      { name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', duration: '7 days' },
      { name: 'Paracetamol', dosage: '1000mg', frequency: 'As needed (max 4x/day)', duration: '5 days' },
      { name: 'Loratadine', dosage: '10mg', frequency: 'Once daily', duration: '5 days' },
    ],
    notes: 'Rest, drink plenty of fluids. Complete the full antibiotic course.',
    status: 'completed',
  },
  {
    id: 'rx3',
    patientId: null,
    doctorId: 'd2',
    doctorName: 'Dr. Maria',
    doctorSpecialty: 'Dermatologist',
    date: '2026-03-28',
    diagnosis: 'Eczema – Mild',
    medications: [
      { name: 'Hydrocortisone Cream 1%', dosage: 'Apply thin layer', frequency: 'Twice daily', duration: '14 days' },
      { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily at night', duration: '14 days' },
    ],
    notes: 'Avoid harsh soaps and hot water. Moisturise regularly.',
    status: 'completed',
  },
];

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Auth State
  const [user, setUser] = useState(null); // { id, name, role: 'patient' | 'doctor', avatar, ... }

  // App Data State
  const [doctors, setDoctors] = useState(DOCTORS);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState(SAMPLE_PRESCRIPTIONS);

  // Auth Methods
  const login = (role, name) => {
    let dummyUser = { id: `u_${Date.now()}`, name, role, avatar: require('../../assets/Avatar.png') };
    if (role === 'doctor') {
      // Find the first doctor just to bind to one for demo purposes (town, specialty, etc.)
      const doc = doctors[0];
      dummyUser = { ...doc, name: name, role: 'doctor' };
    }
    setUser(dummyUser);
  };

  const logout = () => {
    setUser(null);
  };

  // Appointment Methods
  const bookAppointment = (doctorId, date, timeSlot) => {
    // Check for double booking
    const isBooked = appointments.some(
      (apt) => apt.doctorId === doctorId && apt.date === date && apt.timeSlot === timeSlot && apt.status !== 'cancelled'
    );

    if (isBooked) {
      return { success: false, message: 'This time slot is already booked.' };
    }

    const newAppointment = {
      id: `apt_${Date.now()}`,
      patientId: user?.id,
      patientName: user?.name,
      patientAvatar: user?.avatar,
      doctorId,
      date,
      timeSlot,
      status: 'pending', // pending, confirmed, cancelled, completed
    };

    setAppointments((prev) => [...prev, newAppointment]);
    return { success: true, message: 'Appointment booked successfully!' };
  };

  const updateAppointmentStatus = (appointmentId, status) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status } : apt))
    );
  };

  const getPatientAppointments = () => {
    if (!user) return [];
    return appointments.filter((apt) => apt.patientId === user.id);
  };

  const getDoctorAppointments = () => {
    if (!user) return [];
    return appointments.filter((apt) => apt.doctorId === user.id);
  };

  const getPatientPrescriptions = () => {
    // For demo: return all sample prescriptions (in real app filter by patientId)
    return prescriptions;
  };

  const addPrescription = (prescription) => {
    const newRx = {
      ...prescription,
      id: `rx_${Date.now()}`,
      patientId: prescription.patientId,
      date: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setPrescriptions((prev) => [newRx, ...prev]);
    return newRx;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        doctors,
        appointments,
        prescriptions,
        bookAppointment,
        updateAppointmentStatus,
        getPatientAppointments,
        getDoctorAppointments,
        getPatientPrescriptions,
        addPrescription,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
