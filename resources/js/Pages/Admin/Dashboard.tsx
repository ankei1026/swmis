import { Card, CardContent } from '@/components/ui/card';
import { Head, usePage } from '@inertiajs/react';
import { CheckCircle, Truck, XCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import chartData from '../Data/chartdata';
import recentActivity from '../Data/recentActivity';
import Layout from '../Layout/Layout';
import Title from '../Components/Title';
import GarbageInfo from '../Components/GarbageInfoDashboard';

interface DashboardProps {
    totalCollections: number;
    totalSuccess: number;
    totalFailed: number;
    totalOngoing: number;
    totalPending: number;
}

const Dashboard = () => {
    const {
        totalCollections,
        totalSuccess,
        totalFailed,
        totalOngoing,
        totalPending,
        weeklyPerformance,
    } = usePage<DashboardProps>().props;

    // compute success counts per route from recentActivity
    const successCountsByRoute = recentActivity.reduce<Record<string, number>>((acc, cur) => {
        if (cur.status.toLowerCase() === 'success') {
            acc[cur.route] = (acc[cur.route] || 0) + 1;
        }
        return acc;
    }, {});

    // determine the most successful route
    const mostSuccessfulRoute = Object.keys(successCountsByRoute).reduce(
        (best, r) => {
            if (!best) return r;
            return (successCountsByRoute[r] || 0) > (successCountsByRoute[best] || 0) ? r : best;
        },
        Object.keys(successCountsByRoute)[0] || null,
    );

    // Leaflet map setup
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<any>(null);

    const routeLocations: Record<string, { lat: number; lng: number }> = {
        Tabon: { lat: 8.2006, lng: 126.3528 }, // Tabon, Bislig City
        'Castillo Village': { lat: 8.2102, lng: 126.3554 }, // Castillo Village, Mangagoy
        Bosco: { lat: 8.2058, lng: 126.3601 }, // Don Bosco area, Mangagoy
    };

    useEffect(() => {
        const loadLeaflet = () => {
            return new Promise<void>((resolve, reject) => {
                if ((window as any).L) return resolve();

                if (!document.querySelector('link[data-leaflet]')) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    link.setAttribute('data-leaflet', '1');
                    document.head.appendChild(link);
                }

                if (!document.querySelector('script[data-leaflet]')) {
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    script.setAttribute('data-leaflet', '1');
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error('Failed to load Leaflet'));
                    document.body.appendChild(script);
                } else {
                    const check = setInterval(() => {
                        if ((window as any).L) {
                            clearInterval(check);
                            resolve();
                        }
                    }, 50);
                }
            });
        };

        let mounted = true;
        loadLeaflet()
            .then(() => {
                if (!mounted) return;
                const L = (window as any).L;
                if (!mapRef.current) return;

                const center =
                    mostSuccessfulRoute && routeLocations[mostSuccessfulRoute]
                        ? [routeLocations[mostSuccessfulRoute].lat, routeLocations[mostSuccessfulRoute].lng]
                        : [8.2105, 126.3536];

                if (mapInstanceRef.current) {
                    try {
                        mapInstanceRef.current.remove();
                    } catch (e) { }
                }

                const map = L.map(mapRef.current).setView(center, 12);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors',
                }).addTo(map);

                Object.keys(routeLocations).forEach((route) => {
                    const coords = routeLocations[route];
                    const count = successCountsByRoute[route] || 0;
                    const marker = L.marker([coords.lat, coords.lng]).addTo(map);
                    marker.bindPopup(`<strong>${route}</strong><br/>Successes: ${count}`);
                    if (route === mostSuccessfulRoute) {
                        marker.openPopup();
                    }
                });

                mapInstanceRef.current = map;
            })
            .catch(() => { });

        return () => {
            mounted = false;
            if (mapInstanceRef.current) {
                try {
                    mapInstanceRef.current.remove();
                } catch (e) { }
                mapInstanceRef.current = null;
            }
        };
    }, []);

    return (
        <Layout>
            <Head title="Admin Dashboard" />
            <Title title="Dashboard" />
            <GarbageInfo
                totalCollections={totalCollections}
                totalOngoing={totalOngoing}
                totalFailed={totalFailed}
                totalSuccess={totalSuccess}
                totalPending={totalPending}
            />

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <CardContent className="p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-700">Weekly Collection Performance</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="label" stroke="#9ca3af" />
                                <Tooltip />
                                <Bar dataKey="success" fill="#16a34a" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="failed" fill="#dc2626" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-700">Most Successful Collection Location</h3>
                        <div className="mb-3 text-sm text-gray-600">
                            Showing the route with the most successful collections. Map loads Leaflet via CDN at runtime.
                        </div>
                        <div className="h-64 w-full rounded-md border" ref={mapRef} />
                        <div className="mt-3 text-sm text-gray-700">
                            {mostSuccessfulRoute ? (
                                <div>
                                    <strong>{mostSuccessfulRoute}</strong> — {successCountsByRoute[mostSuccessfulRoute] || 0} successful collections
                                </div>
                            ) : (
                                <div>No successful collections yet</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Dashboard;
