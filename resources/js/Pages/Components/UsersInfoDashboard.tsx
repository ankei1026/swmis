import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, Truck, Home, UserCheck } from "lucide-react";
import Title from "./Title";

interface UsersInfoProps {
    totalUsers: number | string;
    adminCount: number | string;
    driverCount: number | string;
    residentCount: number | string;
}

const UsersInfo: React.FC<UsersInfoProps> = ({
    totalUsers,
    adminCount,
    driverCount,
    residentCount
}) => {
    return (
        <div className="mb-4">
            <Title className="text-md font-semibold mb-2" title="Users Information" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Users */}
                <Card className="border border-gray-200 bg-white shadow-sm">
                    <CardContent className="flex items-center gap-3 p-2">
                        <div className="p-2 rounded-lg">
                            <Users className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <h4 className="text-xs text-gray-500 font-medium">Total Users</h4>
                            <p className="text-lg font-bold text-gray-900">{totalUsers}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Admin Count */}
                <Card className="border border-gray-200 bg-white shadow-sm">
                    <CardContent className="flex items-center gap-3 p-2">
                        <div className="p-2 rounded-lg">
                            <Shield className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <h4 className="text-xs text-gray-500 font-medium">Admins</h4>
                            <p className="text-lg font-bold text-gray-900">{adminCount}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Driver Count */}
                <Card className="border border-gray-200 bg-white shadow-sm">
                    <CardContent className="flex items-center gap-3 p-2">
                        <div className="p-2 rounded-lg">
                            <Truck className="text-amber-600" size={20} />
                        </div>
                        <div>
                            <h4 className="text-xs text-gray-500 font-medium">Drivers</h4>
                            <p className="text-lg font-bold text-gray-900">{driverCount}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Resident Count */}
                <Card className="border border-gray-200 bg-white shadow-sm">
                    <CardContent className="flex items-center gap-3 p-2">
                        <div className="p-2 rounded-lg">
                            <Home className="text-green-600" size={20} />
                        </div>
                        <div>
                            <h4 className="text-xs text-gray-500 font-medium">Residents</h4>
                            <p className="text-lg font-bold text-gray-900">{residentCount}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UsersInfo;