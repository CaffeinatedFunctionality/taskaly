/// <reference types="@capacitor/cli" />
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.projectmanagement',
  appName: 'Project Management Manager',
  webDir: 'out',
  server: {
    url: 'http://localhost:3000', // For development, we'll use the dev server
    cleartext: true
  },
  plugins: {
    FirebaseAuthentication: {
      providers: ['google.com', 'apple.com', 'password'],
      // Note: For Apple, we need to configure in Xcode/Google Console
    },
    FirebaseFirestore: {},
    FirebaseStorage: {},
  }
};

export default config;