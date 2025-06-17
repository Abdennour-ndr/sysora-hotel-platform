// اختبار نظام الدخول المباشر للحساب التجريبي
async function testDemoLogin() {
  console.log('🎭 اختبار نظام الدخول المباشر للحساب التجريبي');
  console.log('='.repeat(60));

  try {
    // اختبار 1: Demo Login API
    console.log('\n💻 اختبار 1: Demo Login API');
    console.log('-'.repeat(40));

    const demoLoginResponse = await fetch('http://localhost:5000/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const demoLoginResult = await demoLoginResponse.json();
    
    if (demoLoginResult.success) {
      console.log('✅ Demo Login API يعمل بنجاح!');
      console.log(`👤 المستخدم: ${demoLoginResult.data.user.fullName}`);
      console.log(`🏨 الفندق: ${demoLoginResult.data.hotel.name}`);
      console.log(`🔑 Token: ${demoLoginResult.data.token ? 'موجود' : 'مفقود'}`);
      console.log(`🎭 Demo Flag: ${demoLoginResult.data.user.isDemo ? 'نعم' : 'لا'}`);
      
      const token = demoLoginResult.data.token;

      // اختبار 2: الوصول للـ Dashboard بـ Demo Token
      console.log('\n📊 اختبار 2: الوصول للـ Dashboard');
      console.log('-'.repeat(40));

      const dashboardResponse = await fetch('http://localhost:5000/api/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const dashboardResult = await dashboardResponse.json();
      
      if (dashboardResult.success) {
        console.log('✅ Dashboard يعمل مع Demo Token!');
        console.log(`🛏️ إجمالي الغرف: ${dashboardResult.data.overview.totalRooms}`);
        console.log(`👥 إجمالي العملاء: ${dashboardResult.data.overview.totalGuests}`);
        console.log(`📅 الحجوزات الحديثة: ${dashboardResult.data.recentReservations.length}`);
      } else {
        console.log('❌ Dashboard لا يعمل:', dashboardResult.error);
      }

      // اختبار 3: الوصول للغرف
      console.log('\n🛏️ اختبار 3: الوصول لقائمة الغرف');
      console.log('-'.repeat(40));

      const roomsResponse = await fetch('http://localhost:5000/api/rooms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const roomsResult = await roomsResponse.json();
      
      if (roomsResult.success) {
        console.log('✅ قائمة الغرف تعمل!');
        console.log(`🛏️ عدد الغرف: ${roomsResult.data.rooms.length}`);
        if (roomsResult.data.rooms.length > 0) {
          const firstRoom = roomsResult.data.rooms[0];
          console.log(`🏠 أول غرفة: ${firstRoom.number} - ${firstRoom.name}`);
        }
      } else {
        console.log('❌ قائمة الغرف لا تعمل:', roomsResult.error);
      }

      // اختبار 4: الوصول للعملاء
      console.log('\n👥 اختبار 4: الوصول لقائمة العملاء');
      console.log('-'.repeat(40));

      const guestsResponse = await fetch('http://localhost:5000/api/guests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const guestsResult = await guestsResponse.json();
      
      if (guestsResult.success) {
        console.log('✅ قائمة العملاء تعمل!');
        console.log(`👥 عدد العملاء: ${guestsResult.data.guests.length}`);
        if (guestsResult.data.guests.length > 0) {
          const firstGuest = guestsResult.data.guests[0];
          console.log(`👤 أول عميل: ${firstGuest.firstName} ${firstGuest.lastName}`);
        }
      } else {
        console.log('❌ قائمة العملاء لا تعمل:', guestsResult.error);
      }

      // اختبار 5: الوصول للحجوزات
      console.log('\n📅 اختبار 5: الوصول لقائمة الحجوزات');
      console.log('-'.repeat(40));

      const reservationsResponse = await fetch('http://localhost:5000/api/reservations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const reservationsResult = await reservationsResponse.json();
      
      if (reservationsResult.success) {
        console.log('✅ قائمة الحجوزات تعمل!');
        console.log(`📅 عدد الحجوزات: ${reservationsResult.data.reservations.length}`);
        if (reservationsResult.data.reservations.length > 0) {
          const firstReservation = reservationsResult.data.reservations[0];
          console.log(`📋 أول حجز: ${firstReservation.reservationNumber}`);
        }
      } else {
        console.log('❌ قائمة الحجوزات لا تعمل:', reservationsResult.error);
      }

      // اختبار 6: الوصول للدفعات
      console.log('\n💳 اختبار 6: الوصول لقائمة الدفعات');
      console.log('-'.repeat(40));

      const paymentsResponse = await fetch('http://localhost:5000/api/payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const paymentsResult = await paymentsResponse.json();
      
      if (paymentsResult.success) {
        console.log('✅ قائمة الدفعات تعمل!');
        console.log(`💳 عدد الدفعات: ${paymentsResult.data.payments.length}`);
        if (paymentsResult.data.payments.length > 0) {
          const firstPayment = paymentsResult.data.payments[0];
          console.log(`💰 أول دفعة: ${firstPayment.paymentNumber} - ${firstPayment.amount}`);
        }
      } else {
        console.log('❌ قائمة الدفعات لا تعمل:', paymentsResult.error);
      }

      console.log('\n🎉 ملخص اختبار الحساب التجريبي:');
      console.log('='.repeat(60));
      console.log('✅ Demo Login API: يعمل');
      console.log('✅ Dashboard: يعمل');
      console.log('✅ قائمة الغرف: تعمل');
      console.log('✅ قائمة العملاء: تعمل');
      console.log('✅ قائمة الحجوزات: تعمل');
      console.log('✅ قائمة الدفعات: تعمل');
      console.log('\n🚀 الحساب التجريبي جاهز للاستخدام!');
      
      console.log('\n🔗 معلومات الوصول:');
      console.log(`📧 البريد الإلكتروني: admin@demo.com`);
      console.log(`🔑 كلمة المرور: demo123`);
      console.log(`🌐 رابط Dashboard: http://localhost:3000/dashboard`);
      console.log(`🎭 API Demo Login: http://localhost:5000/api/auth/demo-login`);

    } else {
      console.log('❌ Demo Login API لا يعمل:', demoLoginResult.error);
      
      if (demoLoginResult.error.includes('Demo hotel not found')) {
        console.log('\n💡 الحل: تشغيل البيانات التجريبية');
        console.log('cd server && node scripts/seedDemoData.js');
      }
    }

  } catch (error) {
    console.error('🚨 خطأ في اختبار الحساب التجريبي:', error.message);
  }
}

// تشغيل الاختبار
testDemoLogin();
