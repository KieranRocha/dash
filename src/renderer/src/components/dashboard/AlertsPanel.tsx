// src/components/dashboard/AlertsPanel.tsx
import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, ChevronRight, X } from 'lucide-react';
import { Alert } from '../../hooks/useDashboard';

interface AlertsPanelProps {
    alerts: Alert[];
    onAlertClick?: (alert: Alert) => void;
    onDismiss?: (alertId: number) => void;
    showDismiss?: boolean;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
    alerts,
    onAlertClick,
    onDismiss,
    showDismiss = false
}) => {
    const getAlertIcon = (type: Alert['type']) => {
        switch (type) {
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            case 'info':
                return <CheckCircle className="w-4 h-4 text-blue-500" />;
            default:
                return <AlertTriangle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getSeverityColor = (severity: Alert['severity']) => {
        switch (severity) {
            case 'critical':
                return 'border-l-red-500 bg-red-50';
            case 'high':
                return 'border-l-orange-500 bg-orange-50';
            case 'medium':
                return 'border-l-yellow-500 bg-yellow-50';
            case 'low':
                return 'border-l-blue-500 bg-blue-50';
            default:
                return 'border-l-gray-500 bg-gray-50';
        }
    };

    if (alerts.length === 0) {
        return (
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas do Sistema</h3>
                <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-600">Nenhum alerta ativo</p>
                    <p className="text-sm text-gray-500 mt-1">Sistema funcionando normalmente</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Alertas do Sistema ({alerts.length})
                </h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Ver todos
                </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={`border-l-4 p-3 rounded-r-lg transition-all duration-200 ${getSeverityColor(alert.severity)} ${onAlertClick ? 'cursor-pointer hover:shadow-sm' : ''
                            }`}
                        onClick={() => onAlertClick?.(alert)}
                    >
                        <div className="flex items-start gap-3">
                            {getAlertIcon(alert.type)}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 font-medium">
                                    {alert.message}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-xs text-gray-500">
                                        {alert.time}
                                    </p>
                                    {alert.projectId && (
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            {alert.projectId}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {showDismiss && onDismiss && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDismiss(alert.id);
                                        }}
                                        className="p-1 hover:bg-gray-200 rounded"
                                    >
                                        <X className="w-3 h-3 text-gray-400" />
                                    </button>
                                )}
                                {onAlertClick && (
                                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};