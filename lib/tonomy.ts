import { setSettings, setFetch } from '@tonomy/tonomy-id-sdk';

let isInitialized = false;

export function initializeTonomySDK() {
    if (typeof window === 'undefined' || isInitialized) return;

    try {
        // Set the fetch function with proper window binding
        setFetch(window.fetch.bind(window));

        setSettings({
            ssoWebsiteOrigin: "https://accounts.testnet.tonomy.io",
            blockchainUrl: "https://blockchain-api-testnet.tonomy.io",
            communicationUrl: "https://communication.testnet.tonomy.io"
        });

        isInitialized = true;
    } catch (error) {
        console.error('Failed to initialize Tonomy SDK:', error);
    }
} 