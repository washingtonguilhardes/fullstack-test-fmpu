'use client';

import { Bounce, ToastContainer } from 'react-toastify';

import { Geist, Geist_Mono } from 'next/font/google';

import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { muiTheme } from '@/lib/theme';
import { ThemeProvider as MTRThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-dvh`}>
        <AppRouterCacheProvider>
          <MTRThemeProvider theme={muiTheme}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >

                <SidebarProvider
                  style={
                    {
                      '--sidebar-width': 'calc(var(--spacing) * 72)',
                      '--header-height': 'calc(var(--spacing) * 12)',
                    } as React.CSSProperties
                  }
                >
                  {children}
                </SidebarProvider>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
              />
            </ThemeProvider>
          </MTRThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
