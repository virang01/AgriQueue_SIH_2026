import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/models/User.js';
import { Centre } from './src/models/Centre.js';
import { Slot } from './src/models/Slot.js';
import { ProcurementBooking } from './src/models/ProcurementBooking.js';
import { ProcurementRecord } from './src/models/ProcurementRecord.js';
import { PaymentRecord } from './src/models/PaymentRecord.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agriqueue';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing collection data
    await User.deleteMany({});
    await Centre.deleteMany({});
    await Slot.deleteMany({});
    await ProcurementBooking.deleteMany({});
    await ProcurementRecord.deleteMany({});
    await PaymentRecord.deleteMany({});

    console.log('🧹 Existing data wiped.');

    // 1. Create Centres (10 centres across India with accurate geographic coordinates)
    const centre1 = await Centre.create({
      name: 'Karnal Anaj Mandi Procurement Centre',
      code: 'KNL01',
      state: 'Haryana',
      district: 'Karnal',
      address: 'GT Road, Near Grain Market, Karnal, Haryana - 132001',
      contactPhone: '+91 184 2256789',
      location: { latitude: 29.6857, longitude: 76.9905 },
      dailyCapacityQuintals: 800,
      supportedCrops: ['Wheat', 'Paddy', 'Mustard', 'Chana'],
    });

    const centre2 = await Centre.create({
      name: 'Ludhiana Central Procurement Hub',
      code: 'LDH01',
      state: 'Punjab',
      district: 'Ludhiana',
      address: 'Ferozepur Road, Ludhiana, Punjab - 141001',
      contactPhone: '+91 161 2401234',
      location: { latitude: 30.901, longitude: 75.8573 },
      dailyCapacityQuintals: 1200,
      supportedCrops: ['Wheat', 'Paddy', 'Maize'],
    });

    const centre3 = await Centre.create({
      name: 'Indore Mandi Procurement Centre',
      code: 'IND01',
      state: 'Madhya Pradesh',
      district: 'Indore',
      address: 'Kesarbagh Road, Scheme 103, Indore, MP - 452009',
      contactPhone: '+91 731 2894567',
      location: { latitude: 22.7196, longitude: 75.8577 },
      dailyCapacityQuintals: 650,
      supportedCrops: ['Wheat', 'Pulses', 'Chana', 'Soyabean'],
    });

    const centre4 = await Centre.create({
      name: 'Meerut APMC Grain Procurement Yard',
      code: 'MRT01',
      state: 'Uttar Pradesh',
      district: 'Meerut',
      address: 'Delhi Road, Transport Nagar, Meerut, Uttar Pradesh - 250002',
      contactPhone: '+91 121 2514321',
      location: { latitude: 28.9845, longitude: 77.7064 },
      dailyCapacityQuintals: 950,
      supportedCrops: ['Wheat', 'Paddy', 'Mustard', 'Maize'],
    });

    const centre5 = await Centre.create({
      name: 'Kota Bhamashah Krishi Upaj Mandi',
      code: 'KOT01',
      state: 'Rajasthan',
      district: 'Kota',
      address: 'Anantpura, Jhalawar Road, Kota, Rajasthan - 324005',
      contactPhone: '+91 744 2490812',
      location: { latitude: 25.1383, longitude: 75.8458 },
      dailyCapacityQuintals: 1100,
      supportedCrops: ['Wheat', 'Mustard', 'Soyabean', 'Chana'],
    });

    const centre6 = await Centre.create({
      name: 'Nashik APMC Agricultural Procurement Hub',
      code: 'NSK01',
      state: 'Maharashtra',
      district: 'Nashik',
      address: 'Peth Road, Panchavati, Nashik, Maharashtra - 422003',
      contactPhone: '+91 253 2512984',
      location: { latitude: 20.0125, longitude: 73.7912 },
      dailyCapacityQuintals: 850,
      supportedCrops: ['Soyabean', 'Maize', 'Cotton', 'Chana', 'Wheat'],
    });

    const centre7 = await Centre.create({
      name: 'Rajkot APMC Cotton & Grain Market Yard',
      code: 'RJK01',
      state: 'Gujarat',
      district: 'Rajkot',
      address: 'Bedi Road, Near Marketing Yard, Rajkot, Gujarat - 360003',
      contactPhone: '+91 281 2701456',
      location: { latitude: 22.3168, longitude: 70.8142 },
      dailyCapacityQuintals: 1300,
      supportedCrops: ['Cotton', 'Wheat', 'Chana', 'Soyabean'],
    });

    const centre8 = await Centre.create({
      name: 'Patna Bazaar Samiti Procurement Centre',
      code: 'PTN01',
      state: 'Bihar',
      district: 'Patna',
      address: 'Bazar Samiti Road, Musallahpur Hat, Patna, Bihar - 800006',
      contactPhone: '+91 612 2378901',
      location: { latitude: 25.6093, longitude: 85.1764 },
      dailyCapacityQuintals: 750,
      supportedCrops: ['Paddy', 'Wheat', 'Maize', 'Pulses'],
    });

    const centre9 = await Centre.create({
      name: 'Bardhaman Central Paddy Procurement Depot',
      code: 'BDN01',
      state: 'West Bengal',
      district: 'Purba Bardhaman',
      address: 'Grand Trunk Road, Shaktigarh, Bardhaman, West Bengal - 713149',
      contactPhone: '+91 342 2561234',
      location: { latitude: 23.2324, longitude: 87.8615 },
      dailyCapacityQuintals: 1050,
      supportedCrops: ['Paddy', 'Wheat', 'Mustard', 'Pulses'],
    });

    const centre10 = await Centre.create({
      name: 'Nizamabad APMC Grain & Turmeric Yard',
      code: 'NZB01',
      state: 'Telangana',
      district: 'Nizamabad',
      address: 'Dubba Road, Agricultural Market Committee, Nizamabad, Telangana - 503002',
      contactPhone: '+91 8462 221876',
      location: { latitude: 18.6725, longitude: 78.0941 },
      dailyCapacityQuintals: 900,
      supportedCrops: ['Paddy', 'Maize', 'Cotton', 'Soyabean', 'Pulses'],
    });

    console.log('✅ 10 Centres across India created with real GPS coordinates.');

    // 2. Create Users for Roles (including managers/staff for multiple centres)
    const admin = await User.create({
      name: 'Dr. Rajesh Sharma (Director Procurement)',
      phone: '9999999999',
      email: 'admin@agriqueue.gov.in',
      password: 'password123',
      role: 'admin',
      preferredLanguage: 'en',
    });

    // Karnal Centre Staff & Manager
    const manager = await User.create({
      name: 'Sardar Gurdeep Singh',
      phone: '8888888888',
      email: 'manager.karnal@agriqueue.gov.in',
      password: 'password123',
      role: 'manager',
      centreId: centre1._id,
      preferredLanguage: 'hi',
    });

    const staff = await User.create({
      name: 'Vikas Kumar (Quality Inspector)',
      phone: '7777777777',
      email: 'staff.karnal@agriqueue.gov.in',
      password: 'password123',
      role: 'staff',
      centreId: centre1._id,
      preferredLanguage: 'hi',
    });

    // Meerut (UP) Centre Staff & Manager
    const managerMeerut = await User.create({
      name: 'Rakesh Verma (Centre Head)',
      phone: '8888888881',
      email: 'manager.meerut@agriqueue.gov.in',
      password: 'password123',
      role: 'manager',
      centreId: centre4._id,
      preferredLanguage: 'hi',
    });

    const staffMeerut = await User.create({
      name: 'Anil Tyagi (Quality & Weighment Inspector)',
      phone: '7777777771',
      email: 'staff.meerut@agriqueue.gov.in',
      password: 'password123',
      role: 'staff',
      centreId: centre4._id,
      preferredLanguage: 'hi',
    });

    // Kota (Rajasthan) Centre Staff & Manager
    const managerKota = await User.create({
      name: 'Mahendra Singh Meena',
      phone: '8888888882',
      email: 'manager.kota@agriqueue.gov.in',
      password: 'password123',
      role: 'manager',
      centreId: centre5._id,
      preferredLanguage: 'hi',
    });

    const staffKota = await User.create({
      name: 'Pooja Sharma (Weighbridge Incharge)',
      phone: '7777777772',
      email: 'staff.kota@agriqueue.gov.in',
      password: 'password123',
      role: 'staff',
      centreId: centre5._id,
      preferredLanguage: 'hi',
    });

    // Rajkot (Gujarat) Centre Staff & Manager
    const managerRajkot = await User.create({
      name: 'Bhavin Patel',
      phone: '8888888883',
      email: 'manager.rajkot@agriqueue.gov.in',
      password: 'password123',
      role: 'manager',
      centreId: centre7._id,
      preferredLanguage: 'gu',
    });

    const staffRajkot = await User.create({
      name: 'Ketan Vaghani (Quality Inspector)',
      phone: '7777777773',
      email: 'staff.rajkot@agriqueue.gov.in',
      password: 'password123',
      role: 'staff',
      centreId: centre7._id,
      preferredLanguage: 'gu',
    });

    // 3. Create 10 Farmers Across India with Complete Agronomic & Banking Details
    const farmer1 = await User.create({
      name: 'Rameshwar Farmer',
      phone: '9876543210',
      email: 'ramesh.farmer@gmail.com',
      password: 'password123',
      role: 'farmer',
      preferredLanguage: 'hi',
      farmerDetails: {
        state: 'Haryana',
        district: 'Karnal',
        village: 'Kachhwa',
        landAreaAcres: 8.5,
        aadhaarNumber: 'XXXX-XXXX-1234',
        farmerIdNumber: 'HR-KNL-2024-00128',
        bankDetails: {
          accountName: 'Rameshwar Farmer',
          accountNumber: '34589012345',
          ifscCode: 'SBIN0001234',
          bankName: 'State Bank of India',
        },
      },
    });

    const farmer2 = await User.create({
      name: 'Suresh Patel',
      phone: '9876543211',
      email: 'suresh.patel@gmail.com',
      password: 'password123',
      role: 'farmer',
      preferredLanguage: 'en',
      farmerDetails: {
        state: 'Haryana',
        district: 'Karnal',
        village: 'Gharaunda',
        landAreaAcres: 12.0,
        aadhaarNumber: 'XXXX-XXXX-5678',
        farmerIdNumber: 'HR-KNL-2024-00456',
        bankDetails: {
          accountName: 'Suresh Patel',
          accountNumber: '98712345678',
          ifscCode: 'HDFC0000456',
          bankName: 'HDFC Bank',
        },
      },
    });

    const farmer3 = await User.create({
      name: 'Balwinder Singh Dhillon',
      phone: '9876543212',
      email: 'balwinder.singh@gmail.com',
      password: 'password123',
      role: 'farmer',
      preferredLanguage: 'pa',
      farmerDetails: {
        state: 'Punjab',
        district: 'Ludhiana',
        village: 'Samrala',
        landAreaAcres: 16.0,
        aadhaarNumber: 'XXXX-XXXX-9012',
        farmerIdNumber: 'PB-LDH-2024-00789',
        bankDetails: {
          accountName: 'Balwinder Singh Dhillon',
          accountNumber: '40128934561',
          ifscCode: 'PUNB0023400',
          bankName: 'Punjab National Bank',
        },
      },
    });

    const farmer4 = await User.create({
      name: 'Vikramaditya Chauhan',
      phone: '9876543213',
      email: 'vikram.chauhan@gmail.com',
      password: 'password123',
      role: 'farmer',
      preferredLanguage: 'hi',
      farmerDetails: {
        state: 'Uttar Pradesh',
        district: 'Meerut',
        village: 'Sardhana',
        landAreaAcres: 10.5,
        aadhaarNumber: 'XXXX-XXXX-3456',
        farmerIdNumber: 'UP-MRT-2024-01024',
        bankDetails: {
          accountName: 'Vikramaditya Chauhan',
          accountNumber: '56123498701',
          ifscCode: 'CNRB0001567',
          bankName: 'Canara Bank',
        },
      },
    });

    const farmer5 = await User.create({
      name: 'Rajesh Meena',
      phone: '9876543214',
      email: 'rajesh.meena@gmail.com',
      password: 'password123',
      role: 'farmer',
      preferredLanguage: 'hi',
      farmerDetails: {
        state: 'Rajasthan',
        district: 'Kota',
        village: 'Sangod',
        landAreaAcres: 14.0,
        aadhaarNumber: 'XXXX-XXXX-7890',
        farmerIdNumber: 'RJ-KOT-2024-01452',
        bankDetails: {
          accountName: 'Rajesh Meena',
          accountNumber: '67234509123',
          ifscCode: 'BARB0KOTAAX',
          bankName: 'Bank of Baroda',
        },
      },
    });

    const farmer6 = await User.create({
      name: 'Amitesh Kumar Jha',
      phone: '9876543215',
      email: 'amitesh.jha@gmail.com',
      password: 'password123',
      role: 'farmer',
      preferredLanguage: 'hi',
      farmerDetails: {
        state: 'Bihar',
        district: 'Patna',
        village: 'Fatuha',
        landAreaAcres: 7.0,
        aadhaarNumber: 'XXXX-XXXX-2345',
        farmerIdNumber: 'BR-PTN-2024-02100',
        bankDetails: {
          accountName: 'Amitesh Kumar Jha',
          accountNumber: '11223344556',
          ifscCode: 'CBIN0280123',
          bankName: 'Central Bank of India',
        },
      },
    });

    const farmer7 = await User.create({
      name: 'Dattatray Shinde',
      phone: '9876543216',
      email: 'dattatray.shinde@gmail.com',
      password: 'password123',
      role: 'farmer',
      preferredLanguage: 'mr',
      farmerDetails: {
        state: 'Maharashtra',
        district: 'Nashik',
        village: 'Dindori',
        landAreaAcres: 9.0,
        aadhaarNumber: 'XXXX-XXXX-6789',
        farmerIdNumber: 'MH-NSK-2024-03211',
        bankDetails: {
          accountName: 'Dattatray Shinde',
          accountNumber: '22334455667',
          ifscCode: 'MAHB0000456',
          bankName: 'Bank of Maharashtra',
        },
      },
    });

    const farmer8 = await User.create({
      name: 'Jayantilal Patel',
      phone: '9876543217',
      email: 'jayanti.patel@gmail.com',
      password: 'password123',
      role: 'farmer',
      preferredLanguage: 'gu',
      farmerDetails: {
        state: 'Gujarat',
        district: 'Rajkot',
        village: 'Gondal',
        landAreaAcres: 18.5,
        aadhaarNumber: 'XXXX-XXXX-0123',
        farmerIdNumber: 'GJ-RJK-2024-04589',
        bankDetails: {
          accountName: 'Jayantilal Patel',
          accountNumber: '33445566778',
          ifscCode: 'KKBK0000890',
          bankName: 'Kotak Mahindra Bank',
        },
      },
    });

    const farmer9 = await User.create({
      name: 'Sourav Banerjee',
      phone: '9876543218',
      email: 'sourav.banerjee@gmail.com',
      password: 'password123',
      role: 'farmer',
      preferredLanguage: 'en',
      farmerDetails: {
        state: 'West Bengal',
        district: 'Purba Bardhaman',
        village: 'Memari',
        landAreaAcres: 6.5,
        aadhaarNumber: 'XXXX-XXXX-4567',
        farmerIdNumber: 'WB-BDN-2024-05120',
        bankDetails: {
          accountName: 'Sourav Banerjee',
          accountNumber: '44556677889',
          ifscCode: 'UCBA0001234',
          bankName: 'UCO Bank',
        },
      },
    });

    const farmer10 = await User.create({
      name: 'Mallikarjun Rao',
      phone: '9876543219',
      email: 'malli.rao@gmail.com',
      password: 'password123',
      role: 'farmer',
      preferredLanguage: 'en',
      farmerDetails: {
        state: 'Telangana',
        district: 'Nizamabad',
        village: 'Armoor',
        landAreaAcres: 11.0,
        aadhaarNumber: 'XXXX-XXXX-8901',
        farmerIdNumber: 'TS-NZB-2024-06780',
        bankDetails: {
          accountName: 'Mallikarjun Rao',
          accountNumber: '55667788990',
          ifscCode: 'UBIN0532100',
          bankName: 'Union Bank of India',
        },
      },
    });

    console.log('✅ 10 Diverse State Farmers created.');

    // 4. Create Standard 4 Daily Time Slots for Today & Tomorrow across Key Mandi Hubs
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const dateFormatted = today.replace(/-/g, '');

    const standardWindows = [
      { startTime: '08:00', endTime: '10:00' },
      { startTime: '10:00', endTime: '12:00' },
      { startTime: '12:00', endTime: '14:00' },
      { startTime: '14:00', endTime: '16:00' },
    ];

    // Helper to generate slots for a centre
    const createCentreSlots = async (cId) => {
      const todaySlots = [];
      for (const w of standardWindows) {
        const s = await Slot.create({
          centreId: cId,
          date: today,
          startTime: w.startTime,
          endTime: w.endTime,
          timeWindow: `${w.startTime} - ${w.endTime}`,
          maxCapacityQuintals: 250,
          bookedCapacityQuintals: 0,
          maxFarmers: 5,
          bookedFarmers: 0,
        });
        todaySlots.push(s);
      }
      for (const w of standardWindows) {
        await Slot.create({
          centreId: cId,
          date: tomorrow,
          startTime: w.startTime,
          endTime: w.endTime,
          timeWindow: `${w.startTime} - ${w.endTime}`,
          maxCapacityQuintals: 250,
          bookedCapacityQuintals: 0,
          maxFarmers: 5,
          bookedFarmers: 0,
        });
      }
      return todaySlots;
    };

    const karnalSlots = await createCentreSlots(centre1._id);
    const meerutSlots = await createCentreSlots(centre4._id);
    const kotaSlots = await createCentreSlots(centre5._id);
    const patnaSlots = await createCentreSlots(centre8._id);
    await createCentreSlots(centre2._id);
    await createCentreSlots(centre3._id);
    await createCentreSlots(centre6._id);
    await createCentreSlots(centre7._id);
    await createCentreSlots(centre9._id);
    await createCentreSlots(centre10._id);

    console.log('✅ Daily time slots initialized across all centres.');

    // 5. Populate Realistic Live Queue Pipeline for Karnal Mandi (Centre 1)
    // Stage A: NOW SERVING COUNTER (in_inspection)
    const knlBookingServing = await ProcurementBooking.create({
      tokenNumber: `TOK-KNL01-${dateFormatted}-001`,
      farmerId: farmer1._id,
      centreId: centre1._id,
      slotId: karnalSlots[0]._id,
      bookingDate: today,
      cropType: 'Wheat',
      estimatedQuantityQuintals: 50,
      status: 'in_inspection',
      checkInTime: new Date(Date.now() - 45 * 60000), // Checked in 45m ago
      calledTime: new Date(Date.now() - 10 * 60000),  // Called to counter 10m ago
    });

    // Stage B: CHECKED-IN & WAITING IN QUEUE LINE (checked_in)
    // farmer2 (Suresh Patel) is #1 in waiting line — will show highlighted "YOUR TOKEN" for logged in demo!
    const knlBookingWait1 = await ProcurementBooking.create({
      tokenNumber: `TOK-KNL01-${dateFormatted}-002`,
      farmerId: farmer2._id,
      centreId: centre1._id,
      slotId: karnalSlots[0]._id,
      bookingDate: today,
      cropType: 'Wheat',
      estimatedQuantityQuintals: 45,
      status: 'checked_in',
      checkInTime: new Date(Date.now() - 35 * 60000),
    });

    const knlBookingWait2 = await ProcurementBooking.create({
      tokenNumber: `TOK-KNL01-${dateFormatted}-003`,
      farmerId: farmer3._id,
      centreId: centre1._id,
      slotId: karnalSlots[0]._id,
      bookingDate: today,
      cropType: 'Wheat',
      estimatedQuantityQuintals: 60,
      status: 'checked_in',
      checkInTime: new Date(Date.now() - 25 * 60000),
    });

    const knlBookingWait3 = await ProcurementBooking.create({
      tokenNumber: `TOK-KNL01-${dateFormatted}-004`,
      farmerId: farmer4._id,
      centreId: centre1._id,
      slotId: karnalSlots[0]._id,
      bookingDate: today,
      cropType: 'Mustard',
      estimatedQuantityQuintals: 30,
      status: 'checked_in',
      checkInTime: new Date(Date.now() - 15 * 60000),
    });

    const knlBookingWait4 = await ProcurementBooking.create({
      tokenNumber: `TOK-KNL01-${dateFormatted}-005`,
      farmerId: farmer5._id,
      centreId: centre1._id,
      slotId: karnalSlots[0]._id,
      bookingDate: today,
      cropType: 'Chana',
      estimatedQuantityQuintals: 40,
      status: 'checked_in',
      checkInTime: new Date(Date.now() - 8 * 60000),
    });

    // Stage C: SCHEDULED TODAY FOR AFTERNOON SHIFTS (booked)
    const knlBookingSched1 = await ProcurementBooking.create({
      tokenNumber: `TOK-KNL01-${dateFormatted}-006`,
      farmerId: farmer6._id,
      centreId: centre1._id,
      slotId: karnalSlots[1]._id, // 10:00 - 12:00
      bookingDate: today,
      cropType: 'Wheat',
      estimatedQuantityQuintals: 55,
      status: 'booked',
    });

    const knlBookingSched2 = await ProcurementBooking.create({
      tokenNumber: `TOK-KNL01-${dateFormatted}-007`,
      farmerId: farmer7._id,
      centreId: centre1._id,
      slotId: karnalSlots[2]._id, // 12:00 - 14:00
      bookingDate: today,
      cropType: 'Wheat',
      estimatedQuantityQuintals: 40,
      status: 'booked',
    });

    const knlBookingSched3 = await ProcurementBooking.create({
      tokenNumber: `TOK-KNL01-${dateFormatted}-008`,
      farmerId: farmer8._id,
      centreId: centre1._id,
      slotId: karnalSlots[3]._id, // 14:00 - 16:00
      bookingDate: today,
      cropType: 'Mustard',
      estimatedQuantityQuintals: 48,
      status: 'booked',
    });

    // Stage D: COMPLETED & DISBURSED TODAY (completed & weighment_completed)
    const knlBookingComp1 = await ProcurementBooking.create({
      tokenNumber: `TOK-KNL01-${dateFormatted}-009`,
      farmerId: farmer9._id,
      centreId: centre1._id,
      slotId: karnalSlots[0]._id,
      bookingDate: today,
      cropType: 'Wheat',
      estimatedQuantityQuintals: 48,
      status: 'completed',
      checkInTime: new Date(Date.now() - 120 * 60000),
      calledTime: new Date(Date.now() - 90 * 60000),
      completedTime: new Date(Date.now() - 60 * 60000),
    });

    const knlBookingComp2 = await ProcurementBooking.create({
      tokenNumber: `TOK-KNL01-${dateFormatted}-010`,
      farmerId: farmer10._id,
      centreId: centre1._id,
      slotId: karnalSlots[0]._id,
      bookingDate: today,
      cropType: 'Wheat',
      estimatedQuantityQuintals: 65,
      status: 'weighment_completed',
      checkInTime: new Date(Date.now() - 110 * 60000),
      calledTime: new Date(Date.now() - 80 * 60000),
      completedTime: new Date(Date.now() - 50 * 60000),
    });

    // Update Karnal Slot metrics (Capacity = 5 farmers per slot)
    karnalSlots[0].bookedFarmers = 5; // 5/5 -> Fully booked (no more farmers can book this slot)
    karnalSlots[0].bookedCapacityQuintals = 250;
    await karnalSlots[0].save();

    karnalSlots[1].bookedFarmers = 1; // 1/5 booked
    karnalSlots[1].bookedCapacityQuintals = 55;
    await karnalSlots[1].save();

    karnalSlots[2].bookedFarmers = 1; // 1/5 booked
    karnalSlots[2].bookedCapacityQuintals = 40;
    await karnalSlots[2].save();

    karnalSlots[3].bookedFarmers = 0; // 0/5 booked (fresh slot available)
    karnalSlots[3].bookedCapacityQuintals = 0;
    await karnalSlots[3].save();

    // Create Procurement & Payment Records for Completed Tickets
    const procRec1 = await ProcurementRecord.create({
      bookingId: knlBookingComp1._id,
      farmerId: farmer9._id,
      centreId: centre1._id,
      staffId: staff._id,
      cropType: 'Wheat',
      actualQuantityQuintals: 48,
      qualityGrade: 'Grade A',
      moisturePercentage: 11.4,
      mspPricePerQuintal: 2275,
      totalAmount: 48 * 2275, // ₹109,200
      weighmentDetails: {
        grossWeightKg: 5240,
        tareWeightKg: 440,
        netWeightKg: 4800,
        bagCount: 96,
      },
      notes: 'Grain moisture 11.4% well below 12% ceiling. Certified Grade A FAQ.',
    });

    await PaymentRecord.create({
      procurementRecordId: procRec1._id,
      farmerId: farmer9._id,
      centreId: centre1._id,
      amount: 109200,
      status: 'processed',
      bankDetails: farmer9.farmerDetails.bankDetails,
      paymentReference: 'DBT-PFMS-98214512',
      transactionRef: 'DBT-PFMS-98214512',
      approvedBy: manager._id,
      approvedAt: new Date(Date.now() - 40 * 60000),
      processedAt: new Date(Date.now() - 30 * 60000),
      paidAt: new Date(Date.now() - 30 * 60000),
      remarks: 'PFMS Direct Benefit Transfer credited to UCO Bank Account',
    });

    const procRec2 = await ProcurementRecord.create({
      bookingId: knlBookingComp2._id,
      farmerId: farmer10._id,
      centreId: centre1._id,
      staffId: staff._id,
      cropType: 'Wheat',
      actualQuantityQuintals: 65,
      qualityGrade: 'Grade A',
      moisturePercentage: 11.8,
      mspPricePerQuintal: 2275,
      totalAmount: 65 * 2275, // ₹147,875
      weighmentDetails: {
        grossWeightKg: 7100,
        tareWeightKg: 600,
        netWeightKg: 6500,
        bagCount: 130,
      },
      notes: 'Clean golden grain sample. Moisture verified 11.8%.',
    });

    await PaymentRecord.create({
      procurementRecordId: procRec2._id,
      farmerId: farmer10._id,
      centreId: centre1._id,
      amount: 147875,
      status: 'pending_approval',
      bankDetails: farmer10.farmerDetails.bankDetails,
      remarks: 'Weighment certified by staff. Awaiting manager DBT approval.',
    });

    // 6. Populate Realistic Queue Data for Meerut APMC (Centre 4 - UP)
    await ProcurementBooking.create({
      tokenNumber: `TOK-MRT01-${dateFormatted}-001`,
      farmerId: farmer4._id,
      centreId: centre4._id,
      slotId: meerutSlots[0]._id,
      bookingDate: today,
      cropType: 'Wheat',
      estimatedQuantityQuintals: 52,
      status: 'in_inspection',
      checkInTime: new Date(Date.now() - 30 * 60000),
      calledTime: new Date(Date.now() - 5 * 60000),
    });

    await ProcurementBooking.create({
      tokenNumber: `TOK-MRT01-${dateFormatted}-002`,
      farmerId: farmer1._id,
      centreId: centre4._id,
      slotId: meerutSlots[0]._id,
      bookingDate: today,
      cropType: 'Paddy',
      estimatedQuantityQuintals: 40,
      status: 'checked_in',
      checkInTime: new Date(Date.now() - 20 * 60000),
    });

    await ProcurementBooking.create({
      tokenNumber: `TOK-MRT01-${dateFormatted}-003`,
      farmerId: farmer6._id,
      centreId: centre4._id,
      slotId: meerutSlots[1]._id,
      bookingDate: today,
      cropType: 'Mustard',
      estimatedQuantityQuintals: 35,
      status: 'booked',
    });

    // 7. Populate Realistic Queue Data for Kota Mandi (Centre 5 - Rajasthan)
    await ProcurementBooking.create({
      tokenNumber: `TOK-KOT01-${dateFormatted}-001`,
      farmerId: farmer5._id,
      centreId: centre5._id,
      slotId: kotaSlots[0]._id,
      bookingDate: today,
      cropType: 'Soyabean',
      estimatedQuantityQuintals: 60,
      status: 'in_inspection',
      checkInTime: new Date(Date.now() - 40 * 60000),
      calledTime: new Date(Date.now() - 8 * 60000),
    });

    await ProcurementBooking.create({
      tokenNumber: `TOK-KOT01-${dateFormatted}-002`,
      farmerId: farmer7._id,
      centreId: centre5._id,
      slotId: kotaSlots[0]._id,
      bookingDate: today,
      cropType: 'Mustard',
      estimatedQuantityQuintals: 45,
      status: 'checked_in',
      checkInTime: new Date(Date.now() - 22 * 60000),
    });

    await ProcurementBooking.create({
      tokenNumber: `TOK-KOT01-${dateFormatted}-003`,
      farmerId: farmer8._id,
      centreId: centre5._id,
      slotId: kotaSlots[1]._id,
      bookingDate: today,
      cropType: 'Wheat',
      estimatedQuantityQuintals: 50,
      status: 'booked',
    });

    // 8. Populate Realistic Queue Data for Patna Bazaar Samiti (Centre 8 - Bihar)
    await ProcurementBooking.create({
      tokenNumber: `TOK-PTN01-${dateFormatted}-001`,
      farmerId: farmer6._id,
      centreId: centre8._id,
      slotId: patnaSlots[0]._id,
      bookingDate: today,
      cropType: 'Paddy',
      estimatedQuantityQuintals: 42,
      status: 'in_inspection',
      checkInTime: new Date(Date.now() - 35 * 60000),
      calledTime: new Date(Date.now() - 6 * 60000),
    });

    await ProcurementBooking.create({
      tokenNumber: `TOK-PTN01-${dateFormatted}-002`,
      farmerId: farmer2._id,
      centreId: centre8._id,
      slotId: patnaSlots[0]._id,
      bookingDate: today,
      cropType: 'Wheat',
      estimatedQuantityQuintals: 38,
      status: 'checked_in',
      checkInTime: new Date(Date.now() - 18 * 60000),
    });

    await ProcurementBooking.create({
      tokenNumber: `TOK-PTN01-${dateFormatted}-003`,
      farmerId: farmer9._id,
      centreId: centre8._id,
      slotId: patnaSlots[1]._id,
      bookingDate: today,
      cropType: 'Maize',
      estimatedQuantityQuintals: 50,
      status: 'booked',
    });

    console.log('✅ Real-time Queue pipelines populated across Karnal, Meerut, Kota, and Patna.');
    console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!\n');
    console.log('===========================================================');
    console.log('🌾 AGRIQUEUE PROFESSOR EVALUATION SEED CREDENTIALS');
    console.log('===========================================================');
    console.log('1. Govt Admin (National) : Phone 9999999999 / Password password123');
    console.log('2. Karnal Manager        : Phone 8888888888 / Password password123');
    console.log('3. Karnal Staff          : Phone 7777777777 / Password password123');
    console.log('4. Meerut Manager (UP)   : Phone 8888888881 / Password password123');
    console.log('5. Meerut Staff (UP)     : Phone 7777777771 / Password password123');
    console.log('6. Kota Manager (RJ)     : Phone 8888888882 / Password password123');
    console.log('7. Kota Staff (RJ)       : Phone 7777777772 / Password password123');
    console.log('8. Rajkot Manager (GJ)   : Phone 8888888883 / Password password123');
    console.log('9. Rajkot Staff (GJ)     : Phone 7777777773 / Password password123');
    console.log('10. Farmer (Suresh Patel): Phone 9876543211 / Password password123 (Active in Queue)');
    console.log('11. Farmer (Rameshwar)   : Phone 9876543210 / Password password123 (Now Serving)');
    console.log('===========================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
