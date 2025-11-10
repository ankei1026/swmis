import { Button as ShadButton } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import FormInput from '@/Pages/Components/FormInput';
import FormInputField from '@/Pages/Components/FormInputField';
import FormLabel from '@/Pages/Components/FormLabel';
import Title from '@/Pages/Components/Title';
import Layout from '@/Pages/Layout/Layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button, MenuItem, Select } from '@mui/material';
import { ChevronDownIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import Map, { MapMarker, MANGAGOY_CENTER } from '@/Pages/Components/Map';
import RoutingMachine from '@/Pages/Components/RoutingMachine';
import { toast } from 'sonner';

interface StationRoute {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

interface ScheduleRoute {
    id: number;
    route_name: string;
    driver_id: number;
    driver_name: string;
    station_names: string;
    station_routes: StationRoute[];
}

interface PageProps {
    scheduleRoutes: ScheduleRoute[];
    flash?: {
        success?: string;
        error?: string;
    };
}



const SchedulingCreate = () => {
    const { scheduleRoutes, flash } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        date: '',
        time: '08:00',
        schedule_route_id: '',
        status: '',
        type: '',
    });

    const [open, setOpen] = useState(false);

    // Show flash messages as toasts
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
            reset(); // Reset form on success
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash, reset]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.scheduling.store'), {
            onSuccess: () => {
                // The success toast will be handled by the flash message useEffect
            },
            onError: () => {
                toast.error('Failed to create schedule. Please check the form for errors.');
            }
        });
    };

    // Format time for display and submission
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeValue = e.target.value;
        setData('time', timeValue);
    };

    // Get the selected route details for display
    const selectedRoute = scheduleRoutes.find(route => route.id === parseInt(data.schedule_route_id));

    // Create markers for the selected route
    const markers: MapMarker[] = selectedRoute?.station_routes?.map((station, index) => ({
        id: `${station.id}-${index}`,
        position: [station.latitude, station.longitude],
        popup: (
            <div className="text-sm">
                <strong>{station.name}</strong>
                <br />
                <span className="text-xs text-gray-500">
                    Station {index + 1} of {selectedRoute.station_routes.length}
                </span>
                <br />
                Lat: {station.latitude.toFixed(6)}, Lng: {station.longitude.toFixed(6)}
            </div>
        ),
        color: '#3b82f6', // Blue color for markers
        useCircle: true,
        radius: 8,
    })) || [];

    // Create route waypoints for RoutingMachine
    const routeWaypoints = selectedRoute?.station_routes?.map(station =>
        L.latLng(station.latitude, station.longitude)
    ) || [];

    // Calculate map center based on selected route or use default
    const mapCenter = selectedRoute?.station_routes?.length > 0
        ? [
            selectedRoute.station_routes[0].latitude,
            selectedRoute.station_routes[0].longitude
        ]
        : MANGAGOY_CENTER;

    return (
        <Layout>
            <Head title="Create ● New Schedule" />
            <Title title="Create New Schedule" />

            <div className='w-full bg-gray-100 py-6 rounded-lg'>
                <div className="flex flex-col gap-6 px-6">
                    {/* Form Section - Full width */}
                    <div className="w-full">
                        <form onSubmit={handleSubmit} className="rounded-md border border-gray-300 bg-white p-6 max-w-2xl mx-auto">
                            {/* 📅 Date & Time Picker */}
                            <div className="mb-4 flex gap-4">
                                <div className="flex w-1/2 flex-col gap-3">
                                    <FormLabel htmlFor="date-picker" textLabel="Date" />
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <ShadButton variant="outline" id="date-picker" className="justify-between font-normal">
                                                {data.date || 'Select date'}
                                                <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                                            </ShadButton>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={data.date ? new Date(data.date) : undefined}
                                                onSelect={(selectedDate) => {
                                                    if (selectedDate) {
                                                        setData('date', selectedDate.toISOString().split('T')[0]);
                                                        setOpen(false);
                                                    }
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                                </div>

                                <div className="flex w-1/2 flex-col gap-3">
                                    <FormLabel htmlFor="time-picker" textLabel="Time" />
                                    <Input
                                        type="time"
                                        id="time-picker"
                                        defaultValue={data.time}
                                        step="1"
                                        onChange={handleTimeChange}
                                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                        required
                                    />
                                    {errors.time && (
                                        <p className="text-sm text-red-500">
                                            {errors.time.includes('H:i')
                                                ? 'Please select a valid time'
                                                : errors.time
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* 🛣 Route Selection */}
                            <FormInputField>
                                <FormLabel htmlFor="schedule_route_id" textLabel="Route" />
                                <Select
                                    id="schedule_route_id"
                                    value={data.schedule_route_id}
                                    onChange={(e) => setData('schedule_route_id', e.target.value)}
                                    displayEmpty
                                    fullWidth
                                    size="small"
                                    required
                                >
                                    <MenuItem value="">
                                        <em>Select Route</em>
                                    </MenuItem>
                                    {scheduleRoutes.map((route) => (
                                        <MenuItem key={route.id} value={route.id}>
                                            {route.route_name}
                                            {route.station_names && ` (${route.station_names})`}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.schedule_route_id && <p className="mt-1 text-sm text-red-500">{errors.schedule_route_id}</p>}

                                {/* Display selected route details */}
                                {selectedRoute && (
                                    <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                                        <h4 className="font-semibold text-blue-800 mb-2">Route Details:</h4>
                                        <div className="grid grid-cols-1 gap-2 text-sm">
                                            <p><strong>Route Name:</strong> {selectedRoute.route_name}</p>
                                            <p><strong>Assigned Driver:</strong> {selectedRoute.driver_name}</p>
                                            <p><strong>Stations:</strong> {selectedRoute.station_names}</p>
                                            <p><strong>Number of Stations:</strong> {selectedRoute.station_routes?.length || 0}</p>
                                        </div>
                                    </div>
                                )}
                            </FormInputField>

                            {/* ♻️ Type (Biodegradable / Non-Biodegradable) */}
                            <FormInputField>
                                <FormLabel htmlFor="type" textLabel="Type" />
                                <Select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    displayEmpty
                                    fullWidth
                                    size="small"
                                    required
                                >
                                    <MenuItem value="">
                                        <em>Select Type</em>
                                    </MenuItem>
                                    <MenuItem value="Biodegradable (Malata)">Biodegradable (Malata)</MenuItem>
                                    <MenuItem value="Non-Biodegradable (Di-Malata)">Non-Biodegradable (Di-Malata)</MenuItem>
                                </Select>
                                {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                            </FormInputField>

                            {/* ⚙️ Status */}
                            <FormInputField>
                                <FormLabel htmlFor="status" textLabel="Status" />
                                <Select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    displayEmpty
                                    fullWidth
                                    size="small"
                                    required
                                >
                                    <MenuItem value="">
                                        <em>Select Status</em>
                                    </MenuItem>
                                    <MenuItem value="Success">Success</MenuItem>
                                    <MenuItem value="Failed">Failed</MenuItem>
                                    <MenuItem value="Pending">Pending</MenuItem>
                                </Select>
                                {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
                            </FormInputField>

                            {/* 💾 Submit */}
                            <div className="mt-6 flex justify-end">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    disabled={processing}
                                >
                                    {processing ? 'Saving...' : 'Create Schedule'}
                                </Button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>

            <div className='w-full bg-gray-100 py-6 rounded-lg mt-4'>
                <div className="flex flex-col gap-6 px-6">
                    {/* Map Section - Full width at the bottom */}
                    <div className="w-full">
                        <div className="rounded-md border border-gray-300 bg-white p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {selectedRoute ? `Route Map: ${selectedRoute.route_name}` : 'Route Map Preview'}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                {selectedRoute
                                    ? `Viewing ${selectedRoute.station_routes?.length || 0} stations along the route`
                                    : 'Select a route above to view its path on the map'
                                }
                            </p>

                            <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200">
                                <Map
                                    center={mapCenter}
                                    zoom={selectedRoute ? 13 : 12}
                                    markers={markers}
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    {/* Add RoutingMachine if there are waypoints */}
                                    {routeWaypoints.length > 1 && (
                                        <RoutingMachine
                                            waypoints={routeWaypoints}
                                            color="#3b82f6"
                                            weight={4}
                                        />
                                    )}
                                </Map>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SchedulingCreate;