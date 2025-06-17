// src/services/api.ts - Cliente HTTP Simples
const API_BASE = "http://localhost:5047";

export class APIService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // ✅ Métodos para BOM
  async getBOM(projectId: string, machineId: string) {
    return this.request(`/api/projects/${projectId}/machines/${machineId}/bom`);
  }

  async getBOMVersions(projectId: string, machineId: string) {
    return this.request(
      `/api/projects/${projectId}/machines/${machineId}/bom/versions`,
    );
  }

  async getProjects() {
    return this.request("/api/projects");
  }

  // ✅ Mantém heartbeat se necessário
  async sendHeartbeat() {
    return this.request("/api/session/heartbeat", { method: "POST" });
  }
}
