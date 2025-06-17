// ================================
// COMPOSITE CHARTS CONTAINER
// ================================

import { BOMExtractionTrend } from "./BOMExtractionTrend";
import { EngineersStatusChart } from "./EngineersStatusChart";
import { ProductivityChart } from "./ProductivityChart";
import { ProjectEfficiencyChart } from "./ProjectEfficiencyChart";
import { QualityChart } from "./QualityChart";
import { SystemHealthGauge } from "./SystemHealthGauge";

interface DashboardChartsProps {
    productivityData: ProductivityData[];
    qualityData: QualityMetrics[];
    efficiencyData: EfficiencyData[];
    systemHealth: number;
    bomTrendData: BOMTrendData[];
    engineerStatusData: EngineerStatusData[];
    timeRange: '1h' | '24h' | '7d' | '30d';
}


export const DashboardCharts: React.FC<DashboardChartsProps> = ({
    productivityData,
    qualityData,
    efficiencyData,
    systemHealth,
    bomTrendData,
    engineerStatusData,
    timeRange
}) => {

    return (
        <div className="space-y-6">
            {/* Primary Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProductivityChart data={productivityData} timeRange={timeRange} />
                <QualityChart data={qualityData} />
            </div>

            {/* Secondary Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SystemHealthGauge
                    value={systemHealth}
                    title="Saúde do Sistema"
                    subtitle="Disponibilidade geral"
                />
                <BOMExtractionTrend data={bomTrendData} />
                <EngineersStatusChart data={engineerStatusData} />
            </div>

            {/* Full Width Efficiency Chart */}
            <ProjectEfficiencyChart data={efficiencyData} />
        </div>
    );
};