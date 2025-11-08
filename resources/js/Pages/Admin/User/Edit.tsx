import Layout from '@/Pages/Layout/Layout';
import Title from '@/Pages/Components/Title';
import FormInput from '@/Pages/Components/FormInput';
import FormInputField from '@/Pages/Components/FormInputField';
import FormLabel from '@/Pages/Components/FormLabel';
import { useForm } from '@inertiajs/react';
import { Button, MenuItem, Select } from '@mui/material';
import { toast } from 'sonner';

const UserEdit = ({ user }: { user: any }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        barangay: user.barangay,
        role: user.role,
        status: user.status,
        password: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('admin.users.update', user.id), {
            onSuccess: () => toast.success('User updated successfully!'),
            onError: () => toast.error('Failed to update user'),
        });
    };

    return (
        <Layout>
            <Title title="Edit User" />
            <div className='w-full bg-gray-100 py-6 rounded-lg'>
                <div className="flex items-center justify-center">
                    <form
                        onSubmit={handleSubmit}
                        className="w-[500px] rounded-md border border-gray-300 bg-white p-6 shadow-sm"
                    >
                        <FormInputField>
                            <FormLabel htmlFor="name" textLabel="Name" />
                            <FormInput
                                className='w-full'
                                id="name"
                                type='text'
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                message={errors.name}
                                required
                            />
                        </FormInputField>

                        <FormInputField>
                            <FormLabel htmlFor="email" textLabel="Email" />
                            <FormInput
                                className='w-full'
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                message={errors.email}
                                required
                            />
                        </FormInputField>

                        <FormInputField>
                            <FormLabel htmlFor="phone_number" textLabel="Phone Number" />
                            <FormInput
                                className='w-full'
                                id="phone_number"
                                type='text'
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                message={errors.phone_number}
                                required
                            />
                        </FormInputField>

                        <FormInputField>
                            <FormLabel htmlFor="barangay" textLabel="Barangay" />
                            <FormInput
                                className='w-full'
                                id="barangay"
                                type='text'
                                value={data.barangay}
                                onChange={(e) => setData('barangay', e.target.value)}
                                message={errors.barangay}
                                required
                            />
                        </FormInputField>

                        <FormInputField>
                            <FormLabel htmlFor="role" textLabel="Role" />
                            <Select
                                id="role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                fullWidth
                                size="small"
                                required
                            >
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="Staff">Staff</MenuItem>
                                <MenuItem value="Resident">Resident</MenuItem>
                            </Select>
                        </FormInputField>

                        <FormInputField>
                            <FormLabel htmlFor="status" textLabel="Status" />
                            <Select
                                id="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                fullWidth
                                size="small"
                                required
                            >
                                <MenuItem value="verified">Verified</MenuItem>
                                <MenuItem value="not verified">Not Verified</MenuItem>
                            </Select>
                        </FormInputField>

                        <div className="mt-5 flex justify-end">
                            <Button type="submit" variant="contained" color="success" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default UserEdit;
