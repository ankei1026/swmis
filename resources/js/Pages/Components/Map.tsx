import React, { CSSProperties, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    CircleMarker,
    useMapEvents,
    Polyline,
} from "react-leaflet";

type LatLng = [number, number];

export type MapMarker = {
    id: string | number;
    position: LatLng;
    popup?: React.ReactNode;
    color?: string;
    radius?: number;
    useCircle?: boolean; // if true, render a CircleMarker instead of a Marker
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
}

/**
 * Lightweight, configurable map component using react-leaflet.
 * - Safe for SSR (renders null on server)
 * - Renders markers (either CircleMarker or a simple div icon marker)
 * - Supports route drawing with Polyline
 */
const Map: React.FC<MapProps> = ({
    center = MANGAGOY_CENTER,
    zoom = 15,
    markers = [],
    style,
    onClick,
    tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    children,
    route,
}) => {
    // Prevent server-side render issues
    if (typeof window === "undefined") return null;

    // Create a simple colored div icon for Marker (no external image dependencies)
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
                            pathOptions={{ color: m.color ?? "#1976d2", fillOpacity: 0.8 }}
                            radius={m.radius ?? 6}
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
        <MapContainer center={center} zoom={zoom} style={containerStyle} scrollWheelZoom>
            <TileLayer url={tileUrl} attribution={tileAttribution} />
            <ClickHandler />
            {Markers}

            {/* Draw route line if provided */}
            {route && route.length > 1 && (
                <Polyline
                    positions={route}
                    pathOptions={{ color: "blue", weight: 4, opacity: 0.7 }}
                />
            )}

            {children}
        </MapContainer>
    );
};

export default Map;
