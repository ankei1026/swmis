import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { AxiosInstance } from 'axios';
import { route as ZiggyRoute } from 'ziggy-js';
import { PagesProps as AppPagesProps } from './';

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    var route: typeof ZiggyRoute; // ✅ make route globally available
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPagesProps {}
}
