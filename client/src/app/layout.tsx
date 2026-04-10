// -Path: "PokeRotom/client/src/app/layout.tsx"
import './globals.css';
import type { Metadata } from 'next';
import Providers from '$/components/Providers';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'PokeRotom World - 3D Pokémon RPG',
    description:
        'PokeRotom World: เกม RPG 3D โลกเปิดแฟนเกมโปเกม่อน เล่นออนไลน์ได้พร้อมเพื่อน',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
