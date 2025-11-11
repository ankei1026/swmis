import Layout from '@/Pages/Layout/Layout';
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

// SVG Location Icon Component
const LocationIcon: React.FC<{ color?: string, size?: number }> = ({ color = "#EF4444", size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
            fill={color}
        />
    </svg>
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

// Status text component - Matching Collection Tracker
const StatusText: React.FC<{ status: string }> = ({ status }) => {
    const getTextColor = () => {
        switch (status) {
            case 'pending': return 'text-gray-700';
            case 'arrived': return 'text-blue-700';
            case 'collecting': return 'text-purple-700';
            case 'completed': return 'text-green-700';
            case 'departed': return 'text-yellow-700';
            case 'failed': return 'text-red-700';
            case 'in_progress': return 'text-yellow-700';
            default: return 'text-gray-700';
        }
    };

    return (
        <span className={`${getTextColor()} font-semibold`}>
            {status.replace('_', ' ').toUpperCase()}
        </span>
    );
};

// Helper function for status colors
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

    // Auto-refresh data every 30 seconds
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            fetch('/admin/monitoring/live-updates')
                .then(response => response.json())
                .then(data => {
                    setSchedules(data.schedules);
                    setLastUpdate(data.last_updated);
                })
                .catch(error => console.error('Failed to fetch updates:', error));
        }, 30000);

        return () => clearInterval(interval);
    }, [autoRefresh]);

    // Set first schedule as selected by default
    useEffect(() => {
        if (schedules.length > 0 && !selectedSchedule) {
            setSelectedSchedule(schedules[0]);
        }
    }, [schedules]);

    // Prepare map markers for all active schedules with SVG icons for current stations
    const mapMarkers = schedules.flatMap(schedule => {
        if (!schedule.stations) return [];

        return schedule.stations.map(station => {
            const isCurrentStation = schedule.current_station === station.name;

            return {
                id: `${schedule.id}-${station.id}`,
                position: [station.latitude, station.longitude] as [number, number],
                popup: (
                    <div className="p-3 min-w-[280px] bg-white rounded-lg shadow-lg border">
                        <div className="flex items-center gap-3 mb-2">
                            {isCurrentStation ? (
                                <div className="text-red-500">
                                    <LocationIcon size={20} />
                                </div>
                            ) : (
                                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{
                                    backgroundColor: getStatusColor(station.status)
                                }}></div>
                            )}
                            <div>
                                <strong className="text-sm font-semibold text-gray-900 block">{station.name}</strong>
                                {isCurrentStation && (
                                    <span className="text-xs text-red-600 font-medium">Current Location</span>
                                )}
                            </div>
                        </div>
                        <div className="text-xs space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Driver:</span>
                                <span className="font-medium">{schedule.driver_name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Route:</span>
                                <span className="font-medium">{schedule.route_name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Status:</span>
                                <StatusBadge status={station.status} />
                            </div>
                            {station.arrived_at && (
                                <div className="flex items-center gap-2 text-green-600">
                                    <span>🟢</span>
                                    <span>Arrived: {new Date(station.arrived_at).toLocaleTimeString()}</span>
                                </div>
                            )}
                            {station.completed_at && (
                                <div className="flex items-center gap-2 text-blue-600">
                                    <span>✅</span>
                                    <span>Completed: {new Date(station.completed_at).toLocaleTimeString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ),
                color: isCurrentStation ? '#EF4444' : getStatusColor(station.status),
                useCircle: !isCurrentStation,
                useSvgIcon: isCurrentStation,
                svgIcon: isCurrentStation ? (
                    <LocationIcon color="#EF4444" size={32} />
                ) : undefined,
                radius: isCurrentStation ? 8 : (station.status === 'arrived' || station.status === 'collecting' ? 10 : 6),
            };
        });
    });

    // Prepare route paths for selected schedule
    const routePath = selectedSchedule?.stations
        ?.sort((a, b) => a.order - b.order)
        .map(station => [station.latitude, station.longitude] as [number, number]) || [];

    // Calculate statistics
    const stats = {
        totalActive: schedules.filter(s => s.status === 'in_progress').length,
        totalCompleted: schedules.filter(s => s.status === 'completed').length,
        totalDrivers: drivers.length,
        activeDrivers: drivers.filter(d => d.status === 'active').length,
        totalStations: schedules.reduce((acc, schedule) => acc + (schedule.stations?.length || 0), 0),
        completedStations: schedules.reduce((acc, schedule) =>
            acc + (schedule.stations?.filter(s => s.status === 'completed').length || 0), 0
        ),
    };

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
            })
            .catch(error => console.error('Failed to fetch updates:', error));
    };

    return (
        <Layout>
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
                                                setSelectedSchedule(schedule || null);
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
                                    <p className="text-sm text-gray-600 mt-1">Real-time monitoring of collection routes</p>
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
                                        {schedules.filter(s => s.status === 'in_progress').map(schedule => (
                                            <div
                                                key={schedule.id}
                                                className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-200 ${selectedSchedule?.id === schedule.id
                                                        ? 'bg-blue-50 border-blue-500 shadow-md'
                                                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                                                    }`}
                                                onClick={() => setSelectedSchedule(schedule)}
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
                                                        <div className="text-red-500">
                                                            <LocationIcon size={14} />
                                                        </div>
                                                        <span>Current: {schedule.current_station}</span>
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
                                        ))}

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
        </Layout>
    );
}

export default Monitoring;