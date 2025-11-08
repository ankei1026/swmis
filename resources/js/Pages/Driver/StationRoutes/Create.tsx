import Layout from '@/Pages/Layout/LayoutDriver';
import Title from '@/Pages/Components/Title';
import Map from '@/Pages/Components/Map';
import FormInputField from '@/Pages/Components/FormInputField';
import FormLabel from '@/Pages/Components/FormLabel';
import FormInput from '@/Pages/Components/FormInput';
import { Head, useForm } from '@inertiajs/react';
import { toast } from "sonner"
import { Button } from '@mui/material';

const StationRouteCreate = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        latitude: '',
        longitude: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        post('/driver/stationroute/store', {
            onSuccess: () => {
                toast.success('Station created successfully');
                reset();
            },
            onError: () => {
                toast.error('Failed to create Station Route');
                reset();
            }
        });
    };

    return (
        <Layout>
            <Head title="Create Station Route" />
            <Title title="Create Station Route" subtitle="Create many station of the routes" />
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

                        <p className='text-sm mb-4'>Click the Map for the Latitude and Longitude</p>
                        <div className="flex w-full items-center justify-center">
                            <Map
                                onClick={({ lat, lng }) => {
                                    setData('latitude', Number(lat));
                                    setData('longitude', Number(lng));
                                }}
                                markers={
                                    data.latitude && data.longitude
                                        ? [{
                                            position: [data.latitude, data.longitude],
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
                                {processing ? 'Saving...' : 'Create Station Route'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default StationRouteCreate;
