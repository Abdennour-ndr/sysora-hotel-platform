// إنشاء البيانات التجريبية للحساب التجريبي
async function createDemoData() {
  console.log('🌱 إنشاء البيانات التجريبية...');
  console.log('='.repeat(50));

  try {
    // إنشاء فندق تجريبي
    console.log('\n🏨 إنشاء فندق تجريبي...');
    
    const hotelData = {
      firstName: "Demo",
      lastName: "Admin",
      hotelName: "Demo Hotel",
      email: "admin@demo.com",
      password: "demo123",
      subdomain: "demo",
      location: "Demo Location",
      agreeToTerms: true
    };

    const registerResponse = await fetch('http://localhost:5000/api/auth/register-hotel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hotelData)
    });

    const registerResult = await registerResponse.json();
    
    if (registerResult.success) {
      console.log('✅ تم إنشاء الفندق التجريبي بنجاح!');
      console.log(`🏨 اسم الفندق: ${registerResult.data.hotel.name}`);
      console.log(`🌐 Subdomain: ${registerResult.data.hotel.subdomain}`);
      
      const token = registerResult.data.token;

      // إنشاء غرف تجريبية
      console.log('\n🛏️ إنشاء غرف تجريبية...');
      
      const demoRooms = [
        {
          number: "101",
          name: "Standard Room 101",
          type: "standard",
          floor: 1,
          maxOccupancy: 2,
          basePrice: 15000,
          amenities: ["WiFi", "Air Conditioning", "Television"]
        },
        {
          number: "102",
          name: "Standard Room 102",
          type: "standard",
          floor: 1,
          maxOccupancy: 2,
          basePrice: 15000,
          amenities: ["WiFi", "Air Conditioning", "Television"]
        },
        {
          number: "201",
          name: "Deluxe Room 201",
          type: "deluxe",
          floor: 2,
          maxOccupancy: 3,
          basePrice: 25000,
          amenities: ["WiFi", "Air Conditioning", "Television", "Mini Fridge"]
        },
        {
          number: "301",
          name: "Suite 301",
          type: "suite",
          floor: 3,
          maxOccupancy: 4,
          basePrice: 40000,
          amenities: ["WiFi", "Air Conditioning", "Television", "Mini Fridge", "Safe", "Balcony"]
        }
      ];

      for (const roomData of demoRooms) {
        const roomResponse = await fetch('http://localhost:5000/api/rooms', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(roomData)
        });

        const roomResult = await roomResponse.json();
        if (roomResult.success) {
          console.log(`✅ تم إنشاء غرفة ${roomData.number}`);
        } else {
          console.log(`❌ فشل إنشاء غرفة ${roomData.number}:`, roomResult.error);
        }
      }

      // إنشاء عملاء تجريبيين
      console.log('\n👥 إنشاء عملاء تجريبيين...');
      
      const demoGuests = [
        {
          firstName: "Ahmed",
          lastName: "Benali",
          email: "ahmed.benali@email.com",
          phone: "+213555123456",
          idType: "national_id",
          idNumber: "123456789",
          nationality: "Algeria",
          address: "123 Main Street, Algiers"
        },
        {
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarah.johnson@email.com",
          phone: "+1234567890",
          idType: "passport",
          idNumber: "AB123456",
          nationality: "USA",
          address: "456 Oak Avenue, New York"
        }
      ];

      for (const guestData of demoGuests) {
        const guestResponse = await fetch('http://localhost:5000/api/guests', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(guestData)
        });

        const guestResult = await guestResponse.json();
        if (guestResult.success) {
          console.log(`✅ تم إنشاء عميل ${guestData.firstName} ${guestData.lastName}`);
        } else {
          console.log(`❌ فشل إنشاء عميل ${guestData.firstName}:`, guestResult.error);
        }
      }

      // الحصول على الغرف والعملاء لإنشاء حجوزات
      console.log('\n📅 إنشاء حجوزات تجريبية...');
      
      const roomsResponse = await fetch('http://localhost:5000/api/rooms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const roomsResult = await roomsResponse.json();

      const guestsResponse = await fetch('http://localhost:5000/api/guests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const guestsResult = await guestsResponse.json();

      if (roomsResult.success && guestsResult.success && 
          roomsResult.data.rooms.length > 0 && guestsResult.data.guests.length > 0) {
        
        const room = roomsResult.data.rooms[0];
        const guest = guestsResult.data.guests[0];
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 3);

        const reservationData = {
          guestId: guest._id,
          roomId: room._id,
          checkInDate: tomorrow.toISOString().split('T')[0],
          checkOutDate: dayAfter.toISOString().split('T')[0],
          numberOfGuests: 2,
          notes: "Demo reservation for testing"
        };

        const reservationResponse = await fetch('http://localhost:5000/api/reservations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reservationData)
        });

        const reservationResult = await reservationResponse.json();
        if (reservationResult.success) {
          console.log(`✅ تم إنشاء حجز تجريبي: ${reservationResult.data.reservationNumber}`);
        } else {
          console.log(`❌ فشل إنشاء الحجز:`, reservationResult.error);
        }
      }

      console.log('\n🎉 تم إنشاء البيانات التجريبية بنجاح!');
      console.log('='.repeat(50));
      console.log('🔑 بيانات الدخول للحساب التجريبي:');
      console.log('📧 البريد الإلكتروني: admin@demo.com');
      console.log('🔑 كلمة المرور: demo123');
      console.log('🌐 Subdomain: demo');
      console.log('🎭 Demo Login API: http://localhost:5000/api/auth/demo-login');

    } else {
      console.log('❌ فشل إنشاء الفندق التجريبي:', registerResult.error);
    }

  } catch (error) {
    console.error('🚨 خطأ في إنشاء البيانات التجريبية:', error.message);
  }
}

// تشغيل إنشاء البيانات
createDemoData();
