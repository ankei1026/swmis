import LayoutResident from '@/Pages/Layout/LayoutResident';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Map from '../Components/Map';
import Title from '../Components/Title';

interface Station {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    status: 'pending' | 'arrived' | 'collecting' | 'completed' | 'departed' | 'failed';
    order: number;
    arrived_at: string | null;
    completed_at: string | null;
    departed_at: string | null;
}

interface Schedule {
    id: number;
    driver_id: number;
    driver_name: string;
    driver_avatar: string | null;
    route_name: string;
    status: 'in_progress' | 'completed' | 'failed';
    started_at: string | null;
    completed_at: string | null;
    progress_percentage: number;
    current_station: string;
    stations: Station[];
    last_updated: string;
}

interface Driver {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    current_schedule_id: number | null;
    current_station: Station | null;
    status: 'active' | 'inactive';
    last_seen: string;
}

interface Props {
    activeSchedules: Schedule[];
    drivers: Driver[];
}

// Custom Truck Icon using your SVG - Same as CollectionTracker
const TruckIcon: React.FC<{ size?: number }> = ({ size = 240 }) => (
    <div style={{ width: size, height: size }}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 128 128"
        >
            <path d="M99.844 83.288a7.546 7.546 0 1 1-7.555-7.547 7.554 7.554 0 0 1 7.555 7.547z" fill="#ffad5a" />
            <path d="M109.272 66.515v16.773h-9.428a7.546 7.546 0 1 0-15.092 0h-5.49V50.927h14.422a15.585 15.585 0 0 1 15.588 15.588z" fill="#f9d16e" />
            <path d="M79.262 45.116v38.172H59.314a7.547 7.547 0 1 0-15.093 0 7.546 7.546 0 1 0-15.092 0h-10.4V69.4L31.58 45.116z" fill="#4f9da6" />
            <path d="M87.465 57.26h5.949a9.772 9.772 0 0 1 9.772 9.772v.805H87.465V57.26z" fill="#2d1f5e" />
            <g fill="#fff8e3">
                <path d="M50.447 59.8a1.5 1.5 0 0 1-1.3-2.25l1.88-3.256a3.371 3.371 0 0 1 5.838 0l1.861 3.225a1.5 1.5 0 0 1-2.6 1.5l-1.86-3.224a.339.339 0 0 0-.642 0l-1.879 3.255a1.5 1.5 0 0 1-1.298.75zM59.949 69.74h-3.48a1.5 1.5 0 0 1 0-3h3.48a.37.37 0 0 0 .321-.555l-1.762-3.052a1.5 1.5 0 0 1 2.6-1.5l1.762 3.052a3.37 3.37 0 0 1-2.919 5.055zM51.219 69.74h-3.272a3.37 3.37 0 0 1-2.919-5.055l1.533-2.675a1.5 1.5 0 1 1 2.6 1.492l-1.536 2.679a.358.358 0 0 0 0 .374.354.354 0 0 0 .321.185h3.272a1.5 1.5 0 1 1 0 3z" />
            </g>
            <path d="M44.221 83.288a7.546 7.546 0 1 1-7.546-7.547 7.552 7.552 0 0 1 7.546 7.547z" fill="#ffad5a" />
            <path d="M18.728 75.741h17.947a7.546 7.546 0 0 0-7.546 7.547h-10.4z" fill="#3e8f93" />
            <circle cx="51.767" cy="83.288" r="7.546" fill="#ffad5a" />
            <path d="M36.675 75.741h15.092a7.541 7.541 0 0 0-7.546 7.547 7.546 7.546 0 0 0-7.546-7.547zM79.262 75.741v7.547H59.314a7.547 7.546 0 0 0-15.092 0 7.546 7.546 0 1 0-15.092 0h-10.4V69.4L31.58 45.116z" fill="#4f9da6" />
            <path d="M87.465 57.26h5.949a9.772 9.772 0 0 1 9.772 9.772v.805H87.465V57.26z" fill="#2d1f5e" />
            <g fill="#fff8e3">
                <path d="M50.447 59.8a1.5 1.5 0 0 1-1.3-2.25l1.88-3.256a3.371 3.371 0 0 1 5.838 0l1.861 3.225a1.5 1.5 0 0 1-2.6 1.5l-1.86-3.224a.339.339 0 0 0-.642 0l-1.879 3.255a1.5 1.5 0 0 1-1.298.75zM59.949 69.74h-3.48a1.5 1.5 0 0 1 0-3h3.48a.37.37 0 0 0 .321-.555l-1.762-3.052a1.5 1.5 0 0 1 2.6-1.5l1.762 3.052a3.37 3.37 0 0 1-2.919 5.055zM51.219 69.74h-3.272a3.37 3.37 0 0 1-2.919-5.055l1.533-2.675a1.5 1.5 0 1 1 2.6 1.492l-1.536 2.679a.358.358 0 0 0 0 .374.354.354 0 0 0 .321.185h3.272a1.5 1.5 0 1 1 0 3z" />
            </g>
            <path d="M44.221 83.288a7.546 7.546 0 1 1-7.546-7.547 7.552 7.552 0 0 1 7.546 7.547z" fill="#ffad5a" />
            <path d="M18.728 75.741h17.947a7.546 7.546 0 0 0-7.546 7.547h-10.4z" fill="#3e8f93" />
            <circle cx="51.767" cy="83.288" r="7.546" fill="#ffad5a" />
            <path d="M36.675 75.741h15.092a7.541 7.541 0 0 0-7.546 7.547 7.546 7.546 0 0 0-7.546-7.547zM79.262 75.741v7.547H59.314a7.547 7.547 0 0 0-7.547-7.547z" fill="#3e8f93" />
            <path d="M94.267 83.288a1.969 1.969 0 1 1-1.969-1.97 1.97 1.97 0 0 1 1.969 1.97z" fill="#fff8e3" />
            <circle cx="51.767" cy="83.288" r="1.969" fill="#fff8e3" />
            <path d="M38.644 83.288a1.969 1.969 0 1 1-1.969-1.97 1.969 1.969 0 0 1 1.969 1.97z" fill="#fff8e3" />
            <path d="M108.677 80.7H106.1a1.75 1.75 0 0 1 0-3.5h2.574a1.75 1.75 0 0 1 0 3.5zM113.541 92.584H14.459a1.75 1.75 0 0 1 0-3.5h99.082a1.75 1.75 0 0 1 0 3.5zM111.847 85.037h-2.575a1.75 1.75 0 0 1 0-3.5h2.575a1.75 1.75 0 1 1 0 3.5zM18.728 85.037h-2.575a1.75 1.75 0 1 1 0-3.5h2.575a1.75 1.75 0 1 1 0 3.5z" fill="#2d1f5e" />
        </svg>
    </div>
);

