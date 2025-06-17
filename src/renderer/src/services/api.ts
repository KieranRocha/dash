// src/services/api.ts - Enhanced API Service para Dashboard Industrial
import {
  DashboardKPIs,
  Alert,
  ProjectActivity,
  BOMStats,
  EngineerActivity,
} from "../hooks/useDashboard";

const API_BASE = "http://localhost:5047";

interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any,
  ) {
    super(message);
    this.name = "APIError";
  }
}

export class APIService {
  private cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();
  private pendingRequests = new Map<string, Promise<any>>();

  private async request<T>(
    endpoint: string,
    options: RequestConfig = {},
    signal?: AbortSignal,
  ): Promise<T> {
    const {
      timeout = 10000,
      retries = 2,
      retryDelay = 1000,
      ...fetchOptions
    } = options;

    // Configuração padrão
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      signal,
      ...fetchOptions,
    };

    const url = `${API_BASE}${endpoint}`;

    // Implementa retry logic
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Timeout controller
        const timeoutController = new AbortController();
        const timeoutId = setTimeout(() => timeoutController.abort(), timeout);

        // Combina signals
        const combinedSignal = this.combineAbortSignals(
          signal,
          timeoutController.signal,
        );

        const response = await fetch(url, {
          ...config,
          signal: combinedSignal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new APIError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            "HTTP_ERROR",
          );
        }

