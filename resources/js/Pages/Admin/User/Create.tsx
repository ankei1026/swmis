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

interface PageProps {
    barangays: Barangay[];
}

const UserCreate = () => {
    const { barangays } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        barangay: '',
        password: '',
        confirm_password: '',
        status: '',
        role: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (data.password !== data.confirm_password) {
            toast.error('Passwords do not match');
            return;
        }

        post('/admin/users/store', {
            onSuccess: () => {
                toast.success('User created successfully');
                reset();
            },
            onError: () => {
                toast.error('Failed to create user');
            }
        });
    };

    return (
        <Layout>
            <Title title="Create New User" />
            <div className='w-full bg-gray-100 py-6 rounded-lg mt-4'>
                <div className="flex items-center justify-center">
                    <form onSubmit={handleSubmit} className="w-[500px] rounded-md border border-gray-300 bg-white p-6 shadow-sm">

                        {/* First Name */}
                        <FormInputField>
                            <FormLabel htmlFor="first_name" textLabel="First Name" />
                            <FormInput
                                id="first_name"
                                type="text"
                                placeholder="Jade"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                message={errors.first_name}
                                required
                                className="w-full"
                            />
                        </FormInputField>

                        {/* Last Name */}
                        <FormInputField>
                            <FormLabel htmlFor="last_name" textLabel="Last Name" />
                            <FormInput
                                id="last_name"
                                type="text"
                                placeholder="Santos"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                message={errors.last_name}
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
                                placeholder="639XXXXXXXXX"
                                value={data.phone_number}
                                onChange={(e) => {
                                    // Allow only numbers and limit to 11 characters
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    if (value.length <= 12) {
                                        setData('phone_number', value);
                                    }
                                }}
                                message={errors.phone_number}
                                required
                                maxLength={11}
                                pattern="[0-9]{11}"  // HTML5 validation pattern
                                className="w-full"
                            />
                        </FormInputField>

                        {/* Barangay - Updated to Dropdown */}
                        <FormInputField>
                            <FormLabel htmlFor="barangay" textLabel="Purok" />
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
                                    <em>Select Purok</em>
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

                        {/* Password */}
                        <FormInputField>
                            <FormLabel htmlFor="password" textLabel="Password" />
                            <FormInput
                                id="password"
                                type="password"
                                placeholder="******"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                message={errors.password}
                                required
                                className="w-full"
                            />
                        </FormInputField>

                        {/* Confirm Password */}
                        <FormInputField>
                            <FormLabel htmlFor="confirm_password" textLabel="Confirm Password" />
                            <FormInput
                                id="confirm_password"
                                type="password"
                                placeholder="******"
                                value={data.confirm_password}
                                onChange={(e) => setData('confirm_password', e.target.value)}
                                message={
                                    data.confirm_password && data.password !== data.confirm_password
                                        ? 'Passwords do not match'
                                        : errors.confirm_password
                                }
                                required
                                className="w-full"
                            />
                        </FormInputField>

                        {/* Submit Button */}
                        <div className="mt-5 flex justify-end">
                            <Button type="submit" variant="contained" color="success" disabled={processing}>
                                {processing ? 'Saving...' : 'Create User'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default UserCreate;