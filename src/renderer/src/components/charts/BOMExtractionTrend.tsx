// ================================
// BOM EXTRACTION TREND
// ================================

import { Area, AreaChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface BOMTrendData {
    time: string;
    extractions: number;
    failures: number;
    avgTime: number;
}

interface BOMExtractionTrendProps {
    data: BOMTrendData[];
    height?: number;
}

export const BOMExtractionTrend: React.FC<BOMExtractionTrendProps> = ({
    data,
    height = 200
}) => {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 text-sm">Trend de Extrações BOM</h4>
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>Sucessos</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span>Falhas</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                        <linearGradient id="extractionsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#6B7280" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#6B7280" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            fontSize: '12px'
                        }}
                    />

                    <Area
                        type="monotone"
                        dataKey="extractions"
                        stroke="#3B82F6"
                        fillOpacity={1}
                        fill="url(#extractionsGradient)"
                        strokeWidth={2}
                    />

                    <Bar dataKey="failures" fill="#EF4444" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};