// Status badge component - Matching Collection Tracker
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getBadgeStyle = () => {
        const baseStyle = "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-colors";
        switch (status) {
            case 'pending': return `${baseStyle} bg-gray-100 text-gray-800 border border-gray-300`;
            case 'arrived': return `${baseStyle} bg-blue-100 text-blue-800 border border-blue-300`;
            case 'collecting': return `${baseStyle} bg-purple-100 text-purple-800 border border-purple-300`;
            case 'completed': return `${baseStyle} bg-green-100 text-green-800 border border-green-300`;
            case 'departed': return `${baseStyle} bg-yellow-100 text-yellow-800 border border-yellow-300`;
            case 'failed': return `${baseStyle} bg-red-100 text-red-800 border border-red-300`;
            case 'in_progress': return `${baseStyle} bg-yellow-100 text-yellow-800 border border-yellow-300`;
            default: return `${baseStyle} bg-gray-100 text-gray-800 border border-gray-300`;
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'pending': return '⏳';
            case 'arrived': return '📍';
            case 'collecting': return '🔄';
            case 'completed': return '✅';
            case 'departed': return '🚗';
            case 'failed': return '❌';
            case 'in_progress': return '🚛';
            default: return '⏳';
        }
    };

    return (
        <span className={getBadgeStyle()}>
            <span className="mr-1.5">{getStatusIcon()}</span>
            {status.replace('_', ' ').toUpperCase()}
        </span>
    );
};

