import Layout from '@/Pages/Layout/Layout';
import Title from '@/Pages/Components/Title';
import Map from '@/Pages/Components/Map';
import FormInputField from '@/Pages/Components/FormInputField';
import FormLabel from '@/Pages/Components/FormLabel';
import FormInput from '@/Pages/Components/FormInput';
import FormSelect from '@/Pages/Components/FormSelect'; // Add this import
import { Head, useForm } from '@inertiajs/react';
import { toast } from "sonner"
import { Button } from '@mui/material';

interface District {
    id: number;
    name: string;
}

interface BarangayCreateProps {
    districts: District[];
}

const BarangayCreate = ({ districts }: BarangayCreateProps) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        latitude: '',
        longitude: '',
        district_id: '' // Changed from 'district' to 'district_id'
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        post('/admin/barangays/store', {
            onSuccess: () => {
                toast.success('Purok created successfully');
                reset();
            },
            onError: () => {
                toast.error('Failed to create Purok');
            }
        });
    };

    return (
        <Layout>
            <Head title="Create Purok" />
            <Title title="Create Purok" subtitle="Add a new barangay to the system" />
            <div className='w-full bg-gray-100 p-6 rounded-lg mt-6'>
                <div className='bg-white p-6 rounded-lg shadow-md space-y-6'>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            <FormInputField>
                                <FormLabel htmlFor="name" textLabel="Purok Name" />
                                <FormInput
                                    id="name"
                                    type="text"
                                    placeholder="Example: Castillo Village, Purok - 3"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    message={errors.name}
                                    required
                                    className="w-full"
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
                                    id="latitude"
                                    type="number"
                                    step="any"
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
                                    step="any"
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
                                    setData('latitude', lat);
                                    setData('longitude', lng);
                                }}
                                markers={
                                    data.latitude && data.longitude
                                        ? [{
                                            position: [Number(data.latitude), Number(data.longitude)],
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
                                {processing ? 'Saving...' : 'Create Purok'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default BarangayCreate;