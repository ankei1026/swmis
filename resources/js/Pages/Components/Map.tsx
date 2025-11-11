import React, { CSSProperties, useMemo, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    CircleMarker,
    useMapEvents,
    useMap,
    Polyline,
} from "react-leaflet";
import TruckSvg from '@/Pages/Components/TruckSvg';

type LatLng = [number, number];

export type MapMarker = {
    id: string | number;
    position: LatLng;
    popup?: React.ReactNode;
    color?: string;
    radius?: number;
    useCircle?: boolean;
    useSvgIcon?: boolean;
    svgIcon?: string;
};

export const MANGAGOY_CENTER: LatLng = [8.1836, 126.3567];

export interface MapProps {
    center?: LatLng;
    zoom?: number;
    markers?: MapMarker[];
    style?: CSSProperties;
    onClick?: (latlng: { lat: number; lng: number }) => void;
    tileUrl?: string;
    tileAttribution?: string;
    children?: React.ReactNode;
    route?: LatLng[];
    classname?: string;
    useRoutingMachine?: boolean;
}

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Route Component using OSRM API
const CustomRoute: React.FC<{ waypoints: LatLng[] }> = ({ waypoints }) => {
    const map = useMap();
    const [routePath, setRoutePath] = React.useState<LatLng[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
        if (waypoints.length < 2) {
            setRoutePath([]);
            return;
        }

        const fetchRoute = async () => {
            setIsLoading(true);
            try {
                // Format coordinates for OSRM API: "lng,lat;lng,lat"
                const coordinates = waypoints.map(wp => `${wp[1]},${wp[0]}`).join(';');
                const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

                console.log('Fetching route from:', url);

                const response = await fetch(url);
                const data = await response.json();

                console.log('OSRM Response:', data);

                if (data.routes && data.routes.length > 0) {
                    const routeCoordinates = data.routes[0].geometry.coordinates.map(
                        (coord: [number, number]) => [coord[1], coord[0]] as LatLng
                    );
                    setRoutePath(routeCoordinates);

                    // Fit map to show the entire route
                    if (routeCoordinates.length > 0) {
                        const bounds = L.latLngBounds(routeCoordinates);
                        map.fitBounds(bounds, { padding: [20, 20] });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch route from OSRM:', error);
                // Fallback: use straight lines between waypoints
                setRoutePath(waypoints);

                // Fit map to show all waypoints
                if (waypoints.length > 0) {
                    const bounds = L.latLngBounds(waypoints);
                    map.fitBounds(bounds, { padding: [20, 20] });
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchRoute();
    }, [map, waypoints]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="leaflet-top leaflet-right">
                <div className="leaflet-control leaflet-bar bg-white p-2 shadow-lg rounded">
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                        <span className="text-sm text-gray-700">Calculating route...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (routePath.length < 2) return null;

    return (
        <Polyline
            positions={routePath}
            pathOptions={{
                color: '#16a34a', // Green color for success
                weight: 6,
                opacity: 0.7,
                lineCap: 'round',
                lineJoin: 'round'
            }}
        />
    );
};

// Simple Polyline fallback (straight lines)
const SimpleRoute: React.FC<{ waypoints: LatLng[] }> = ({ waypoints }) => {
    const map = useMap();

    useEffect(() => {
        if (waypoints.length > 0) {
            // Fit map to show all waypoints
            const bounds = L.latLngBounds(waypoints);
            map.fitBounds(bounds, { padding: [20, 20] });
        }
    }, [map, waypoints]);

    if (waypoints.length < 2) return null;

    return (
        <Polyline
            positions={waypoints}
            pathOptions={{
                color: '#16a34a', // Green color for success
                weight: 4,
                opacity: 0.7,
                dashArray: '10, 10',
                lineCap: 'round',
                lineJoin: 'round'
            }}
        />
    );
};

const Map: React.FC<MapProps> = ({
    center = MANGAGOY_CENTER,
    zoom = 15,
    markers = [],
    style,
    onClick,
    tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    children,
    route = [],
    useRoutingMachine = false,
}) => {
    // Prevent server-side render issues
    if (typeof window === "undefined") return null;

    // Create a simple colored div icon for Marker
    const makeDivIcon = (color = "#1976d2") =>
        L.divIcon({
            className: "",
            html: `<div style="
                width: 14px;
                height: 14px;
                background:${color};
                border:2px solid white;
                border-radius:50%;
                box-shadow:0 0 2px rgba(0,0,0,0.5);
                transform: translate(-50%, -50%);
            "></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
        });

    // Create truck icon using the TruckSvg component
    const makeTruckIcon = (size = 40) => {
        // Convert the TruckSvg component to HTML string for Leaflet
        const truckSvgHtml = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 128 128">
                <path d="M99.844 83.288a7.546 7.546 0 1 1-7.555-7.547 7.554 7.554 0 0 1 7.555 7.547z" fill="#ffad5a"/>
                <path d="M109.272 66.515v16.773h-9.428a7.546 7.546 0 1 0-15.092 0h-5.49V50.927h14.422a15.585 15.585 0 0 1 15.588 15.588z" fill="#f9d16e"/>
                <path d="M79.262 45.116v38.172H59.314a7.547 7.547 0 1 0-15.093 0 7.546 7.546 0 1 0-15.092 0h-10.4V69.4L31.58 45.116z" fill="#4f9da6"/>
                <path d="M87.465 57.26h5.949a9.772 9.772 0 0 1 9.772 9.772v.805H87.465V57.26z" fill="#2d1f5e"/>
                <g fill="#fff8e3">
                    <path d="M50.447 59.8a1.5 1.5 0 0 1-1.3-2.25l1.88-3.256a3.371 3.371 0 0 1 5.838 0l1.861 3.225a1.5 1.5 0 0 1-2.6 1.5l-1.86-3.224a.339.339 0 0 0-.642 0l-1.879 3.255a1.5 1.5 0 0 1-1.298.75zM59.949 69.74h-3.48a1.5 1.5 0 0 1 0-3h3.48a.37.37 0 0 0 .321-.555l-1.762-3.052a1.5 1.5 0 0 1 2.6-1.5l1.762 3.052a3.37 3.37 0 0 1-2.919 5.055zM51.219 69.74h-3.272a3.37 3.37 0 0 1-2.919-5.055l1.533-2.675a1.5 1.5 0 1 1 2.6 1.492l-1.536 2.679a.358.358 0 0 0 0 .374.354.354 0 0 0 .321.185h3.272a1.5 1.5 0 1 1 0 3z"/>
                </g>
                <path d="M44.221 83.288a7.546 7.546 0 1 1-7.546-7.547 7.552 7.552 0 0 1 7.546 7.547z" fill="#ffad5a"/>
                <path d="M18.728 75.741h17.947a7.546 7.546 0 0 0-7.546 7.547h-10.4z" fill="#3e8f93"/>
                <circle cx="51.767" cy="83.288" r="7.546" fill="#ffad5a"/>
                <path d="M36.675 75.741h15.092a7.541 7.541 0 0 0-7.546 7.547 7.546 7.546 0 0 0-7.546-7.547zM79.262 75.741v7.547H59.314a7.547 7.547 0 0 0-7.547-7.547z" fill="#3e8f93"/>
                <path d="M94.267 83.288a1.969 1.969 0 1 1-1.969-1.97 1.97 1.97 0 0 1 1.969 1.97z" fill="#fff8e3"/>
                <circle cx="51.767" cy="83.288" r="1.969" fill="#fff8e3"/>
                <path d="M38.644 83.288a1.969 1.969 0 1 1-1.969-1.97 1.969 1.969 0 0 1 1.969 1.97z" fill="#fff8e3"/>
                <path d="M108.677 80.7H106.1a1.75 1.75 0 0 1 0-3.5h2.574a1.75 1.75 0 0 1 0 3.5zM113.541 92.584H14.459a1.75 1.75 0 0 1 0-3.5h99.082a1.75 1.75 0 0 1 0 3.5zM111.847 85.037h-2.575a1.75 1.75 0 0 1 0-3.5h2.575a1.75 1.75 0 1 1 0 3.5zM18.728 85.037h-2.575a1.75 1.75 0 1 1 0-3.5h2.575a1.75 1.75 0 1 1 0 3.5z" fill="#2d1f5e"/>
            </svg>
        `;

        return L.divIcon({
            className: "custom-truck-icon",
            html: `<div style="
                display: flex;
                align-items: center;
                justify-content: center;
                width: ${size}px;
                height: ${size}px;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            ">${truckSvgHtml}</div>`,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
        });
    };

    const Markers = useMemo(() => {
        return markers.map((m) => {
            // Use truck icon if specified
            if (m.useSvgIcon) {
                const iconSize = m.radius || 40;
                return (
                    <Marker
                        key={m.id}
                        position={m.position}
                        icon={makeTruckIcon(iconSize)}
                    >
                        {m.popup ? <Popup>{m.popup}</Popup> : null}
                    </Marker>
                );
            }

            // Use circle marker if specified
            if (m.useCircle) {
                return (
                    <CircleMarker
                        key={m.id}
                        center={m.position}
                        pathOptions={{ 
                            color: m.color ?? "#1976d2", 
                            fillColor: m.color ?? "#1976d2",
                            fillOpacity: 0.8 
                        }}
                        radius={m.radius ?? 6}
                    >
                        {m.popup ? <Popup>{m.popup}</Popup> : null}
                    </CircleMarker>
                );
            }

            // Default marker
            return (
                <Marker
                    key={m.id}
                    position={m.position}
                    icon={makeDivIcon(m.color ?? "#1976d2")}
                >
                    {m.popup ? <Popup>{m.popup}</Popup> : null}
                </Marker>
            );
        });
    }, [markers]);

    function ClickHandler() {
        useMapEvents({
            click(e) {
                onClick?.({ lat: e.latlng.lat, lng: e.latlng.lng });
            },
        });
        return null;
    }

    const containerStyle: CSSProperties = {
        width: "100%",
        height: 400,
        ...style,
    };

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={containerStyle}
            scrollWheelZoom
        >
            <TileLayer url={tileUrl} attribution={tileAttribution} />
            <ClickHandler />

            {/* Show route FIRST (so it appears below markers) */}
            {route.length > 1 && useRoutingMachine && (
                <CustomRoute waypoints={route} />
            )}

            {route.length > 1 && !useRoutingMachine && (
                <SimpleRoute waypoints={route} />
            )}

            {/* Markers SECOND (so they appear above the route) */}
            {Markers}

            {children}
        </MapContainer>
    );
};

export default Map;