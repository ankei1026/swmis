import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Map from "@/Pages/Components/Map";

interface MostSuccessfulLocationProps {
    successCountsByRoute: Record<string, number>;
    mostSuccessfulRoute: string | null;
}

const MostSuccessfulCollection: React.FC<MostSuccessfulLocationProps> = ({
    successCountsByRoute,
    mostSuccessfulRoute,
}) => {
    // Add the routeLocations object definition
    const routeLocations: Record<string, { lat: number; lng: number }> = {
        Tabon: { lat: 8.2006, lng: 126.3528 },
        "Castillo Village": { lat: 8.2102, lng: 126.3554 },
        Bosco: { lat: 8.2058, lng: 126.3601 },
    };

    // Create markers only for routes that exist in routeLocations
    const markers = Object.keys(routeLocations)
        .filter(route => route in successCountsByRoute || route === mostSuccessfulRoute)
        .map((route) => ({
            id: route,
            position: [
                routeLocations[route].lat,
                routeLocations[route].lng,
            ] as [number, number],
            popup: (
                <div>
                    <strong>{route}</strong>
                    <br />
                    Successes: {successCountsByRoute[route] || 0}
                </div>
            ),
            color: route === mostSuccessfulRoute ? "#16a34a" : "#2563eb", // highlight the top route
            radius: route === mostSuccessfulRoute ? 10 : 6,
            useCircle: true,
        }));

    const center = mostSuccessfulRoute && routeLocations[mostSuccessfulRoute]
        ? [routeLocations[mostSuccessfulRoute].lat, routeLocations[mostSuccessfulRoute].lng]
        : [8.2105, 126.3536]; // default fallback center

    return (
        <Card>
            <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-700">
                    Most Successful Collection Location
                </h3>
                <p className="mb-3 text-sm text-gray-600">
                    Showing the route with the most successful collections this week.
                </p>

                <div className="h-64 w-full rounded-md border overflow-hidden">
                    <Map
                        center={center as [number, number]}
                        zoom={13}
                        markers={markers}
                        style={{ height: "100%", width: "100%" }}
                    />
                </div>

                <div className="mt-3 text-sm text-gray-700">
                    {mostSuccessfulRoute ? (
                        <div>
                            <strong>{mostSuccessfulRoute}</strong> —{" "}
                            {successCountsByRoute[mostSuccessfulRoute] || 0} successful
                            collections
                        </div>
                    ) : (
                        <div>No successful collections yet</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MostSuccessfulCollection;