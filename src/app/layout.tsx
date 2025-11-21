import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: 'Clarity AI',
  description: 'This AI app is designed as a next-generation intelligent assistant capable of performing advanced tasks across multiple domains, including natural conversation, code generation, debugging, UI/UX design, content creation, translation, and business strategy. It can build complete apps and websites from user instructions, write and improve code in various programming languages, generate scripts, branding content, and SEO-optimized copies, and create professional documents such as PDFs, PPTs, and Excel files. The AI also understands complex problems, solves homework with step-by-step explanations, assists with planning, research, and decision-making, and can generate high-quality images for logos, interfaces, and illustrations. With capabilities similar to ChatGPT, this app becomes an all-in-one smart system that thinks, writes, designs, explains, and creates anything the user needs through simple natural-language commands.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&family=Sora:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AppShell>
          {children}
        </AppShell>
        <Toaster />
      </body>
    </html>
  );
}
