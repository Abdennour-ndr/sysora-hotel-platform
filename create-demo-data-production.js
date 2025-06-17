// إنشاء البيانات التجريبية على الخادم المنشور
async function createDemoDataProduction() {
  console.log('🌱 إنشاء البيانات التجريبية على الخادم المنشور...');
  console.log('='.repeat(60));

  try {
    // إنشاء فندق تجريبي
    console.log('\n🏨 إنشاء فندق تجريبي...');
    
    const hotelData = {
      fullName: "Demo Admin",
      companyName: "Demo Hotel",
      email: "admin@demo.com",
      password: "demo123",
      employeeCount: "1-10",
      subdomain: "demo",
      selectedPlan: "standard"
    };

    const registerResponse = await fetch('https://sysora-hotel-platform.fly.dev/api/auth/register-hotel', {
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
        const roomResponse = await fetch('https://sysora-hotel-platform.fly.dev/api/rooms', {
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
        },
        {
          firstName: "محمد",
          lastName: "العربي",
          email: "mohamed.alarabi@email.com",
          phone: "+213661234567",
          idType: "national_id",
          idNumber: "987654321",
          nationality: "Algeria",
          address: "شارع الاستقلال، وهران"
        }
      ];

      for (const guestData of demoGuests) {
        const guestResponse = await fetch('https://sysora-hotel-platform.fly.dev/api/guests', {
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

      console.log('\n🎉 تم إنشاء البيانات التجريبية بنجاح على الخادم المنشور!');
      console.log('='.repeat(60));
      console.log('🔑 بيانات الدخول للحساب التجريبي:');
      console.log('📧 البريد الإلكتروني: admin@demo.com');
      console.log('🔑 كلمة المرور: demo123');
      console.log('🌐 URL: https://sysora-hotel-platform.fly.dev');
      console.log('🎭 Demo Login API: https://sysora-hotel-platform.fly.dev/api/auth/demo-login');

    } else {
      console.log('❌ فشل إنشاء الفندق التجريبي:', registerResult.error);
      
      if (registerResult.error && registerResult.error.includes('already exists')) {
        console.log('✅ الفندق التجريبي موجود بالفعل!');
        console.log('🔑 بيانات الدخول:');
        console.log('📧 البريد الإلكتروني: admin@demo.com');
        console.log('🔑 كلمة المرور: demo123');
      }
    }

  } catch (error) {
    console.error('🚨 خطأ في إنشاء البيانات التجريبية:', error.message);
  }
}

// تشغيل إنشاء البيانات
createDemoDataProduction();
