// إضافة المزيد من البيانات التجريبية
async function addMoreDemoData() {
  console.log('🌱 إضافة المزيد من البيانات التجريبية...');
  console.log('='.repeat(50));

  try {
    // تسجيل الدخول للحساب التجريبي
    const loginResponse = await fetch('http://localhost:5000/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const loginResult = await loginResponse.json();
    
    if (!loginResult.success) {
      console.log('❌ فشل الدخول للحساب التجريبي:', loginResult.error);
      return;
    }

    const token = loginResult.data.token;
    console.log('✅ تم الدخول للحساب التجريبي');

    // إضافة المزيد من الغرف
    console.log('\n🛏️ إضافة المزيد من الغرف...');
    
    const moreRooms = [
      {
        number: "103",
        name: "Standard Room 103",
        type: "standard",
        floor: 1,
        maxOccupancy: 2,
        basePrice: 15000,
        amenities: ["WiFi", "Air Conditioning", "Television"],
        description: "غرفة قياسية مريحة مع إطلالة على الحديقة"
      },
      {
        number: "104",
        name: "Standard Room 104",
        type: "standard",
        floor: 1,
        maxOccupancy: 2,
        basePrice: 15000,
        amenities: ["WiFi", "Air Conditioning", "Television"],
        description: "غرفة قياسية مريحة مع إطلالة على المدينة"
      },
      {
        number: "202",
        name: "Deluxe Room 202",
        type: "deluxe",
        floor: 2,
        maxOccupancy: 3,
        basePrice: 25000,
        amenities: ["WiFi", "Air Conditioning", "Television", "Mini Fridge", "Safe"],
        description: "غرفة ديلوكس فسيحة مع شرفة"
      },
      {
        number: "203",
        name: "Deluxe Room 203",
        type: "deluxe",
        floor: 2,
        maxOccupancy: 3,
        basePrice: 25000,
        amenities: ["WiFi", "Air Conditioning", "Television", "Mini Fridge", "Safe"],
        description: "غرفة ديلوكس مع إطلالة بحرية"
      },
      {
        number: "302",
        name: "Executive Suite 302",
        type: "suite",
        floor: 3,
        maxOccupancy: 4,
        basePrice: 45000,
        amenities: ["WiFi", "Air Conditioning", "Television", "Mini Fridge", "Safe", "Balcony", "Bathtub"],
        description: "جناح تنفيذي فاخر مع صالة منفصلة"
      }
    ];

    for (const roomData of moreRooms) {
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

    // إضافة المزيد من العملاء
    console.log('\n👥 إضافة المزيد من العملاء...');
    
    const moreGuests = [
      {
        firstName: "محمد",
        lastName: "العربي",
        email: "mohamed.alarabi@email.com",
        phone: "+213661234567",
        idType: "national_id",
        idNumber: "987654321",
        nationality: "Algeria",
        address: "شارع الاستقلال، وهران"
      },
      {
        firstName: "فاطمة",
        lastName: "بن سالم",
        email: "fatima.bensalem@email.com",
        phone: "+213771234567",
        idType: "national_id",
        idNumber: "456789123",
        nationality: "Algeria",
        address: "حي النصر، قسنطينة"
      },
      {
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@email.com",
        phone: "+33123456789",
        idType: "passport",
        idNumber: "FR123456",
        nationality: "France",
        address: "123 Rue de la Paix, Paris"
      }
    ];

    for (const guestData of moreGuests) {
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

    // إنشاء حجوزات تجريبية
    console.log('\n📅 إنشاء حجوزات تجريبية...');
    
    // الحصول على الغرف والعملاء
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
      
      const rooms = roomsResult.data.rooms;
      const guests = guestsResult.data.guests;
      
      // إنشاء عدة حجوزات
      const reservations = [
        {
          guestId: guests[0]._id,
          roomId: rooms[0]._id,
          checkInDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // غداً
          checkOutDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // بعد 3 أيام
          numberOfGuests: 2,
          notes: "حجز تجريبي - عميل VIP"
        },
        {
          guestId: guests[1]._id,
          roomId: rooms[1]._id,
          checkInDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // بعد يومين
          checkOutDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // بعد 5 أيام
          numberOfGuests: 1,
          notes: "حجز تجريبي - إقامة عمل"
        }
      ];

      for (const reservationData of reservations) {
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
          console.log(`✅ تم إنشاء حجز: ${reservationResult.data.reservationNumber}`);
        } else {
          console.log(`❌ فشل إنشاء الحجز:`, reservationResult.error);
        }
      }
    }

    console.log('\n🎉 تم إضافة المزيد من البيانات التجريبية بنجاح!');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('🚨 خطأ في إضافة البيانات التجريبية:', error.message);
  }
}

// تشغيل إضافة البيانات
addMoreDemoData();
