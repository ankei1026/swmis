import Layout from '@/Pages/Layout/LayoutDriver';
import Title from '@/Pages/Components/Title';
import Map, { MapMarker, MANGAGOY_CENTER } from '@/Pages/Components/Map';
import DataTable from '@/Pages/Components/Table';
import scheduleRouteColumns from '@/Pages/Data/scheduleRouteColumn';
import { router, PageProps, Head } from '@inertiajs/react';
import { toast } from "sonner"
import { route } from "ziggy-js";
import RoutingMachine from '@/Pages/Components/RoutingMachine';
import { useState, useMemo } from 'react';

interface ScheduleRoute {
    id: number;
    route_name: string;
    driver_id: number;
    station_order: number[] | null;
    station_names: string;
    driver_name: string;
    driver?: {
        id: number;
        name: string;
    };
    station_routes?: Array<{
        id: number;
        name: string;
        latitude: number;
        longitude: number;
    }>;
}

interface Props extends PageProps {
    scheduleroutes: ScheduleRoute[];
}

// Color palette for different routes
const ROUTE_COLORS = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316', // orange
    '#6366f1', // indigo
];

const ScheduleRouteList = ({ scheduleroutes }: Props) => {
    const [selectedRouteIds, setSelectedRouteIds] = useState<number[]>([]);

    const handleDelete = (id: number) => {
        toast.warning('Are you sure you want to delete this schedule route?', {
            action: {
                label: 'Confirm',
                onClick: () => {
                    router.delete(route('driver.scheduleroute.destroy', id), {
                        preserveScroll: true,
                        onStart: () => toast.loading('Deleting schedule route...'),
                        onSuccess: () => {
                            toast.dismiss();
                            toast.success('Schedule route deleted successfully!');
                        },
                        onError: () => {
                            toast.dismiss();
                            toast.error('Failed to delete schedule route.');
                        },
                    });
                },
            },
            duration: 5000,
        });
    };

    // Toggle route selection
    const toggleRouteSelection = (routeId: number) => {
        setSelectedRouteIds(prev => {
            // If clicking the only selected route, show all
            if (prev.length === 1 && prev[0] === routeId) {
                return [];
            }
            // If route is already selected, remove it
            if (prev.includes(routeId)) {
                return prev.filter(id => id !== routeId);
            }
            // If no routes selected, start with this one
            if (prev.length === 0) {
                return [routeId];
            }
            // Add route to selection
            return [...prev, routeId];
        });
    };

    // Filter routes based on selection - if empty array, show all
    const filteredRoutes = useMemo(() => {
        if (selectedRouteIds.length === 0) {
            return scheduleroutes;
        }
        return scheduleroutes.filter(route => selectedRouteIds.includes(route.id));
    }, [scheduleroutes, selectedRouteIds]);

    // Convert scheduleroutes to DataGrid rows (always show all routes in table)
    const rows = scheduleroutes.map(route => ({
        id: route.id,
        route_name: route.route_name,
        driver_name: route.driver_name || route.driver?.name || 'Unassigned',
        station_names: route.station_names || 'No stations assigned',
        station_count: route.station_routes?.length || 0,
        stations: route.station_routes || [],
    }));

    // Create markers for filtered routes only
    const allStations = useMemo(() =>
        filteredRoutes.flatMap(route =>
            route.station_routes?.map(station => ({
                ...station,
                route_name: route.route_name,
                route_id: route.id
            })) || []
        ),
        [filteredRoutes]
    );

    const markers: MapMarker[] = allStations.map((station, index) => ({
        id: `${station.id}-${station.route_id}`,
        position: [station.latitude, station.longitude],
        popup: (
            <div className="space-y-2 text-sm">
                <div>
                    <strong>{station.name}</strong>
                    <br />
                    <span className="text-xs text-gray-500">Part of: {station.route_name}</span>
                    <br />
                    Lat: {station.latitude.toFixed(6)}, Lng: {station.longitude.toFixed(6)}
                </div>
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => router.get(route('driver.scheduleroute.edit', station.route_id))}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                        Edit Route
                    </button>
                </div>
            </div>
        ),
        color: ROUTE_COLORS[station.route_id % ROUTE_COLORS.length],
        useCircle: true,
        radius: 8,
    }));

    // Create route data for RoutingMachine components (filtered)
    const routesWithStations = useMemo(() =>
        filteredRoutes
            .filter(route => route.station_routes && route.station_routes.length > 1)
            .map((route, index) => {
                const waypoints = route.station_routes!.map(station =>
                    L.latLng(station.latitude, station.longitude)
                );

                return {
                    id: route.id,
                    waypoints,
                    color: ROUTE_COLORS[route.id % ROUTE_COLORS.length],
                    route_name: route.route_name,
                    isSelected: selectedRouteIds.length === 0 || selectedRouteIds.includes(route.id)
                };
            }),
        [filteredRoutes, selectedRouteIds]
    );

    // Get all routes with stations for the legend
    const allRoutesWithStations = useMemo(() =>
        scheduleroutes
            .filter(route => route.station_routes && route.station_routes.length > 1)
            .map((route, index) => ({
                id: route.id,
                route_name: route.route_name,
                color: ROUTE_COLORS[route.id % ROUTE_COLORS.length],
                isSelected: selectedRouteIds.length === 0 || selectedRouteIds.includes(route.id)
            })),
        [scheduleroutes, selectedRouteIds]
    );

    // Count routes with stations
    const routesWithStationsCount = scheduleroutes.filter(r => r.station_routes && r.station_routes.length > 0).length;

    return (
        <Layout>
            <Head title="Schedule Route" />
            <Title title="Schedule Route" subtitle="View and manage schedule routes" />

            {/* Action Buttons - Fixed flex layout */}
            <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="text-sm text-gray-600">
                    Total Routes: {scheduleroutes.length} |
                    Routes with Stations: {routesWithStationsCount}
                    {selectedRouteIds.length > 0 && ` | Showing: ${selectedRouteIds.length}`}
                </div>
                <button
                    onClick={() => router.get(route('driver.scheduleroute.create'))}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 w-fit"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Route
                </button>
            </div>

            {/* DataTable Component */}
            <div className='w-full bg-gray-100 mb-4 rounded-lg'>
                <div className='py-4'>
                    <DataTable
                        columns={scheduleRouteColumns}
                        rows={rows}
                        title="Schedule Routes"
                        pageSize={5}
                        checkboxSelection={false}
                    />
                </div>
            </div>

            {/* Map View - Only show if there are stations */}
            {allStations.length > 0 && (
                <div className="w-full bg-gray-100 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Routes Map View</h3>
                    <p className='text-sm mb-4 text-gray-600'>
                        Click any route name to filter the map view. Select multiple routes or click "Show All" to reset.
                    </p>
                    
                    {/* Interactive Route Legend */}
                    {allRoutesWithStations.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-3">
                            {allRoutesWithStations.map((route) => (
                                <button
                                    key={route.id}
                                    onClick={() => toggleRouteSelection(route.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${route.isSelected
                                            ? 'bg-white border-gray-300 shadow-sm hover:shadow-md'
                                            : 'bg-gray-100 border-gray-200 opacity-60 hover:opacity-80'
                                        }`}
                                >
                                    <div
                                        className="w-4 h-1 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: route.color }}
                                    ></div>
                                    <span className={`text-sm font-medium ${route.isSelected ? 'text-gray-800' : 'text-gray-500'
                                        }`}>
                                        {route.route_name}
                                    </span>
                                    {route.isSelected && selectedRouteIds.length > 0 && (
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))}

                            {/* Clear Filter Button - Only show when routes are filtered */}
                            {selectedRouteIds.length > 0 && (
                                <button
                                    onClick={() => setSelectedRouteIds([])}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className="text-sm font-medium">Show All</span>
                                </button>
                            )}
                        </div>
                    )}

                    <div className="flex w-full items-center justify-center">
                        <Map
                            center={MANGAGOY_CENTER}
                            zoom={12}
                            markers={markers}
                            style={{ height: 800 }}
                        >
                            {/* Add RoutingMachine components for each filtered route */}
                            {routesWithStations.map((route) => (
                                <RoutingMachine
                                    key={route.id}
                                    waypoints={route.waypoints}
                                    color={route.color}
                                    weight={3}
                                />
                            ))}
                        </Map>
                    </div>
                </div>
            )}

            {/* No Stations Warning */}
            {allStations.length === 0 && scheduleroutes.length > 0 && (
                <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center">
                        <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                            <h3 className="text-lg font-medium text-yellow-800">No Stations Assigned</h3>
                            <p className="text-yellow-700">You have created schedule routes but no stations have been assigned to them yet.</p>
                            <button
                                onClick={() => router.get(route('driver.scheduleroute.create'))}
                                className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                            >
                                Add Stations to Routes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {scheduleroutes.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No schedule routes</h3>
                    <p className="mt-2 text-sm text-gray-500">Get started by creating your first schedule route.</p>
                    <div className="mt-6">
                        <button
                            onClick={() => router.get(route('driver.scheduleroute.create'))}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Schedule Route
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ScheduleRouteList;