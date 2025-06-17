import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Guest from '../models/Guest.js';
import Reservation from '../models/Reservation.js';
import Payment from '../models/Payment.js';

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sysora-hotel';

async function connectDB() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function seedRealData() {
  try {
    console.log('🌱 Starting to seed real data...');

    // Find all hotels and seed data for each
    const existingHotels = await Hotel.find().sort({ createdAt: -1 });
    if (existingHotels.length === 0) {
      console.log('❌ No hotels found. Please register first.');
      return;
    }

    for (const existingHotel of existingHotels) {

    console.log(`🏨 Found hotel: ${existingHotel.name}`);
    const hotelId = existingHotel._id;

    // Clear existing data for this hotel
    await Room.deleteMany({ hotelId });
    await Guest.deleteMany({ hotelId });
    await Reservation.deleteMany({ hotelId });
    await Payment.deleteMany({ hotelId });

    console.log('🧹 Cleared existing data');

    // Create Rooms
    const rooms = [];
    const roomTypes = [
      { type: 'standard', basePrice: 8000, maxOccupancy: 2, bedCount: 1, bedType: 'single' },
      { type: 'deluxe', basePrice: 12000, maxOccupancy: 3, bedCount: 1, bedType: 'double' },
      { type: 'suite', basePrice: 20000, maxOccupancy: 4, bedCount: 2, bedType: 'queen' },
      { type: 'presidential', basePrice: 35000, maxOccupancy: 6, bedCount: 3, bedType: 'king' }
    ];

    for (let floor = 1; floor <= 4; floor++) {
      for (let room = 1; room <= 12; room++) {
        const roomNumber = `${floor}${room.toString().padStart(2, '0')}`;
        const roomTypeIndex = Math.floor(Math.random() * roomTypes.length);
        const roomType = roomTypes[roomTypeIndex];

        const roomData = {
          hotelId,
          number: roomNumber,
          type: roomType.type,
          maxOccupancy: roomType.maxOccupancy,
          bedCount: roomType.bedCount,
          bedType: roomType.bedType,
          basePrice: roomType.basePrice,
          size: Math.floor(Math.random() * 30) + 20, // 20-50 sqm
          floor: floor,
          status: Math.random() > 0.3 ? 'available' : 'occupied',
          cleaningStatus: 'clean',
          maintenanceStatus: 'good',
          amenities: ['WiFi', 'Air Conditioning', 'Television', 'Mini Fridge'],
          features: {
            hasBalcony: Math.random() > 0.5,
            hasKitchen: roomType.type === 'suite' || roomType.type === 'presidential',
            smokingAllowed: false,
            petFriendly: Math.random() > 0.8,
            accessible: Math.random() > 0.9
          },
          isActive: true
        };

        rooms.push(roomData);
      }
    }

    const createdRooms = await Room.insertMany(rooms);
    console.log(`🏠 Created ${createdRooms.length} rooms`);

    // Create Guests
    const guests = [
      {
        hotelId,
        firstName: 'Ahmed',
        lastName: 'Benali',
        email: 'ahmed.benali@email.com',
        phone: '+213555123456',
        nationality: 'Algerian',
        dateOfBirth: new Date('1985-03-15'),
        idType: 'passport',
        idNumber: 'P123456789',
        isActive: true
      },
      {
        hotelId,
        firstName: 'Fatima',
        lastName: 'Zahra',
        email: 'fatima.zahra@email.com',
        phone: '+213555234567',
        nationality: 'Algerian',
        dateOfBirth: new Date('1990-07-22'),
        idType: 'national_id',
        idNumber: 'N987654321',
        isActive: true
      },
      {
        hotelId,
        firstName: 'Mohamed',
        lastName: 'Salim',
        email: 'mohamed.salim@email.com',
        phone: '+213555345678',
        nationality: 'Moroccan',
        dateOfBirth: new Date('1988-11-10'),
        idType: 'passport',
        idNumber: 'P456789123',
        isActive: true
      },
      {
        hotelId,
        firstName: 'Amina',
        lastName: 'Khelifi',
        email: 'amina.khelifi@email.com',
        phone: '+213555456789',
        nationality: 'Algerian',
        dateOfBirth: new Date('1992-05-18'),
        idType: 'national_id',
        idNumber: 'N456123789',
        isActive: true
      },
      {
        hotelId,
        firstName: 'Youssef',
        lastName: 'Brahimi',
        email: 'youssef.brahimi@email.com',
        phone: '+213555567890',
        nationality: 'Tunisian',
        dateOfBirth: new Date('1987-09-03'),
        idType: 'passport',
        idNumber: 'P789123456',
        isActive: true
      }
    ];

    const createdGuests = await Guest.insertMany(guests);
    console.log(`👥 Created ${createdGuests.length} guests`);

    // Create Reservations
    const now = new Date();
    const reservations = [];

    for (let i = 0; i < 15; i++) {
      const guest = createdGuests[Math.floor(Math.random() * createdGuests.length)];
      const room = createdRooms[Math.floor(Math.random() * createdRooms.length)];
      
      const checkInDate = new Date(now.getTime() + (Math.random() - 0.5) * 7 * 24 * 60 * 60 * 1000);
      const nights = Math.floor(Math.random() * 5) + 1;
      const checkOutDate = new Date(checkInDate.getTime() + nights * 24 * 60 * 60 * 1000);

      const roomRate = room.basePrice;
      const totalAmount = roomRate * nights;
      const paidAmount = Math.random() > 0.3 ? totalAmount : Math.floor(totalAmount * 0.5);

      const statuses = ['confirmed', 'checked_in', 'checked_out', 'pending'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const adults = Math.min(Math.floor(Math.random() * room.maxOccupancy) + 1, room.maxOccupancy);
      const children = Math.floor(Math.random() * 2);

      const reservation = {
        hotelId,
        guestId: guest._id,
        roomId: room._id,
        checkInDate,
        checkOutDate,
        adults,
        children,
        roomRate,
        totalAmount,
        paidAmount,
        status,
        paymentStatus: paidAmount >= totalAmount ? 'paid' : 'partial',
        source: ['direct', 'phone', 'walk_in'][Math.floor(Math.random() * 3)],
        specialRequests: Math.random() > 0.7 ? ['Late check-in requested'] : [],
        currency: 'DZD'
      };

      reservations.push(reservation);
    }

    // Create reservations one by one to avoid duplicate key issues
    const createdReservations = [];
    for (const reservationData of reservations) {
      try {
        const reservation = new Reservation(reservationData);
        const savedReservation = await reservation.save();
        createdReservations.push(savedReservation);
      } catch (error) {
        console.log(`⚠️ Skipped reservation due to error: ${error.message}`);
      }
    }
    console.log(`📅 Created ${createdReservations.length} reservations`);

    // Get the hotel owner to use as processedBy
    const hotelOwner = await User.findOne({ hotelId, role: 'owner' });

    // Create Payments
    const payments = [];
    for (const reservation of createdReservations) {
      if (reservation.paidAmount > 0) {
        const paymentMethods = ['cash', 'credit_card', 'bank_transfer'];
        const payment = {
          hotelId,
          reservationId: reservation._id,
          amount: reservation.paidAmount,
          currency: 'DZD',
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          status: 'completed',
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          description: `Payment for reservation ${reservation.reservationNumber}`,
          processedBy: hotelOwner._id,
          processedAt: new Date()
        };
        payments.push(payment);
      }
    }

    // Create payments one by one to avoid duplicate key issues
    const createdPayments = [];
    for (const paymentData of payments) {
      try {
        const payment = new Payment(paymentData);
        const savedPayment = await payment.save();
        createdPayments.push(savedPayment);
      } catch (error) {
        console.log(`⚠️ Skipped payment due to error: ${error.message}`);
      }
    }
    console.log(`💳 Created ${createdPayments.length} payments`);

      console.log(`✅ Real data seeding completed for ${existingHotel.name}!`);
      console.log(`
📊 Summary for ${existingHotel.name}:
- Rooms: ${createdRooms.length}
- Guests: ${createdGuests.length}
- Reservations: ${createdReservations.length}
- Payments: ${createdPayments.length}
      `);
    }

    console.log('🎉 All hotels seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

async function main() {
  await connectDB();
  await seedRealData();
  await mongoose.disconnect();
  console.log('👋 Disconnected from MongoDB');
}

main().catch(console.error);
