// src/hooks/useDashboard.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../services/api";

export interface DashboardKPIs {
  activeProjects: { value: number; change: number; trend: "up" | "down" };
  totalEngineers: { value: number; change: number; trend: "up" | "down" };
  bomVersions: { value: number; change: number; trend: "up" | "down" };
  systemHealth: { value: number; change: number; trend: "up" | "down" };
}

export interface Alert {
  id: number;
  type: "error" | "warning" | "info";
  message: string;
  time: string;
  projectId?: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface ProjectActivity {
  id: number;
  name: string;
  activity: number;
  status: "active" | "planning" | "review" | "onhold" | "completed";
  deadline: string;
  budget: number;
  lastActivity?: string;
  responsibleEngineer?: string;
}

export interface BOMStats {
  totalExtractions: number;
  successRate: number;
  avgProcessingTime: number;
  lastHour: number;
  failedExtractions: number;
  systemAvailability: number;
}

export interface EngineerActivity {
  id: number;
  name: string;
  projects: number;
  saves: number;
  hours: number;
  status: "online" | "away" | "offline";
  lastActivity: string;
  currentProject?: string;
}

export interface DashboardData {
  kpis: DashboardKPIs;
  alerts: Alert[];
  projectsActivity: ProjectActivity[];
  bomStats: BOMStats;
  engineerActivity: EngineerActivity[];
  systemStatus: "healthy" | "warning" | "critical";
  lastUpdate: Date;
}

export interface DashboardFilters {
  timeRange: "1h" | "24h" | "7d" | "30d";
  projectFilter?: string;
  engineerFilter?: string;
  statusFilter?: string;
}

export interface UseDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  filters: DashboardFilters;
  setFilters: (filters: Partial<DashboardFilters>) => void;
  refresh: () => Promise<void>;
  lastUpdate: Date;
  isRealTimeEnabled: boolean;
  toggleRealTime: () => void;
}
export interface ProductivityData {
  hour: string;
  bomExtractions: number;
  activeSaves: number;
  engineersOnline: number;
  target: number;
}
export const useDashboard = (): UseDashboardReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  const [filters, setFiltersState] = useState<DashboardFilters>({
    timeRange: "24h",
  });

  // Refs para controle de intervalos
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Função para buscar dados da dashboard
  const fetchDashboardData = useCallback(
    async (signal?: AbortSignal): Promise<DashboardData> => {
      try {
        // Simula múltiplas chamadas de API paralelas
        const [kpis, alerts, projects, bomStats, engineers] = await Promise.all(
          [
            api.getDashboardKPIs(filters.timeRange, signal),
            api.getSystemAlerts(signal),
            api.getActiveProjectsActivity(signal),
            api.getBOMStatistics(filters.timeRange, signal),
            api.getEngineersActivity(signal),
          ],
        );

        // Calcula status geral do sistema
        const systemStatus = calculateSystemStatus(kpis, alerts, bomStats);

        return {
          kpis,
          alerts,
          projectsActivity: projects,
          bomStats,
          engineerActivity: engineers,
          systemStatus,
          lastUpdate: new Date(),
        };
      } catch (error) {
        if (signal?.aborted) {
          throw new Error("Request cancelled");
        }
        throw error;
      }
    },
    [filters.timeRange],
  );

  // Função para calcular status do sistema
  const calculateSystemStatus = (
    kpis: DashboardKPIs,
    alerts: Alert[],
    bomStats: BOMStats,
  ): "healthy" | "warning" | "critical" => {
    const criticalAlerts = alerts.filter(
      (a) => a.severity === "critical",
    ).length;
    const highAlerts = alerts.filter((a) => a.severity === "high").length;

    if (criticalAlerts > 0 || bomStats.systemAvailability < 95) {
      return "critical";
    }

    if (
      highAlerts > 0 ||
      bomStats.successRate < 90 ||
      bomStats.systemAvailability < 98
    ) {
      return "warning";
    }

    return "healthy";
  };

  // Função principal para refresh dos dados
  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Cancela request anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Cria novo AbortController
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const newData = await fetchDashboardData(abortController.signal);

      setData(newData);
      setLastUpdate(new Date());
    } catch (err: any) {
      if (err.message !== "Request cancelled") {
        console.error("Dashboard refresh error:", err);
        setError(err.message || "Erro ao atualizar dashboard");
      }
    } finally {
      setLoading(false);
    }
  }, [fetchDashboardData]);

  // Função para atualizar filtros
  const setFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Toggle para tempo real
  const toggleRealTime = useCallback(() => {
    setIsRealTimeEnabled((prev) => !prev);
  }, []);

  // Effect para carregar dados iniciais
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Effect para auto-refresh em tempo real
  useEffect(() => {
    if (!isRealTimeEnabled) {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      return;
    }

    // Configura intervalo baseado no timeRange
    const getRefreshInterval = () => {
      switch (filters.timeRange) {
        case "1h":
          return 15000; // 15 segundos
        case "24h":
          return 30000; // 30 segundos
        case "7d":
          return 60000; // 1 minuto
        case "30d":
          return 300000; // 5 minutos
        default:
          return 30000;
      }
    };

    refreshIntervalRef.current = setInterval(() => {
      refresh();
    }, getRefreshInterval());

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isRealTimeEnabled, filters.timeRange, refresh]);

  // Effect para reagir a mudanças nos filtros
  useEffect(() => {
    refresh();
  }, [
    filters.timeRange,
    filters.projectFilter,
    filters.engineerFilter,
    filters.statusFilter,
  ]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    filters,
    setFilters,
    refresh,
    lastUpdate,
    isRealTimeEnabled,
    toggleRealTime,
  };
};

// Hook para métricas específicas de performance
export const useDashboardPerformance = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    dataFetchTime: 0,
    updateCount: 0,
  });

  const trackRender = useCallback((startTime: number) => {
    const renderTime = performance.now() - startTime;
    setMetrics((prev) => ({
      ...prev,
      renderTime,
      updateCount: prev.updateCount + 1,
    }));
  }, []);

  const trackDataFetch = useCallback((fetchTime: number) => {
    setMetrics((prev) => ({
      ...prev,
      dataFetchTime: fetchTime,
    }));
  }, []);

  return { metrics, trackRender, trackDataFetch };
};

// Hook para notificações da dashboard
export const useDashboardNotifications = () => {
  const [notifications, setNotifications] = useState<Alert[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  const addNotification = useCallback((alert: Alert) => {
    setNotifications((prev) => [alert, ...prev].slice(0, 50)); // Mantém apenas 50 notificações
    setHasUnread(true);
  }, []);

  const markAsRead = useCallback(() => {
    setHasUnread(false);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setHasUnread(false);
  }, []);

  return {
    notifications,
    hasUnread,
    addNotification,
    markAsRead,
    clearNotifications,
  };
};
