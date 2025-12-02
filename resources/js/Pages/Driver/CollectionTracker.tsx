import React, { useState, useMemo, useEffect } from "react";
import { toast } from 'sonner';
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

// Custom Truck Icon using your SVG
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
            <path d="M36.675 75.741h15.092a7.541 7.541 0 0 0-7.546 7.547 7.546 7.546 0 0 0-7.546-7.547zM79.262 75.741v7.547H59.314a7.547 7.547 0 0 0-7.547-7.547z" fill="#3e8f93" />
            <path d="M94.267 83.288a1.969 1.969 0 1 1-1.969-1.97 1.97 1.97 0 0 1 1.969 1.97z" fill="#fff8e3" />
            <circle cx="51.767" cy="83.288" r="1.969" fill="#fff8e3" />
            <path d="M38.644 83.288a1.969 1.969 0 1 1-1.969-1.97 1.969 1.969 0 0 1 1.969 1.97z" fill="#fff8e3" />
            <path d="M108.677 80.7H106.1a1.75 1.75 0 0 1 0-3.5h2.574a1.75 1.75 0 0 1 0 3.5zM113.541 92.584H14.459a1.75 1.75 0 0 1 0-3.5h99.082a1.75 1.75 0 0 1 0 3.5zM111.847 85.037h-2.575a1.75 1.75 0 0 1 0-3.5h2.575a1.75 1.75 0 1 1 0 3.5zM18.728 85.037h-2.575a1.75 1.75 0 1 1 0-3.5h2.575a1.75 1.75 0 1 1 0 3.5z" fill="#2d1f5e" />
        </svg>
    </div>
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

// Format schedule date to 'December 12, 2025' format
const formatScheduleDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (e) {
        return dateString;
    }
};

// Status badge component
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
            case 'success': return `${baseStyle} bg-green-100 text-green-800 border border-green-300`;
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
            case 'success': return '🎯';
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

