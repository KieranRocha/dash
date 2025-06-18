// ================================
// PROJECT EFFICIENCY CHART
// ================================

import { Activity } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ProjectEfficiencyChartProps {
    data: EfficiencyData[];
    height?: number;
}

export const ProjectEfficiencyChart: React.FC<ProjectEfficiencyChartProps> = ({
    data,
    height = 300
}) => {
    const getStatusColor = (status: EfficiencyData['status']) => {
        switch (status) {
            case 'good': return '#10B981';
            case 'warning': return '#F59E0B';
            case 'critical': return '#EF4444';
            default: return '#6B7280';
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-600" />
                        Eficiência por Projeto
                    </h3>
                    <p className="text-sm text-gray-600">
                        Comparativo planejado vs realizado
                    </p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={height}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis
                        dataKey="project"
                        tick={{ fontSize: 11 }}
                        stroke="#6B7280"
                        angle={-45}
                        textAnchor="end"
                        height={60}
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
                            `${value}h`,
                            name === 'planned' ? 'Planejado' : 'Realizado'
                        ]}
                    />
                    <Legend />

                    <Bar
                        dataKey="planned"
                        fill="#94A3B8"
                        name="Planejado"
                        radius={[2, 2, 0, 0]}
                    />
                    <Bar
                        dataKey="actual"
                        fill="#3B82F6"
                        name="Realizado"
                        radius={[2, 2, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>

            {/* Status indicators */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Dentro do prazo</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Atenção</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Crítico</span>
                </div>
            </div>
        </div>
    );
};