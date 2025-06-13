package com.sysorahotel;

import android.app.Application;
import android.content.Context;
import android.util.Log;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactHost;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactHost;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;

import androidx.multidex.MultiDexApplication;

import java.util.List;

/**
 * MainApplication for Sysora Hotel Management App
 * 
 * This class initializes React Native and configures the application.
 */
public class MainApplication extends MultiDexApplication implements ReactApplication {

    private static final String TAG = "SysoraHotel";

    private final ReactNativeHost mReactNativeHost =
        new DefaultReactNativeHost(this) {
            @Override
            public boolean getUseDeveloperSupport() {
                return BuildConfig.DEBUG;
            }

            @Override
            protected List<ReactPackage> getPackages() {
                @SuppressWarnings("UnnecessaryLocalVariable")
                List<ReactPackage> packages = new PackageList(this).getPackages();
                
                // Add custom packages here if needed
                // packages.add(new MyReactNativePackage());
                
                return packages;
            }

            @Override
            protected String getJSMainModuleName() {
                return "index";
            }

            @Override
            protected boolean isNewArchEnabled() {
                return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
            }

            @Override
            protected Boolean isHermesEnabled() {
                return BuildConfig.IS_HERMES_ENABLED;
            }
        };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public ReactHost getReactHost() {
        return DefaultReactHost.getDefaultReactHost(getApplicationContext(), getReactNativeHost());
    }

    @Override
    public void onCreate() {
        super.onCreate();
        
        Log.d(TAG, "Initializing Sysora Hotel Application...");
        
        // Initialize SoLoader for React Native
        SoLoader.init(this, /* native exopackage */ false);
        
        // Initialize New Architecture if enabled
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            DefaultNewArchitectureEntryPoint.load();
        }
        
        // Initialize Flipper for debugging (only in debug builds)
        if (BuildConfig.DEBUG) {
            initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
        }
        
        Log.d(TAG, "Sysora Hotel Application initialized successfully");
    }

    /**
     * Loads Flipper in React Native templates. Call this in the onCreate method with something like
     * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
     *
     * @param context Application context
     * @param reactInstanceManager React instance manager
     */
    private static void initializeFlipper(
        Context context, 
        com.facebook.react.ReactInstanceManager reactInstanceManager
    ) {
        if (BuildConfig.DEBUG) {
            try {
                /*
                 We use reflection here to pick up the class that initializes Flipper,
                 since Flipper library is not available in release mode
                */
                Class<?> aClass = Class.forName("com.sysorahotel.ReactNativeFlipper");
                aClass
                    .getMethod("initializeFlipper", Context.class, com.facebook.react.ReactInstanceManager.class)
                    .invoke(null, context, reactInstanceManager);
                    
                Log.d(TAG, "Flipper initialized successfully");
            } catch (ClassNotFoundException e) {
                Log.d(TAG, "Flipper class not found, skipping initialization");
            } catch (Exception e) {
                Log.e(TAG, "Error initializing Flipper", e);
            }
        }
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        // Enable MultiDex for large applications
        androidx.multidex.MultiDex.install(this);
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
        Log.d(TAG, "Sysora Hotel Application terminated");
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        Log.w(TAG, "Low memory warning received");
    }

    @Override
    public void onTrimMemory(int level) {
        super.onTrimMemory(level);
        Log.w(TAG, "Memory trim requested, level: " + level);
    }
}
