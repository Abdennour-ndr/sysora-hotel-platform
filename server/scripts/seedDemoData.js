import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Guest from '../models/Guest.js';
import Reservation from '../models/Reservation.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDemoData = async () => {
  try {
    console.log('🌱 Starting demo data seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sysora');
    console.log('📊 Connected to MongoDB');

    // Check if demo hotel already exists
    const existingHotel = await Hotel.findOne({ subdomain: 'demo' });
    if (existingHotel) {
      console.log('✅ Demo hotel already exists');
      return;
    }

    // Create demo hotel
    const demoHotel = new Hotel({
      name: "Demo Hotel",
      subdomain: "demo",
      email: "admin@demo.com",
      owner: {
        fullName: "Demo Admin",
        email: "admin@demo.com"
      },
      employeeCount: "1-10",
      subscription: {
        plan: "standard",
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        trialUsed: false
      },
      settings: {
        currency: {
          code: "DZD",
          name: "Algerian Dinar",
          symbol: "د.ج"
        },
        timezone: "Africa/Algiers",
        language: "en"
      }
    });

    await demoHotel.save();
    console.log('🏨 Demo hotel created:', demoHotel.name);

    // Create demo user (owner)
    const hashedPassword = await bcrypt.hash('demo123', 10);
    const demoUser = new User({
      fullName: "Demo Admin",
      email: "admin@demo.com",
      password: hashedPassword,
      hotelId: demoHotel._id,
      role: "owner",
      isActive: true,
      permissions: {
        canManageRooms: true,
        canManageReservations: true,
        canManageGuests: true,
        canManagePayments: true,
        canManageServices: true,
        canManageUsers: true,
        canViewReports: true,
        canManageSettings: true
      }
    });

    await demoUser.save();
    console.log('👤 Demo user created:', demoUser.email);

    // Create demo rooms
    const demoRooms = [
      {
        number: "101",
        name: "Standard Room 101",
        type: "standard",
        floor: 1,
        maxOccupancy: 2,
        basePrice: 15000,
        status: "available",
        amenities: ["WiFi", "Air Conditioning", "Television"],
        hotelId: demoHotel._id
      },
      {
        number: "102",
        name: "Standard Room 102",
        type: "standard",
        floor: 1,
        maxOccupancy: 2,
        basePrice: 15000,
        status: "occupied",
        amenities: ["WiFi", "Air Conditioning", "Television"],
        hotelId: demoHotel._id
      },
      {
        number: "201",
        name: "Deluxe Room 201",
        type: "deluxe",
        floor: 2,
        maxOccupancy: 3,
        basePrice: 25000,
        status: "available",
        amenities: ["WiFi", "Air Conditioning", "Television", "Mini Fridge"],
        hotelId: demoHotel._id
      },
      {
        number: "301",
        name: "Suite 301",
        type: "suite",
        floor: 3,
        maxOccupancy: 4,
        basePrice: 40000,
        status: "maintenance",
        amenities: ["WiFi", "Air Conditioning", "Television", "Mini Fridge", "Safe", "Balcony"],
        hotelId: demoHotel._id
      }
    ];

    for (const roomData of demoRooms) {
      const room = new Room(roomData);
      await room.save();
    }
    console.log('🛏️ Demo rooms created:', demoRooms.length);

    // Create demo guests
    const demoGuests = [
      {
        firstName: "Ahmed",
        lastName: "Benali",
        email: "ahmed.benali@email.com",
        phone: "+213555123456",
        idType: "national_id",
        idNumber: "123456789",
        nationality: "Algeria",
        address: "123 Main Street, Algiers",
        hotelId: demoHotel._id
      },
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@email.com",
        phone: "+1234567890",
        idType: "passport",
        idNumber: "AB123456",
        nationality: "USA",
        address: "456 Oak Avenue, New York",
        hotelId: demoHotel._id
      }
    ];

    for (const guestData of demoGuests) {
      const guest = new Guest(guestData);
      await guest.save();
    }
    console.log('👥 Demo guests created:', demoGuests.length);

    // Create demo reservations
    const rooms = await Room.find({ hotelId: demoHotel._id });
    const guests = await Guest.find({ hotelId: demoHotel._id });

    if (rooms.length > 0 && guests.length > 0) {
      const demoReservation = new Reservation({
        reservationNumber: "DEMO001",
        guestId: guests[0]._id,
        roomId: rooms[1]._id, // Room 102 (occupied)
        hotelId: demoHotel._id,
        checkInDate: new Date(),
        checkOutDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        numberOfGuests: 2,
        totalAmount: 45000, // 3 nights * 15000
        paidAmount: 30000,
        status: "confirmed",
        paymentStatus: "partial",
        notes: "Demo reservation for testing"
      });

      await demoReservation.save();
      console.log('📅 Demo reservation created:', demoReservation.reservationNumber);
    }

    console.log('✅ Demo data seeding completed successfully!');
    console.log('\n🔑 Demo Credentials:');
    console.log('Subdomain: demo');
    console.log('Email: admin@demo.com');
    console.log('Password: demo123');
    console.log('\n🌐 Access URL: http://localhost:3000 → Login → Enter "demo" as subdomain');

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDemoData();
}

export default seedDemoData;
