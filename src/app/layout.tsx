import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/authContext';

export const metadata: Metadata = {
  title: 'Project Management Manager',
  description: 'Manage your projects and tasks with ease',
};

import { ThemeProvider } from '@/lib/themeContext';
import { StripeProvider } from '@/lib/stripeProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider>
            <StripeProvider>{children}</StripeProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}