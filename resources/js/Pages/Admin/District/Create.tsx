import FormInput from '@/Pages/Components/FormInput';
import FormInputField from '@/Pages/Components/FormInputField';
import FormLabel from '@/Pages/Components/FormLabel';
import Title from '@/Pages/Components/Title';
import Layout from '@/Pages/Layout/Layout';
import { useForm, usePage } from '@inertiajs/react';
import { Button, MenuItem, Select } from '@mui/material';
import { toast } from "sonner"

const DistrictCreate = () => {

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        post('/admin/district/store', {
            onSuccess: () => {
                toast.success('District created successfully');
                reset();
            },
            onError: () => {
                toast.error('Failed to create District');
            }
        });
    };

    return (
        <Layout>
            <Title title="Create New District" />
            <div className='w-full bg-gray-100 py-6 rounded-lg mt-4'>
                <div className="flex items-center justify-center">
                    <form onSubmit={handleSubmit} className="w-[500px] rounded-md border border-gray-300 bg-white p-6 shadow-sm">

                        {/* First Name */}
                        <FormInputField>
                            <FormLabel htmlFor="name" textLabel="District Name" />
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

                        {/* Submit Button */}
                        <div className="mt-5 flex justify-end">
                            <Button type="submit" variant="contained" color="success" disabled={processing}>
                                {processing ? 'Saving...' : 'Create District'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default DistrictCreate;