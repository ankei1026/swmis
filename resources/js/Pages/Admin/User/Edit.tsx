// UserEdit.tsx - Similar structure but with existing user data
import FormInput from '@/Pages/Components/FormInput';
import FormInputField from '@/Pages/Components/FormInputField';
import FormLabel from '@/Pages/Components/FormLabel';
import Title from '@/Pages/Components/Title';
import Layout from '@/Pages/Layout/Layout';
import { useForm, usePage } from '@inertiajs/react';
import { Button, MenuItem, Select } from '@mui/material';
import { toast } from "sonner"

interface Barangay {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    last_name: string;
    email: string;
    phone_number: string;
    barangay: string;
    status: string;
    role: string;
}

interface PageProps {
    user: User;
    barangays: Barangay[];
}

const UserEdit = () => {
    const { user, barangays } = usePage<PageProps>().props;

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        barangay: user.barangay || '',
        status: user.status || '',
        role: user.role || '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        put(`/admin/users/${user.id}`, {
            onSuccess: () => {
                toast.success('User updated successfully');
            },
            onError: () => {
                toast.error('Failed to update user');
            }
        });
    };

    return (
        <Layout>
            <Title title={`Edit User: ${user.name}`} />
            <div className='w-full bg-gray-100 py-6 rounded-lg mt-4'>
                <div className="flex items-center justify-center">
                    <form onSubmit={handleSubmit} className="w-[500px] rounded-md border border-gray-300 bg-white p-6 shadow-sm">

                        {/* First Name */}
                        <FormInputField>
                            <FormLabel htmlFor="name" textLabel="Name" />
                            <FormInput
                                id="name"
                                type="text"
                                placeholder="Jade"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                message={errors.name}
                                required
                                className="w-full"
                            />
                        </FormInputField>

                        {/* Email */}
                        <FormInputField>
                            <FormLabel htmlFor="email" textLabel="Email" />
                            <FormInput
                                id="email"
                                type="email"
                                placeholder="jade.santos@example.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                message={errors.email}
                                required
                                className="w-full"
                            />
                        </FormInputField>

                        {/* Phone Number */}
                        <FormInputField>
                            <FormLabel htmlFor="phone_number" textLabel="Phone Number" />
                            <FormInput
                                id="phone_number"
                                type="text"
                                placeholder="+63 912 345 6789"
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                message={errors.phone_number}
                                required
                                className="w-full"
                            />
                        </FormInputField>

                        {/* Barangay - Dropdown */}
                        <FormInputField>
                            <FormLabel htmlFor="barangay" textLabel="Barangay" />
                            <Select
                                id="barangay"
                                value={data.barangay}
                                onChange={(e) => setData('barangay', e.target.value)}
                                displayEmpty
                                fullWidth
                                size="small"
                                required
                            >
                                <MenuItem value="">
                                    <em>Select Barangay</em>
                                </MenuItem>
                                {barangays.map((barangay) => (
                                    <MenuItem key={barangay.id} value={barangay.name}>
                                        {barangay.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.barangay && <p className="mt-1 text-sm text-red-500">{errors.barangay}</p>}
                        </FormInputField>

                        {/* Status */}
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
                                    <em>Select status</em>
                                </MenuItem>
                                <MenuItem value="verified">verified</MenuItem>
                                <MenuItem value="not verified">not verified</MenuItem>
                            </Select>
                            {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
                        </FormInputField>

                        {/* Role */}
                        <FormInputField>
                            <FormLabel htmlFor="role" textLabel="Role" />
                            <Select
                                id="role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                displayEmpty
                                fullWidth
                                size="small"
                                required
                            >
                                <MenuItem value="">
                                    <em>Select Role</em>
                                </MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="driver">Driver</MenuItem>
                                <MenuItem value="resident">Resident</MenuItem>
                            </Select>
                            {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
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
                                {processing ? 'Updating...' : 'Update User'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default UserEdit;