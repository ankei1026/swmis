import React, { CSSProperties, useMemo, useEffect, useState } from "react";
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

type LatLng = [number, number];

export type MapMarker = {
    id: string | number;
    position: LatLng;
    popup?: React.ReactNode;
    color?: string;
    radius?: number;
    useCircle?: boolean;
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

    const Markers = useMemo(
        () =>
            markers.map((m) => {
                if (m.useCircle) {
                    return (
                        <CircleMarker
                            key={m.id}
                            center={m.position}
                            pathOptions={{ 
                                color: m.color ?? "#1976d2", 
                                fillColor: m.color ?? "#1976d2",
                                fillOpacity: 0.8,
                                // Add zIndex to ensure markers appear above route
                                className: "marker-circle"
                            }}
                            radius={m.radius ?? 6}
                            // Add event propagation to ensure markers are clickable
                            eventHandlers={{
                                click: (e) => {
                                    L.DomEvent.stopPropagation(e);
                                },
                            }}
                        >
                            {m.popup ? <Popup>{m.popup}</Popup> : null}
                        </CircleMarker>
                    );
                }
                return (
                    <Marker
                        key={m.id}
                        position={m.position}
                        icon={makeDivIcon(m.color ?? "#1976d2")}
                        // Add zIndexOffset to ensure markers appear above route
                        zIndexOffset={1000}
                        // Add event propagation
                        eventHandlers={{
                            click: (e) => {
                                L.DomEvent.stopPropagation(e);
                            },
                        }}
                    >
                        {m.popup ? <Popup>{m.popup}</Popup> : null}
                    </Marker>
                );
            }),
        [markers]
    );

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