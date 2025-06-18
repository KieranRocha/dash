import { Target } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface QualityChartProps {
    data: QualityMetrics[];
    height?: number;
}

export const QualityChart: React.FC<QualityChartProps> = ({
    data,
    height = 250
}) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-600" />
                        Métricas de Qualidade
                    </h3>
                    <p className="text-sm text-gray-600">
                        Taxa de sucesso e tempo de processamento
                    </p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#6B7280" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value: number, name: string) => [
                            `${value}%`,
                            name === 'successRate' ? 'Taxa de Sucesso' : 'Taxa de Erro'
                        ]}
                    />

                    <Area
                        type="monotone"
                        dataKey="successRate"
                        stroke="#10B981"
                        fillOpacity={1}
                        fill="url(#successGradient)"
                        strokeWidth={2}
                        name="Taxa de Sucesso"
                    />

                    <Area
                        type="monotone"
                        dataKey="errorRate"
                        stroke="#EF4444"
                        fillOpacity={1}
                        fill="url(#errorGradient)"
                        strokeWidth={2}
                        name="Taxa de Erro"
                    />

                    <ReferenceLine y={95} stroke="#10B981" strokeDasharray="5 5" label="Meta 95%" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};