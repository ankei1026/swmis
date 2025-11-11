import React, { useState, useMemo, useEffect } from "react";
import Layout from '@/Pages/Layout/LayoutDriver';
import Title from '@/Pages/Components/Title';
import Map from '../Components/Map';
import { router } from '@inertiajs/react';

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
    date: string;
    time: string;
    status: 'pending' | 'in_progress' | 'success' | 'failed';
    route_name: string;
    stations: Station[];
    current_station: Station | null;
    progress_percentage: number;
}

interface Props {
    schedules: Schedule[];
}

// Custom SVG Location Icon Component
const LocationIcon: React.FC<{ size?: number }> = ({ size = 32 }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        width={size}
        height={size}
        style={{
            shapeRendering: 'geometricPrecision',
            textRendering: 'geometricPrecision',
            imageRendering: 'optimizeQuality',
            fillRule: 'evenodd',
            clipRule: 'evenodd'
        }}
        viewBox="0 0 6.827 6.827"
    >
        <g id="Layer_x0020_1">
            <path
                d="M4.304 2.189a.89.89 0 1 0-1.781 0 .89.89 0 0 0 1.78 0z"
                style={{ fill: '#64ffda' }}
            />
            <path
                style={{ fill: 'none' }}
                d="M0 0h6.827v6.827H0z"
            />
            <path
                style={{ fill: 'none' }}
                d="M.853.853h5.12v5.12H.853z"
            />
            <path
                d="M3.413.853c.776 0 1.405.585 1.405 1.305 0 .485-1.164 3.18-1.405 3.815-.17-.447-1.405-3.298-1.405-3.815 0-.72.63-1.305 1.405-1.305zm0 .446a.89.89 0 1 1 0 1.78.89.89 0 0 1 0-1.78z"
                style={{ fill: '#26a69a' }}
            />
        </g>
    </svg>
);

// Helper function outside component
const getStatusColor = (status: string) => {
    const colors = {
        pending: '#6B7280',
        arrived: '#3B82F6',
        collecting: '#8B5CF6',
        completed: '#10B981',
        departed: '#F59E0B',
        failed: '#EF4444',
    };
    return colors[status as keyof typeof colors] || '#6B7280';
};

// Status badge component with improved styling
// Status badge component with improved styling
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
            case 'success': return `${baseStyle} bg-green-100 text-green-800 border border-green-300`; // Added success case
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
            case 'success': return '🎯'; // Added success icon
            case 'in_progress': return '🚛';
            default: return '⏳';
        }
    };

    return (
        <span className={getBadgeStyle()}>
            <span className="mr-1.5">{getStatusIcon()}</span>
            {status.toUpperCase()}
        </span>
    );
};

