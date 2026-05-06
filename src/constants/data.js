export const TOWNS = [
  'Windhoek',
  'Rundu',
  'Walvis Bay',
  'Oshakati',
  'Ongwediva',
  'Swakopmund'
];

export const CATEGORIES = [
  { id: '1', name: 'General', icon: 'stethoscope', type: 'FontAwesome5', specialty: 'General Physician' },
  { id: '2', name: 'Dentist', icon: 'tooth', type: 'FontAwesome5', specialty: 'Dentist' },
  { id: '3', name: 'Lung\nSpecialist', icon: 'lungs', type: 'FontAwesome5', specialty: 'Neurologist' },
  { id: '4', name: 'Surgeon', icon: 'user-md', type: 'FontAwesome5', specialty: 'Surgeon' },
  { id: '5', name: 'Cardiologist', icon: 'heartbeat', type: 'FontAwesome5', specialty: 'Cardiologist' },
];

export const SPECIALTIES = [
  'General Physician',
  'Cardiologist',
  'Dentist',
  'Dermatologist',
  'Pediatrician',
  'Neurologist'
];

export const DOCTORS = [
  {
    id: 'd1',
    name: 'Dr. Marcus Horizon',
    specialty: 'Cardiologist',
    town: 'Windhoek',
    distance: '800m away',
    rating: '4,7',
    reviews: 124,
    about: 'Dr. Marcus Horizon is a top cardiologist in Windhoek with over 15 years of experience in treating heart conditions.',
    avatar: require('../../assets/Image (1).png')
  },
  {
    id: 'd2',
    name: 'Dr. Maria',
    specialty: 'Dermatologist',
    town: 'Swakopmund',
    distance: '1.2km away',
    rating: '4,9',
    reviews: 89,
    about: 'Dr. Maria specializes in cosmetic dermatology and skin conditions.',
    avatar: require('../../assets/Image (2).png')
  },
  {
    id: 'd3',
    name: 'Dr. Stevi',
    specialty: 'General Physician',
    town: 'Oshakati',
    distance: '2.5km away',
    rating: '4,7',
    reviews: 210,
    about: 'Dr. Stevi is a well-known general physician dedicated to providing the best healthcare.',
    avatar: require('../../assets/Image (3).png')
  },
  {
    id: 'd4',
    name: 'Dr. Luke',
    specialty: 'Surgeon',
    town: 'Walvis Bay',
    distance: '3km away',
    rating: '4,9',
    reviews: 320,
    about: 'Experienced surgeon with a focus on minimally invasive procedures.',
    avatar: require('../../assets/Image (4).png')
  },
  {
    id: 'd5',
    name: 'Dr. John',
    specialty: 'Neurologist',
    town: 'Ongwediva',
    distance: '4km away',
    rating: '4,8',
    reviews: 150,
    about: 'Leading neurologist specializing in complex cases.',
    avatar: require('../../assets/Image (5).png')
  },
  {
    id: 'd6',
    name: 'Dr. Sarah',
    specialty: 'Pediatrician',
    town: 'Swakopmund',
    distance: '5km away',
    rating: '4,9',
    reviews: 210,
    about: 'Friendly pediatrician ensuring the health of your children.',
    avatar: require('../../assets/Image (6).png')
  },
  {
    id: 'd7',
    name: 'Dr. Michael',
    specialty: 'Orthopedist',
    town: 'Rundu',
    distance: '2km away',
    rating: '4,6',
    reviews: 95,
    about: 'Expert orthopedist helping you move pain-free.',
    avatar: require('../../assets/Image (7).png')
  }
];

export const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
];
