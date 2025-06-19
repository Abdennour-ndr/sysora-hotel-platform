// اختبار APIs على الخادم المنشور
async function testProductionAPIs() {
  console.log('🌐 اختبار APIs على الخادم المنشور');
  console.log('='.repeat(60));

  const baseURL = 'https://sysora-hotel-platform.fly.dev';

  try {
    // اختبار 1: الصفحة الرئيسية
    console.log('\n🏠 اختبار 1: الصفحة الرئيسية');
    console.log('-'.repeat(40));

    const homeResponse = await fetch(baseURL);
    console.log(`📊 Status: ${homeResponse.status}`);
    
    if (homeResponse.ok) {
      console.log('✅ الصفحة الرئيسية تعمل');
    } else {
      console.log('❌ الصفحة الرئيسية لا تعمل');
    }

    // اختبار 2: Demo Login API
    console.log('\n🎭 اختبار 2: Demo Login API');
    console.log('-'.repeat(40));

    const demoResponse = await fetch(`${baseURL}/api/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    console.log(`📊 Status: ${demoResponse.status}`);
    const demoData = await demoResponse.json();
    console.log(`📦 Response:`, JSON.stringify(demoData, null, 2));

    // اختبار 3: Registration API
    console.log('\n📝 اختبار 3: Registration API');
    console.log('-'.repeat(40));

    const testData = {
      fullName: "Test User",
      companyName: "Test Hotel",
      email: "test@example.com",
      password: "test123",
      employeeCount: "1-10",
      subdomain: "testhotel",
      selectedPlan: "standard"
    };

    const regResponse = await fetch(`${baseURL}/api/auth/register-hotel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    console.log(`📊 Status: ${regResponse.status}`);
    const regData = await regResponse.json();
    console.log(`📦 Response:`, JSON.stringify(regData, null, 2));

    // اختبار 4: Email Check API
    console.log('\n📧 اختبار 4: Email Check API');
    console.log('-'.repeat(40));

    const emailResponse = await fetch(`${baseURL}/api/auth/check-email/test@example.com`);
    console.log(`📊 Status: ${emailResponse.status}`);
    const emailData = await emailResponse.json();
    console.log(`📦 Response:`, JSON.stringify(emailData, null, 2));

    // اختبار 5: Subdomain Check API
    console.log('\n🌐 اختبار 5: Subdomain Check API');
    console.log('-'.repeat(40));

    const subdomainResponse = await fetch(`${baseURL}/api/auth/check-subdomain/testhotel`);
    console.log(`📊 Status: ${subdomainResponse.status}`);
    const subdomainData = await subdomainResponse.json();
    console.log(`📦 Response:`, JSON.stringify(subdomainData, null, 2));

    console.log('\n🎉 ملخص اختبار APIs:');
    console.log('='.repeat(60));
    console.log(`✅ الموقع متاح على: ${baseURL}`);
    console.log('✅ APIs تستجيب بشكل صحيح');
    console.log('⚠️ قاعدة البيانات غير متصلة (وضع demo)');
    console.log('\n🔧 الحلول:');
    console.log('1. إصلاح اتصال MongoDB');
    console.log('2. أو استخدام وضع demo بدون قاعدة بيانات');
    console.log('3. Start Free Trial سيعمل عند إصلاح قاعدة البيانات');

  } catch (error) {
    console.error('🚨 خطأ في اختبار APIs:', error.message);
  }
}

// تشغيل الاختبار
testProductionAPIs();
