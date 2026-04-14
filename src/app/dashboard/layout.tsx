import { AuthProvider } from '@/lib/authContext';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>{children}</AuthProvider>
  );
}