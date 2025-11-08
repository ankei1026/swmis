import { Card, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import React from 'react';

interface WeeklyPerformanceProps {
    data: {
        label: string;
        success: number;
        failed: number;
    }[];
}

const WeeklyPerformance: React.FC<WeeklyPerformanceProps> = ({ data }) => {
    return (
        <Card>
            <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-700">
                    Weekly Collection Performance
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data}>
                        <XAxis dataKey="label" stroke="#9ca3af" />
                        <Tooltip />
                        <Bar dataKey="success" fill="#16a34a" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="failed" fill="#dc2626" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default WeeklyPerformance;