// Helper function for status colors - Matching Collection Tracker
const getStatusColor = (status: string) => {
    const colors = {
        pending: '#6B7280',
        arrived: '#3B82F6',
        collecting: '#8B5CF6',
        completed: '#10B981',
        departed: '#F59E0B',
        failed: '#EF4444',
        in_progress: '#F59E0B',
    };
    return colors[status as keyof typeof colors] || '#6B7280';
};

const Monitoring: React.FC<Props> = ({ activeSchedules, drivers }) => {
    const [schedules, setSchedules] = useState<Schedule[]>(activeSchedules);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [lastUpdate, setLastUpdate] = useState<string>(new Date().toISOString());
    const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

    // Set selected schedule from localStorage or default to first schedule
    useEffect(() => {
        if (schedules.length > 0) {
            // Try to get the last selected schedule from localStorage
            const savedScheduleId = localStorage.getItem('monitoringSelectedScheduleId');
            
            if (savedScheduleId) {
                const savedSchedule = schedules.find(s => s.id === parseInt(savedScheduleId));
                if (savedSchedule) {
                    setSelectedSchedule(savedSchedule);
                    return;
                }
            }
            
            // If no saved schedule or saved schedule not found, use the first one
            setSelectedSchedule(schedules[0]);
        }
    }, [schedules]);

    // Save selected schedule to localStorage whenever it changes
    useEffect(() => {
        if (selectedSchedule) {
            localStorage.setItem('monitoringSelectedScheduleId', selectedSchedule.id.toString());
        }
    }, [selectedSchedule]);

    // Handle schedule change with localStorage persistence
    const handleScheduleChange = (schedule: Schedule | null) => {
        setSelectedSchedule(schedule);
        // The useEffect above will automatically save to localStorage
    };

    // Auto-refresh data every 30 seconds
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            fetch('/admin/monitoring/live-updates')
                .then(response => response.json())
                .then(data => {
                    setSchedules(data.schedules);
                    setLastUpdate(data.last_updated);
                    
                    // Update selected schedule if it exists in the new data
                    if (selectedSchedule) {
                        const updatedSelectedSchedule = data.schedules.find((s: Schedule) => s.id === selectedSchedule.id);
                        if (updatedSelectedSchedule) {
                            setSelectedSchedule(updatedSelectedSchedule);
                        }
                    }
                })
                .catch(error => console.error('Failed to fetch updates:', error));
        }, 30000);

        return () => clearInterval(interval);
    }, [autoRefresh, selectedSchedule]);

    // Get current active station for each schedule - Same logic as CollectionTracker
    const getCurrentActiveStation = (schedule: Schedule) => {
        if (!schedule.stations) return null;

        const stations = schedule.stations.sort((a, b) => a.order - b.order);
        
        // First, look for stations that are actively being worked on
        const collectingStation = stations.find(station => station.status === 'collecting');
        const arrivedStation = stations.find(station => station.status === 'arrived');
        
        // If we're actively collecting or arrived at a station, that's the current one
        if (collectingStation) return collectingStation;
        if (arrivedStation) return arrivedStation;
        
        // If no active station, find the first pending station
        const pendingStations = stations.filter(station => station.status === 'pending');
        if (pendingStations.length > 0) return pendingStations[0];

        // If all stations are completed/departed, return the last one
        const completedStations = stations.filter(station =>
            station.status === 'completed' || station.status === 'departed'
        );
        if (completedStations.length > 0) {
            return completedStations[completedStations.length - 1];
        }

        return null;
    };

    // Prepare map markers for all active schedules with Truck SVG for current stations
    const mapMarkers = schedules.flatMap(schedule => {
        if (!schedule.stations) return [];

        const currentActiveStation = getCurrentActiveStation(schedule);

        return schedule.stations.map(station => {
            const isCurrentActiveStation = currentActiveStation?.id === station.id;
            const isLastStation = station.order === Math.max(...schedule.stations.map(s => s.order));

            return {
                id: `${schedule.id}-${station.id}`,
                position: [station.latitude, station.longitude] as [number, number],
                popup: (
                    <div className="p-3 min-w-[280px] bg-white rounded-lg shadow-lg border">
                        <div className="flex items-center gap-3 mb-2">
                            {isCurrentActiveStation ? (
                                <div className="text-blue-500 flex-shrink-0">
                                    <TruckIcon size={32} />
                                </div>
                            ) : (
                                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{
                                    backgroundColor: getStatusColor(station.status)
                                }}></div>
                            )}
                            <div className="flex-1 min-w-0">
                                <strong className="text-sm font-semibold text-gray-900 block">{station.name}</strong>
                                {isCurrentActiveStation && (
                                    <span className="text-xs text-blue-600 font-medium">
                                        {isLastStation ? '🏁 Final Station' : '🚛 Collection Truck'}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <StatusBadge status={station.status} />
                        </div>
                        <div className="space-y-1.5 text-xs text-gray-600">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Driver:</span>
                                <span className="font-medium">{schedule.driver_name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Route:</span>
                                <span className="font-medium">{schedule.route_name}</span>
                            </div>
                            {station.arrived_at && (
                                <div className="flex items-center gap-2">
                                    <span className="w-4">🟢</span>
                                    <span>Arrived: {new Date(station.arrived_at).toLocaleTimeString()}</span>
                                </div>
                            )}
                            {station.completed_at && (
                                <div className="flex items-center gap-2">
                                    <span className="w-4">✅</span>
                                    <span>Completed: {new Date(station.completed_at).toLocaleTimeString()}</span>
                                </div>
                            )}
                            {station.departed_at && (
                                <div className="flex items-center gap-2">
                                    <span className="w-4">🚗</span>
                                    <span>Departed: {new Date(station.departed_at).toLocaleTimeString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ),
                color: getStatusColor(station.status),
                useCircle: !isCurrentActiveStation,
                useSvgIcon: isCurrentActiveStation,
                svgIcon: isCurrentActiveStation ? <TruckIcon size={40} /> : undefined,
                radius: isCurrentActiveStation ? 80 : 8,
            };
        });
    });

    // Prepare route paths for selected schedule
    const routePath = selectedSchedule?.stations
        ?.sort((a, b) => a.order - b.order)
        .map(station => [station.latitude, station.longitude] as [number, number]) || [];

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    const refreshData = () => {
        fetch('/admin/monitoring/live-updates')
            .then(response => response.json())
            .then(data => {
                setSchedules(data.schedules);
                setLastUpdate(data.last_updated);
                
                // Update selected schedule if it exists in the new data
                if (selectedSchedule) {
                    const updatedSelectedSchedule = data.schedules.find((s: Schedule) => s.id === selectedSchedule.id);
                    if (updatedSelectedSchedule) {
                        setSelectedSchedule(updatedSelectedSchedule);
                    }
                }
            })
            .catch(error => console.error('Failed to fetch updates:', error));
    };

    return (
        <LayoutResident>
            <Head title="Collection Tracker" />
            <Title title='Collection Tracker' subtitle='Monitor all active waste collection routes' />
            <div className="bg-gray-50 rounded-lg">
                <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Map Section - Matching Collection Tracker Layout */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Schedule Selector Card */}
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Select Collection Route
                                        </label>
                                        <select
                                            value={selectedSchedule?.id || ''}
                                            onChange={(e) => {
                                                const schedule = schedules.find(s => s.id === parseInt(e.target.value));
                                                handleScheduleChange(schedule || null);
                                            }}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                        >
                                            <option value="">All Active Routes</option>
                                            {schedules.map(schedule => (
                                                <option key={schedule.id} value={schedule.id}>
                                                    {schedule.driver_name} • {schedule.route_name} • {schedule.status.replace('_', ' ')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Selected Schedule Overview */}
                                {selectedSchedule && (
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedSchedule.route_name}</h3>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <span>👨‍💼</span>
                                                        <span>{selectedSchedule.driver_name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span>📍</span>
                                                        <span>{selectedSchedule.stations.length} Stations</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span>🕒</span>
                                                        <span>Started: {selectedSchedule.started_at ? new Date(selectedSchedule.started_at).toLocaleTimeString() : 'Not started'}</span>
                                                    </div>
                                                    {getCurrentActiveStation(selectedSchedule) && (
                                                        <div className="flex items-center gap-1.5 text-blue-600 font-medium">
                                                            <TruckIcon size={24} />
                                                            <span>Current: {getCurrentActiveStation(selectedSchedule)?.name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <StatusBadge status={selectedSchedule.status} />
                                            </div>
                                        </div>

                                        {/* Progress Section */}
                                        <div className="mt-4">
                                            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                                                <span>Route Progress</span>
                                                <span>{selectedSchedule.progress_percentage}% Complete</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                                                    style={{ width: `${selectedSchedule.progress_percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Map Card */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <div className="p-4 border-b bg-gray-50">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <span>🗺️</span>
                                        Live Route Tracking
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <span className="inline-flex items-center gap-1 mr-3">
                                            <TruckIcon size={16} /> Current Station
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <div className="w-3 h-3 rounded-full bg-gray-500 mr-1"></div>
                                            Other Stations
                                        </span>
                                    </p>
                                </div>
                                <div className="p-2">
                                    <Map
                                        markers={mapMarkers}
                                        route={routePath}
                                        style={{ height: '400px', width: '100%' }}
                                        useRoutingMachine={true}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Active Collections & Stats */}
                        <div className="space-y-6">
                            {/* Active Collections Card */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <div className="p-4 border-b bg-gray-50">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <span>🚛</span>
                                        Active Collections
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">Currently running schedules</p>
                                </div>

                                <div className="p-4">
                                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                        {schedules.filter(s => s.status === 'in_progress').map(schedule => {
                                            const currentStation = getCurrentActiveStation(schedule);
                                            return (
                                                <div
                                                    key={schedule.id}
                                                    className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-200 ${selectedSchedule?.id === schedule.id
                                                            ? 'bg-blue-50 border-blue-500 shadow-md'
                                                            : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                                                        }`}
                                                    onClick={() => handleScheduleChange(schedule)}
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                                    <span className="text-blue-600 font-semibold text-sm">
                                                                        {schedule.driver_name.split(' ').map(n => n[0]).join('')}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900 text-sm">{schedule.driver_name}</h4>
                                                                    <p className="text-xs text-gray-600">{schedule.route_name}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <StatusBadge status={schedule.status} />
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="mb-3">
                                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                            <span>Progress</span>
                                                            <span>{schedule.progress_percentage}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${schedule.progress_percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    {/* Station Info */}
                                                    <div className="space-y-2 text-xs">
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <div className="text-blue-500">
                                                                <TruckIcon size={14} />
                                                            </div>
                                                            <span>Current: {currentStation?.name || 'Not started'}</span>
                                                        </div>
                                                        {schedule.started_at && (
                                                            <div className="text-gray-500">
                                                                🕒 Started: {new Date(schedule.started_at).toLocaleTimeString()}
                                                            </div>
                                                        )}
                                                        <div className="text-gray-400">
                                                            Updated {formatTimeAgo(schedule.last_updated)}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {schedules.filter(s => s.status === 'in_progress').length === 0 && (
                                            <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
                                                <div className="text-lg mb-2">No active collections</div>
                                                <div className="text-sm">All drivers have completed their routes</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Recently Completed Card */}
                            {schedules.filter(s => s.status === 'completed').length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                    <div className="p-4 border-b bg-gray-50">
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                                            <span>✅</span>
                                            Recently Completed
                                        </h3>
                                    </div>
                                    <div className="p-4">
                                        <div className="space-y-3 max-h-[200px] overflow-y-auto">
                                            {schedules.filter(s => s.status === 'completed').slice(0, 5).map(schedule => (
                                                <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-sm text-gray-900 truncate">{schedule.driver_name}</div>
                                                        <div className="text-xs text-gray-600 truncate">{schedule.route_name}</div>
                                                    </div>
                                                    <div className="text-xs text-gray-500 whitespace-nowrap">
                                                        {schedule.completed_at ? new Date(schedule.completed_at).toLocaleTimeString() : 'N/A'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </LayoutResident>
    );
}

export default Monitoring;