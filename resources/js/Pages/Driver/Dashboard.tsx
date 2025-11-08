import { Card, CardContent } from '@/components/ui/card';
import { Head, usePage } from '@inertiajs/react';
import Layout from '../Layout/LayoutDriver';
import Title from '../Components/Title';
import GarbageInfo from '../Components/GarbageInfoDashboard';
import WeeklyPerformance from '../Components/WeeklyPerformance';
import MostSuccessfulCollection from '../Components/MostSuccessfulCollection';

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
        mostSuccessfulRoute 
    } = usePage<DashboardProps>().props;

    console.log('Route success counts:', successCountsByRoute);
    console.log('Most successful route:', mostSuccessfulRoute);

    return (
        <Layout>
            <Head title="Dashboard" />
            <Title title="Dashboard" />
            <div className="flex flex-col gap-6">
                <GarbageInfo
                    totalCollections={totalCollections}
                    totalSuccess={totalSuccess}
                    totalFailed={totalFailed}
                    totalOngoing={totalOngoing}
                    totalPending={totalPending}
                />
                {/* <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <WeeklyPerformance data={weeklyPerformance} />

                    <MostSuccessfulCollection
                        successCountsByRoute={successCountsByRoute}
                        mostSuccessfulRoute={mostSuccessfulRoute}
                    />
                </div> */}
            </div>
        </Layout>
    );
};

export default Dashboard;