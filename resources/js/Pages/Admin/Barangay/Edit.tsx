import Layout from '@/Pages/Layout/Layout';
import Title from '@/Pages/Components/Title';
import FormInputField from '@/Pages/Components/FormInputField';
import FormLabel from '@/Pages/Components/FormLabel';
import FormInput from '@/Pages/Components/FormInput';
import FormSelect from '@/Pages/Components/FormSelect'; // Add this import
import Map, { MANGAGOY_CENTER } from '@/Pages/Components/Map';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@mui/material';

interface District {
    id: number;
    name: string;
}

interface Barangay {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    district_id: number;
    district?: District;
}

interface Props {
    barangay: Barangay;
    districts: District[]; // Add districts prop
}

const BarangayEdit = ({ barangay, districts }: Props) => {
    const { data, setData, put, processing, errors } = useForm({
        name: barangay.name || '',
        latitude: barangay.latitude?.toString() || '',
        longitude: barangay.longitude?.toString() || '',
        district_id: barangay.district_id?.toString() || '', // Add district_id to form
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('admin.barangay.update', barangay.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Purok updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update purok.');
            },
        });
    };

    return (
        <Layout>
            <Title title={`Edit Purok - ${barangay.name}`} />

            <div className="w-full bg-gray-100 p-6 rounded-lg">
                <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            <FormInputField>
                                <FormLabel htmlFor="name" textLabel="Purok Name" />
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
                                <FormLabel htmlFor="district_id" textLabel="District" />
                                <FormSelect
                                    id="district_id"
                                    value={data.district_id}
                                    onChange={(e) => setData('district_id', e.target.value)}
                                    message={errors.district_id}
                                    required
                                    className="w-full"
                                >
                                    <option value="">Select District</option>
                                    {districts.map((district) => (
                                        <option key={district.id} value={district.id}>
                                            {district.name}
                                        </option>
                                    ))}
                                </FormSelect>
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
                                    setData('latitude', lat.toString());
                                    setData('longitude', lng.toString());
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
                                {processing ? 'Updating...' : 'Update Purok'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default BarangayEdit;