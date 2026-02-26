import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LogaCore Admin Portal',
  description: 'Internal portal for agency and ecommerce management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
