import { Card, CardContent } from "@/components/ui/card";
import { Truck, CheckCircle, XCircle, Clock, BarChart3 } from "lucide-react";
import Title from "./Title";

interface GarbageInfoProps {
    totalCollections: number | string;
    totalSuccess: number | string;
    totalFailed: number | string;
    totalOngoing: number | string;
    totalPending: number | string;
}

const GarbageInfo: React.FC<GarbageInfoProps> = ({
    totalCollections,
    totalSuccess,
    totalFailed,
    totalOngoing,
    totalPending
}) => {
    return (
        <div className="mb-2 mt-4">
            <Title className="text-lg text-gray-600 font-semibold mb-2" title="Schedule Information"/>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Collections */}
                <Card className="border border-gray-200 bg-white">
                    <CardContent className="flex items-center gap-3 p-3">
                        <BarChart3 className="text-blue-500" size={30} />
                        <div>
                            <h4 className="text-md text-gray-500">Total</h4>
                            <p className="text-3xl font-semibold text-gray-900">{totalCollections}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Successful */}
                <Card className="border border-gray-200 bg-white">
                    <CardContent className="flex items-center gap-3 p-3">
                        <CheckCircle className="text-green-500" size={30} />
                        <div>
                            <h4 className="text-md text-gray-500">Successful</h4>
                            <p className="text-3xl font-semibold text-gray-900">{totalSuccess}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Failed */}
                <Card className="border border-gray-200 bg-white">
                    <CardContent className="flex items-center gap-3 p-3">
                        <XCircle className="text-red-500" size={30} />
                        <div>
                            <h4 className="text-md text-gray-500">Failed</h4>
                            <p className="text-3xl font-semibold text-gray-900">{totalFailed}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending */}
                <Card className="border border-gray-200 bg-white">
                    <CardContent className="flex items-center gap-3 p-3">
                        <Clock className="text-purple-500" size={30} />
                        <div>
                            <h4 className="text-md text-gray-500">Pending</h4>
                            <p className="text-3xl font-semibold text-gray-900">{totalPending}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default GarbageInfo;