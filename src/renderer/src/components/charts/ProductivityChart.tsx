// ================================
// PRODUCTIVITY CHART
// ================================

interface ProductivityChartProps {
    data: ProductivityData[];
    timeRange: '1h' | '24h' | '7d' | '30d';
    height?: number;
    showTarget?: boolean;
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({
    data,
    timeRange,
    height = 300,
    showTarget = true
}) => {
    const chartConfig = useMemo(() => {
        const colors = {
            bomExtractions: '#3B82F6',
            activeSaves: '#10B981',
            engineersOnline: '#F59E0B',
            target: '#EF4444'
        };

        return { colors };
    }, []);

    const formatXAxisLabel = (value: string) => {
        if (timeRange === '1h') return value;
        if (timeRange === '24h') return value.split(':')[0] + 'h';
        return value.split(' ')[0];
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        Produtividade em Tempo Real
                    </h3>
                    <p className="text-sm text-gray-600">
                        Extrações de BOM, saves ativos e engenheiros online
                    </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>BOMs</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Saves</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span>Engineers</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={height}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis
                        dataKey="hour"
                        tick={{ fontSize: 12 }}
                        tickFormatter={formatXAxisLabel}
                        stroke="#6B7280"
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value: number, name: string) => [
                            value,
                            name === 'bomExtractions' ? 'BOMs Extraídas' :
                                name === 'activeSaves' ? 'Saves Ativos' :
                                    name === 'engineersOnline' ? 'Engenheiros Online' : name
                        ]}
                    />
                    <Legend />

                    <Line
                        type="monotone"
                        dataKey="bomExtractions"
                        stroke={chartConfig.colors.bomExtractions}
                        strokeWidth={2}
                        dot={{ fill: chartConfig.colors.bomExtractions, strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: chartConfig.colors.bomExtractions, strokeWidth: 2 }}
                        name="BOMs Extraídas"
                    />

                    <Line
                        type="monotone"
                        dataKey="activeSaves"
                        stroke={chartConfig.colors.activeSaves}
                        strokeWidth={2}
                        dot={{ fill: chartConfig.colors.activeSaves, strokeWidth: 2, r: 4 }}
                        name="Saves Ativos"
                    />

                    <Line
                        type="monotone"
                        dataKey="engineersOnline"
                        stroke={chartConfig.colors.engineersOnline}
                        strokeWidth={2}
                        dot={{ fill: chartConfig.colors.engineersOnline, strokeWidth: 2, r: 4 }}
                        name="Engenheiros Online"
                    />

                    {showTarget && (
                        <ReferenceLine
                            y={data[0]?.target || 50}
                            stroke={chartConfig.colors.target}
                            strokeDasharray="5 5"
                            label={{ value: "Meta", position: "topRight" }}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};