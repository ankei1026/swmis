import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Layout from '../Layout/Layout';
import { Head, usePage } from '@inertiajs/react';
import Title from '../Components/Title';

const Profile = () => {
    const page = usePage();

    // Mock user data — later you can fetch this from your backend or props
    const user = (page.props as any)?.auth?.user || {
        photo: 'https://i.pravatar.cc/100?img=13',
        name: 'Resident SWMIS',
        email: 'resident@example.com',
        phone_number: '+63 912 345 6789',
        barangay: 'Tabon, Bislig City, Surigao del Sur',
        status: 'verified',
    };

    return (
        <Layout>
            <Head title="Profile" />
            <Title title="My Profile" />
            <div className='w-full bg-gray-100 py-6 rounded-lg'>
                <div className="mx-auto max-w-xl">
                    <Card className="border border-gray-200">
                        <CardHeader className="flex flex-col items-center pt-8 pb-6">
                            <Avatar className="h-28 w-28 border-2 border-gray-200">
                                <AvatarImage src={user.photo} alt={user.name} />
                                <AvatarFallback className="bg-gray-200 text-2xl text-gray-700">
                                    {user.name[0]}
                                </AvatarFallback>
                            </Avatar>

                            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
                                {user.name}
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">{user.role}</p>
                        </CardHeader>

                        <CardContent className="px-8 pb-8">
                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-gray-100 py-3">
                                    <span className="text-sm font-medium text-gray-600">Email</span>
                                    <span className="text-sm text-gray-900">{user.email}</span>
                                </div>

                                <div className="flex justify-between border-b border-gray-100 py-3">
                                    <span className="text-sm font-medium text-gray-600">Phone Number</span>
                                    <span className="text-sm text-gray-900">{user.phone_number}</span>
                                </div>

                                <div className="flex justify-between py-3">
                                    <span className="text-sm font-medium text-gray-600">Barangay</span>
                                    <span className="max-w-xs text-right text-sm text-gray-900">{user.barangay}</span>
                                </div>

                                <div className="flex justify-between py-3">
                                    <span className="text-sm font-medium text-gray-600">Status</span>
                                    <span className="max-w-xs text-right text-sm text-gray-900">{user.status}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
