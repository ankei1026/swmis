import Layout from '@/Pages/Layout/LayoutDriver';
import Title from '@/Pages/Components/Title';
import FormInputField from '@/Pages/Components/FormInputField';
import FormLabel from '@/Pages/Components/FormLabel';
import FormInput from '@/Pages/Components/FormInput';
import Map, { MANGAGOY_CENTER } from '@/Pages/Components/Map';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@mui/material';

interface Barangay {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

interface Props {
    barangay: Barangay;
}

const BarangayEdit = ({ barangay }: Props) => {
    const { data, setData, put, processing, errors } = useForm({
        name: barangay.name || '',
        latitude: barangay.latitude || '',
        longitude: barangay.longitude || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('driver.barangay.update', barangay.id), {
            preserveScroll: true,
            onStart: () => toast.loading('Updating barangay...'),
            onSuccess: () => {
                toast.dismiss();
                toast.success('Barangay updated successfully!');
            },
            onError: () => {
                toast.dismiss();
                toast.error('Failed to update barangay.');
            },
        });
    };

    return (
        <Layout>
            <Title title={`Edit Barangay - ${barangay.name}`} />

            <div className="w-full bg-gray-100 p-6 rounded-lg">
                <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormInputField>
                                <FormLabel htmlFor="name" textLabel="Barangay Name" />
                                <FormInput
                                    className='w-full'
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    message={errors.name}
                                    required
                                />
                            </FormInputField>

                            <FormInputField>
                                <FormLabel htmlFor="latitude" textLabel="Latitude" />
                                <FormInput
                                    className='w-full'
                                    id="latitude"
                                    type="number"
                                    step="any"
                                    value={data.latitude}
                                    onChange={(e) => setData('latitude', e.target.value)}
                                    message={errors.latitude}
                                    required
                                />
                            </FormInputField>

                            <FormInputField>
                                <FormLabel htmlFor="longitude" textLabel="Longitude" />
                                <FormInput
                                    className='w-full'
                                    id="longitude"
                                    type="number"
                                    step="any"
                                    value={data.longitude}
                                    onChange={(e) => setData('longitude', e.target.value)}
                                    message={errors.longitude}
                                    required
                                />
                            </FormInputField>
                        </div>



                        <p className="text-sm mb-4">Click the map to update the latitude and longitude:</p>
                        <div className="flex w-full items-center justify-center">
                            <Map
                                center={[Number(data.latitude) || MANGAGOY_CENTER[0], Number(data.longitude) || MANGAGOY_CENTER[1]]}
                                zoom={13}
                                style={{ height: 400 }}
                                onClick={({ lat, lng }) => {
                                    setData('latitude', lat);
                                    setData('longitude', lng);
                                }}
                                markers={[
                                    {
                                        id: barangay.id,
                                        position: [Number(data.latitude), Number(data.longitude)],
                                        popup: <strong>{data.name}</strong>,
                                        color: '#2563eb',
                                        useCircle: true,
                                        radius: 8,
                                    },
                                ]}
                            />
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button
                                type="submit"
                                disabled={processing}
                                color='success'
                                variant="contained"
                            >
                                {processing ? 'Updating...' : 'Update Barangay'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default BarangayEdit;
