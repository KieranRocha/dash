// src/services/api.ts - CORRIGIDO: Alinhado com backend
import {
  Project,
  ProjectSummary,
  CreateProject,
  UpdateProject,
  ApiError,
} from "../types/index";

const API_BASE = "http://localhost:5047";

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
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    signal?: AbortSignal,
  ): Promise<T> {
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal,
      ...options,
    };

    const url = `${API_BASE}${endpoint}`;

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorDetails = null;

        try {
          const errorData = await response.json();
          if (errorData.message) errorMessage = errorData.message;
          if (errorData.details) errorDetails = errorData.details;
        } catch {
          // Se não conseguir parsear JSON do erro, usa mensagem padrão
        }

        throw new APIError(
          errorMessage,
          response.status,
          "HTTP_ERROR",
          errorDetails,
        );
      }

      const contentType = response.headers.get("content-type");
      if (
        response.status === 204 ||
        !contentType ||
        !contentType.includes("application/json")
      ) {
        return Promise.resolve(undefined as T);
      }

      // Apenas se tivermos certeza que há um corpo JSON, fazemos o parse.
      return await response.json();
    } catch (error: any) {
      if (error instanceof APIError) {
        throw error;
      }

      if (error.name === "AbortError") {
        throw new APIError("Requisição cancelada", 0, "ABORTED");
      }

      throw new APIError(
        "Erro de conexão com o servidor",
        0,
        "CONNECTION_ERROR",
        error.message,
      );
    }
  }

  // ================================
  // PROJECT ENDPOINTS - CORRIGIDOS
  // ================================

  async getProjects(signal?: AbortSignal): Promise<ProjectSummary[]> {
    return this.request<ProjectSummary[]>("/api/projects", {}, signal);
  }

  async getActiveProjects(signal?: AbortSignal): Promise<ProjectSummary[]> {
    return this.request<ProjectSummary[]>("/api/projects/active", {}, signal);
  }

  async getProject(id: number, signal?: AbortSignal): Promise<Project> {
    return this.request<Project>(`/api/projects/${id}`, {}, signal);
  }

  async createProject(
    projectData: CreateProject,
    signal?: AbortSignal,
  ): Promise<Project> {
    return this.request<Project>(
      "/api/Projects",
      {
        method: "POST",
        body: JSON.stringify(projectData),
      },
      signal,
    );
  }

  async updateProject(
    id: number,
    projectData: UpdateProject,
    signal?: AbortSignal,
  ): Promise<Project> {
    return this.request<Project>(
      `/api/projects/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(projectData),
      },
      signal,
    );
  }

  async deleteProject(id: number, signal?: AbortSignal): Promise<void> {
    await this.request<void>(
      `/api/projects/${id}`,
      {
        method: "DELETE",
      },
      signal,
    );
  }

  // ================================
  // SYSTEM ENDPOINTS
  // ================================

  async sendHeartbeat(signal?: AbortSignal): Promise<void> {
    const heartbeat = {
      CompanionId: "web-client",
      Timestamp: new Date().toISOString(),
      Status: "RUNNING",
    };

    await this.request<void>(
      "/api/Session/heartbeat",
      {
        method: "POST",
        body: JSON.stringify(heartbeat),
        timeout: 3000,
      },
      signal,
    );
  }

  async getSystemHealth(signal?: AbortSignal): Promise<any> {
    return this.request("/api/system/health", {}, signal);
  }

  // ================================
  // UTILITY METHODS
  // ================================

  async testConnection(signal?: AbortSignal): Promise<boolean> {
    try {
      await this.sendHeartbeat(signal);
      return true;
    } catch {
      return false;
    }
  }
}

export const api = new APIService();