const CollectionTracker: React.FC<Props> = ({ schedules }) => {
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [currentAction, setCurrentAction] = useState<string>('');

    // Listen for real-time schedule completion
    useEffect(() => {
        const echo = (window as any).Echo;
        if (!echo || !selectedSchedule) return;

        const channel = echo.channel(`driver.${selectedSchedule.id}`);
        const handleScheduleUpdate = (payload: any) => {
            if (payload && payload.id === selectedSchedule.id && (payload.status === 'success' || payload.status === 'completed')) {
                toast.success('Route completed!');
                setRouteCompleted(true);
                setSelectedSchedule(null);
            }
        };
        channel.listen('schedule.updated', handleScheduleUpdate);
        channel.listen('.schedule.updated', handleScheduleUpdate);
        return () => {
            channel.stopListening('schedule.updated', handleScheduleUpdate);
            channel.stopListening('.schedule.updated', handleScheduleUpdate);
            channel.unsubscribe();
        };
    }, [selectedSchedule]);

    // Set selected schedule from localStorage or default to first schedule
    useEffect(() => {
        if (schedules.length > 0) {
            // Try to get the last selected schedule from localStorage
            const savedScheduleId = localStorage.getItem('selectedScheduleId');
            
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
            localStorage.setItem('selectedScheduleId', selectedSchedule.id.toString());
        }
    }, [selectedSchedule]);

    // Get current active station
    const getCurrentActiveStation = useMemo(() => {
        if (!selectedSchedule || !selectedSchedule.stations) return null;

        const stations = selectedSchedule.stations.sort((a, b) => a.order - b.order);
        
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
    }, [selectedSchedule]);

    // Check if this is the last station
    const isLastStation = useMemo(() => {
        if (!selectedSchedule || !selectedSchedule.stations) return false;
        const stations = selectedSchedule.stations.sort((a, b) => a.order - b.order);
        const currentStation = getCurrentActiveStation;
        if (!currentStation) return false;
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
                // Show toast for station updates so driver gets immediate feedback
                if (status === 'completed') {
                    try {
                        const stations = selectedSchedule?.stations || [];
                        const station = stations.find(s => s.id === stationId);
                        const maxOrder = stations.length ? Math.max(...stations.map(s => s.order)) : -1;
                        const isLast = station ? station.order === maxOrder : false;
                        if (isLast) {
                            toast.success('Final station collection completed. Tap Complete Route to finish.');
                        } else {
                            toast.success('Station collection completed.');
                        }
                    } catch (e) {
                        toast.success('Station updated.');
                    }
                } else {
                    toast.success('Station status updated.');
                }

                // Refresh data to reflect server state. Consider local state updates for smoother UX.
                router.reload();
            },
        });
    };

    const [routeCompleted, setRouteCompleted] = useState(false);
    const handleCompleteSchedule = (scheduleId: number) => {
        setCurrentAction('completing');
        router.post(`/driver/schedules/${scheduleId}/complete`, {}, {
            onFinish: () => {
                setCurrentAction('');
                // Immediate feedback for drivers
                toast.success('Route completed!');
                setRouteCompleted(true);
                setSelectedSchedule(null);
            },
        });
    };

    const handleScheduleChange = (schedule: Schedule | null) => {
        setSelectedSchedule(schedule);
        // The useEffect above will automatically save to localStorage
    };

    const getNextAction = (station: Station) => {
        const currentActiveStation = getCurrentActiveStation;
        
        // Only show actions for the current active station
        if (!currentActiveStation || currentActiveStation.id !== station.id) {
            return null;
        }

        // Special case for last station
        if (isLastStation && station.status === 'completed') {
            return {
                label: 'Complete Route',
                action: 'departed',
                icon: '🎯',
                color: 'green',
                isFinalAction: true
            };
        }

        // Normal flow - must go through each status sequentially
        switch (station.status) {
            case 'pending':
                return { 
                    label: 'Mark Arrived', 
                    action: 'arrived', 
                    icon: '📍', 
                    color: 'blue' 
                };
            case 'arrived':
                return { 
                    label: 'Start Collecting', 
                    action: 'collecting', 
                    icon: '🔄', 
                    color: 'purple' 
                };
            case 'collecting':
                return { 
                    label: 'Complete Collection', 
                    action: 'completed', 
                    icon: '✅', 
                    color: 'green' 
                };
            case 'completed':
                // Only show "Depart" if this isn't the last station
                if (!isLastStation) {
                    return { 
                        label: 'Depart to Next', 
                        action: 'departed', 
                        icon: '🚗', 
                        color: 'yellow' 
                    };
                }
                return null;
            case 'departed':
                // After departing, the next station should automatically become active
                return null;
            default:
                return null;
        }
    };

    const canStartSchedule = selectedSchedule?.status === 'pending';
    const canCompleteSchedule = selectedSchedule?.status === 'in_progress' &&
        selectedSchedule.stations.length > 0 &&
        selectedSchedule.stations.every(s => s.status === 'completed' || s.status === 'departed');

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
                                {routeCompleted ? (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <div className="text-5xl mb-4">🎉</div>
                                        <div className="text-2xl font-bold text-green-700 mb-2">Route Completed!</div>
                                        <div className="text-gray-600 mb-4">You have finished all stations for this route.</div>
                                        <button
                                            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700"
                                            onClick={() => { setRouteCompleted(false); setSelectedSchedule(null); }}
                                        >Back to Schedules</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                            <div className="flex-1">
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Select Collection Schedule
                                                </label>
                                                <select
                                                    value={selectedSchedule?.id || ''}
                                                    onChange={(e) => {
                                                        const schedule = schedules.find(s => s.id === parseInt(e.target.value));
                                                        handleScheduleChange(schedule || null);
                                                    }}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                                >
                                                    <option value="">Choose a schedule to track...</option>
                                                    {schedules.map(schedule => (
                                                        <option key={schedule.id} value={schedule.id}>
                                                            {schedule.route_name} • {formatScheduleDate(schedule.date)} {schedule.time} • {schedule.status.replace('_', ' ')}
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

                                        {selectedSchedule && (
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedSchedule.route_name}</h3>
                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                            <div className="flex items-center gap-1.5">
                                                                <span>📅</span>
                                                                <span>{formatScheduleDate(selectedSchedule.date)}</span>
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
                                                                <div className="flex items-center gap-1.5 text-blue-600 font-medium">
                                                                    <TruckIcon size={24} />
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
                                    </>
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
                                            : 'bg-blue-50 border-blue-200'
                                            }`}>
                                            <div className="flex items-center gap-2 text-blue-700">
                                                <TruckIcon size={16} />
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
                                                            className={`bg-white p-4 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all duration-200 ${isCurrentActive ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                                                                }`}
                                                            style={{ borderLeftColor: borderColor }}
                                                        >
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="flex items-start gap-3 flex-1">
                                                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border mt-0.5 relative ${isCurrentActive
                                                                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                                                                        : 'bg-gray-100 text-gray-700 border-gray-300'
                                                                        }`}>
                                                                        {station.order + 1}
                                                                        {isCurrentActive && (
                                                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
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
                                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                                    <TruckIcon size={10} />
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
                                                                        onClick={() => {
                                                                            if (nextAction.isFinalAction) {
                                                                                // Final action should finish the schedule, not just update the station
                                                                                handleCompleteSchedule(selectedSchedule.id);
                                                                            } else {
                                                                                handleUpdateStationStatus(
                                                                                    selectedSchedule.id,
                                                                                    station.id,
                                                                                    nextAction.action
                                                                                );
                                                                            }
                                                                        }}
                                                                        disabled={currentAction.includes(`updating-${station.id}`)}
                                                                        className={`flex items-center gap-1.5 ${nextAction.isFinalAction
                                                                                ? 'bg-green-600 hover:bg-green-700'
                                                                                : nextAction.color === 'blue'
                                                                                    ? 'bg-blue-500 hover:bg-blue-600'
                                                                                    : nextAction.color === 'purple'
                                                                                        ? 'bg-purple-500 hover:bg-purple-600'
                                                                                        : nextAction.color === 'green'
                                                                                            ? 'bg-green-500 hover:bg-green-600'
                                                                                            : 'bg-yellow-500 hover:bg-yellow-600'
                                                                            } text-white px-3 py-2 rounded-lg text-xs font-semibold disabled:opacity-50 transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-md flex-shrink-0`}
                                                                    >
                                                                        {currentAction === `updating-${station.id}` ? (
                                                                            <>
                                                                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                                <span>Updating...</span>
                                                                            </>
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