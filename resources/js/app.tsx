import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Toaster } from 'sonner'; // ✅ import Sonner toaster
import "leaflet/dist/leaflet.css";


const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} ● ${appName}`,
    resolve: (name) =>
        resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        createRoot(el).render(
            <>
                <App {...props} />
                {/* ✅ Add the Toaster globally here */}
                <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    expand
                />
            </>
        );
    },
    progress: {
        color: '#00fe3bff',
    },
});
