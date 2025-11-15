import Layout from '@/Pages/Layout/LayoutDriver';
import Title from '@/Pages/Components/Title';
import Map from '@/Pages/Components/Map';
import FormInputField from '@/Pages/Components/FormInputField';
import FormLabel from '@/Pages/Components/FormLabel';
import FormInput from '@/Pages/Components/FormInput';
import { Head, useForm, PageProps } from '@inertiajs/react';
import { toast } from "sonner"
import { Button } from '@mui/material';

interface StationRoute {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

interface Props extends PageProps {
    stationroute: StationRoute;
}

const StationRouteEdit = ({ stationroute }: Props) => {
    const { data, setData, put, processing, errors } = useForm({
        name: stationroute.name,
        latitude: stationroute.latitude.toString(),
        longitude: stationroute.longitude.toString(),
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        put(`/admin/stationroute/update/${stationroute.id}`, {
            onSuccess: () => {
                toast.success('Station route updated successfully');
            },
            onError: () => {
                toast.error('Failed to update station route');
            }
        });
    };

    return (
        <Layout>
            <Head title="Edit Station Route" />
            <Title title="Edit Station Route" subtitle="Update station route information" />
            <div className='w-full bg-gray-100 p-6 rounded-lg mt-6'>
                <div className='bg-white p-6 rounded-lg shadow-md space-y-6'>
                    <form action="" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormInputField>
                                <FormLabel htmlFor="name" textLabel="Station Route Name" />
                                <FormInput
                                    id="name"
                                    type="text"
                                    placeholder="Example: Union Site MRF"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    message={errors.name}
                                    required
                                    className="w-full"
                                />
                            </FormInputField>

                            <FormInputField>
                                <FormLabel htmlFor="latitude" textLabel="Latitude" />
                                <FormInput
                                    id="latitude"
                                    type="number"
                                    placeholder="0.0"
                                    value={data.latitude}
                                    onChange={(e) => setData('latitude', e.target.value)}
                                    message={errors.latitude}
                                    required
                                    className="w-full"
                                />
                            </FormInputField>

                            <FormInputField>
                                <FormLabel htmlFor="longitude" textLabel="Longitude" />
                                <FormInput
                                    id="longitude"
                                    type="number"
                                    placeholder="0.0"
                                    value={data.longitude}
                                    onChange={(e) => setData('longitude', e.target.value)}
                                    message={errors.longitude}
                                    required
                                    className="w-full"
                                />
                            </FormInputField>
                        </div>

                        <p className='text-sm mb-4'>Click the Map to update the Latitude and Longitude</p>
                        <div className="flex w-full items-center justify-center">
                            <Map
                                onClick={({ lat, lng }) => {
                                    setData('latitude', lat.toString());
                                    setData('longitude', lng.toString());
                                }}
                                markers={
                                    data.latitude && data.longitude
                                        ? [{
                                            position: [parseFloat(data.latitude), parseFloat(data.longitude)],
                                            color: '#2563eb',
                                            useCircle: true,
                                            radius: 8,
                                        }]
                                        : []
                                }
                            />
                        </div>
                        <div className='w-full flex items-end justify-end mt-4'>
                            <Button type="submit" variant="contained" color="success" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Station Route'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default StationRouteEdit;