// Status text component
const StatusText: React.FC<{ status: string }> = ({ status }) => {
    const getTextColor = () => {
        switch (status) {
            case 'pending': return 'text-gray-700';
            case 'arrived': return 'text-blue-700';
            case 'collecting': return 'text-purple-700';
            case 'completed': return 'text-green-700';
            case 'departed': return 'text-yellow-700';
            case 'failed': return 'text-red-700';
            case 'success': return 'text-green-700'; // Added success case
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

const CollectionTracker: React.FC<Props> = ({ schedules }) => {
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [currentAction, setCurrentAction] = useState<string>('');

    // Set first schedule as selected by default
    useEffect(() => {
        if (schedules.length > 0 && !selectedSchedule) {
            setSelectedSchedule(schedules[0]);
        }
    }, [schedules]);

    // Get current active station (the one that should show the location icon)
    const getCurrentActiveStation = useMemo(() => {
        if (!selectedSchedule || !selectedSchedule.stations) return null;

        const stations = selectedSchedule.stations.sort((a, b) => a.order - b.order);

        // Find stations in different states
        const arrivedStation = stations.find(station => station.status === 'arrived');
        const collectingStation = stations.find(station => station.status === 'collecting');
        const pendingStations = stations.filter(station => station.status === 'pending');

        // Priority: arrived > collecting > first pending
        if (arrivedStation) {
            return arrivedStation;
        }
        if (collectingStation) {
            return collectingStation;
        }
        if (pendingStations.length > 0) {
            return pendingStations[0]; // First pending station
        }

        // If all stations are completed/departed, return the last station
        const completedStations = stations.filter(station =>
            station.status === 'completed' || station.status === 'departed'
        );
        if (completedStations.length > 0) {
            return completedStations[completedStations.length - 1]; // Last completed station
        }

        return null;
    }, [selectedSchedule]);

    // Check if this is the last station
    const isLastStation = useMemo(() => {
        if (!selectedSchedule || !selectedSchedule.stations) return false;

        const stations = selectedSchedule.stations.sort((a, b) => a.order - b.order);
        const currentStation = getCurrentActiveStation;

        if (!currentStation) return false;

        // Check if this is the highest order station
        const maxOrder = Math.max(...stations.map(s => s.order));
        return currentStation.order === maxOrder;
    }, [selectedSchedule, getCurrentActiveStation]);

    const mapMarkers = useMemo(() => {
        if (!selectedSchedule || !selectedSchedule.stations) return [];

        const currentActiveStation = getCurrentActiveStation;

        return selectedSchedule.stations.map(station => {
            const isCurrentActiveStation = currentActiveStation?.id === station.id;

            return {
                id: station.id,
                position: [station.latitude, station.longitude] as [number, number],
                popup: (
                    <div className="p-3 min-w-[280px] bg-white rounded-lg shadow-lg border">
                        <div className="flex items-center gap-3 mb-2">
                            {isCurrentActiveStation ? (
                                <div className="text-teal-500">
                                    <LocationIcon size={20} />
                                </div>
                            ) : (
                                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{
                                    backgroundColor: getStatusColor(station.status)
                                }}></div>
                            )}
                            <div>
                                <strong className="text-sm font-semibold text-gray-900 block">{station.name}</strong>
                                {isCurrentActiveStation && (
                                    <span className="text-xs text-teal-600 font-medium">
                                        {isLastStation ? 'Final Station' : 'Current Location'}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <StatusBadge status={station.status} />
                        </div>
                        <div className="space-y-1.5 text-xs text-gray-600">
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
                color: isCurrentActiveStation ? '#26a69a' : getStatusColor(station.status),
                useCircle: !isCurrentActiveStation,
                useSvgIcon: isCurrentActiveStation,
                svgIcon: isCurrentActiveStation ? (
                    <LocationIcon size={28} />
                ) : undefined,
                radius: isCurrentActiveStation ? 8 : (station.status === 'arrived' || station.status === 'collecting' ? 12 : 8),
            };
        });
    }, [selectedSchedule, getCurrentActiveStation, isLastStation]);

    const routePath = useMemo(() => {
        if (!selectedSchedule || !selectedSchedule.stations) return [];

        return selectedSchedule.stations
            .sort((a, b) => a.order - b.order)
            .map(station => [station.latitude, station.longitude] as [number, number]);
    }, [selectedSchedule]);

    const handleStartSchedule = (scheduleId: number) => {
        setCurrentAction('starting');
        router.post(`/driver/schedules/${scheduleId}/start`, {}, {
            onFinish: () => {
                setCurrentAction('');
                router.reload();
            },
        });
    };

    const handleUpdateStationStatus = (scheduleId: number, stationId: number, status: string) => {
        setCurrentAction(`updating-${stationId}`);
        router.patch(`/driver/schedules/${scheduleId}/stations/${stationId}`, {
            status,
        }, {
            onFinish: () => {
                setCurrentAction('');
                router.reload();
            },
        });
    };

    const handleCompleteSchedule = (scheduleId: number) => {
        setCurrentAction('completing');
        router.post(`/driver/schedules/${scheduleId}/complete`, {}, {
            onFinish: () => {
                setCurrentAction('');
                router.reload();
            },
        });
    };

    const getNextAction = (station: Station) => {
        // Only show actions for the current active station
        const currentActiveStation = getCurrentActiveStation;
        if (!currentActiveStation || currentActiveStation.id !== station.id) {
            return null;
        }

        // If this is the last station and it's completed, show complete route instead of depart
        if (isLastStation && station.status === 'completed') {
            return {
                label: 'Complete Route',
                action: 'departed',
                icon: '🎯',
                color: 'green',
                isFinalAction: true
            };
        }

        switch (station.status) {
            case 'pending':
                return { label: 'Mark Arrived', action: 'arrived', icon: '📍', color: 'blue' };
            case 'arrived':
                return { label: 'Start Collecting', action: 'collecting', icon: '🔄', color: 'purple' };
            case 'collecting':
                return { label: 'Complete', action: 'completed', icon: '✅', color: 'green' };
            case 'completed':
                return { label: 'Depart', action: 'departed', icon: '🚗', color: 'yellow' };
            default:
                return null;
        }
    };

    const canStartSchedule = selectedSchedule?.status === 'pending';
    const canCompleteSchedule = selectedSchedule?.status === 'in_progress' &&
        selectedSchedule.stations.length > 0 &&
        selectedSchedule.stations.every(s => s.status === 'completed' || s.status === 'departed');

    // Filter for completed schedules
    const completedSchedules = schedules.filter(s => s.status === 'success'); // Changed from 'completed'

    // Calculate completion stats
    const completionStats = selectedSchedule ? {
        total: selectedSchedule.stations.length,
        completed: selectedSchedule.stations.filter(s => s.status === 'completed' || s.status === 'departed').length,
        pending: selectedSchedule.stations.filter(s => s.status === 'pending').length,
        inProgress: selectedSchedule.stations.filter(s => s.status === 'arrived' || s.status === 'collecting').length,
        currentStation: getCurrentActiveStation?.name || 'Not started',
        isLastStation: isLastStation,
    } : null;

    return (
        <Layout>
            <Title title="Collection Tracker" subtitle='Manage and track your waste collection routes' />
            <div className="bg-gray-50 mt-4">
                <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content - Map & Schedule Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Schedule Selector Card */}
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Select Collection Schedule
                                        </label>
                                        <select
                                            value={selectedSchedule?.id || ''}
                                            onChange={(e) => {
                                                const schedule = schedules.find(s => s.id === parseInt(e.target.value));
                                                setSelectedSchedule(schedule || null);
                                            }}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                        >
                                            <option value="">Choose a schedule to track...</option>
                                            {schedules.map(schedule => (
                                                <option key={schedule.id} value={schedule.id}>
                                                    {schedule.route_name} • {schedule.date} {schedule.time} • {schedule.status.replace('_', ' ')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedSchedule && (
                                        <div className="flex-shrink-0">
                                            <StatusBadge status={selectedSchedule.status} />
                                        </div>
                                    )}
                                </div>

                                {/* Schedule Overview */}
                                {selectedSchedule && (
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedSchedule.route_name}</h3>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <span>📅</span>
                                                        <span>{selectedSchedule.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span>🕒</span>
                                                        <span>{selectedSchedule.time}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span>📍</span>
                                                        <span>{selectedSchedule.stations.length} Stations</span>
                                                    </div>
                                                    {completionStats?.currentStation && (
                                                        <div className="flex items-center gap-1.5 text-teal-600 font-medium">
                                                            <LocationIcon size={16} />
                                                            <span>
                                                                {completionStats.isLastStation ? 'Final: ' : 'Current: '}
                                                                {completionStats.currentStation}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                {canStartSchedule && (
                                                    <button
                                                        onClick={() => handleStartSchedule(selectedSchedule.id)}
                                                        disabled={currentAction === 'starting'}
                                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                                                    >
                                                        {currentAction === 'starting' ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                Starting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>🚀</span>
                                                                Start Route
                                                            </>
                                                        )}
                                                    </button>
                                                )}

                                                {canCompleteSchedule && (
                                                    <button
                                                        onClick={() => handleCompleteSchedule(selectedSchedule.id)}
                                                        disabled={currentAction === 'completing'}
                                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg disabled:opacity-50 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                                                    >
                                                        {currentAction === 'completing' ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                Completing...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>🎯</span>
                                                                Complete Route
                                                            </>
                                                        )}
                                                    </button>
                                                )}
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
                                        Route Map
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">Real-time tracking of your collection route</p>
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

                        {/* Sidebar - Stations & Progress */}
                        <div className="space-y-6">
                            {/* Stats Overview Card */}
                            {selectedSchedule && completionStats && (
                                <div className="bg-white rounded-xl shadow-sm border p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <span>📊</span>
                                        Route Overview
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-3 rounded-lg border border-blue-200 bg-blue-50">
                                            <div className="text-2xl font-bold text-blue-600">{completionStats.total}</div>
                                            <div className="text-sm text-blue-600 font-medium">Total Stations</div>
                                        </div>
                                        <div className="text-center p-3 rounded-lg border border-green-200 bg-green-50">
                                            <div className="text-2xl font-bold text-green-600">{completionStats.completed}</div>
                                            <div className="text-sm text-green-600 font-medium">Completed</div>
                                        </div>
                                        <div className="text-center p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                                            <div className="text-2xl font-bold text-yellow-600">{completionStats.inProgress}</div>
                                            <div className="text-sm text-yellow-600 font-medium">In Progress</div>
                                        </div>
                                        <div className="text-center p-3 rounded-lg border border-gray-200 bg-gray-50">
                                            <div className="text-2xl font-bold text-gray-600">{completionStats.pending}</div>
                                            <div className="text-sm text-gray-600 font-medium">Pending</div>
                                        </div>
                                    </div>
                                    {completionStats.currentStation && (
                                        <div className={`mt-4 p-3 rounded-lg border ${completionStats.isLastStation
                                            ? 'bg-green-50 border-green-200'
                                            : 'bg-teal-50 border-teal-200'
                                            }`}>
                                            <div className="flex items-center gap-2 text-teal-700">
                                                <LocationIcon size={18} />
                                                <div>
                                                    <div className="text-sm font-semibold">
                                                        {completionStats.isLastStation ? 'Final Station' : 'Current Station'}
                                                    </div>
                                                    <div className="text-xs">{completionStats.currentStation}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Stations List Card */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <div className="p-4 border-b bg-gray-50">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <span>📍</span>
                                        Station Progress
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">Update station status as you progress</p>
                                </div>

                                <div className="p-4">
                                    {selectedSchedule ? (
                                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                            {selectedSchedule.stations
                                                .sort((a, b) => a.order - b.order)
                                                .map((station) => {
                                                    const nextAction = getNextAction(station);
                                                    const borderColor = getStatusColor(station.status);
                                                    const isCurrentActive = getCurrentActiveStation?.id === station.id;
                                                    const isStationLast = station.order === Math.max(...selectedSchedule.stations.map(s => s.order));

                                                    return (
                                                        <div
                                                            key={station.id}
                                                            className={`bg-white p-4 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all duration-200 ${isCurrentActive ? 'ring-2 ring-teal-500 ring-opacity-50' : ''
                                                                }`}
                                                            style={{ borderLeftColor: borderColor }}
                                                        >
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="flex items-start gap-3 flex-1">
                                                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border mt-0.5 relative ${isCurrentActive
                                                                        ? 'bg-teal-100 text-teal-700 border-teal-300'
                                                                        : 'bg-gray-100 text-gray-700 border-gray-300'
                                                                        }`}>
                                                                        {station.order + 1}
                                                                        {isCurrentActive && (
                                                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full animate-ping"></div>
                                                                        )}
                                                                        {isStationLast && (
                                                                            <div className="absolute -bottom-1 -right-1 text-xs">🏁</div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                                                                                {station.name}
                                                                            </h4>
                                                                            {isCurrentActive && (
                                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                                                                    <LocationIcon size={12} />
                                                                                    {isLastStation ? 'Final' : 'Current'}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="mb-2">
                                                                            <StatusBadge status={station.status} />
                                                                        </div>

                                                                        <div className="space-y-1 text-xs text-gray-500">
                                                                            {station.arrived_at && (
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <span>🟢</span>
                                                                                    <span>Arrived: {new Date(station.arrived_at).toLocaleTimeString()}</span>
                                                                                </div>
                                                                            )}
                                                                            {station.completed_at && (
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <span>✅</span>
                                                                                    <span>Completed: {new Date(station.completed_at).toLocaleTimeString()}</span>
                                                                                </div>
                                                                            )}
                                                                            {station.departed_at && (
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <span>🚗</span>
                                                                                    <span>Departed: {new Date(station.departed_at).toLocaleTimeString()}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {nextAction && (
                                                                    <button
                                                                        onClick={() => handleUpdateStationStatus(
                                                                            selectedSchedule.id,
                                                                            station.id,
                                                                            nextAction.action
                                                                        )}
                                                                        disabled={currentAction === `updating-${station.id}`}
                                                                        className={`flex items-center gap-1.5 ${nextAction.isFinalAction
                                                                            ? 'bg-green-600 hover:bg-green-700'
                                                                            : `bg-${nextAction.color}-500 hover:bg-${nextAction.color}-600`
                                                                            } text-white px-3 py-2 rounded-lg text-xs font-semibold disabled:opacity-50 transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-md flex-shrink-0`}
                                                                    >
                                                                        {currentAction === `updating-${station.id}` ? (
                                                                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                        ) : (
                                                                            <>
                                                                                <span>{nextAction.icon}</span>
                                                                                <span>{nextAction.label}</span>
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                                            <div className="text-gray-400 text-4xl mb-3">🗺️</div>
                                            <div className="text-gray-500 font-medium mb-1">No Schedule Selected</div>
                                            <div className="text-gray-400 text-sm">Choose a schedule to view station progress</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CollectionTracker;