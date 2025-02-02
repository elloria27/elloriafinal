import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ecocurveinteract.app',
  appName: 'Eco Curve Interact',
  webDir: 'dist',
  server: {
    url: 'https://eco-curve-interact.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    contentInset: 'automatic'
  }
};

export default config;