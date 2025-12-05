// resources/js/echo.ts
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Echo: Echo;
        Pusher: any;
    }
}

export const initializeEcho = (): Echo | null => {
    if (!import.meta.env.VITE_REVERB_APP_KEY) {
        console.warn('Reverb environment variables not found. Real-time features disabled.');
        return null;
    }

    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    const csrfToken = csrfMeta?.getAttribute('content') || '';
    
    const authHeaders: Record<string, string> = {};
    
    if (csrfToken) {
        authHeaders['X-CSRF-Token'] = csrfToken;
    }
    
    authHeaders['X-Requested-With'] = 'XMLHttpRequest';

    window.Pusher = Pusher;
    
    const echo = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
        wsPort: import.meta.env.VITE_REVERB_PORT || 80,
        wssPort: import.meta.env.VITE_REVERB_PORT || 443,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
        authEndpoint: '/broadcasting/auth',
        auth: {
            headers: authHeaders,
        },
    });

    window.Echo = echo;
    console.log('Laravel Echo initialized:', !!window.Echo);
    
    return echo;
};