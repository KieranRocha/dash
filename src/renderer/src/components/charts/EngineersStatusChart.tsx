// ================================
// ENGINEERS STATUS PIE CHART
// ================================

interface EngineerStatusData {
    status: string;
    count: number;
    color: string;
}

interface EngineersStatusChartProps {
    data: EngineerStatusData[];
    size?: number;
}

export const EngineersStatusChart: React.FC<EngineersStatusChartProps> = ({
    data,
    size = 150
}) => {
    const RADIAN = Math.PI / 180;

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize="12"
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h4 className="font-medium text-gray-900 text-sm mb-3">Status dos Engenheiros</h4>

            <div className="flex items-center gap-4">
                <ResponsiveContainer width={size} height={size}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={size / 3}
                            fill="#8884d8"
                            dataKey="count"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value} engenheiros`, 'Quantidade']} />
                    </PieChart>
                </ResponsiveContainer>

                <div className="flex flex-col gap-2 text-sm">
                    {data.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            ></div>
                            <span className="capitalize">{entry.status}</span>
                            <span className="text-gray-500">({entry.count})</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};