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
    const totalSuccess = data.reduce((sum, item) => sum + item.success, 0);
    const totalFailed = data.reduce((sum, item) => sum + item.failed, 0);
    const totalCollections = totalSuccess + totalFailed;
    const successRate = totalCollections > 0 ? (totalSuccess / totalCollections) * 100 : 0;

    // Calculate efficiency metrics
    const avgDailySuccess = totalSuccess / data.length;
    const avgDailyFailed = totalFailed / data.length;
    
    // Performance trends
    const weeklyTrend = totalSuccess > data[0]?.success ? 'improving' : 'declining';

    return (
        <Card>
            <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-600">
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

                {/* Logistics Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3">📊 Logistics Summary</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-bold">Total Collections:</span>
                                <span className="font-medium">{totalCollections}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-bold">Success Rate:</span>
                                <span className={`font-medium ${successRate >= 90 ? 'text-green-600' : successRate >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {successRate.toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-bold">Avg Daily Success:</span>
                                <span className="font-medium text-green-600">{avgDailySuccess.toFixed(1)}</span>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-bold">Completion Rate:</span>
                                <span className="font-medium">{((totalSuccess / totalCollections) * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-bold">Weekly Trend:</span>
                                <span className={`font-medium ${weeklyTrend === 'improving' ? 'text-green-600' : 'text-red-600'}`}>
                                    {weeklyTrend} 📈
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-bold">Avg Daily Failed:</span>
                                <span className="font-medium text-red-600">{avgDailyFailed.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default WeeklyPerformance;