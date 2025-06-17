// اختبار الدخول العادي للحساب التجريبي
async function testDemoRegularLogin() {
  console.log('🎭 اختبار الدخول العادي للحساب التجريبي');
  console.log('='.repeat(60));

  try {
    // اختبار الدخول العادي
    console.log('\n🔐 اختبار الدخول العادي...');
    console.log('-'.repeat(40));

    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@demo.com',
        password: 'demo123'
      })
    });

    const loginResult = await loginResponse.json();
    
    if (loginResult.success) {
      console.log('✅ الدخول العادي يعمل بنجاح!');
      console.log(`👤 المستخدم: ${loginResult.data.user.fullName}`);
      console.log(`🏨 الفندق: ${loginResult.data.hotel.name}`);
      console.log(`🔑 Token: ${loginResult.data.token ? 'موجود' : 'مفقود'}`);
      
      const token = loginResult.data.token;

      // اختبار Dashboard
      console.log('\n📊 اختبار Dashboard...');
      console.log('-'.repeat(40));

      const dashboardResponse = await fetch('http://localhost:5000/api/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const dashboardResult = await dashboardResponse.json();
      
      if (dashboardResult.success) {
        console.log('✅ Dashboard يعمل!');
        console.log(`🛏️ إجمالي الغرف: ${dashboardResult.data.overview.totalRooms}`);
        console.log(`👥 إجمالي العملاء: ${dashboardResult.data.overview.totalGuests}`);
        console.log(`📅 الحجوزات الحديثة: ${dashboardResult.data.recentReservations.length}`);
      } else {
        console.log('❌ Dashboard لا يعمل:', dashboardResult.error);
      }

      console.log('\n🎉 الحساب التجريبي جاهز!');
      console.log('='.repeat(60));
      console.log('🔗 معلومات الوصول:');
      console.log(`📧 البريد الإلكتروني: admin@demo.com`);
      console.log(`🔑 كلمة المرور: demo123`);
      console.log(`🌐 رابط Dashboard: http://localhost:3000/dashboard`);

    } else {
      console.log('❌ الدخول العادي لا يعمل:', loginResult.error);
    }

  } catch (error) {
    console.error('🚨 خطأ في اختبار الحساب التجريبي:', error.message);
  }
}

// تشغيل الاختبار
testDemoRegularLogin();
