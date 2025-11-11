import { Card, CardContent } from '@/components/ui/card';
import { Head, usePage } from '@inertiajs/react';
import { CheckCircle, Truck, XCircle } from 'lucide-react';
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
    weeklyPerformance: {
        label: string;
        success: number;
        failed: number;
    }[];
    successCountsByRoute: Record<string, number>;
    mostSuccessfulRoute: string | null;
    routeStations: number
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
        routeStations
    } = usePage<DashboardProps>().props;

    return (
        <Layout>
            <Head title="Admin Dashboard" />
            <Title title="Dashboard" />
            <UsersInfo
                totalUsers={totalUsers}
                adminCount={adminCount}
                driverCount={driverCount}
                residentCount={residentCount}
            />
            <GarbageInfo
                totalCollections={totalCollections}
                totalOngoing={totalOngoing}
                totalFailed={totalFailed}
                totalSuccess={totalSuccess}
                totalPending={totalPending}
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
