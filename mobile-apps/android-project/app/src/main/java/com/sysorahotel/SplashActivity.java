package com.sysorahotel;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;

/**
 * SplashActivity for Sysora Hotel Management App
 * 
 * This activity shows a splash screen while the app is loading.
 * It displays the Sysora logo and app name with animations.
 */
public class SplashActivity extends AppCompatActivity {

    private static final int SPLASH_DURATION = 2500; // 2.5 seconds
    private static final String TAG = "SysoraSplash";

    private ImageView logoImageView;
    private TextView appNameTextView;
    private TextView appSubtitleTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        
        // Configure system UI
        configureSystemUI();
        
        // Initialize views
        initializeViews();
        
        // Start animations
        startAnimations();
        
        // Navigate to main activity after delay
        navigateToMainActivity();
    }

    /**
     * Configure system UI for splash screen
     */
    private void configureSystemUI() {
        // Make the splash screen full screen
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );
        
        // Enable edge-to-edge display
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        
        // Set status bar and navigation bar colors
        getWindow().setStatusBarColor(getResources().getColor(R.color.sysora_mint, getTheme()));
        getWindow().setNavigationBarColor(getResources().getColor(R.color.sysora_mint, getTheme()));
    }

    /**
     * Initialize UI views
     */
    private void initializeViews() {
        logoImageView = findViewById(R.id.splash_logo);
        appNameTextView = findViewById(R.id.splash_app_name);
        appSubtitleTextView = findViewById(R.id.splash_app_subtitle);
    }

    /**
     * Start splash screen animations
     */
    private void startAnimations() {
        // Logo animation - scale and fade in
        Animation logoAnimation = AnimationUtils.loadAnimation(this, R.anim.splash_logo_animation);
        logoImageView.startAnimation(logoAnimation);
        
        // App name animation - slide up and fade in
        Animation nameAnimation = AnimationUtils.loadAnimation(this, R.anim.splash_text_animation);
        nameAnimation.setStartOffset(500); // Start after 0.5 seconds
        appNameTextView.startAnimation(nameAnimation);
        
        // Subtitle animation - slide up and fade in
        Animation subtitleAnimation = AnimationUtils.loadAnimation(this, R.anim.splash_text_animation);
        subtitleAnimation.setStartOffset(800); // Start after 0.8 seconds
        appSubtitleTextView.startAnimation(subtitleAnimation);
    }

    /**
     * Navigate to main activity after splash duration
     */
    private void navigateToMainActivity() {
        new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
            @Override
            public void run() {
                // Create intent to start MainActivity
                Intent intent = new Intent(SplashActivity.this, MainActivity.class);
                
                // Add flags to prevent going back to splash
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                
                // Start MainActivity
                startActivity(intent);
                
                // Add transition animation
                overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
                
                // Finish splash activity
                finish();
            }
        }, SPLASH_DURATION);
    }

    /**
     * Prevent going back to splash screen
     */
    @Override
    public void onBackPressed() {
        // Do nothing - prevent going back during splash
    }

    /**
     * Handle activity pause
     */
    @Override
    protected void onPause() {
        super.onPause();
        // Activity is paused
    }

    /**
     * Handle activity resume
     */
    @Override
    protected void onResume() {
        super.onResume();
        // Activity is resumed
    }

    /**
     * Handle activity destroy
     */
    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Clean up resources
    }
}
