'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalUser, SdkError, SdkErrors } from '@tonomy/tonomy-id-sdk';
import { initializeTonomySDK } from '@/lib/tonomy';

export default function CallbackPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        const verifyLogin = async () => {
            try {
                // Initialize SDK first
                initializeTonomySDK();

                // Add a small delay to ensure SDK is properly initialized
                await new Promise((resolve) => setTimeout(resolve, 500));

                console.log('Starting login verification...');

                // Ensure we're in a browser environment
                if (typeof window === 'undefined') {
                    throw new Error('Cannot verify login in non-browser environment');
                }

                const user = await ExternalUser.verifyLoginRequest();

                if (user) {
                    console.log('User object received:', user);
                    try {
                        const accountName = await user.getAccountName();
                        console.log('Account name retrieved:', accountName?.toString());

                        // Store user info in session storage
                        sessionStorage.setItem(
                            'user',
                            JSON.stringify({
                                accountName: accountName?.toString() || 'Anonymous',
                            }),
                        );

                        // Redirect back to the main page after successful verification
                        router.push('/');
                    } catch (nameError) {
                        console.error('Error getting account name:', nameError);
                        setError('Error retrieving account information');
                    }
                } else {
                    console.log('No user object received from verification');
                    setError('Verification failed: No user data received');
                }
            } catch (e) {
                console.error('Login verification failed:', e);
                if (e instanceof SdkError) {
                    console.error('SDK Error details:', {
                        code: e.code,
                        message: e.message,
                        name: e.name,
                    });
                    setError(`Verification failed: ${e.message}`);
                } else {
                    console.error('Unexpected error details:', e);
                    setError('An unexpected error occurred during verification');
                }
            } finally {
                setIsVerifying(false);
                // Wait a bit before redirecting on error
                if (error) {
                    setTimeout(() => {
                        router.push('/');
                    }, 3000);
                }
            }
        };

        verifyLogin();
    }, [router, error]);

    return (
        <div
            className="min-h-screen bg-gray-900 text-white flex items-center justify-center"
            data-oid="cab91lr"
        >
            <div className="text-center" data-oid="5kcilse">
                <h1 className="text-2xl font-bold mb-4" data-oid="s5vid7n">
                    {error ? 'Verification Failed' : 'Verifying Login...'}
                </h1>
                <p className="text-gray-400" data-oid="b6tawbz">
                    {error || 'Please wait while we complete your login.'}
                </p>
                {isVerifying && (
                    <div className="mt-4" data-oid="mkcjdpj">
                        <div
                            className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"
                            data-oid="wnujmtg"
                        ></div>
                    </div>
                )}
            </div>
        </div>
    );
}
