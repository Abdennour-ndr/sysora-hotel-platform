// اختبار مباشر لـ demo-login API
async function testDemoApiDirect() {
  console.log('🎭 اختبار مباشر لـ demo-login API');
  console.log('='.repeat(50));

  try {
    console.log('📡 إرسال طلب إلى /api/auth/demo-login...');
    
    const response = await fetch('http://localhost:5000/api/auth/demo-login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log(`📊 Status Code: ${response.status}`);
    console.log(`📊 Status Text: ${response.statusText}`);

    const data = await response.json();
    console.log('📦 Response Data:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('✅ Demo Login API يعمل بنجاح!');
    } else {
      console.log('❌ Demo Login API فشل:', data.error);
      if (data.hint) {
        console.log('💡 اقتراح:', data.hint);
      }
    }

  } catch (error) {
    console.error('🚨 خطأ في الطلب:', error.message);
  }
}

// تشغيل الاختبار
testDemoApiDirect();
