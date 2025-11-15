// DistrictEdit.tsx - Similar structure but with existing District data
import FormInput from '@/Pages/Components/FormInput';
import FormInputField from '@/Pages/Components/FormInputField';
import FormLabel from '@/Pages/Components/FormLabel';
import Title from '@/Pages/Components/Title';
import Layout from '@/Pages/Layout/Layout';
import { useForm, usePage } from '@inertiajs/react';
import { Button, MenuItem, Select } from '@mui/material';
import { toast } from "sonner"

interface District {
    id: number;
    name: string;
}

interface PageProps {
    district: District;
}

const DistrictEdit = () => {
    const { district } = usePage<PageProps>().props;

    const { data, setData, put, processing, errors } = useForm({
        name: district.name || '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        put(`/admin/district/${district.id}`, {
            onSuccess: () => {
                toast.success('District updated successfully');
            },
            onError: () => {
                toast.error('Failed to update district');
            }
        });
    };

    return (
        <Layout>
            <Title title={`Edit District: ${district.name}`} />
            <div className='w-full bg-gray-100 py-6 rounded-lg mt-4'>
                <div className="flex items-center justify-center">
                    <form onSubmit={handleSubmit} className="w-[500px] rounded-md border border-gray-300 bg-white p-6 shadow-sm">

                        {/* First Name */}
                        <FormInputField>
                            <FormLabel htmlFor="name" textLabel="Name" />
                            <FormInput
                                id="name"
                                type="text"
                                placeholder="District I"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                message={errors.name}
                                required
                                className="w-full"
                            />
                        </FormInputField>

                        {/* Submit & Cancel Buttons */}
                        <div className="mt-5 flex justify-end gap-3">
                            <Button 
                                type="button" 
                                variant="contained" 
                                color="primary"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="success" disabled={processing}>
                                {processing ? 'Updating...' : 'Update District'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default DistrictEdit;