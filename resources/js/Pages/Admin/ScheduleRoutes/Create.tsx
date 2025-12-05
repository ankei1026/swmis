import Layout from '@/Pages/Layout/Layout';
import Title from '@/Pages/Components/Title';
import { usePage, useForm, Head } from '@inertiajs/react';
import { Button, MenuItem, Select, FormControl } from '@mui/material';
import { toast } from "sonner";
import Map from '@/Pages/Components/Map';
import { useState, useEffect } from 'react';
import FormInputField from '@/Pages/Components/FormInputField';
import FormLabel from '@/Pages/Components/FormLabel';
import FormInput from '@/Pages/Components/FormInput';
import RoutingMachine from '@/Pages/Components/RoutingMachine'; // Adjust path as needed
import L from 'leaflet';

const ScheduleRouteCreate = () => {
    const { props }: any = usePage();
    const stationroutes = props.stationroutes || [];
    const drivers = props.drivers || [];

    const { data, setData, post, processing, errors, reset } = useForm({
        route_name: '',
        station_order: [] as number[],
        driver_id: '',
    });

    const [selected, setSelected] = useState<number[]>([]);

    const handleStationClick = (stationId: number) => {
        if (!selected.includes(stationId)) {
            const updated = [...selected, stationId];
            setSelected(updated);
            setData('station_order', updated);
        }
    };

    const removeStation = (stationId: number) => {
        const updated = selected.filter(id => id !== stationId);
        setSelected(updated);
        setData('station_order', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.station_order.length < 2) {
            toast.error("Select at least two station routes to make a route");
            return;
        }

        if (!data.driver_id) {
            toast.error("Please select a driver");
            return;
        }

        post(route('admin.scheduleroute.store'), {
            onSuccess: () => {
                toast.success("Route created successfully!");
                reset();
                setSelected([]);
            },
            onError: () => {
                toast.error("Failed to create route");
            }
        });
    };

    const getSelectedStationName = (id: number) => {
        const station = stationroutes.find((b: any) => b.id === id);
        return station ? station.name : 'Unknown Station';
    };

    // Convert selected stations to waypoints for routing
    const waypoints = selected.map(id => {
        const station = stationroutes.find((b: any) => b.id === id);
        return station ? L.latLng(station.latitude, station.longitude) : null;
    }).filter(Boolean) as L.LatLng[];

    return (
        <Layout>
            <Title title="Create Schedule Route" />
            <Head title='Create Schedule Route'/>
            <div className="w-full bg-gray-100 p-6 rounded-lg">
                <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                                <FormInputField>
                                    <FormLabel htmlFor="route_name" textLabel="Route Name" />
                                    <FormInput
                                        id="route_name"
                                        type="text"
                                        placeholder="Example: Team A"
                                        value={data.route_name}
                                        onChange={(e) => setData('route_name', e.target.value)}
                                        message={errors.route_name}
                                        required
                                        className="w-full"
                                    />
                                </FormInputField>

                                {/* Driver Selection Field */}
                                <FormInputField>
                                    <FormLabel htmlFor="driver_id" textLabel="Assign Driver" />
                                    <FormControl fullWidth size="small">
                                        <Select
                                            id="driver_id"
                                            value={data.driver_id}
                                            onChange={(e) => setData('driver_id', e.target.value)}
                                            displayEmpty
                                            error={!!errors.driver_id}
                                            color="success"
                                        >
                                            <MenuItem value="">
                                                <em>Select a driver</em>
                                            </MenuItem>
                                            {drivers.map((driver: any) => (
                                                <MenuItem key={driver.id} value={driver.id}>
                                                    {driver.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {errors.driver_id && (
                                        <p className="text-red-500 text-xs mt-1">{errors.driver_id}</p>
                                    )}
                                </FormInputField>
                            </div>

                            {/* Selected Stations Display */}
                            {selected.length > 0 && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-blue-800 mb-2">Selected Route Stations ({selected.length})</h3>
                                    <div className="space-y-2">
                                        {selected.map((stationId, index) => (
                                            <div key={stationId} className="flex items-center justify-between bg-white p-3 rounded border border-blue-200">
                                                <div className="flex items-center space-x-3">
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                                                        {index + 1}
                                                    </span>
                                                    <span className="font-medium text-gray-700">
                                                        {getSelectedStationName(stationId)}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeStation(stationId)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-blue-600 mt-2">
                                        Click on stations in the map to add them to your route in order
                                    </p>
                                </div>
                            )}

                            <p className='text-sm text-gray-600'>
                                Click on stations in the map to connect them and create your route. The blue line shows the actual driving route.
                            </p>

                            <div style={{ height: 500, position: 'relative' }}>
                                <Map
                                    markers={stationroutes.map((b: any) => ({
                                        id: b.id,
                                        position: [b.latitude, b.longitude] as [number, number],
                                        popup: (
                                            <div className="text-center">
                                                <strong>{b.name}</strong>
                                                <br />
                                                <span className="text-xs text-gray-500">
                                                    {selected.includes(b.id) ? '✓ Added to route' : 'Click to add'}
                                                </span>
                                            </div>
                                        ),
                                        color: selected.includes(b.id) ? '#16a34a' : '#2563eb',
                                        useCircle: true,
                                        radius: selected.includes(b.id) ? 10 : 6,
                                    }))}
                                    
                                    onClick={({ lat, lng }) => {
                                        const nearest = stationroutes.find(
                                            (b: any) =>
                                                Math.abs(b.latitude - lat) < 0.001 &&
                                                Math.abs(b.longitude - lng) < 0.001
                                        );
                                        if (nearest) handleStationClick(nearest.id);
                                    }}
                                    style={{ height: '100%' }}
                                >
                                    {/* Add Routing Machine component when we have 2+ waypoints */}
                                    {waypoints.length >= 2 && (
                                        <RoutingMachine waypoints={waypoints} />
                                    )}
                                </Map>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button
                                type="submit"
                                variant="contained"
                                color='success'
                                disabled={processing}
                                size="large"
                            >
                                {processing ? 'Creating Route...' : 'Create Route'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default ScheduleRouteCreate;