        // Tenta parsear JSON
        try {
          return await response.json();
        } catch (jsonError) {
          throw new APIError(
            "Resposta inválida do servidor",
            response.status,
            "INVALID_JSON",
          );
        }
      } catch (error: any) {
        // Se é o último attempt ou erro não recuperável, throw
        if (
          attempt === retries ||
          error.name === "AbortError" ||
          error.status === 401 ||
          error.status === 403 ||
          error.status === 404
        ) {
          throw error;
        }

        // Wait before retry
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * (attempt + 1)),
        );
      }
    }

    throw new APIError(
      "Falha na comunicação após múltiplas tentativas",
      0,
      "RETRY_FAILED",
    );
  }

  private combineAbortSignals(
    ...signals: (AbortSignal | undefined)[]
  ): AbortSignal {
    const controller = new AbortController();

    signals.forEach((signal) => {
      if (signal?.aborted) {
        controller.abort();
      } else if (signal) {
        signal.addEventListener("abort", () => controller.abort());
      }
    });

    return controller.signal;
  }

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}${params ? `?${JSON.stringify(params)}` : ""}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache<T>(key: string, data: T, ttl: number = 30000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  // ================================
  // DASHBOARD ENDPOINTS
  // ================================

  async getDashboardKPIs(
    timeRange: string = "24h",
    signal?: AbortSignal,
  ): Promise<DashboardKPIs> {
    const cacheKey = this.getCacheKey("/api/dashboard/kpis", { timeRange });
    const cached = this.getFromCache<DashboardKPIs>(cacheKey);

    if (cached) return cached;

    try {
      const data = await this.request<DashboardKPIs>(
        `/api/dashboard/kpis?timeRange=${timeRange}`,
        { timeout: 5000 },
        signal,
      );

      this.setCache(cacheKey, data, 15000); // Cache por 15 segundos
      return data;
    } catch (error) {
      // Fallback para dados mock se API falhar
      console.warn("API falhou, usando dados mock para KPIs");
      return this.getMockKPIs();
    }
  }

  async getSystemAlerts(signal?: AbortSignal): Promise<Alert[]> {
    const cacheKey = this.getCacheKey("/api/dashboard/alerts");
    const cached = this.getFromCache<Alert[]>(cacheKey);

    if (cached) return cached;

    try {
      const data = await this.request<Alert[]>(
        "/api/dashboard/alerts",
        { timeout: 5000 },
        signal,
      );

      this.setCache(cacheKey, data, 10000); // Cache por 10 segundos
      return data;
    } catch (error) {
      console.warn("API falhou, usando dados mock para alertas");
      return this.getMockAlerts();
    }
  }

  async getActiveProjectsActivity(
    signal?: AbortSignal,
  ): Promise<ProjectActivity[]> {
    const cacheKey = this.getCacheKey("/api/dashboard/projects");
    const cached = this.getFromCache<ProjectActivity[]>(cacheKey);

    if (cached) return cached;

    try {
      // Combina dados de projetos ativos com dados de atividade
      const [projects, activities] = await Promise.all([
        this.request<any[]>("/api/projects/active", {}, signal),
        this.request<any[]>("/api/dashboard/project-activities", {}, signal),
      ]);

      const enhancedProjects = this.combineProjectData(projects, activities);
      this.setCache(cacheKey, enhancedProjects, 20000); // Cache por 20 segundos
      return enhancedProjects;
    } catch (error) {
      console.warn("API falhou, usando dados mock para projetos");
      return this.getMockProjectsActivity();
    }
  }

  async getBOMStatistics(
    timeRange: string = "24h",
    signal?: AbortSignal,
  ): Promise<BOMStats> {
    const cacheKey = this.getCacheKey("/api/dashboard/bom-stats", {
      timeRange,
    });
    const cached = this.getFromCache<BOMStats>(cacheKey);

    if (cached) return cached;

    try {
      const data = await this.request<BOMStats>(
        `/api/dashboard/bom-stats?timeRange=${timeRange}`,
        { timeout: 5000 },
        signal,
      );

      this.setCache(cacheKey, data, 15000);
      return data;
    } catch (error) {
      console.warn("API falhou, usando dados mock para BOM stats");
      return this.getMockBOMStats();
    }
  }

  async getEngineersActivity(
    signal?: AbortSignal,
  ): Promise<EngineerActivity[]> {
    const cacheKey = this.getCacheKey("/api/dashboard/engineers");
    const cached = this.getFromCache<EngineerActivity[]>(cacheKey);

    if (cached) return cached;

    try {
      const data = await this.request<EngineerActivity[]>(
        "/api/dashboard/engineers",
        { timeout: 5000 },
        signal,
      );

      this.setCache(cacheKey, data, 20000);
      return data;
    } catch (error) {
      console.warn("API falhou, usando dados mock para engenheiros");
      return this.getMockEngineersActivity();
    }
  }

  // ================================
  // EXISTING PROJECT ENDPOINTS
  // ================================

  async getProjects(signal?: AbortSignal) {
    return this.request("/api/projects", {}, signal);
  }

  async getActiveProjects(signal?: AbortSignal) {
    return this.request("/api/projects/active", {}, signal);
  }

  async getProject(id: number, signal?: AbortSignal) {
    return this.request(`/api/projects/${id}`, {}, signal);
  }

  async createProject(projectData: any, signal?: AbortSignal) {
    return this.request(
      "/api/projects",
      {
        method: "POST",
        body: JSON.stringify(projectData),
      },
      signal,
    );
  }

  async updateProject(id: number, projectData: any, signal?: AbortSignal) {
    return this.request(
      `/api/projects/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(projectData),
      },
      signal,
    );
  }

  async deleteProject(id: number, signal?: AbortSignal) {
    return this.request(
      `/api/projects/${id}`,
      {
        method: "DELETE",
      },
      signal,
    );
  }

  // ================================
  // BOM ENDPOINTS
  // ================================

  async getBOM(projectId: string, machineId: string, signal?: AbortSignal) {
    return this.request(
      `/api/projects/${projectId}/machines/${machineId}/bom`,
      {},
      signal,
    );
  }

  async getBOMVersions(
    projectId: string,
    machineId: string,
    signal?: AbortSignal,
  ) {
    return this.request(
      `/api/projects/${projectId}/machines/${machineId}/bom/versions`,
      {},
      signal,
    );
  }

  // ================================
  // SYSTEM ENDPOINTS
  // ================================

  async sendHeartbeat(signal?: AbortSignal) {
    return this.request(
      "/api/session/heartbeat",
      {
        method: "POST",
        timeout: 3000,
      },
      signal,
    );
  }

  async getSystemHealth(signal?: AbortSignal) {
    return this.request("/api/system/health", {}, signal);
  }

  // ================================
  // UTILITY METHODS
  // ================================

  private combineProjectData(
    projects: any[],
    activities: any[],
  ): ProjectActivity[] {
    return projects.map((project) => {
      const activity = activities.find((a) => a.projectId === project.id) || {};

      return {
        id: project.id,
        name: project.name,
        activity: activity.progressPercentage || 0,
        status: project.status?.toLowerCase() || "planning",
        deadline: this.calculateDeadline(project.endDate),
        budget: activity.budgetUsagePercentage || 0,
        lastActivity: project.lastActivity,
        responsibleEngineer: project.responsibleEngineer,
      };
    });
  }

  private calculateDeadline(endDate?: string): string {
    if (!endDate) return "Indefinido";

    const end = new Date(endDate);
    const now = new Date();
    const diffDays = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) return "Atrasado";
    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Amanhã";
    return `${diffDays} dias`;
  }

  // ================================
  // MOCK DATA FALLBACKS
  // ================================

  private getMockKPIs(): DashboardKPIs {
    return {
      activeProjects: { value: 23, change: +2, trend: "up" },
      totalEngineers: { value: 47, change: +3, trend: "up" },
      bomVersions: { value: 1247, change: +89, trend: "up" },
      systemHealth: { value: 98.2, change: -0.3, trend: "down" },
    };
  }

  private getMockAlerts(): Alert[] {
    return [
      {
        id: 1,
        type: "warning",
        message: "Projeto C-2024-15 sem atividade há 3 dias",
        time: "2h atrás",
        severity: "medium",
        projectId: "C-2024-15",
      },
      {
        id: 2,
        type: "error",
        message: "Falha na extração de BOM - Máquina M-340",
        time: "4h atrás",
        severity: "high",
      },
      {
        id: 3,
        type: "info",
        message: "Nova versão de BOM detectada - Projeto AeroTech",
        time: "6h atrás",
        severity: "low",
        projectId: "AeroTech",
      },
    ];
  }

  private getMockProjectsActivity(): ProjectActivity[] {
    return [
      {
        id: 1,
        name: "AeroTech V2",
        activity: 95,
        status: "active",
        deadline: "15 dias",
        budget: 85,
        responsibleEngineer: "Carlos Silva",
      },
      {
        id: 2,
        name: "Industrial Mixer",
        activity: 78,
        status: "active",
        deadline: "8 dias",
        budget: 92,
        responsibleEngineer: "Ana Costa",
      },
      {
        id: 3,
        name: "Conveyor System",
        activity: 45,
        status: "planning",
        deadline: "30 dias",
        budget: 67,
        responsibleEngineer: "João Santos",
      },
    ];
  }

  private getMockBOMStats(): BOMStats {
    return {
      totalExtractions: 2847,
      successRate: 97.8,
      avgProcessingTime: 3.2,
      lastHour: 47,
      failedExtractions: 23,
      systemAvailability: 98.2,
    };
  }

  private getMockEngineersActivity(): EngineerActivity[] {
    return [
      {
        id: 1,
        name: "Carlos Silva",
        projects: 3,
        saves: 23,
        hours: 7.5,
        status: "online",
        lastActivity: "2 min atrás",
        currentProject: "AeroTech V2",
      },
      {
        id: 2,
        name: "Ana Costa",
        projects: 2,
        saves: 18,
        hours: 6.8,
        status: "online",
        lastActivity: "5 min atrás",
        currentProject: "Industrial Mixer",
      },
      {
        id: 3,
        name: "João Santos",
        projects: 4,
        saves: 31,
        hours: 8.2,
        status: "away",
        lastActivity: "15 min atrás",
      },
      {
        id: 4,
        name: "Maria Oliveira",
        projects: 1,
        saves: 12,
        hours: 4.1,
        status: "offline",
        lastActivity: "2h atrás",
      },
    ];
  }

  // ================================
  // CACHE MANAGEMENT
  // ================================

  clearCache(): void {
    this.cache.clear();
  }

  clearCacheByPattern(pattern: string): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    });
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const api = new APIService();
