import Layout from '@/Pages/Layout/Layout';
import Title from '@/Pages/Components/Title';
import DataTable from '@/Pages/Components/Table';
import { router, PageProps, Head } from '@inertiajs/react';
import { toast } from "sonner"
import { route } from "ziggy-js";
import Map, { MapMarker, MANGAGOY_CENTER } from '@/Pages/Components/Map';
import RoutingMachine from '@/Pages/Components/RoutingMachine';
import { useState, useMemo, useEffect } from 'react';

// Import MUI components for columns
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { GridColDef } from '@mui/x-data-grid';

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

// ✅ Get status color
const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'primary';
        case 'completed':
            return 'success';
        case 'success':
            return 'success';
        case 'ongoing':
            return 'warning';
        case 'failed':
            return 'error';
        default:
            return 'default';
    }
};

// ✅ Get type color
const getTypeColor = (type: string) => {
    if (type.includes('Biodegradable')) {
        return 'success';
    } else if (type.includes('Non-Biodegradable')) {
        return 'primary';
    }
    return 'default';
};

// ✅ Format time for display
const formatTime = (time: string) => {
    if (!time) return '';

    // If time is in 24-hour format, convert to 12-hour format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes} ${ampm}`;
};

// ✅ Format date for display
const formatDate = (dateString: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Function to generate columns with delete handler
const getScheduleColumns = (onDelete: (id: number) => void): GridColDef[] => {
    return [
        {
            field: 'date',
            headerName: 'Date',
            width: 120,
            flex: 1,
            renderCell: (params) => (
                <div className="text-sm font-medium text-gray-700">
                    {formatDate(params.value)}
                </div>
            ),
        },
        {
            field: 'time',
            headerName: 'Time',
            width: 100,
            flex: 1,
            renderCell: (params) => (
                <div className="text-sm text-gray-600">
                    {formatTime(params.value)}
                </div>
            ),
        },
        {
            field: 'route_name',
            headerName: 'Route',
            width: 180,
            flex: 1,
            renderCell: (params) => (
                <div className="text-sm font-medium text-gray-700">
                    {params.value}
                </div>
            ),
        },
        {
            field: 'driver_name',
            headerName: 'Driver',
            width: 150,
            flex: 1,
            renderCell: (params) => (
                <div className="text-sm font-medium text-gray-700">
                    {params.value}
                </div>
            ),
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 180,
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    color={getTypeColor(params.value) as any}
                    variant="outlined"
                />
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            headerAlign: 'center',
            align: 'center',
            width: 120,
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={(params.value || '').toString().toLowerCase() === 'completed' ? 'Success' : (params.value || '').toString().charAt(0).toUpperCase() + (params.value || '').toString().slice(1)}
                    size="small"
                    color={getStatusColor((params.value || '').toString()) as any}
                    variant="filled"
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            align: 'center',
            headerAlign: 'center',
            flex: 1,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <div className="flex justify-center items-center gap-1 h-full">
                    <Tooltip title="Edit Schedule">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.visit(route('admin.scheduling.edit', params.row.id));
                            }}
                            sx={{
                                '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Schedule">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(params.row.id);
                            }}
                            sx={{
                                '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' }
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        },
    ];
};

