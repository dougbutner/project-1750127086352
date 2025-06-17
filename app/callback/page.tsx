'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalUser } from '@tonomy/tonomy-id-sdk';

export default function CallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const verifyLogin = async () => {
            try {
                const user = await ExternalUser.verifyLoginRequest();
                if (user) {
                    // Redirect back to the main page after successful verification
                    router.push('/');
                }
            } catch (error) {
                console.error('Login verification failed:', error);
                // Redirect to main page even on error
                router.push('/');
            }
        };

        verifyLogin();
    }, [router]);

    return (
        <div
            className="min-h-screen bg-gray-900 text-white flex items-center justify-center"
            data-oid="-xub0x."
        >
            <div className="text-center" data-oid="cov9s_g">
                <h1 className="text-2xl font-bold mb-4" data-oid="62ud2.x">
                    Verifying Login...
                </h1>
                <p className="text-gray-400" data-oid="3xerr:7">
                    Please wait while we complete your login.
                </p>
            </div>
        </div>
    );
}
