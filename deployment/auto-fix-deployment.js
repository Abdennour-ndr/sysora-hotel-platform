#!/usr/bin/env node

// Auto-fix common deployment issues
import fs from 'fs';
import path from 'path';

console.log('🔧 Auto-fixing deployment issues...');

// Fix 1: Update vite.config.js
const viteConfigPath = 'vite.config.js';
if (fs.existsSync(viteConfigPath)) {
    let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
    
    if (!viteConfig.includes("base:")) {
        viteConfig = viteConfig.replace(
            'plugins: [react()],',
            'plugins: [react()],\n  base: "./",'
        );
        fs.writeFileSync(viteConfigPath, viteConfig);
        console.log('✅ Added base: "./" to vite.config.js');
    }
}

// Fix 2: Update index.html paths (if needed)
const indexPath = 'dist/index.html';
if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Replace absolute paths with relative
    indexContent = indexContent.replace(/(?:src|href)="\/([^"]+)"/g, '$&="./$1"');
    
    fs.writeFileSync(indexPath, indexContent);
    console.log('✅ Fixed paths in index.html');
}

console.log('🎉 Fixes applied! Run "npm run build" and redeploy.');
