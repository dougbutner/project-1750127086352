'use client';

import { useState, useEffect } from 'react';
import { ExternalUser, SdkError, SdkErrors } from '@tonomy/tonomy-id-sdk';
import { initializeTonomySDK } from '@/lib/tonomy';

// Define user type to fix type errors
export interface User {
    id: string;
    name: string;
}

// Define Tonomy window interface
declare global {
    interface Window {
        tonomy: {
            contracts: {
                invite: {
                    cxc: {
                        actions: {
                            redeeminvite: (params: {
                                user: string;
                                inviter: string;
                            }) => Promise<any>;
                            claimreward: (params: { user: string }) => Promise<any>;
                        };
                    };
                };
            };
        };
    }
}

export default function Page() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Add invite page state
    const [inviter, setInviter] = useState('');
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteError, setInviteError] = useState('');
    const [inviteSuccess, setInviteSuccess] = useState('');

    // Ensure we're on the client side
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        // Initialize SDK
        initializeTonomySDK();

        // Check if user is already logged in
        const checkSession = async () => {
            try {
                // Add a small delay to ensure SDK is properly initialized
                await new Promise((resolve) => setTimeout(resolve, 500));

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
    }, [isClient]);

    const handleTonomyLogin = async () => {
        if (!isClient) return;

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
        if (!isClient) return;

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

    const handleRedeemInvite = async () => {
        if (!inviter) {
            setInviteError('Please enter an inviter account');
            return;
        }
        if (!user?.id) {
            setInviteError('Please log in first');
            return;
        }
        setInviteLoading(true);
        setInviteError('');
        setInviteSuccess('');
        try {
            // Call the contract action
            const result = await window.tonomy.contracts.invite.cxc.actions.redeeminvite({
                user: user.id,
                inviter: inviter,
            });
            setInviteSuccess('Successfully redeemed invite!');
        } catch (err: any) {
            setInviteError(err.message || 'Failed to redeem invite');
        }
        setInviteLoading(false);
    };

    const handleClaimReward = async () => {
        if (!user?.id) {
            setInviteError('Please log in first');
            return;
        }
        setInviteLoading(true);
        setInviteError('');
        setInviteSuccess('');
        try {
            // Call the contract action
            const result = await window.tonomy.contracts.invite.cxc.actions.claimreward({
                user: user.id,
            });
            setInviteSuccess('Successfully claimed reward!');
        } catch (err: any) {
            setInviteError(err.message || 'Failed to claim reward');
        }
        setInviteLoading(false);
    };

    // Don't render anything until we're on the client side
    if (!isClient) {
        return null;
    }

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
            className="min-h-screen bg-black text-white relative overflow-hidden"
            data-oid="o0fcycd"
        >
            <div className="relative z-10 container mx-auto px-6 py-8" data-oid="o7q2.1v">
                <h1
                    className="text-5xl md:text-7xl font-medium tracking-tighter font-jakarta text-center mb-6"
                    data-oid="kku-vhl"
                >
                    Welcome to{' '}
                    <span
                        className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400"
                        data-oid="p7iw3ry"
                    >
                        Tonomy Portal
                    </span>
                </h1>
                <div
                    className="max-w-md mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8"
                    data-oid="zp.h_42"
                >
                    <h2
                        className="text-2xl font-semibold mb-4 text-center tracking-tight"
                        data-oid="n:y3xtq"
                    >
                        Login with Tonomy ID
                    </h2>
                    <div className="mt-6 text-center" data-oid="3.cee32">
                        <p className="text-gray-400" data-oid="9lsnw6d">
                            Access the cXc.world invite program and token bridge
                        </p>
                    </div>
                    <button
                        onClick={handleTonomyLogin}
                        disabled={loading}
                        className="w-full mt-8 bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100 active:scale-95 transition-all"
                        data-oid="kvw:8g5"
                    >
                        {loading ? 'Logging in...' : 'Login with Tonomy ID'}
                    </button>
                </div>
            </div>
        </div>
    );

    // --- Dashboard --- //
    const renderDashboard = () => (
        <div className="min-h-screen bg-black text-white" data-oid="fs..3w9">
            <div className="max-w-6xl mx-auto p-6" data-oid="x13t1pp">
                <h2
                    className="text-3xl md:text-4xl font-semibold tracking-tight mb-8"
                    data-oid="1jixlkg"
                >
                    Welcome back, {user?.name}
                </h2>
                <div className="grid md:grid-cols-3 gap-8" data-oid="t9l-:_d">
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
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all cursor-pointer"
                            data-oid="65t.b9t"
                        >
                            <div className="text-3xl mb-4" data-oid="p0ss1qa">
                                {item.icon}
                            </div>
                            <h3
                                className="text-xl font-semibold mb-3 tracking-tight"
                                data-oid="mkgg1.u"
                            >
                                {item.name}
                            </h3>
                            <p className="text-gray-400" data-oid="e-j45p0">
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
        <div className="min-h-screen bg-black text-white p-6" data-oid="iywtv4k">
            <div className="max-w-4xl mx-auto" data-oid="ua_e6ul">
                <h2
                    className="text-3xl md:text-4xl font-semibold tracking-tight mb-8"
                    data-oid="bkk5ikj"
                >
                    Invite System
                </h2>

                {/* Redeem Invite Section */}
                <div
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8"
                    data-oid="rm3_vh6"
                >
                    <h3 className="text-xl font-semibold mb-4 tracking-tight" data-oid="5h3l4bs">
                        Redeem Invite
                    </h3>
                    <p className="text-gray-400 mb-6" data-oid="jzv_k3_">
                        Enter the account name of the person who invited you to join.
                    </p>

                    <div className="space-y-4" data-oid=".d0.lx8">
                        <input
                            type="text"
                            value={inviter}
                            onChange={(e) => setInviter(e.target.value)}
                            placeholder="Enter inviter account name"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
                            data-oid="2.wqrhn"
                        />

                        <button
                            onClick={handleRedeemInvite}
                            disabled={inviteLoading}
                            className="w-full bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            data-oid="_m-ml3s"
                        >
                            {inviteLoading ? 'Processing...' : 'Redeem Invite'}
                        </button>
                    </div>
                </div>

                {/* Claim Reward Section */}
                <div
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8"
                    data-oid="uflr3r_"
                >
                    <h3 className="text-xl font-semibold mb-4 tracking-tight" data-oid="0ceqybn">
                        Claim Reward
                    </h3>
                    <p className="text-gray-400 mb-6" data-oid="3-v5gs2">
                        Claim your rewards for successful invites.
                    </p>

                    <button
                        onClick={handleClaimReward}
                        disabled={inviteLoading}
                        className="w-full bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        data-oid="cwtdqmz"
                    >
                        {inviteLoading ? 'Processing...' : 'Claim Reward'}
                    </button>
                </div>

                {/* Status Messages */}
                {inviteError && (
                    <div
                        className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
                        data-oid="5n9fxan"
                    >
                        {inviteError}
                    </div>
                )}
                {inviteSuccess && (
                    <div
                        className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400"
                        data-oid="19c8lv4"
                    >
                        {inviteSuccess}
                    </div>
                )}
            </div>
        </div>
    );

    // --- Bridge Page --- //
    const renderBridge = () => (
        <div className="min-h-screen bg-black text-white p-6" data-oid="5x4n5yd">
            <div className="max-w-4xl mx-auto" data-oid="u3oq1zr">
                <h2
                    className="text-3xl md:text-4xl font-semibold tracking-tight mb-8"
                    data-oid="f4tgibg"
                >
                    Asset Bridge
                </h2>
                <div
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8"
                    data-oid="h9eqnx1"
                >
                    <button
                        onClick={() => console.log('Smart contract: bridgeAssets')}
                        className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-all"
                        data-oid="w_wro.6"
                    >
                        Bridge Assets
                    </button>
                </div>
            </div>
        </div>
    );

    // --- Learn Page --- //
    const renderLearn = () => (
        <div className="min-h-screen bg-black text-white p-6" data-oid="e0zn-2l">
            <div className="max-w-4xl mx-auto" data-oid="zy.0l:d">
                <h2
                    className="text-3xl md:text-4xl font-semibold tracking-tight mb-8"
                    data-oid="082pdhh"
                >
                    Learn
                </h2>
                <div
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8"
                    data-oid="aak1hfo"
                >
                    <p className="text-gray-300" data-oid="u:7zpnh">
                        Educational content about Tonomy blockchain
                    </p>
                </div>
            </div>
        </div>
    );

    // --- Navigation Bar --- //
    const NavBar = () => (
        <nav
            className="bg-black/80 backdrop-blur-lg border-b border-white/10 p-4"
            data-oid="szjz.2b"
        >
            <div className="max-w-6xl mx-auto flex justify-between items-center" data-oid="b.jgwn9">
                <div className="flex space-x-8" data-oid="g8aabg3">
                    <button
                        onClick={() => setCurrentPage('home')}
                        className="text-gray-300 hover:text-white transition-colors"
                        data-oid="_znas2c"
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setCurrentPage('invite')}
                        className="text-gray-300 hover:text-white transition-colors"
                        data-oid="2:32:e7"
                    >
                        Invite
                    </button>
                    <button
                        onClick={() => setCurrentPage('bridge')}
                        className="text-gray-300 hover:text-white transition-colors"
                        data-oid="k_mc.f5"
                    >
                        Bridge
                    </button>
                    <button
                        onClick={() => setCurrentPage('learn')}
                        className="text-gray-300 hover:text-white transition-colors"
                        data-oid="8-9jvkg"
                    >
                        Learn
                    </button>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-all"
                    data-oid="c6zc41o"
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
