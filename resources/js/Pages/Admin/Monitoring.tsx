import Layout from '@/Pages/Layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

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

    const SAVED_ROUTES_KEY = 'swmis_saved_routes';
    const [drawing, setDrawing] = useState(false);
    const [currentRoute, setCurrentRoute] = useState<[number, number][]>([]);
    const [routes, setRoutes] = useState<SavedRoute[]>([]);
    const drawingRef = useRef<boolean>(false);

    // ✅ Load saved routes safely
    useEffect(() => {
        try {
            const raw = localStorage.getItem(SAVED_ROUTES_KEY);
            if (!raw) {
                setRoutes([]);
                return;
            }

            const parsed = JSON.parse(raw);

            if (Array.isArray(parsed)) {
                setRoutes(parsed);
            } else if (typeof parsed === 'object' && parsed !== null) {
                // Convert old object format
                const converted = Object.entries(parsed).map(([name, coords]) => ({
                    name,
                    coords: coords as [number, number][],
                }));
                setRoutes(converted);
                localStorage.setItem(SAVED_ROUTES_KEY, JSON.stringify(converted));
            } else {
                setRoutes([]);
            }
        } catch (e) {
            console.error('Failed to parse routes:', e);
            setRoutes([]);
        }
    }, []);

    // 🟢 Helper functions
    function toggleDrawing() {
        const next = !drawing;
        setDrawing(next);
        drawingRef.current = next;

        if (!next && (leafletRef as any).currentTempPoly && leafletRef.current) {
            leafletRef.current.removeLayer((leafletRef as any).currentTempPoly);
            (leafletRef as any).currentTempPoly = null;
            setCurrentRoute([]);
        }
    }

    function undoPoint() {
        setCurrentRoute((r) => {
            const next = r.slice(0, -1);
            if ((leafletRef as any).currentTempPoly) (leafletRef as any).currentTempPoly.setLatLngs(next);
            return next;
        });
    }

    function clearRoute() {
        setCurrentRoute([]);
        if ((leafletRef as any).currentTempPoly && leafletRef.current) {
            leafletRef.current.removeLayer((leafletRef as any).currentTempPoly);
            (leafletRef as any).currentTempPoly = null;
        }
    }

    function saveCurrentRoute() {
        if (!currentRoute || currentRoute.length < 2) {
            alert('Draw at least 2 points before saving');
            return;
        }

        const name = prompt('Enter a name for this route (e.g. "Morning Route")');
        if (!name) return;

        try {
            const newRoutes = [...routes, { name, coords: currentRoute }];
            setRoutes(newRoutes);
            localStorage.setItem(SAVED_ROUTES_KEY, JSON.stringify(newRoutes));
            alert(`Route "${name}" saved!`);
            clearRoute();
            setDrawing(false);
        } catch (e) {
            console.error(e);
            alert('Failed to save route');
        }
    }

    function loadSavedRoute(route: SavedRoute) {
        try {
            const L = (window as any).L;
            if (!L || !leafletRef.current) return;

            // Remove existing saved poly
            if ((leafletRef as any).currentSavedPoly && leafletRef.current) {
                leafletRef.current.removeLayer((leafletRef as any).currentSavedPoly);
                (leafletRef as any).currentSavedPoly = null;
            }

            const poly = L.polyline(route.coords, { color: 'green', weight: 4 }).addTo(leafletRef.current);
            (leafletRef as any).currentSavedPoly = poly;

            leafletRef.current.fitBounds(poly.getBounds(), { padding: [40, 40] });
        } catch (e) {
            console.error(e);
        }
    }

    function deleteRoute(name: string) {
        const confirmed = confirm(`Delete route "${name}"?`);
        if (!confirmed) return;
        const updated = routes.filter((r) => r.name !== name);
        setRoutes(updated);
        localStorage.setItem(SAVED_ROUTES_KEY, JSON.stringify(updated));
    }

    // 🗺 Initialize map
    useEffect(() => {
        if (typeof window === 'undefined') return;

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
        script.onload = () => initMap((window as any).L);
        document.body.appendChild(script);
    }, []);

    function initMap(L: any) {
        if (!mapRef.current) return;

        const map = L.map(mapRef.current).setView([8.2154, 126.3167], 13);
        leafletRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // Add staff markers
        staff.forEach((s) => {
            const marker = L.marker([s.lat, s.lng]).addTo(map).bindPopup(`<strong>${s.name}</strong><br/>${s.status}`);
            markersRef.current[s.id] = marker;
        });

        // Click handler for drawing mode
        map.on('click', (ev: any) => {
            if (!drawingRef.current) return;
            const latlng = ev.latlng;
            const point: [number, number] = [latlng.lat, latlng.lng];
            setCurrentRoute((r) => {
                const next: [number, number][] = [...r, point];
                if ((leafletRef as any).currentTempPoly) {
                    (leafletRef as any).currentTempPoly.setLatLngs(next);
                } else {
                    (leafletRef as any).currentTempPoly = L.polyline(next, {
                        color: 'orange',
                        dashArray: '6',
                    }).addTo(map);
                }
                return next;
            });
        });
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
        <Layout title="Waste Tracker">
            <Head title="Waste Tracker" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Waste Tracker</CardTitle>
                        <CardDescription>Collection status and live updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-2 flex items-center justify-between">
                            <div className="text-sm font-medium">Map</div>
                            <div className="flex items-center gap-2">
                                <button type="button" className="rounded border px-2 py-1 text-sm" onClick={toggleDrawing}>
                                    {drawing ? 'Stop drawing' : 'Start drawing'}
                                </button>
                                <button type="button" className="rounded border px-2 py-1 text-sm" onClick={undoPoint}>
                                    Undo
                                </button>
                                <button type="button" className="rounded border px-2 py-1 text-sm" onClick={clearRoute}>
                                    Clear
                                </button>
                                <button type="button" className="rounded bg-emerald-600 px-2 py-1 text-sm text-white" onClick={saveCurrentRoute}>
                                    Save route
                                </button>
                            </div>
                        </div>

                        <div className="mb-3 flex items-center gap-3">
                            <div className="text-sm">Saved Routes:</div>
                            <div className="flex flex-wrap items-center gap-2">
                                {routes.length > 0 ? (
                                    routes.map((route) => (
                                        <div key={route.name} className="flex items-center gap-1 rounded border px-2 py-1">
                                            <button className="text-xs text-blue-600" onClick={() => loadSavedRoute(route)}>
                                                {route.name}
                                            </button>
                                            <button className="text-xs text-red-500" onClick={() => deleteRoute(route.name)}>
                                                ✕
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-xs text-slate-500">No saved routes</div>
                                )}
                            </div>
                        </div>

                        <div className="h-[480px] w-full">
                            <div ref={mapRef} className="h-full w-full rounded" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
