'use client';

import { useState, useEffect } from 'react';
import { ExternalUser, setSettings, SdkError, SdkErrors } from '@tonomy/tonomy-id-sdk';

// Configure network settings
setSettings({
    ssoWebsiteOrigin: 'https://accounts.testnet.tonomy.io',
    blockchainUrl: 'https://blockchain-api-testnet.tonomy.io',
});

// Define user type to fix type errors
export interface User {
    id: string;
    name: string;
    username?: string;
}

export default function Page() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if user is already logged in
        const checkSession = async () => {
            try {
                const user = await ExternalUser.getUser();
                if (user) {
                    // Get the account name using the method and convert to string
                    const accountName = (await user.getAccountName())?.toString() || 'Anonymous';
                    setUser({ id: accountName, name: accountName });
                    setIsLoggedIn(true);
                }
            } catch (e) {
                if (e instanceof SdkError) {
                    switch (e.code) {
                        case SdkErrors.AccountNotFound:
                        case SdkErrors.UserNotLoggedIn:
                            console.log('User not logged in');
                            break;
                        default:
                            console.error('Unexpected error:', e);
                    }
                } else {
                    console.error('Error fetching user:', e);
                }
            }
        };
        checkSession();
    }, []);

    const handleTonomyLogin = async () => {
        setLoading(true);
        try {
            const dataRequest = { username: true };
            await ExternalUser.loginWithTonomy({
                callbackPath: '/callback',
                dataRequest,
            });
        } catch (error) {
            console.error('Login failed:', error);
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            const user = await ExternalUser.getUser();
            if (user) {
                await user.logout();
            }
            setUser(null);
            setIsLoggedIn(false);
            setCurrentPage('home');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // --- Navigation --- //
    const renderPage = () => {
        if (!isLoggedIn) return renderLanding();

        switch (currentPage) {
            case 'invite':
                return renderInvite();
            case 'bridge':
                return renderBridge();
            case 'learn':
                return renderLearn();
            default:
                return renderDashboard();
        }
    };

    // --- Landing Page --- //
    const renderLanding = () => (
        <div
            className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white"
            data-oid="mi6ue5v"
        >
            <div className="container mx-auto px-4 py-8" data-oid="s7xf524">
                <h1 className="text-4xl font-bold mb-6 text-center" data-oid="4_5adqe">
                    Tonomy Portal
                </h1>
                <div
                    className="max-w-md mx-auto bg-gray-700 p-6 rounded-lg shadow-md"
                    data-oid="u1pxxy"
                >
                    <h2 className="text-2xl font-semibold mb-4 text-center" data-oid="u1pxxz">
                        Login with Tonomy ID
                    </h2>
                    <div className="mt-6 text-center" data-oid="u1pxxzj">
                        <p className="text-sm text-gray-400" data-oid="4_5adqf">
                            Access the cXc.world invite program and token bridge
                        </p>
                    </div>
                    <button
                        onClick={handleTonomyLogin}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                        data-oid="u1pxxza"
                    >
                        {loading ? 'Logging in...' : 'Login with Tonomy ID'}
                    </button>
                </div>
            </div>
        </div>
    );

    // --- Dashboard --- //
    const renderDashboard = () => (
        <div className="min-h-screen bg-gray-900 text-white" data-oid="zk442y_">
            <div className="max-w-6xl mx-auto p-6" data-oid="76y59x6">
                <h2 className="text-2xl font-bold mb-8" data-oid="wedya41">
                    Welcome back, {user?.name}
                </h2>
                <div className="grid md:grid-cols-3 gap-6" data-oid="td5p:1r">
                    {[
                        {
                            name: 'Invite',
                            desc: 'Manage invitations and referrals',
                            page: 'invite',
                            icon: '👥',
                        },
                        {
                            name: 'Bridge',
                            desc: 'Cross-chain asset transfers',
                            page: 'bridge',
                            icon: '🌉',
                        },
                        { name: 'Learn', desc: 'Educational resources', page: 'learn', icon: '📚' },
                    ].map((item) => (
                        <div
                            key={item.page}
                            onClick={() => setCurrentPage(item.page)}
                            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 cursor-pointer transition-all duration-300 hover:transform hover:scale-105"
                            data-oid="yc2onwh"
                        >
                            <div className="text-3xl mb-4" data-oid="2.tc7te">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2" data-oid="4j3k36e">
                                {item.name}
                            </h3>
                            <p className="text-gray-400" data-oid="-mwt679">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // --- Invite Page --- //
    const renderInvite = () => (
        <div className="min-h-screen bg-gray-900 text-white p-6" data-oid="w.e6hsv">
            <div className="max-w-4xl mx-auto" data-oid="gf16juf">
                <h2 className="text-3xl font-bold mb-8" data-oid="r5g9g5j">
                    Invite System
                </h2>
                <div
                    className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
                    data-oid="3wxv.19"
                >
                    <button
                        onClick={() => console.log('Smart contract: createInvite')}
                        className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                        data-oid="qo2d6dw"
                    >
                        Create Invite
                    </button>
                </div>
            </div>
        </div>
    );

    // --- Bridge Page --- //
    const renderBridge = () => (
        <div className="min-h-screen bg-gray-900 text-white p-6" data-oid="cy.h_z4">
            <div className="max-w-4xl mx-auto" data-oid="e2nxpw4">
                <h2 className="text-3xl font-bold mb-8" data-oid="lcadinc">
                    Asset Bridge
                </h2>
                <div
                    className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
                    data-oid="khnh-un"
                >
                    <button
                        onClick={() => console.log('Smart contract: bridgeAssets')}
                        className="bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                        data-oid="3jzr0:6"
                    >
                        Bridge Assets
                    </button>
                </div>
            </div>
        </div>
    );

    // --- Learn Page --- //
    const renderLearn = () => (
        <div className="min-h-screen bg-gray-900 text-white p-6" data-oid="wi7fht7">
            <div className="max-w-4xl mx-auto" data-oid="e6d5q9:">
                <h2 className="text-3xl font-bold mb-8" data-oid="_3q89mc">
                    Learn
                </h2>
                <div
                    className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
                    data-oid="y3s3-2c"
                >
                    <p className="text-gray-300" data-oid="cv902wn">
                        Educational content about Tonomy blockchain
                    </p>
                </div>
            </div>
        </div>
    );

    // --- Navigation Bar --- //
    const NavBar = () => (
        <nav
            className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700/50 p-4"
            data-oid="i4qg-ar"
        >
            <div className="max-w-6xl mx-auto flex justify-between items-center" data-oid=".:adpz8">
                <div className="flex space-x-6" data-oid="_6m2-k_">
                    <button
                        onClick={() => setCurrentPage('home')}
                        className="text-white hover:text-purple-400 transition-colors"
                        data-oid="ddibm:b"
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setCurrentPage('invite')}
                        className="text-white hover:text-purple-400 transition-colors"
                        data-oid="354wcw7"
                    >
                        Invite
                    </button>
                    <button
                        onClick={() => setCurrentPage('bridge')}
                        className="text-white hover:text-purple-400 transition-colors"
                        data-oid="zpq1r:j"
                    >
                        Bridge
                    </button>
                    <button
                        onClick={() => setCurrentPage('learn')}
                        className="text-white hover:text-purple-400 transition-colors"
                        data-oid="f:vu9-o"
                    >
                        Learn
                    </button>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-colors"
                    data-oid="z.kcc5u"
                >
                    Logout
                </button>
            </div>
        </nav>
    );

    return (
        <div data-oid="use5-k6">
            {isLoggedIn && <NavBar data-oid="8hrou_m" />}
            {renderPage()}
        </div>
    );
}
