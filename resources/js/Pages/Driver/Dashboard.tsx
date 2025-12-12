import { Card, CardContent } from '@/components/ui/card';
import { Head, usePage } from '@inertiajs/react';
import Layout from '../Layout/LayoutDriver';
import Title from '../Components/Title';
import GarbageInfo from '../Components/GarbageInfoDashboard';
import WeeklyPerformance from '../Components/WeeklyPerformance';
import MostSuccessfulCollection from '../Components/MostSuccessfulCollection';
import { BarChart3, MapPin, Route, Calendar } from 'lucide-react';

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
    totalBarangay: number;
    totalStationRoute: number;
    totalScheduleCount: number;
    totalInprogress: number
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
        totalBarangay,
        totalStationRoute,
        totalScheduleCount,
        totalInprogress
    } = usePage<DashboardProps>().props;

    // console.log('Route success counts:', successCountsByRoute);
    // console.log('Most successful route:', mostSuccessfulRoute);
    // console.log('Route stations:', routeStations);
    // console.log('Weekly performance data:', weeklyPerformance);

    return (
        <Layout>
            <Head title="Driver Dashboard" />
            <Title title="Driver Dashboard" />
            <div className="flex flex-col gap-6">

                <GarbageInfo
                    totalCollections={totalCollections}
                    totalSuccess={totalSuccess}
                    totalFailed={totalFailed}
                    totalOngoing={totalOngoing}
                    totalPending={totalPending}
                    totalInProgress={totalInprogress}
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