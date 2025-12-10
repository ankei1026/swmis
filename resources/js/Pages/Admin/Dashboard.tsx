import { Card, CardContent } from '@/components/ui/card';
import { Head, usePage } from '@inertiajs/react';
import { Calendar, CheckCircle, MapPin, Route, Truck, XCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import chartData from '../Data/chartdata';
import recentActivity from '../Data/recentActivity';
import Layout from '../Layout/Layout';
import Title from '../Components/Title';
import GarbageInfo from '../Components/GarbageInfoDashboard';
import UsersInfo from '../Components/UsersInfoDashboard';
import WeeklyPerformance from '../Components/WeeklyPerformance';
import MostSuccessfulCollection from '../Components/MostSuccessfulCollection';

interface DashboardProps {
    totalCollections: number;
    totalSuccess: number;
    totalFailed: number;
    totalOngoing: number;
    totalPending: number;
    totalUsers: number;
    adminCount: number;
    driverCount: number;
    residentCount: number;
    totalInProgress: number;
    weeklyPerformance: {
        label: string;
        success: number;
        failed: number;
    }[];
    successCountsByRoute: Record<string, number>;
    mostSuccessfulRoute: string | null;
    routeStations: Record<string, any[]>;
    totalBarangay: number;
    totalStationRoute: number;
    totalScheduleCount: number;

}

const Dashboard = () => {
    const {
        totalCollections,
        totalSuccess,
        totalFailed,
        totalOngoing,
        totalPending,
        totalUsers,
        adminCount,
        driverCount,
        residentCount,
        weeklyPerformance,
        successCountsByRoute,
        mostSuccessfulRoute,
        routeStations,
        totalBarangay,
        totalStationRoute,
        totalScheduleCount,
        totalInProgress
    } = usePage<DashboardProps>().props;

    return (
        <Layout>
            <Head title="Admin Dashboard" />
            <Title title="Admin Dashboard" />
            <UsersInfo
                totalUsers={totalUsers}
                adminCount={adminCount}
                driverCount={driverCount}
                residentCount={residentCount}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div>
                    <Title className="text-lg text-gray-600 font-semibold mb-2" title="Purok Count" />
                    <Card className="border border-gray-200 bg-white">
                        <CardContent className="flex items-center gap-3 p-3">
                            <MapPin className="text-blue-500" size={30} />
                            <div>
                                <h4 className="text-md text-gray-500">Total</h4>
                                <p className="text-3xl font-semibold text-gray-900">{totalBarangay}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Title className="text-lg text-gray-600 font-semibold mb-2" title="Station Route Count" />
                    <Card className="border border-gray-200 bg-white">
                        <CardContent className="flex items-center gap-3 p-3">
                            <Route className="text-green-500" size={30} />
                            <div>
                                <h4 className="text-md text-gray-500">Total</h4>
                                <p className="text-3xl font-semibold text-gray-900">{totalStationRoute}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Title className="text-lg text-gray-600 font-semibold mb-2" title="Schedule Route Count" />
                    <Card className="border border-gray-200 bg-white">
                        <CardContent className="flex items-center gap-3 p-3">
                            <Calendar className="text-purple-500" size={30} />
                            <div>
                                <h4 className="text-md text-gray-500">Total</h4>
                                <p className="text-3xl font-semibold text-gray-900">{totalScheduleCount}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <GarbageInfo
                totalCollections={totalCollections}
                totalOngoing={totalOngoing}
                totalFailed={totalFailed}
                totalSuccess={totalSuccess}
                totalPending={totalPending}
                totalInProgress={totalInProgress}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
                <WeeklyPerformance data={weeklyPerformance} />

                <MostSuccessfulCollection
                    successCountsByRoute={successCountsByRoute}
                    mostSuccessfulRoute={mostSuccessfulRoute}
                    routeStations={routeStations}
                />
            </div>
        </Layout>
    );
};

export default Dashboard;
