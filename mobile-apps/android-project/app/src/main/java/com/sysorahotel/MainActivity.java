package com.sysorahotel;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import android.os.Bundle;
import android.view.WindowManager;
import androidx.core.view.WindowCompat;

/**
 * MainActivity for Sysora Hotel Management App
 * 
 * This is the main entry point for the React Native application.
 * It extends ReactActivity which handles the React Native lifecycle.
 */
public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript. 
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "SysoraHotel";
    }

    /**
     * Returns the instance of the {@link ReactActivityDelegate}. 
     * Here we use a util class {@link DefaultReactActivityDelegate} which allows you to easily 
     * enable Fabric and Concurrent React (aka React 18) with two boolean flags.
     */
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new DefaultReactActivityDelegate(
            this,
            getMainComponentName(),
            // If you opted-in for the New Architecture, we enable the Fabric Renderer.
            DefaultNewArchitectureEntryPoint.getFabricEnabled()
        );
    }

    /**
     * Called when the activity is starting.
     * This is where most initialization should go.
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Configure status bar and navigation bar
        configureSystemUI();
        
        // Prevent screenshots in production (optional security measure)
        if (!BuildConfig.DEBUG) {
            getWindow().setFlags(
                WindowManager.LayoutParams.FLAG_SECURE,
                WindowManager.LayoutParams.FLAG_SECURE
            );
        }
    }

    /**
     * Configure system UI (status bar and navigation bar)
     */
    private void configureSystemUI() {
        // Enable edge-to-edge display
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        
        // Set status bar color
        getWindow().setStatusBarColor(getResources().getColor(R.color.sysora_light, getTheme()));
        
        // Set navigation bar color
        getWindow().setNavigationBarColor(getResources().getColor(R.color.white, getTheme()));
        
        // Make status bar icons dark (for light background)
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            getWindow().getDecorView().setSystemUiVisibility(
                getWindow().getDecorView().getSystemUiVisibility() 
                | android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
            );
        }
        
        // Make navigation bar icons dark (for light background)
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            getWindow().getDecorView().setSystemUiVisibility(
                getWindow().getDecorView().getSystemUiVisibility() 
                | android.view.View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
            );
        }
    }

    /**
     * Called when the activity is becoming visible to the user.
     */
    @Override
    protected void onStart() {
        super.onStart();
        // Activity is becoming visible
    }

    /**
     * Called when the activity will start interacting with the user.
     */
    @Override
    protected void onResume() {
        super.onResume();
        // Activity is now visible and interactive
    }

    /**
     * Called when the system is about to start resuming a previous activity.
     */
    @Override
    protected void onPause() {
        super.onPause();
        // Activity is about to lose focus
    }

    /**
     * Called when the activity is no longer visible to the user.
     */
    @Override
    protected void onStop() {
        super.onStop();
        // Activity is no longer visible
    }

    /**
     * Called before the activity is destroyed.
     */
    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Activity is being destroyed
    }
}
