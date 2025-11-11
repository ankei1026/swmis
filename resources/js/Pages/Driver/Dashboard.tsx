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
        totalScheduleCount
    } = usePage<DashboardProps>().props;

    console.log('Route success counts:', successCountsByRoute);
    console.log('Most successful route:', mostSuccessfulRoute);
    console.log('Route stations:', routeStations);
    console.log('Weekly performance data:', weeklyPerformance);

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

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div>
                        <Title className="text-lg text-gray-600 font-semibold mb-2" title="Barangay Count" />
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