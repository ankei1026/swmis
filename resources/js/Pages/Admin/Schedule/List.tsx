import Layout from '@/Pages/Layout/Layout';
import Title from '@/Pages/Components/Title';
import DataTable from '@/Pages/Components/Table';
import scheduleColumns from '@/Pages/Data/schedulingColumn';
import { router, PageProps, Head } from '@inertiajs/react';
import { toast } from "sonner"
import { route } from "ziggy-js";
import Map, { MapMarker, MANGAGOY_CENTER } from '@/Pages/Components/Map';
import RoutingMachine from '@/Pages/Components/RoutingMachine';
import { useState, useMemo } from 'react';

interface StationRoute {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

interface Schedule {
    id: number;
    date: string;
    time: string;
    route_name: string;
    driver_name: string;
    type: string;
    status: string;
    created_at: string;
    station_routes?: StationRoute[];
}

interface Props extends PageProps {
    schedules: Schedule[];
}

const ScheduleList = ({ schedules }: Props) => {
    const [selectedScheduleIds, setSelectedScheduleIds] = useState<number[]>([]);

    const handleDelete = (id: number) => {
        toast.warning('Are you sure you want to delete this schedule?', {
            action: {
                label: 'Confirm',
                onClick: () => {
                    router.delete(route('admin.schedules.destroy', id), {
                        preserveScroll: true,
                        onStart: () => toast.loading('Deleting schedule...'),
                        onSuccess: () => {
                            toast.dismiss();
                            toast.success('Schedule deleted successfully!');
                        },
                        onError: () => {
                            toast.dismiss();
                            toast.error('Failed to delete schedule.');
                        },
                    });
                },
            },
            duration: 5000,
        });
    };

    // Toggle schedule selection for map view
    const toggleScheduleSelection = (scheduleId: number) => {
        setSelectedScheduleIds(prev => {
            // If clicking the only selected schedule, show all
            if (prev.length === 1 && prev[0] === scheduleId) {
                return [];
            }
            // If schedule is already selected, remove it
            if (prev.includes(scheduleId)) {
                return prev.filter(id => id !== scheduleId);
            }
            // If no schedules selected, start with this one
            if (prev.length === 0) {
                return [scheduleId];
            }
            // Add schedule to selection
            return [...prev, scheduleId];
        });
    };

    // Filter schedules based on selection - if empty array, show all
    const filteredSchedules = useMemo(() => {
        if (selectedScheduleIds.length === 0) {
            return schedules;
        }
        return schedules.filter(schedule => selectedScheduleIds.includes(schedule.id));
    }, [schedules, selectedScheduleIds]);

    const rows = [...schedules]; // This might work if the structure is already correct

    // Or if that doesn't work, try this:
    // const rows = schedules.map(schedule => ({
    //     ...schedule, // Spread all properties
    //     // Ensure all required fields are present
    //     id: schedule.id,
    //     date: schedule.date,
    //     time: schedule.time,
    //     route_name: schedule.route_name,
    //     driver_name: schedule.driver_name,
    //     type: schedule.type,
    //     status: schedule.status,
    // }));

    // Create markers for filtered schedules only
    const allStations = useMemo(() =>
        filteredSchedules.flatMap(schedule =>
            schedule.station_routes?.map(station => ({
                ...station,
                route_name: schedule.route_name,
                schedule_id: schedule.id,
                schedule_date: schedule.date,
                schedule_time: schedule.time
            })) || []
        ),
        [filteredSchedules]
    );

    const markers: MapMarker[] = allStations.map((station, index) => ({
        id: `${station.id}-${station.schedule_id}`,
        position: [station.latitude, station.longitude],
        popup: (
            <div className="space-y-2 text-sm">
                <div>
                    <strong>{station.name}</strong>
                    <br />
                    <span className="text-xs text-gray-500">Part of: {station.route_name}</span>
                    <br />
                    <span className="text-xs text-gray-500">Schedule: {new Date(station.schedule_date).toLocaleDateString()} at {station.schedule_time}</span>
                    <br />
                    Lat: {station.latitude.toFixed(6)}, Lng: {station.longitude.toFixed(6)}
                </div>
            </div>
        ),
        color: '#3b82f6',
        useCircle: true,
        radius: 8,
    }));

    // Create route data for RoutingMachine components (filtered)
    const routesWithStations = useMemo(() =>
        filteredSchedules
            .filter(schedule => schedule.station_routes && schedule.station_routes.length > 1)
            .map((schedule, index) => {
                const waypoints = schedule.station_routes!.map(station =>
                    L.latLng(station.latitude, station.longitude)
                );

                return {
                    id: schedule.id,
                    waypoints,
                    color: '#3b82f6',
                    route_name: schedule.route_name,
                    isSelected: selectedScheduleIds.length === 0 || selectedScheduleIds.includes(schedule.id)
                };
            }),
        [filteredSchedules, selectedScheduleIds]
    );

    // Get all schedules with stations for the legend
    const allSchedulesWithStations = useMemo(() =>
        schedules
            .filter(schedule => schedule.station_routes && schedule.station_routes.length > 1)
            .map((schedule, index) => ({
                id: schedule.id,
                route_name: schedule.route_name,
                date: schedule.date,
                time: schedule.time,
                color: '#3b82f6',
                isSelected: selectedScheduleIds.length === 0 || selectedScheduleIds.includes(schedule.id)
            })),
        [schedules, selectedScheduleIds]
    );

    // Count schedules with stations
    const schedulesWithStationsCount = schedules.filter(s => s.station_routes && s.station_routes.length > 0).length;

    console.log('Schedules data:', schedules);
    console.log('Rows data:', rows);

    return (
        <Layout>
            <Head title="Schedule List" />
            <Title title="Schedule List" subtitle="View and manage collection schedules" />

            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <h4 className="font-semibold text-blue-800">Raw Data Debug:</h4>
                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            <th className="text-left">ID</th>
                            <th className="text-left">Route</th>
                            <th className="text-left">Driver</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => (
                            <tr key={row.id}>
                                <td>{row.id}</td>
                                <td className="font-semibold">{row.route_name}</td>
                                <td>{row.driver_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Action Buttons */}
            <div className="mb-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                    Total Schedules: {schedules.length} |
                    Schedules with Routes: {schedulesWithStationsCount}
                    {selectedScheduleIds.length > 0 && ` | Showing: ${selectedScheduleIds.length}`}
                </div>
                <button
                    onClick={() => router.get(route('admin.scheduling.create'))}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Schedule
                </button>
            </div>

            {/* DataTable Component */}
            <div className='w-full bg-gray-100 mb-6 rounded-lg'>
                <div className='py-4'>
                    <DataTable
                        columns={scheduleColumns}
                        rows={rows}
                        title="Collection Schedules"
                        pageSize={10}
                        checkboxSelection={false}
                    />
                </div>
            </div>

            {/* Debug information - remove in production */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <h4 className="font-semibold text-yellow-800">Debug Info:</h4>
                    <p className="text-sm text-yellow-700">
                        Schedules count: {schedules.length} |
                        Rows count: {rows.length} |
                        First row route_name: {rows[0]?.route_name || 'N/A'} |
                        First row driver_name: {rows[0]?.driver_name || 'N/A'}
                    </p>
                </div>
            )}

            {/* Map View - Only show if there are stations */}
            {allStations.length > 0 && (
                <div className="w-full bg-gray-100 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Schedules Map View</h3>
                    <p className='text-sm mb-4 text-gray-600'>
                        Click any schedule to filter the map view. Select multiple schedules or click "Show All" to reset.
                    </p>

                    {/* Interactive Schedule Legend */}
                    {allSchedulesWithStations.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-3">
                            {allSchedulesWithStations.map((schedule) => (
                                <button
                                    key={schedule.id}
                                    onClick={() => toggleScheduleSelection(schedule.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${schedule.isSelected
                                        ? 'bg-white border-gray-300 shadow-sm hover:shadow-md'
                                        : 'bg-gray-100 border-gray-200 opacity-60 hover:opacity-80'
                                        }`}
                                >
                                    <div
                                        className="w-4 h-1 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: schedule.color }}
                                    ></div>
                                    <div className="text-left">
                                        <span className={`text-sm font-medium ${schedule.isSelected ? 'text-gray-800' : 'text-gray-500'
                                            }`}>
                                            {schedule.route_name}
                                        </span>
                                        <br />
                                        <span className="text-xs text-gray-500">
                                            {new Date(schedule.date).toLocaleDateString()} • {schedule.time}
                                        </span>
                                    </div>
                                    {schedule.isSelected && selectedScheduleIds.length > 0 && (
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))}

                            {/* Clear Filter Button - Only show when schedules are filtered */}
                            {selectedScheduleIds.length > 0 && (
                                <button
                                    onClick={() => setSelectedScheduleIds([])}
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
                            style={{ height: 600 }}
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

                    {/* Schedule Statistics */}
                    {filteredSchedules.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="font-semibold text-green-800">Schedules</div>
                                <div className="text-2xl font-bold text-green-600">
                                    {filteredSchedules.length}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="font-semibold text-blue-800">Stations</div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {allStations.length}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <div className="font-semibold text-purple-800">Routes</div>
                                <div className="text-2xl font-bold text-purple-600">
                                    {routesWithStations.length}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-amber-50 rounded-lg">
                                <div className="font-semibold text-amber-800">Active</div>
                                <div className="text-2xl font-bold text-amber-600">
                                    {filteredSchedules.filter(s => s.status === 'ongoing').length}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* No Stations Warning */}
            {allStations.length === 0 && schedules.length > 0 && (
                <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center">
                        <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                            <h3 className="text-lg font-medium text-yellow-800">No Route Data</h3>
                            <p className="text-yellow-700">You have created schedules but no route data is available for map display.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {schedules.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-md mt-6">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No schedules found</h3>
                    <p className="mt-2 text-sm text-gray-500">Get started by creating your first collection schedule.</p>
                    <div className="mt-6">
                        <button
                            onClick={() => router.get(route('admin.scheduling.create'))}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Schedule
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ScheduleList;