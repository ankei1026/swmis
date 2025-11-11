import { Card, CardContent } from '@/components/ui/card';
import { Head, usePage } from '@inertiajs/react';
import Layout from '../Layout/LayoutResident'; // You'll need a Resident layout
import Title from '../Components/Title';
import GarbageInfo from '../Components/GarbageInfoDashboard';
import WeeklyPerformance from '../Components/WeeklyPerformance';
import MostSuccessfulCollection from '../Components/MostSuccessfulCollection';
import { BarChart3, MapPin, Route, Calendar, User } from 'lucide-react';

interface DashboardProps {
    totalCollections: number;
    totalSuccess: number;
    totalFailed: number;
    totalOngoing: number;
    totalPending: number;
    weeklyPerformance: {
        label: string;
        success: number;
        failed: number;
    }[];
    successCountsByRoute: Record<string, number>;
    mostSuccessfulRoute: string | null;
    routeStations: Record<string, any[]>;
    user: {
        name: string;
        email: string;
        role: string;
    };
}

const Dashboard = () => {
    const {
        totalCollections,
        totalSuccess,
        totalFailed,
        totalOngoing,
        totalPending,
        weeklyPerformance,
        successCountsByRoute,
        mostSuccessfulRoute,
        routeStations,
        user
    } = usePage<DashboardProps>().props;

    return (
        <Layout>
            <Head title="Dashboard" />
            <Title
                title={`Welcome back, ${user.name}!`}
                subtitle="Here's your dashboard overview"
            />

            <div className="flex flex-col gap-6">
                {/* User Info Card */}
                <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
                    <Card className="border">
                        <CardContent className="px-4 py-2">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-100 p-3 rounded-full">
                                    <User className="text-gray-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                    <p className="text-gray-700 text-sm">{user.email}</p>
                                    <p className="text-gray-600 text-xs">Resident Account</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <GarbageInfo
                    totalCollections={totalCollections}
                    totalSuccess={totalSuccess}
                    totalFailed={totalFailed}
                    totalOngoing={totalOngoing}
                    totalPending={totalPending}
                />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <WeeklyPerformance data={weeklyPerformance} />

                    <MostSuccessfulCollection
                        successCountsByRoute={successCountsByRoute}
                        mostSuccessfulRoute={mostSuccessfulRoute}
                        routeStations={routeStations}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;