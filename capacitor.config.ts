import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.syspconecsa',
  appName: 'App Ponto - Conecsa',
  webDir: 'www',
  bundledWebRuntime: false,

  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  }
};

export default config;
