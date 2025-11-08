import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import LayoutResident from '../Layout/LayoutResident';

type Staff = {
    id: number;
    name: string;
    lat: number;
    lng: number;
    status: string;
};

type SavedRoute = {
    name: string;
    coords: [number, number][];
};

export default function Monitoring() {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const leafletRef = useRef<any>(null);
    const markersRef = useRef<Record<number, any>>({});

    const [staff, setStaff] = useState<Staff[]>([
        {
            id: 1,
            name: 'Team 1',
            lat: 8.1854,
            lng: 126.3567,
            status: 'On route',
        },
    ]);

    const [routes, setRoutes] = useState<SavedRoute[]>([]);
    const SAVED_ROUTES_KEY = 'swmis_saved_routes';

    // ✅ Load saved routes only
    // 🗺 Initialize map (fixed: only initialize once)
    useEffect(() => {
        if (typeof window === 'undefined' || !mapRef.current) return;

        // prevent double initialization
        if (leafletRef.current) return;

        const L = (window as any).L;

        if (L) {
            initMap(L);
            return;
        }

        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(css);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
            if (!leafletRef.current) initMap((window as any).L);
        };
        document.body.appendChild(script);
    }, [routes]);

    function initMap(L: any) {
        if (!mapRef.current) return;

        // create map only once
        const map = L.map(mapRef.current, {
            center: [8.2154, 126.3167],
            zoom: 13,
        });

        leafletRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // 🟢 Add staff markers
        staff.forEach((s) => {
            const marker = L.marker([s.lat, s.lng]).addTo(map).bindPopup(`<strong>${s.name}</strong><br/>${s.status}`);
            markersRef.current[s.id] = marker;
        });

        // 🟢 Add saved routes
        routes.forEach((route) => {
            const poly = L.polyline(route.coords, { color: 'green', weight: 4 }).addTo(map);
            poly.bindPopup(`<b>${route.name}</b>`);
        });

        // fit all routes if available
        if (routes.length > 0) {
            const allCoords = routes.flatMap((r) => r.coords);
            const bounds = L.latLngBounds(allCoords);
            map.fitBounds(bounds, { padding: [40, 40] });
        }
    }

    // 🔄 Simulate live staff movement
    useEffect(() => {
        const id = setInterval(() => {
            setStaff((prev) => {
                const updated = prev.map((p) => ({
                    ...p,
                    lat: p.lat + (Math.random() - 0.5) * 0.0006,
                    lng: p.lng + (Math.random() - 0.5) * 0.0006,
                }));

                if (leafletRef.current) {
                    updated.forEach((u) => {
                        const m = markersRef.current[u.id];
                        if (m) {
                            m.setLatLng([u.lat, u.lng]);
                            m.setPopupContent(`<strong>${u.name}</strong><br/>${u.status}`);
                        }
                    });
                }

                return updated;
            });
        }, 3000);

        return () => clearInterval(id);
    }, []);

    // 🧩 UI
    return (
        <LayoutResident title="Waste Tracker">
            <Head title="Waste Tracker" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Collection Waste Tracker</CardTitle>
                        <CardDescription>View current waste collection team locations and saved routes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            {routes.length > 0 ? (
                                routes.map((route) => (
                                    <div key={route.name} className="rounded border bg-gray-50 px-2 py-1 text-xs text-gray-700">
                                        {route.name}
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs text-slate-500">No routes available</div>
                            )}
                        </div>

                        <div className="h-[480px] w-full">
                            <div ref={mapRef} className="h-full w-full rounded shadow-inner" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </LayoutResident>
    );
}
