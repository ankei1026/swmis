import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Map, { MANGAGOY_CENTER } from "@/Pages/Components/Map";

interface Station {
    id: number;
    name: string;
    lat: number;
    lng: number;
}

interface MostSuccessfulLocationProps {
    successCountsByRoute: Record<string, number>;
    mostSuccessfulRoute: string | null;
    routeLocations?: Record<string, { lat: number; lng: number }>;
    routeStations?: Record<string, Station[]>;
}

const MostSuccessfulCollection: React.FC<MostSuccessfulLocationProps> = ({
    successCountsByRoute,
    mostSuccessfulRoute,
    routeLocations = {},
    routeStations = {}
}) => {
    // Default route locations as fallback
    const defaultRouteLocations: Record<string, { lat: number; lng: number }> = {
        "Team 1": { lat: 8.2105, lng: 126.3536 },
        "Tabon": { lat: 8.2006, lng: 126.3528 },
        "Castillo Village": { lat: 8.2102, lng: 126.3554 },
        "Bosco": { lat: 8.2058, lng: 126.3601 },
        "Unknown Route": MANGAGOY_CENTER,
    };

    // Use provided locations or fallback to defaults
    const locations = { ...defaultRouteLocations, ...routeLocations };

    // Get the most successful route's stations for routing
    const mostSuccessfulStations = mostSuccessfulRoute ? routeStations[mostSuccessfulRoute] : null;
    const routePath = mostSuccessfulStations ? 
        mostSuccessfulStations.map(station => [station.lat, station.lng] as [number, number]) : 
        [];

    // Create markers for all routes
    const markers = Object.keys(successCountsByRoute)
        .flatMap((route) => {
            if (routeStations[route] && routeStations[route].length > 0) {
                return routeStations[route].map((station, index) => ({
                    id: `${route}-${station.id}`,
                    position: [station.lat, station.lng] as [number, number],
                    popup: (
                        <div className="p-2">
                            <strong className="text-sm">{station.name}</strong>
                            <br />
                            <span className="text-xs">Route: {route}</span>
                            <br />
                            <span className="text-xs">Order: {index + 1}</span>
                            <br />
                            <span className="text-xs">Successes: {successCountsByRoute[route]}</span>
                            {route === mostSuccessfulRoute && (
                                <br />
                            )}
                            {route === mostSuccessfulRoute && (
                                <span className="text-xs text-green-600">🏆 Top Route</span>
                            )}
                        </div>
                    ),
                    color: route === mostSuccessfulRoute ? "#16a34a" : "#2563eb",
                    radius: route === mostSuccessfulRoute ? 8 : 6,
                    useCircle: true,
                }));
            } else {
                const location = locations[route];
                if (location) {
                    return [{
                        id: route,
                        position: [location.lat, location.lng] as [number, number],
                        popup: (
                            <div className="p-2">
                                <strong className="text-sm">{route}</strong>
                                <br />
                                <span className="text-xs">Successes: {successCountsByRoute[route]}</span>
                                {route === mostSuccessfulRoute && (
                                    <br />
                                )}
                                {route === mostSuccessfulRoute && (
                                    <span className="text-xs text-green-600">🏆 Top Route</span>
                                )}
                            </div>
                        ),
                        color: route === mostSuccessfulRoute ? "#16a34a" : "#2563eb",
                        radius: route === mostSuccessfulRoute ? 12 : 8,
                        useCircle: true,
                    }];
                }
                return [];
            }
        });

    // Set center based on most successful route, or use MANGAGOY_CENTER as default
    const center = mostSuccessfulRoute && locations[mostSuccessfulRoute]
        ? [locations[mostSuccessfulRoute].lat, locations[mostSuccessfulRoute].lng]
        : MANGAGOY_CENTER;

    const hasRouteData = routePath.length > 1; // Need at least 2 points for a route

    return (
        <Card>
            <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-700">
                    Most Successful Collection Route
                </h3>
                <p className="mb-3 text-sm text-gray-600">
                    Showing routes with successful collections this week.
                    {hasRouteData && " Optimized route shown for top performing route."}
                </p>

                <div className="h-64 w-full rounded-md border overflow-hidden">
                    <Map
                        center={center}
                        zoom={13}
                        markers={markers}
                        style={{ height: "100%", width: "100%" }}
                        route={hasRouteData ? routePath : []}
                        useRoutingMachine={hasRouteData}
                    />
                </div>

                <div className="mt-3 text-sm text-gray-700">
                    {mostSuccessfulRoute ? (
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-semibold text-gray-800">
                                🏆 Top Performing Route
                            </div>
                            <div className="text-gray-700">
                                <strong>{mostSuccessfulRoute}</strong> —{" "}
                                {successCountsByRoute[mostSuccessfulRoute]} successful collections
                            </div>
                            {routeStations[mostSuccessfulRoute] && (
                                <div className="text-xs text-gray-600 mt-1">
                                    {routeStations[mostSuccessfulRoute].length} stations in this route
                                    {hasRouteData && " • Optimized route calculated"}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-600">
                            No successful collections recorded yet
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MostSuccessfulCollection;