import './globals.css';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata = {
    title: 'Tonomy Portal',
    description: 'Tonomy Portal - Access the cXc.world invite program and token bridge',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" data-oid="t1k.e:w">
            <body className={`${inter.className} bg-black text-white`} data-oid="ca_a36p">
                {children}
            </body>
        </html>
    );
}
