"use client";
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import Social from './Social';
import LuxeNavbar from './Luxe/LuxeNavbar';
import LuxeFooter from './Luxe/LuxeFooter';
import LuxeSocial from './Luxe/LuxeSocial';
import { AuthProvider } from '../../../../context/AuthContext';

export default function NavigationWrapper({ children }) {
    const pathname = usePathname();

    // Check if the current route is /luxe or a sub-page like /luxe/product/...
    const isLuxe = pathname?.startsWith('/luxe');

    return (
        <AuthProvider>
            {/* Conditional Navbar */}
            {isLuxe ? <LuxeNavbar /> : <Navbar />}

            {/* Page Content */}
            <main className="min-h-screen">
                {children}
            </main>

            {/* Conditional Social Bar (Hidden on Luxe) */}
            {isLuxe ? <LuxeSocial /> : <Social />}
            {/* Conditional Footer */}
            {isLuxe ? <LuxeFooter /> : <Footer />}
        </AuthProvider>
    );
}