const ScheduleList = ({ schedules }: Props) => {
    const [selectedScheduleIds, setSelectedScheduleIds] = useState<number[]>([]);
    const [currentMapPage, setCurrentMapPage] = useState<number>(1);
    const [itemsPerMapPage, setItemsPerMapPage] = useState<number>(8);

    const handleDelete = (id: number) => {
        toast.warning('Are you sure you want to delete this schedule?', {
            action: {
                label: 'Confirm',
                onClick: () => {
                    console.log('Deleting schedule with ID:', id);
                    router.delete(route('admin.scheduling.destroy', id), {
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

    const rows = [...schedules]; // Use the schedules directly

    // Get paginated schedules for map view
    const paginatedSchedules = useMemo(() => {
        const startIndex = (currentMapPage - 1) * itemsPerMapPage;
        const endIndex = startIndex + itemsPerMapPage;
        return filteredSchedules.slice(startIndex, endIndex);
    }, [filteredSchedules, currentMapPage, itemsPerMapPage]);

    // Calculate total pages for map view
    const totalMapPages = useMemo(() => {
        return Math.ceil(filteredSchedules.length / itemsPerMapPage);
    }, [filteredSchedules.length, itemsPerMapPage]);

    // Create markers for paginated schedules only
    const allStations = useMemo(() =>
        paginatedSchedules.flatMap(schedule =>
            schedule.station_routes?.map(station => ({
                ...station,
                route_name: schedule.route_name,
                schedule_id: schedule.id,
                schedule_date: schedule.date,
                schedule_time: schedule.time
            })) || []
        ),
        [paginatedSchedules]
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

    // Create route data for RoutingMachine components (paginated)
    const routesWithStations = useMemo(() =>
        paginatedSchedules
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
        [paginatedSchedules, selectedScheduleIds]
    );

    // Get paginated schedules with stations for the legend (only current page)
    const paginatedSchedulesWithStations = useMemo(() =>
        paginatedSchedules
            .filter(schedule => schedule.station_routes && schedule.station_routes.length > 0)
            .map((schedule, index) => ({
                id: schedule.id,
                route_name: schedule.route_name,
                date: schedule.date,
                time: schedule.time,
                color: '#3b82f6',
                isSelected: selectedScheduleIds.length === 0 || selectedScheduleIds.includes(schedule.id)
            })),
        [paginatedSchedules, selectedScheduleIds]
    );

    // Count schedules with stations
    const schedulesWithStationsCount = schedules.filter(s => s.station_routes && s.station_routes.length > 0).length;

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentMapPage(page);
        // Scroll to map section for better UX
        const mapSection = document.getElementById('map-section');
        if (mapSection) {
            mapSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentMapPage(1);
    }, [selectedScheduleIds]);

    console.log('Schedules data:', schedules);
    console.log('Rows data:', rows);

    return (
        <Layout>
            <Head title="Schedule List" />
            <Title title="Schedule List" subtitle="View and manage collection schedules" />

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
                        columns={getScheduleColumns(handleDelete)} // Pass the handler here
                        rows={rows}
                        title="Collection Schedules"
                        pageSize={10}
                        checkboxSelection={false}
                    />
                </div>
            </div>

            {/* Map View - Only show if there are stations */}
            {schedulesWithStationsCount > 0 && (
                <div id="map-section" className="w-full bg-gray-100 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-semibold">Schedules Map View</h3>
                            <p className='text-sm text-gray-600'>
                                Showing {paginatedSchedules.length} schedules (page {currentMapPage} of {totalMapPages}) 
                                {selectedScheduleIds.length > 0 && ` | Filtered: ${selectedScheduleIds.length}`}
                            </p>
                        </div>
                        
                        {/* Map Pagination Controls */}
                        {totalMapPages > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentMapPage - 1)}
                                    disabled={currentMapPage === 1}
                                    className={`px-3 py-1 rounded border ${currentMapPage === 1 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                >
                                    Previous
                                </button>
                                
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalMapPages) }, (_, i) => {
                                        // Show page numbers with ellipsis
                                        let pageNum;
                                        if (totalMapPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentMapPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentMapPage >= totalMapPages - 2) {
                                            pageNum = totalMapPages - 4 + i;
                                        } else {
                                            pageNum = currentMapPage - 2 + i;
                                        }
                                        
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-8 h-8 rounded ${currentMapPage === pageNum 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                <button
                                    onClick={() => handlePageChange(currentMapPage + 1)}
                                    disabled={currentMapPage === totalMapPages}
                                    className={`px-3 py-1 rounded border ${currentMapPage === totalMapPages 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Interactive Schedule Legend - ONLY PAGINATED SCHEDULES */}
                    {paginatedSchedulesWithStations.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-3">
                            {paginatedSchedulesWithStations.map((schedule) => (
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

                    {/* Map Display - Only show if current page has stations */}
                    {allStations.length > 0 ? (
                        <div className="flex w-full items-center justify-center">
                            <Map
                                center={MANGAGOY_CENTER}
                                zoom={12}
                                markers={markers}
                                style={{ height: 600 }}
                            >
                                {/* Add RoutingMachine components for each paginated route */}
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
                    ) : (
                        <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <svg className="mx-auto h-12 w-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-yellow-800">No Stations on This Page</h3>
                            <p className="mt-2 text-yellow-700">The schedules on this page don't have route stations.</p>
                            <p className="mt-1 text-sm text-yellow-600">Try the next page or select different schedules.</p>
                        </div>
                    )}

                    {/* Map Pagination Footer */}
                    {totalMapPages > 1 && (
                        <div className="mt-4 flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                Showing {paginatedSchedules.length} of {filteredSchedules.length} schedules on map
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Items per page:</span>
                                <select
                                    value={itemsPerMapPage}
                                    onChange={(e) => {
                                        setItemsPerMapPage(Number(e.target.value));
                                        setCurrentMapPage(1); // Reset to first page
                                    }}
                                    className="border rounded px-2 py-1 text-sm"
                                >
                                    <option value={4}>4</option>
                                    <option value={8}>8</option>
                                    <option value={12}>12</option>
                                    <option value={16}>16</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* No Stations Warning - Only show if NO schedules have stations at all */}
            {schedulesWithStationsCount === 0 && schedules.length > 0 && (
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