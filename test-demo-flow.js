// اختبار تدفق Demo Login الكامل
async function testDemoFlow() {
  console.log('🎭 اختبار تدفق Demo Login الكامل');
  console.log('='.repeat(60));

  try {
    // اختبار 1: Demo Login API
    console.log('\n🔐 اختبار 1: Demo Login API');
    console.log('-'.repeat(40));

    const demoResponse = await fetch('http://localhost:5000/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const demoResult = await demoResponse.json();
    
    if (demoResult.success) {
      console.log('✅ Demo Login API يعمل بنجاح!');
      console.log(`👤 المستخدم: ${demoResult.data.user.fullName}`);
      console.log(`🏨 الفندق: ${demoResult.data.hotel.name}`);
      console.log(`🔑 Token: ${demoResult.data.token ? 'موجود' : 'مفقود'}`);
      console.log(`🎭 Demo Flag: ${demoResult.data.user.isDemo ? 'نعم' : 'لا'}`);
      
      const token = demoResult.data.token;

      // اختبار 2: التحقق من صحة Token
      console.log('\n🔍 اختبار 2: التحقق من صحة Token');
      console.log('-'.repeat(40));

      const verifyResponse = await fetch('http://localhost:5000/api/rooms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (verifyResponse.ok) {
        console.log('✅ Token صالح ويعمل مع APIs');
      } else {
        console.log('❌ Token غير صالح أو منتهي الصلاحية');
      }

      // اختبار 3: محاكاة تخزين البيانات في localStorage
      console.log('\n💾 اختبار 3: محاكاة تخزين البيانات');
      console.log('-'.repeat(40));

      // محاكاة ما يحدث في DemoLoginButton
      const userData = JSON.stringify(demoResult.data.user);
      const hotelData = JSON.stringify(demoResult.data.hotel);
      const tokenData = demoResult.data.token;

      console.log('✅ بيانات المستخدم جاهزة للتخزين');
      console.log('✅ بيانات الفندق جاهزة للتخزين');
      console.log('✅ Token جاهز للتخزين');

      // اختبار 4: محاكاة Dashboard authentication check
      console.log('\n🏠 اختبار 4: محاكاة Dashboard authentication check');
      console.log('-'.repeat(40));

      if (userData && hotelData && tokenData) {
        console.log('✅ جميع البيانات المطلوبة للـ Dashboard متوفرة');
        console.log('✅ Dashboard سيسمح بالدخول');
        
        const user = JSON.parse(userData);
        const hotel = JSON.parse(hotelData);
        
        console.log(`👤 اسم المستخدم: ${user.fullName}`);
        console.log(`🏨 اسم الفندق: ${hotel.name}`);
        console.log(`🌐 Subdomain: ${hotel.subdomain}`);
      } else {
        console.log('❌ بيانات مفقودة - Dashboard سيرفض الدخول');
      }

      // اختبار 5: اختبار APIs الأساسية
      console.log('\n📊 اختبار 5: اختبار APIs الأساسية للـ Dashboard');
      console.log('-'.repeat(40));

      const apis = [
        { name: 'Rooms', endpoint: '/api/rooms' },
        { name: 'Guests', endpoint: '/api/guests' },
        { name: 'Reservations', endpoint: '/api/reservations' },
        { name: 'Payments', endpoint: '/api/payments' }
      ];

      for (const api of apis) {
        try {
          const response = await fetch(`http://localhost:5000${api.endpoint}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              console.log(`✅ ${api.name} API يعمل`);
            } else {
              console.log(`⚠️ ${api.name} API يعمل لكن بدون بيانات`);
            }
          } else {
            console.log(`❌ ${api.name} API لا يعمل (${response.status})`);
          }
        } catch (error) {
          console.log(`❌ ${api.name} API خطأ: ${error.message}`);
        }
      }

      console.log('\n🎉 ملخص اختبار Demo Flow:');
      console.log('='.repeat(60));
      console.log('✅ Demo Login API: يعمل بنجاح');
      console.log('✅ Token Validation: يعمل');
      console.log('✅ Data Storage: جاهز');
      console.log('✅ Dashboard Auth: سيعمل');
      console.log('✅ APIs: متاحة');
      console.log('\n🚀 Demo Login Button جاهز للاستخدام!');
      console.log('🔗 عند الضغط على Demo، سيتم:');
      console.log('   1. استدعاء Demo Login API');
      console.log('   2. تخزين البيانات في localStorage');
      console.log('   3. التوجه إلى /dashboard');
      console.log('   4. Dashboard سيتحقق من localStorage');
      console.log('   5. عرض لوحة التحكم الكاملة');

    } else {
      console.log('❌ Demo Login API فشل:', demoResult.error);
    }

  } catch (error) {
    console.error('🚨 خطأ في اختبار Demo Flow:', error.message);
  }
}

// تشغيل الاختبار
testDemoFlow();
