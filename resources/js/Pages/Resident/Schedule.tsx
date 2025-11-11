import LayoutResident from '@/Pages/Layout/LayoutResident';
import Title from '@/Pages/Components/Title';
import DataTable from '@/Pages/Components/Table';
import { router, PageProps, Head } from '@inertiajs/react';
import { toast } from "sonner"
import { route } from "ziggy-js";
import Map, { MapMarker, MANGAGOY_CENTER } from '@/Pages/Components/Map';
import RoutingMachine from '@/Pages/Components/RoutingMachine';
import { useState, useMemo } from 'react';
import scheduleColumnsDriverResident from '../Data/scheduleColumnDriverResident';

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

    // Transform schedules data for the table - ensure all fields are properly mapped
    const rows = schedules.map(schedule => ({
        id: schedule.id,
        date: schedule.date,
        time: schedule.time,
        route_name: schedule.route_name || 'No Route',
        driver_name: schedule.driver_name || 'No Driver',
        type: schedule.type,
        status: schedule.status,
        created_at: schedule.created_at,
        station_routes: schedule.station_routes || []
    }));

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

    return (
        <LayoutResident>
            <Head title="Schedule" />
            <Title title="Schedule" subtitle="View collection schedules" />

            {/* DataTable Component */}
            <div className='w-full bg-gray-100 mb-6 rounded-lg mt-4'>
                <div className='py-4'>
                    <DataTable
                        columns={scheduleColumnsDriverResident}
                        rows={rows}
                        title="Collection Schedules"
                        pageSize={10}
                        checkboxSelection={false}
                    />
                </div>
            </div>

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
        </LayoutResident>
    );
};

export default ScheduleList;